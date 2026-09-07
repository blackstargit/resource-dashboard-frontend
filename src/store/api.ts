import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  clearSession,
  deriveSessionKey,
  deriveVerifier,
  loadSession,
  proveChallenge,
  saveSession,
  authHeaders,
  type Session,
} from "../lib/authCrypto";
import type { ProcessListResponse, ProcessSortKey } from "../types";

export const API_BASE = "/api/v1";

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_BASE });

/**
 * Signs every outgoing request with the session key. Nothing secret is sent —
 * the signature covers this exact method and path, is single-use, and expires
 * within seconds, so capturing it off the wire buys an attacker nothing.
 */
const signedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const req: FetchArgs = typeof args === "string" ? { url: args } : args;
  const session = loadSession();

  if (session) {
    const method = (req.method ?? "GET").toUpperCase();
    const path = API_BASE + req.url.split("?")[0];
    req.headers = { ...(req.headers as object), ...authHeaders(session, method, path) };
  }

  const result = await rawBaseQuery(req, api, extraOptions);

  // A 401 means the session is gone (expired, revoked, password rotated).
  // Drop it here so every caller falls back to the login form at once.
  if (result.error?.status === 401 && loadSession()) {
    clearSession();
    api.dispatch(dashboardApi.util.invalidateTags(["Session"]));
  }
  return result;
};

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: signedBaseQuery,
  tagTypes: ["Session", "Processes"],
  endpoints: (build) => ({
    getMe: build.query<{ authenticated: boolean; allow_process_kill: boolean }, void>({
      query: () => "/auth/me",
      providesTags: ["Session"],
    }),

    /**
     * Challenge/response login. Three steps rather than one round trip:
     * fetch the KDF parameters, derive the verifier from the password locally,
     * then prove knowledge of it. The password itself never leaves the browser.
     */
    login: build.mutation<{ ok: true }, { username: string; password: string }>({
      queryFn: async (arg, api, extraOptions) => {
        const challengeRes = await rawBaseQuery("/auth/challenge", api, extraOptions);
        if (challengeRes.error) return { error: challengeRes.error };
        const { salt, iterations, challenge } = challengeRes.data as {
          salt: string;
          iterations: number;
          challenge: string;
        };

        const verifier = await deriveVerifier(arg.password, salt, iterations);

        const loginRes = await rawBaseQuery(
          {
            url: "/auth/login",
            method: "POST",
            body: {
              username: arg.username,
              challenge,
              proof: proveChallenge(verifier, challenge),
            },
          },
          api,
          extraOptions,
        );
        if (loginRes.error) return { error: loginRes.error };
        const { session_id, server_time } = loginRes.data as {
          session_id: string;
          server_time: number;
        };

        const session: Session = {
          id: session_id,
          key: deriveSessionKey(verifier, session_id),
          offset: server_time - Date.now() / 1000,
        };
        saveSession(session);
        return { data: { ok: true as const } };
      },
      invalidatesTags: ["Session"],
    }),

    logout: build.mutation<{ ok: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      // Local state goes regardless: a failed request must not strand the
      // user in a session they asked to leave.
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          clearSession();
        }
      },
      invalidatesTags: ["Session"],
    }),

    getProcesses: build.query<
      ProcessListResponse,
      { sortBy: ProcessSortKey; limit: number }
    >({
      query: ({ sortBy, limit }) =>
        `/resources/processes?sort_by=${sortBy}&limit=${limit}`,
      providesTags: ["Processes"],
    }),

    killProcess: build.mutation<{ pid: number; terminated: boolean }, number>({
      query: (pid) => ({ url: `/resources/processes/${pid}`, method: "DELETE" }),
      invalidatesTags: ["Processes"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetProcessesQuery,
  useKillProcessMutation,
} = dashboardApi;

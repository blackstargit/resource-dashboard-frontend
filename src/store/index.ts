import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { dashboardApi } from "./api";

export const store = configureStore({
  reducer: { [dashboardApi.reducerPath]: dashboardApi.reducer },
  middleware: (getDefault) => getDefault().concat(dashboardApi.middleware),
});

setupListeners(store.dispatch);

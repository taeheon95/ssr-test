import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

export const store = configureStore({
  middleware: (defaultMiddleware) => defaultMiddleware().concat(logger),
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

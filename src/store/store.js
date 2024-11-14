import { configureStore } from "@reduxjs/toolkit";
import cdpReducer from "./cdpSlice";

const store = configureStore({
  reducer: {
    cdp: cdpReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

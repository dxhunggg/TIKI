import { configureStore } from "@reduxjs/toolkit";
import countReducer from "./countReducer";

const store = configureStore({
  reducer: {
    count: countReducer,
  },
});

export default store;

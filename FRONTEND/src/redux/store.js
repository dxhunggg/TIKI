import { configureStore } from "@reduxjs/toolkit";
import countReducer from "./countReducer";
import userReducer from "./userSlide";

const store = configureStore({
  reducer: {
    count: countReducer,
    user: userReducer,
  },
});

export default store;

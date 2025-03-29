import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlide";
import userReducer from "./userSlide";
import orderReducer from "./orderSlide";

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    // order: orderReducer,
  },
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const count = createSlice({
  name: "count",
  initialState,
  reducers: {
    increase: (state) => {
      state.value++;
    },
    decrease: (state) => {
      state.value--;
    },
  },
});

export const { increase, decrease } = count.actions;
export default count.reducer;

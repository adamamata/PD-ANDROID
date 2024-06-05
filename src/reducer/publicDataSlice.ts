
import { createSlice } from "@reduxjs/toolkit";

export const publicDataSlice = createSlice({
  name: "publicData",
  initialState: {
    publicSpData : null,
    publicPageScrollPosition: null,
    publicPagePersistPageNo: null,
  },
  reducers: {
    set_public_sp_data: (state, action) => {
      state.publicSpData = action?.payload
    },

    set_public_page_scroll_position: (state, action) => {
      state.publicPageScrollPosition = action.payload
    },

    set_public_persist_page_no: (state, action) => {
      state.publicPagePersistPageNo = action.payload
    },

    reset_public_scroll_position: (state) => {
      state.publicPageScrollPosition = null
    },

    reset_set_public_sp_data: (state) => {
      state.publicSpData = null
    }
  },
});

export const publicData = (state: any) => state?.publicData;
export const { set_public_sp_data, reset_set_public_sp_data, set_public_persist_page_no, reset_public_scroll_position, set_public_page_scroll_position } = publicDataSlice.actions
export default publicDataSlice.reducer
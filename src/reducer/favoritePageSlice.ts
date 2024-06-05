import { createSlice } from "@reduxjs/toolkit";

export const favoritePageSlice = createSlice({
  name: "favoritePageData",
  initialState: {
    //userHomeData 
    favoritePageScrollPosition: null,
    favoritePersistPageNo: null,
    favoritePagePersistData: null,
  },
  reducers: {
    set_favorite_page_scroll_position: (state, action) => {
      state.favoritePageScrollPosition = action.payload
    },

    set_favorite_persist_page_no: (state, action) => {
      state.favoritePersistPageNo = action.payload
    },

    set_favorite_persist_page_data: (state, action) => {
      state.favoritePagePersistData = action.payload
    },

    reset_favorite_scroll_position: (state) => {
      state.favoritePagePersistData = null
    }
  },
});

export const favoritePageData = (state: any) => state?.favoritePageDetails;
export const { set_favorite_page_scroll_position, set_favorite_persist_page_no, set_favorite_persist_page_data, reset_favorite_scroll_position } = favoritePageSlice.actions
export default favoritePageSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

export const homePageSlice = createSlice({
  name: "homePageData",
  initialState: {
    //userHomeData 
    spHomePageScrollPosition: null,
    spHomePersistPageNo: null,
    spHomePagePersistData: null,
    
    //SPHomeData
    homePageScrollPosition: null,
    userHomePersistPageNo: null,
    userHomePagePersistData: []
  },
  reducers: {
    //SPAction
    set_sp_home_page_scroll_position: (state, action) => {
      state.spHomePageScrollPosition = action.payload
    },

    set_sp_home_persist_page_no: (state, action) => {
      state.spHomePersistPageNo = action.payload
    },

    set_sp_home_persist_page_data: (state, action) => {
      state.spHomePagePersistData = action.payload
    },

    set_home_scroll_position: (state, action) => {
      state.homePageScrollPosition = action.payload
    },

    //UserAction
    set_user_home_persist_page_no: (state, action) => {
      state.userHomePersistPageNo = action.payload
    },

    set_user_home_persist_page_data: (state, action) => {
      state.userHomePagePersistData = action.payload
    },

    reset_sp_home_scroll_position: (state) => {
      state.spHomePageScrollPosition = null
    },

    reset_home_scroll_position: (state) => {
      state.homePageScrollPosition = null
    }
  },
});

export const homePageData = (state: any) => state?.homePageDetails;
export const { set_home_scroll_position, reset_home_scroll_position, set_sp_home_page_scroll_position, reset_sp_home_scroll_position, set_sp_home_persist_page_no, set_user_home_persist_page_no, set_sp_home_persist_page_data, set_user_home_persist_page_data } = homePageSlice.actions
export default homePageSlice.reducer
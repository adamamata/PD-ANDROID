import { combineReducers } from "@reduxjs/toolkit";
import azureCommunicationData from "./chatDataSlice";
import auth from "./auth";
import scrollPositionDetails  from "./homePageSlice";

const reducer = combineReducers({
  authData: auth,
  chatDetails: azureCommunicationData,
  scrollPositionDetails: scrollPositionDetails
});

export default reducer;

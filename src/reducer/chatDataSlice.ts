import { createSlice } from "@reduxjs/toolkit";

export const azureSlice = createSlice({
  name: "azureCommunicationData",
  initialState : {
    azureCommunicationData: null,
    chatTokenCredential: null
  },
  reducers: {
    set_azure_communication_data: (state, action) => {
      state.azureCommunicationData = action.payload
    },

    set_chat_token_credential_data: (state, action) => {
      state.chatTokenCredential = action.payload
    },
    
    reset_azure_communication_data: (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      state.azureCommunicationData = null,
      state.chatTokenCredential = null
    }
  },
});

export const azureCommunicationDetails = (state: any) => state?.chatDetails;
export const { set_azure_communication_data, set_chat_token_credential_data, reset_azure_communication_data } = azureSlice.actions
export default azureSlice.reducer
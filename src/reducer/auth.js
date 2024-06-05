import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authData",
  initialState: {
    login: {
      isSuccess: false
    },
    user_profile: {},
    referral_code: "",
    endpoint: "",
    showChat: false,
    chatData: {},
    callData: {},
    callConnected: null,
    callAgent: {
      clientId: null
    },
    callClient: {
    },
    call: {},
    incomingCall: {},
    toggleVideoCall: true,
    tokenCredential: null,
    userIdentifier: null,
    connection: null,
    threadId: null,
    inboxData: null,
    inboxCount:0,
    chatCount:0,
    accountData: null,
    totalCredit: {},
    isPhoneCalling: false,
  },
  reducers: {
    auth_login: (state, action) => {
      state.login = action.payload;
    },
    set_profile: (state, action) => {
      state.user_profile = action.payload;
    },
    set_referral_code: (state, action) => {
      state.referral_code = action.payload;
    },
    set_endpoint: (state, action) => {
      state.endpoint = action.payload;
    },
    set_chat_data: (state, action) => {
      state.chatData = action.payload;
    },
    set_toggle_video_call: (state, action) => {
      state.toggleVideoCall = action.payload;
    },
    set_call_connected: (state, action) => {
      state.callConnected = action.payload;
    },
    set_Show_Chat: (state, action) => {
      state.showChat = action.payload;
    },
    set_Show_Call: (state, action) => {
      state.callData = action.payload;
    },
    set_Call_Agent: (state, action) => {
      state.callAgent = action.payload;
    },
    set_Call_Client: (state, action) => { 
      state.callClient = action.payload;
    },
    set_Call: (state, action) => {
      state.call = action.payload;
    },
    set_Phone_Calling: (state, action) => {
      state.isPhoneCalling = action.payload;
    },
    set_Incoming_Call: (state, action) => {
      state.incomingCall = action.payload;
    },
    set_Inbox_Data: (state, action) => {
      state.inboxData = action.payload;
    },
    set_Inbox_Count: (state, action) => {
      state.inboxCount = action.payload;
    },
    set_Chat_Count: (state, action) => {
      var newTitle = 'Phone Darlings';
      var favicon = document.getElementById('favicon');

      if (action.payload > 0) {
        newTitle = `${newTitle} (${action.payload})`;
        favicon.href = `${process.env.PUBLIC_URL}/phoneDarlingsFavIcon-baged.svg`;
      } else {
        favicon.href = `${process.env.PUBLIC_URL}/phoneDarlingsFavIcon.svg`;
      }

      document.title = newTitle;
      state.chatCount = action.payload;
    },
    set_Token_Credential: (state, action) => {
      state.tokenCredential = action.payload;
    },
    set_User_Identifier: (state, action) => {
      state.userIdentifier = action.payload;
    },
    set_Connection: (state, action) => {
      state.connection = action.payload;
    },
    set_Account_Data : (state, action) => {
      state.accountData = action.payload
    },
    set_Total_Credit : (state, action) => {
      state.totalCredit = action.payload
    },
    set_Thread_Id : (state, action) => {
      state.threadId = action.payload
    },

    reset_Call_State: (state, action) => {
      state.callData= {};
      state.callConnected= null;
      state.incomingCall= {};
      state.toggleVideoCall= true;
      state.incomingCallUser= {};
      state.acceptIncomingCall= false;
    },
    
    reset_States: (state, action) => {
      reset_Call_State(state, action);
      state.login = {
        isSuccess: false
      };
      state.user_profile = {};
      state.referral_code = null;
      state.inboxData = null;
      state.inboxCount = 0;
      state.chatCount = 0;
      state.tokenCredential = null;
      state.userIdentifier = null;
      state.threadId = null;
      state.totalCredit = {};
      if (!!state.callAgent && !!state.callAgent.dispose) {
        state.callAgent.dispose();
      }
      state.callAgent= {};
    }
  },
});

export const {
  set_profile,
  auth_login,
  set_referral_code,
  set_endpoint,
  set_chat_data,
  set_toggle_video_call,
  set_call_connected,
  set_Show_Chat,
  set_Show_Call,
  set_Call_Agent,
  set_Call_Client,
  set_Call,
  set_Phone_Calling,
  set_Incoming_Call,
  set_Token_Credential,
  set_User_Identifier,
  set_Connection,
  set_Inbox_Data,
  set_Inbox_Count,
  set_Chat_Count,
  reset_States,
  reset_Call_State,
  set_Account_Data,
  set_Total_Credit,
  set_Thread_Id
} = authSlice.actions;

export const auth_details = (state) => state.authData;

export default authSlice.reducer;

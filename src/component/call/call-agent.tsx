import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { connect, useDispatch, useSelector } from "react-redux";
import { CallAgent, IncomingCall, Call } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier, CommunicationUserKind } from "@azure/communication-common";
import { HubConnection } from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";

import * as serviceWorkerRegistration from './../../serviceWorkerRegistration';

import { auth_details, 
  reset_Call_State, 
  reset_States, 
  set_Call_Agent, 
  set_Call_Client, 
  set_call_connected, 
  set_Chat_Count, 
  set_chat_data, 
  set_Connection, 
  set_endpoint, 
  set_Incoming_Call, 
  set_Phone_Calling, 
  set_Thread_Id, 
  set_toggle_video_call,
  set_Token_Credential, 
  set_Total_Credit, 
  set_User_Identifier 
} from "../../reducer/auth";
import { acceptIncomingCall, detectIncomingCall, getConnection, getEndpoint, getSPProfileList, getTotalCredit, getUnReadAlldata } from "../../services/homeService";
import { LOCALSTORE } from "../../constant/default";
import IncomingAudioCall from "../../component/call/incoming-audio-call";
import IncomingVideoCall from "../call/incoming-video-call";
import { BroadcastTargetEnum, BroadcastTypeEnum, CallTypeEnum, RingtoneEnum, UserRoleEnum } from "../../enums/enum";
import { AcceptIncomingCallModel } from "../../models/communication-model";
import { createStatefulCallClient, fromFlatCommunicationIdentifier, StatefulCallClient } from "@azure/communication-react";
import { ChatClient } from "@azure/communication-chat";
import { ChatMessageReceivedEvent } from "@azure/communication-signaling";
import { getCallType, playRingTone, stopRingTone } from "../../functions/utilities";
import { reset_azure_communication_data } from "../../reducer/chatDataSlice";
import { CallNotificationModel, EventSignalRModel } from "../../models/signalR.model";
import { PublicProfileResponseModel } from "../../models/user-public-profile";

const AzureCallAgent: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const userDetail = useSelector(auth_details);
  const accountData = userDetail.accountData;
  const userProfile = userDetail.user_profile;
  const incomingCall: IncomingCall = userDetail.incomingCall;
    
  const [callType, setCallType] = useState(CallTypeEnum.AudioCall);
  const [isIncomingCall, setIncomingCallDialog] = useState(false);
  const [incomingCallUser, setIncomingCallUser] = useState<PublicProfileResponseModel>();
  const [currentSPProfile, setCurrentSPProfile] = useState<any>();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [call, setCall] = useState<Call>();
  const [isTabActive, setIsTabActive] = useState<boolean>();

  const spProfiles: string[] = [];

  // Init SignalR connection
  
  useEffect(() => {
    try {
      if (!userDetail?.login?.isSuccess) {
        if (!!hubConnection) {
          hubConnection.off(BroadcastTargetEnum.CallNotification, handleCallNotification);
          hubConnection.off(BroadcastTargetEnum.Notification, handleSignalRNotification);
        }
        return;
      }
      
      initSignalRConnection();
      initNotification();
      getunreadCount();

      const userRole = localStorage.getItem(LOCALSTORE.role) as any;
      if (userRole == UserRoleEnum.ServiceProvider) {
        getProfiles();
      } else {
        const communicationToken = localStorage.getItem(LOCALSTORE.communicationIdentifier.token) as any;
        const communicationUserId = localStorage.getItem(LOCALSTORE.communicationIdentifier.userId) as any;
        const expiredOn = localStorage.getItem(LOCALSTORE.communicationIdentifier.expiredOn);

        validate(communicationToken, communicationUserId, expiredOn);
        userInit(communicationToken, communicationUserId);
      }
    } catch (err) {
      // toast.error("Create call agent failed, please refresh the page.", { theme: "colored", autoClose: 3000 });
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail?.login?.isSuccess]);

  useEffect(() => {
    setCall(userDetail.call);
  }, [userDetail.call])

  useEffect(() => {
    window.onfocus = function () { 
      setIsTabActive(true);
   }; 
   
   window.onblur = function () { 
     setIsTabActive(false);
   }; 

    const onBeforeUnload = (ev: any) => {
      hangUpOrRejectCall();
    }

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const hangUpOrRejectCall = () => { 
    if (userDetail.call && typeof userDetail.call.hangUp === 'function') {
      userDetail.call.hangUp({forEveryone : true}).then();
    } else {
      if (userDetail.incomingCall && typeof userDetail.incomingCall.reject === 'function') {
        userDetail.incomingCall.reject().then();
      }
    }
  }

  const getunreadCount = () => {
    const { dispatch } = props;
    dispatch(getUnReadAlldata())
      .then((res: any) => {
        // setCount(res?.data?.data);
        dispatch(set_Chat_Count(res?.data?.data));
      })
      .catch((err: any) => {});
  };

  async function dropTheCall(message: EventSignalRModel<CallNotificationModel>) {
    const { dispatch } = props;
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    
    if (message.data 
      && (userRole == UserRoleEnum.ServiceProvider && message.data.SPId && spProfiles.indexOf(message.data.SPId) >= 0
      || userRole == UserRoleEnum.User && message.data.UserId == userProfile.id)) {

        if (message.data.CallType && getCallType(message.data.CallType) == CallTypeEnum.PhoneCall) {
          dispatch(set_Phone_Calling(false));
        }

        hangUpOrRejectCall();
        if (window.location.pathname.indexOf('/outgoing-call') >= 0 
        || window.location.pathname.indexOf('/incoming-call') >= 0) {
          if (message.broadcastType == BroadcastTypeEnum.BlockedDuringCall) {
              
            let role = 'user';
            if (userRole == UserRoleEnum.User) {
              role = 'consultant';
            }

            navigate(`/${role}/chat`);
          }
          navigate(-1);
        }
      }
  }

  // Force drop the call if has issue after 3s
  const handleCallDisconnected = (message: EventSignalRModel<CallNotificationModel>) => {
    setTimeout(() => {
      dropTheCall(message);
    }, 3000);
  }

  const handleCallNotification = (message: EventSignalRModel<CallNotificationModel>) => {
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
  
    if (message.data) {
      switch (message.broadcastType) {
        case BroadcastTypeEnum.CallDisconnected:
          handleCallDisconnected(message);
          break;
        case BroadcastTypeEnum.CallDisconnecting:
          handleCallDisconnecting(message);
          break;
        case BroadcastTypeEnum.InsufficientCredit:
          handleInsufficientCredit(message);
          break;
        case BroadcastTypeEnum.CallMissed:
          handleMissedCallSignalR(message);
          break;
          break;
        case BroadcastTypeEnum.BlockedDuringCall:
          handleCallDisconnecting(message);
          break;
        default:
          break;
      }
    }
  }

  const handleCallDisconnecting = async (message: EventSignalRModel<CallNotificationModel>) => {
    dropTheCall(message);
  }

  const handleInsufficientCredit = async (message: EventSignalRModel<CallNotificationModel>) => {
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    
    if (message.data) {
      if (message.data.CallType && getCallType(message.data.CallType) == CallTypeEnum.PhoneCall) {
        if (userRole == UserRoleEnum.User && message.data?.UserId == userProfile.id) {
          toast.error("Your call has been disconnected since you do not have the minimum amount of credits needed. Please top up to continue.", {
            theme: "colored",
            autoClose: 3000,
          });
        }
      } else {
        handleCallDisconnected(message);
      }
    }
  }

  const handleMissedCallSignalR = async (message: EventSignalRModel<CallNotificationModel>) => {
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    
    if (message.data && (userRole == UserRoleEnum.ServiceProvider && message.data.SPId && spProfiles.indexOf(message.data.SPId) >= 0)) {
        logoutData();
      }
  }

  const handleSignalRNotification = async (message: EventSignalRModel<any>) => {
    if (message.data) {
      switch (message.broadcastType) {
        case BroadcastTypeEnum.ExpiredToken:
          const data = message.data as string[];
          if (data && (data.filter(id=> spProfiles.indexOf(id) >= 0).length > 0 || 
                       data.filter(id=> id == userProfile.id).length > 0)) {
            logoutData();
          }
          break;
        case BroadcastTypeEnum.NewInboxMessage:
          break;
        case BroadcastTypeEnum.UserStatus:
          break;
        default:
          //
          break;
        
      }
    }
  }

  const initNotification = () => {
    if (("Notification" in window)) {
      try {
        if (Notification.permission !== "granted") {
          Notification.requestPermission().then((permission) => {
            console.log(permission);
          }, (err) => {
            console.log(err);
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      // Check if the browser supports notifications
      console.log("This browser does not support notification");
    }    
  }

  const initSignalRConnection = () => {
    const { dispatch } = props;
    const connection = getConnection();
    dispatch(set_Connection(connection));
    setHubConnection(connection);
    connection.on(BroadcastTargetEnum.Notification, handleSignalRNotification);
    connection.on(BroadcastTargetEnum.CallNotification, handleCallNotification);

    connection.start().then(() => {
      console.log('Hub connection started');
    }, (err) => {
      console.log(err);
    });
  }

  const initCall = (profile: any, communicationToken: string, communicationUserId: string) => {
    const { dispatch } = props;
    const tokenCredential = new AzureCommunicationTokenCredential(communicationToken);
    const userIdentifier = fromFlatCommunicationIdentifier(communicationUserId) as CommunicationUserIdentifier;
    
    const statefulCallClient = createStatefulCallClient({
      userId: userIdentifier,
    });

    statefulCallClient.createCallAgent(tokenCredential, { displayName: profile.username}).then((callAgent: CallAgent) => {
      subscribeIncomingCall(profile, callAgent, statefulCallClient, userIdentifier, tokenCredential);
    });

    subscribeIncomingMessage(tokenCredential, communicationUserId, profile);
  }

  const userInit = (communicationToken: string, communicationUserId: string) => {
    const { dispatch } = props;

    const tokenCredential = new AzureCommunicationTokenCredential(communicationToken);
    const userIdentifier = fromFlatCommunicationIdentifier(communicationUserId) as CommunicationUserIdentifier;
    const threadId = localStorage.getItem(LOCALSTORE.communicationIdentifier.threadId);

    dispatch(set_Token_Credential(tokenCredential));
    dispatch(set_User_Identifier(userIdentifier));
    dispatch(set_Thread_Id(threadId))

    const statefulCallClient = createStatefulCallClient({
      userId: userIdentifier,
    });
    statefulCallClient.createCallAgent(tokenCredential, { displayName: userProfile.username }).then((callAgent: CallAgent) => {
      dispatch(set_Call_Client(statefulCallClient));
      dispatch(set_Call_Agent(callAgent));
    });
    subscribeIncomingMessage(tokenCredential, communicationUserId, null);
  }

  const getProfiles = () => {
    const { dispatch } = props;
    dispatch(getSPProfileList()).then((result: any) => {      
      result.data.forEach((p: any) => {
        spProfiles.push(p.id);
        initCall(p, p.communicationIdentifier.token, p.communicationIdentifier.user_id);
      });
    })
  }
  
  const updateCredit = () => {
    const { dispatch } = props;
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    let userId;

    if (userRole == UserRoleEnum.ServiceProvider) 
      userId = accountData.id
    else   
      userId = userProfile.id

    if(userId || userDetail?.totalCredit?.accountId) {
      dispatch(getTotalCredit(userId ? userId : userDetail?.totalCredit?.accountId)).then((credit: any) => {
        dispatch(set_Total_Credit(credit?.data))
      })
    }
  };

  const logoutData = () => {
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    const {dispatch} = props;
    window.localStorage.clear();
    dispatch(reset_States(null));
    persistDispatch(reset_azure_communication_data())
    
    if (userRole == UserRoleEnum.ServiceProvider) {
      window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }    
  };

  const validate = (communicationToken: string, communicationUserId: string, expiredOn: string | null) => {
    if (communicationToken == null || communicationUserId == null) {
      toast.error("Communication Id not found, please contact to admin for supporting", { theme: "colored", autoClose: 3000 });
      logoutData();
      return;
    }

    if (!expiredOn) {
      logoutData();
    } else {
      const expiredDate = new Date(expiredOn);
      const now = new Date();
      if (expiredDate.getTime() - now.getTime() <= 0) {
        logoutData();
      }
    }
  }

  const subscribeIncomingMessage = (tokenCredential: AzureCommunicationTokenCredential, communicationUserId: string, profile: any) => {
    const { dispatch } = props;
    dispatch(getEndpoint())
    .then( async (res: any) => {
      dispatch(set_endpoint(res.data.data));
      const endpoint = res.data.data;
      const chat = new ChatClient(endpoint, tokenCredential);
      await chat.startRealtimeNotifications();

      chat.on("chatMessageReceived", (event) => handleChatMessageReceived(event, communicationUserId, profile));
      chat.on("chatMessageEdited", handleChatMessageUpdated);
    });
  }
  
  function handleChatMessageReceived(event: ChatMessageReceivedEvent, communicationUserId: string, profile: any) {
    // updateNewMessageToChatList(event, props, userDetail.chatThreads, userDetail.chatData);
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    const sender = event.sender as CommunicationUserKind;

    getunreadCount();
    
    if (sender.communicationUserId == communicationUserId) {
      // Update Credit to SPs when they finish a round of chat
      if (userRole == UserRoleEnum.ServiceProvider) {
        updateCredit();
      }
      return;
    }
    
    playRingTone(RingtoneEnum.MessageIncoming).then();
    
    // Update Credit to SPs when they get message with metadata (GIFT | MEDIA)
    // OR Update Credit to Users when they finish a round of chat 
    if (userRole == UserRoleEnum.ServiceProvider && Object.getOwnPropertyNames(event.metadata).length > 0
    || userRole == UserRoleEnum.User) {
      updateCredit();
    }

    if (profile) {
      notifyMe(`${event.senderDisplayName} to ${profile.username}: ${event.message}`);
    } else {
      notifyMe(`${event.senderDisplayName}: ${event.message}`);
    }
  }
  
  function notifyMe(message: string) {
    if (!("Notification" in window)) {
      console.log("This browser does not support notification");
    } else if (Notification.permission === "granted") {
      serviceWorkerRegistration.showNotification(message);
    }
  }

  function handleChatMessageUpdated(event: ChatMessageReceivedEvent) {
    // updateNewMessageToChatList(event, props, userDetail.chatThreads, userDetail.chatData);
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    
    // Update Credit to SPs when they get message with metadata
    if (userRole == UserRoleEnum.ServiceProvider && Object.getOwnPropertyNames(event.metadata).length > 0) {
      updateCredit();
    }
  }

  const handleEndCall = () => {
    stopRingTone(RingtoneEnum.Incoming);
  }

  const incomingCallListener = async (profile: any, incomingC: IncomingCall, agent: CallAgent, statefulCallClient: StatefulCallClient,
    userIdentifier: CommunicationUserIdentifier,
    tokenCredential: AzureCommunicationTokenCredential) => {
    const { dispatch } = props;
    try {
      const identifier =  incomingC.callerInfo.identifier as CommunicationUserKind
      const body = {
        callConnectionId: incomingC.id,
        incomingCommunicationUserId: identifier.communicationUserId,
      };
      
      incomingC.on("callEnded", handleEndCall);

      dispatch(detectIncomingCall(body, profile.id))
        .then(async (res: any) => {
          if (!res.data.isSuccess) {
            resetData();
            await incomingC.reject();
            incomingC.off("callEnded", handleEndCall);
            toast.error(res.data.message, {
                theme: "colored",
                autoClose: 3000,
            });
            return;
          }

          const caller: PublicProfileResponseModel = res.data.data;
          setIncomingCallUser(caller);

          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_User_Identifier(userIdentifier));
          dispatch(set_Call_Agent(agent));
          dispatch(set_Call_Client(statefulCallClient));
          dispatch(set_Incoming_Call(incomingC));
          const ct = CallTypeEnum[caller?.communication?.callConnecting?.callType as keyof typeof CallTypeEnum];
          setCallType(ct);
          setCurrentSPProfile(profile);
          setIncomingCallDialog(true);
          
          notifyMe(
`${caller.username} is calling to ${profile.username}
via ${ct == CallTypeEnum.VideoCallOneWay ? "One Way Video Call" : (ct == CallTypeEnum.VideoCallTwoWay ? "Video Call" : "Voice Call")}`);
        })
        .catch(async (err: any) => {
          resetData();
          await incomingC.reject();
          incomingC.off("callEnded", handleEndCall);
          toast.error(err.data.message, {
              theme: "colored",
              autoClose: 3000,
          });
        });
      
    } catch (error: any) {
      resetData();
      toast.error(error, { theme: "colored", autoClose: 3000 });
      await incomingC.reject();
      incomingC.off("callEnded", handleEndCall);
    }
  }

  function callEndListener() {
    resetData();
  }

  const subscribeIncomingCall = (profile: any, agent: CallAgent, 
    statefulCallClient: StatefulCallClient,
    userIdentifier: CommunicationUserIdentifier,
    tokenCredential: AzureCommunicationTokenCredential) => {
    // Listen for an incoming call to accept.
    agent.on("incomingCall", (args) => {
      incomingCallListener(profile, args.incomingCall, agent, statefulCallClient, userIdentifier, tokenCredential);
      args.incomingCall.on("callEnded", callEndListener);
    });
  };

  const onAcceptCall = (profile: any, isVideoToggle?: boolean) => {
    const { dispatch } = props;
    setIncomingCallDialog(false);
    stopRingTone(RingtoneEnum.Incoming);
    dispatch(acceptIncomingCall(incomingCall.id, incomingCallUser?.id, profile.id))
      .then(async (res: any) => {
        if (res?.data?.isSuccess) {
          const acceptIncomingCall : AcceptIncomingCallModel = res?.data.data;
          dispatch(set_toggle_video_call(isVideoToggle));
          dispatch(set_chat_data(acceptIncomingCall.callConnectedUser?.room));
          dispatch(set_call_connected(acceptIncomingCall.callConnectedUser));
          dispatch(set_Thread_Id(acceptIncomingCall.callConnectedUser?.room?.threadId));
          let callType = '';
          if (incomingCallUser?.communication?.callConnecting?.callType) {
            const callTypeEnum = CallTypeEnum[(incomingCallUser.communication.callConnecting.callType) as keyof typeof CallTypeEnum];
            if (callTypeEnum == CallTypeEnum.VideoCallTwoWay) {
              callType = 'video';
            } else if (callTypeEnum == CallTypeEnum.VideoCallOneWay) {
              callType = 'video-one-way';
            } else if (callTypeEnum == CallTypeEnum.AudioCall) {
              callType = 'voice';
            } 
          }

          incomingCall.off("callEnded", callEndListener);

          let role = 'user';
          if (incomingCallUser?.role == UserRoleEnum.User) {
            role = 'consultant';
          }

          navigate(`/${role}/incoming-call/${callType}/${acceptIncomingCall.callConnectedUser?.callerUser?.id}`);
        }
      })
      .catch((err: any) => {
        toast.error(err.data.message, { theme: "colored", autoClose: 3000 });
        incomingCall.reject();
        resetData();
      });
  };

  const onRejectCall = async () => {
    stopRingTone(RingtoneEnum.Incoming);
    
    if (!incomingCallUser) {
      toast.error("Cannot detect caller user", { theme: "colored", autoClose: 3000 });
      resetData();

      return;
    }

    
    await incomingCall.reject();
    incomingCall.off("callEnded", handleEndCall);
    resetData();
  };

  const resetData = () => {
    const { dispatch } = props;
    dispatch(reset_Call_State(null));
    dispatch(set_Call_Agent(null));
    setIncomingCallDialog(false);
  }

  return (
    <div className=" w-full bg-center">
      <ToastContainer />
      <audio id="message-tone" hidden>
        <source type="audio/mpeg"></source>
      </audio>
      <audio id="writing-a-text-message-tone" hidden>
        <source type="audio/mpeg"></source>
      </audio>
      <audio id="top-up-alert" hidden>
        <source type="audio/mpeg"></source>
      </audio>
      <audio id="outgoing-tone" hidden>
        <source type="audio/mpeg"></source>
      </audio>
      <audio hidden={true} id="incoming-tone">
        <source type="audio/mpeg"></source>
      </audio>
      {isIncomingCall && callType != CallTypeEnum.VideoCallTwoWay && (
        <IncomingAudioCall
          callerName={incomingCallUser?.username}
          calleeName={currentSPProfile?.username}
          avatar={incomingCallUser?.profileImageUrl}
          currentSPProfile={currentSPProfile}
          alertText={callType == CallTypeEnum.VideoCallOneWay ? "Incoming One Way Video Call" : "Incoming Voice Call"}
          onClickAccept={onAcceptCall}
          onClickReject={onRejectCall}
        />
      )}
      {isIncomingCall && callType == CallTypeEnum.VideoCallTwoWay && (
        <IncomingVideoCall
          callerName={incomingCallUser?.username}
          calleeName={currentSPProfile?.username}
          avatar={incomingCallUser?.profileImageUrl}
          currentSPProfile={currentSPProfile}
          alertText={"Incoming Video Call"}
          onClickAccept={onAcceptCall}
          onClickReject={onRejectCall}
        />
      )}
      </div>
  );
};

export default connect()(AzureCallAgent);

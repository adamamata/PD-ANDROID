import React, { useEffect, useRef, useState } from "react";
import {
  openChatThread,
  getChatThreads,
  getSearchFriend,
  postRequestConsultation,
  getChatMessage,
  readMeassgess,
  getUnReadAlldata,
  getEndpoint,
  getindexLists,
  getSPProfileList,
} from "../../../services/homeService";
import {
  auth_details,
  set_chat_data,
  set_Show_Chat,
  set_Chat_Count,
  set_Token_Credential,
  set_User_Identifier,
  set_Thread_Id,
  // set_chat_threads,
} from "../../../reducer/auth";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import ChatScreen from "./chatScreen";
import RctPageLoader from "../../../component/RctPageLoader";
import NewChat from "./newChat";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatThreadModel } from "../../../models/chat-model";
import { ChatClient, ChatMessage } from "@azure/communication-chat";
import { updateNewMessageToChatList } from "../../../functions/utilities";
import { LOCALSTORE } from "../../../constant/default";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import ChatList from "../../../component/chat/chatList";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { CommunicationUserIdentifier } from "@azure/communication-signaling";
import { set_azure_communication_data, set_chat_token_credential_data } from "../../../reducer/chatDataSlice";

const UserChat: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const [chat, setChat] = useState(false);
  const profile = useSelector(auth_details);
  const [isLoading, setisLoading] = useState(false);
  const chatUser = profile?.chatData;
  const showChat = profile?.showChat;
  const [chatThreads, setChatThreads] = useState<ChatThreadModel[]>([]);
  const [indexsList, setIndexList] = useState<any>();
  const [searchData, setSearchData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [newChatShow, setNewChatShow] = useState(false);
  const [DisableRequest, setDisableRequest] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [indexState, setIndexState] = useState(null);

  useEffect(() => {
    const onBeforeUnload = () => {
      localStorage.setItem("indexData", JSON.stringify(null));
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return(() => {
      localStorage.setItem("indexData", JSON.stringify(null));
      window.removeEventListener("beforeunload", onBeforeUnload);
    })
  },[])

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    },0)
  }, [])

  useEffect(() => {
    // getChatListData();
    getIndexData();
    getProfiles();
    if (chatUser?.myId && showChat) {
      getWholeMessage();
    }

    persistDispatch(set_Token_Credential(null))    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatUser]);

  const getProfiles = () => {
    const { dispatch } = props;
    dispatch(getEndpoint()).then(async (endpoint: any) => {
      dispatch(getSPProfileList()).then((profiles: any) => {
        profiles.data.forEach((profile: any) => {
          const tokenCredential = new AzureCommunicationTokenCredential(profile.communicationIdentifier.token);
          subscribeIncomingMessage(endpoint, tokenCredential);
        });
      })
    })
  }

  const subscribeIncomingMessage = async (endpoint: string, tokenCredential: AzureCommunicationTokenCredential) => {
    const chatClient = new ChatClient(endpoint, tokenCredential);

    await chatClient.startRealtimeNotifications();

    chatClient.on("chatMessageReceived", (data) => {
      getIndexData();
      setIndexState((c : any) => {
        if (c)
        c.callBack(data);
        return c;
      });
    });
  };

  const getunreadCount = () => {
    const { dispatch } = props;
    dispatch(getUnReadAlldata())
      .then((res: any) => {
        // setCount(res?.data?.data);
        dispatch(set_Chat_Count(res?.data?.data));
      })
      .catch((err: any) => {});
  };

  const getIndexData = () => {
    const { dispatch } = props;
    dispatch(getindexLists())
      .then((res: any) => {
        setIndexList(res.data);
      })
      .catch((Err: any) => {
        console.log("dfscghv", Err);
      });
  };

  const bakctogetChat = (data:any) => {
    // getChatListData()
 }

 const setIndexThread = (data:any ,arrayData:any) => {
  const index = arrayData?.findIndex((res:any) => res.id === data.id)
  const newObj :any = arrayData?.find((res:any) => res.id === data.id)
  if (index !== -1 && newObj) {
    arrayData?.splice(index , 1)
    arrayData?.splice(0, 0, newObj);
  }
  setChatThreads(arrayData)
 }

 const handleInboxChanged = (state: any) => {
  setIndexState(state);
 }

  const createOpenChatThread = (participantUserId: any,  myUserId: any) => {    
    setisLoading(true);
    const { dispatch } = props;
    dispatch(openChatThread(participantUserId, myUserId))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId)  as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
          localStorage.setItem(
            LOCALSTORE.communicationIdentifier.threadId,
            res?.data?.threadId
          );

          localStorage.setItem(
            LOCALSTORE.communicationIdentifier.token,
            res?.data?.myAccessToken
          );
        }
        setisLoading(false);
        persistDispatch(set_azure_communication_data(res?.data))
        persistDispatch(set_chat_token_credential_data(new AzureCommunicationTokenCredential(res?.data?.myAccessToken)))
        dispatch(set_chat_data(res?.data));
        dispatch(set_Show_Chat(true));
        setOpenChat(true);
        getunreadCount();
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
      });
  };

  const getWholeMessage = () => {
    const { dispatch } = props;
    const body = {
      threadId: chatUser?.threadId,
      chatAccessToken: chatUser?.myAccessToken,
    };
    dispatch(getChatMessage(body))
      .then((res: any) => {
        const data: any = [];
        res.data.map((item: any) => {
          data.push(item.id);
        });
        readMassgess(data);
      })
      .catch((err: any) => {});
  };

  const readMassgess = (messages: any) => {
    const { dispatch } = props;
    const body = {
      threadId: chatUser?.threadId,
      chatAccessToken: chatUser?.myAccessToken,
      messageIds: messages,
    };
    dispatch(readMeassgess(body))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getunreadCount();
        }
      })
      .catch((err: any) => {});
  };

  const getChatListData = () => {
    setisLoading(true);
    const { dispatch } = props;
    dispatch(getChatThreads())
      .then((res: any) => {
        if (res) {
          setChatThreads(res.data);
          setIndexThread(chatUser , res.data );
          getunreadCount();
        }

        setisLoading(false);
      })
      .catch((err: any) => {
        setisLoading(false);
      });
  };

  const changeChatList = (data: any) => {
    createOpenChatThread(data?.participantUserId, data?.myUserId);
    // getChatListData();
  };

  const changeCHateList = (data: any) => {
    createOpenChatThread(data?.participantUserId, data?.myUserId);
  };


  const newChatClose = () => {
    setNewChatShow(false);
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const requestUser = (searchData: any) => {
    const { dispatch } = props;
    setisLoading(true);
    dispatch(postRequestConsultation(searchData?.id))
    .then((res: any) => {
        if (res?.data?.isSuccess) {
          setDisableRequest(true);
          setisLoading(false);
          toast.success("Request send Successful!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        console.log("errr", err);
        setisLoading(false);
      });
    };
    
    return (
    <ChatList 
      showChat={showChat}
      profile={profile}
      searchData={searchData}
      changeCHateList={changeCHateList}
      DisableRequest={DisableRequest}
      requestUser={requestUser}
      error={error}
      chatThreads={chatThreads}
      chatUser={chatUser}
      changeChatList={changeChatList}
      newChatShow={newChatShow}
      newChatClose={newChatClose}
      getChatListData={getChatListData}
      isLoading={isLoading}
      chatType="consultant"
      indexsList={indexsList}
      setIsLoading={setisLoading}
      bakctogetChat={bakctogetChat}
      setIndexThread={setIndexThread}
      onInboxChanged={handleInboxChanged}
    />
  );
};

export default connect()(UserChat);

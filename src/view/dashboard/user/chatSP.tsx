import React, { useEffect, useState } from "react";
import Header from "../../../component/header";
import {
  openChatThread,
  getChatThreads,
  postRequestConsultation,
  getSearchFriend,
  getChatMessage,
  readMeassgess,
  getUnReadAlldata,
  getEndpoint
} from "../../../services/homeService";
import {
  auth_details,
  set_chat_data,
  set_Show_Chat,
  set_Chat_Count,
  set_User_Identifier,
  set_Token_Credential,
  set_Thread_Id,
  // set_chat_threads,

} from "../../../reducer/auth";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import ChatScreen from "./chatScreen";
import NewChat from "./newChat";
import SendGift from "./sendGift";
import RctPageLoader from "../../../component/RctPageLoader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatThreadModel } from "../../../models/chat-model";
import { ChatClient, ChatMessage } from "@azure/communication-chat";
import { updateNewMessageToChatList } from "../../../functions/utilities";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from "@azure/communication-common";
import { LOCALSTORE } from "../../../constant/default";
import ChatList from "../../../component/chat/chatList";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";

const SPChat: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const [chat, setChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profile = useSelector(auth_details);
  const [isLoading, setLoading] = useState(false);
  const chatUser = profile?.chatData;
  const showChat = profile?.showChat;

  const [chatThreads, setChatThreads] = useState<ChatThreadModel[]>([]);

  const [newChatShow, setNewChatShow] = useState(false);
  const [giftShow, setGiftShow] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [chatMassges, setchatMassges] = useState(chatUser);
  const [DisableRequest, setDisableRequest] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [indexState, setIndexState] = useState(null);

  useEffect(() => {
    getChatListData();
    setchatMassges(chatUser);
    subscribeIncomingMessage();
    if (chatUser?.myId && showChat) {
      getWholeMeassge();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribeIncomingMessage = () => {
    const { dispatch } = props;
    dispatch(getEndpoint())
      .then(async (res: any) => {
        const endpoint = res.data.data;
        const communicationToken = localStorage.getItem(LOCALSTORE.communicationIdentifier.token) as any;
        const tokenCredential = new AzureCommunicationTokenCredential(communicationToken);
        const chatClient = new ChatClient(endpoint, tokenCredential);

        await chatClient.startRealtimeNotifications();

        chatClient.on("chatMessageReceived", (data) => {
          setIndexState((c : any) => {
            if (c)
            c.callBack(data);
            return c;
          });
        });
      });
  }

  const createOpenChatThread = (id: any) => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(openChatThread(id))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId)  as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
        }
        dispatch(set_chat_data(res?.data));
        setchatMassges(res?.data);
        dispatch(set_Show_Chat(true));
        setLoading(false);
        setOpenChat(true);
        getunreadCount();
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setLoading(false);
      });
  };

  const getChatListData = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getChatThreads())
      .then((res: any) => {
        if (res) {
          setChatThreads(res.data);   
          setIndexThread(chatUser , res.data );
          getunreadCount();
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };


  const bakctogetChat = (data:any) => {
    getChatListData()
 }

 const handleInboxChanged = (state: any) => {
  setIndexState(state);
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

  const readMassgess = (meassges: any) => {
    const { dispatch } = props;
    const body = {
      threadId: chatUser?.threadId,
      chatAccessToken: chatUser?.myAccessToken,
      messageIds: meassges,
    };
    dispatch(readMeassgess(body))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getChatListData();
        }
      })
      .catch((err: any) => { });
  };

  const getWholeMeassge = () => {
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
      .catch((err: any) => { });
  };

  const onSearchList = () => {
    const { dispatch } = props;
    setLoading(true);
    if (searchQuery !== "") {
      dispatch(getSearchFriend(searchQuery))
        .then((res: any) => {
          setError(false);
          setLoading(false);
          setSearchData(res.data);
        })
        .catch((err: any) => {
          setError(true);
          setLoading(false);
        });
    } else {
      setError(false);
      setLoading(false);
    }
  };

  const changeCHateList = (data: any) => {
    createOpenChatThread(data?.participantUserId);
  };

  const changeChatList = (data: any) => {
    createOpenChatThread(data?.participantUserId);
    getunreadCount()
  };

  const newChatClose = () => {
    setNewChatShow(false);
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const requestUser = (searchData: any) => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(postRequestConsultation(searchData?.id))
      .then((res: any) => {
        if (res?.data?.isSuccess) {
          setDisableRequest(true);
          setLoading(false);
          toast.success("Request user send Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setLoading(false);
      });
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const getunreadCount = () => {
    const { dispatch } = props;
    dispatch(getUnReadAlldata())
      .then((res: any) => {
        // setCount(res?.data?.data);
        dispatch(set_Chat_Count(res?.data?.data));
      })
      .catch((err: any) => { });
  };

  return (
    <>
      <ChatList
        showChat={showChat}
        profile={profile}
        onSearchList={onSearchList}
        searchQuery={searchQuery}
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
        chatType='user'
        bakctogetChat={bakctogetChat}
        setIndexThread={setIndexThread}
        onInboxChanged={handleInboxChanged}
      />
    </>
  );
};

export default connect()(SPChat);

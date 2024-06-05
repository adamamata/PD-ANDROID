import React, { useEffect, useState, useRef } from "react";
import {
  openChatThread,
  getChatThreads,
  postRequestConsultation,
  getSearchFriend,
  readMeassgess,
  getUnReadAlldata,
  getChatMessage,
  getEndpoint,
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
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateNewMessageToChatList } from "../../../functions/utilities";
import { ChatClient, ChatMessage } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from "@azure/communication-common";
import { LOCALSTORE } from "../../../constant/default";
import ChatList from "../../../component/chat/chatList";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { set_azure_communication_data, set_chat_token_credential_data } from "../../../reducer/chatDataSlice";

const UserChat: React.FC<any> = (props: any) => {
  const persistDispatch = useDispatch()
  const [chat, setChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profile = useSelector(auth_details);
  const [isLoading, setLoading] = useState(false);
  const showChat = profile?.showChat;
  const [chatThreads, setChatThreads] = useState<any[]>([]);

  const [newChatShow, setNewChatShow] = useState(false);
  const [giftShow, setGiftShow] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [DisableRequest, setDisableRequest] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false)
  const [currentChatData, setCurrentChatData] = useState<any>({})
  const [noMoreData, setNoMoreData] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [cardLoading, setCardLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>();

  useEffect(() => {
    const { dispatch } = props;
    getChatListData();
    subscribeIncomingMessage();
    if (currentChatData?.myId && showChat) {
      getWholeMeassge();
    }

    dispatch(set_chat_data({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentChatData !== null && chatLoading) {
      if (currentChatData.participantUserId) {
        const updateThread = chatThreads.map((thread: any) => {
          if (thread.participantUserId === currentChatData.participantUserId) {
            thread.unread = 0
            return thread
          }
          return thread
        })
        setChatThreads(updateThread);
        setChatLoading(false)
      }
    }
  }, [currentChatData, chatLoading])

  const subscribeIncomingMessage = () => {
    const { dispatch } = props;
    dispatch(getEndpoint()).then(async (res: any) => {
      const endpoint = res.data.data;
      const communicationToken = localStorage.getItem(
        LOCALSTORE.communicationIdentifier.token
      ) as any;
      const tokenCredential = new AzureCommunicationTokenCredential(
        communicationToken
      );
      const chatClient = new ChatClient(endpoint, tokenCredential);

      await chatClient.startRealtimeNotifications();

      chatClient.on("chatMessageReceived", (data) => {
        setChatThreads((ct) => {
          const updatedChatThreads = updateNewMessageToChatList(
            data,
            ct,
            data.threadId
          );

          return updatedChatThreads
        })

        setChatLoading(true)
      });
    });
  };

  const setIndexThread = (data: any, arrayData: any) => {
    const index = arrayData?.findIndex((res: any) => res.id === data.id)
    const newObj: any = arrayData?.find((res: any) => res.id === data.id)
    if (index !== -1 && newObj) {
      arrayData?.splice(index, 1)
      arrayData?.splice(0, 0, newObj);
    }
    setChatLoading(true)
    setChatThreads(arrayData)
  }

  const createOpenChatThread = (id: any) => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(openChatThread(id))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId) as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
          localStorage.setItem(
            LOCALSTORE.communicationIdentifier.threadId,
            res?.data?.threadId
          );
        }
        dispatch(set_chat_data(res?.data));
        persistDispatch(set_azure_communication_data(res?.data))
        persistDispatch(set_chat_token_credential_data(new AzureCommunicationTokenCredential(res?.data?.myAccessToken)))


        setCurrentChatData(res?.data)
        if (res?.data) {
          const updateThread = chatThreads.map((thread: any) => {
            if (thread.participantUserId === res?.data?.participantUserId) {
              thread.unread = 0
              return thread
            }
            return thread
          })
          setChatThreads(updateThread);
        }

        dispatch(set_Show_Chat(true));
        setLoading(false);
        setOpenChat(true);
        
        getunreadCount();
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const bakctogetChat = (data: any) => {
    // getChatListData();
  };

  const getChatListData = (searchText?: string) => {
    if (abortControllerRef.current) {
      return;
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const { dispatch } = props;
    setLoading(true);
    dispatch(getChatThreads(page, searchText))
      .then((res: any) => {
        if (res) {
          getunreadCount();
          setChatThreads(res.data);
          setChatLoading(true)
          setIndexThread(currentChatData, res.data)
          setPage(page + 1);
          if (res.data.length === 0) {
            setNoMoreData(true);
          }
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
      }).finally(() => {
        abortControllerRef.current = null;
      })
  };

  const getMoreChatThreads = (searchText?: string) => {
    if (abortControllerRef.current) {
      return;
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setCardLoading(true)
    const { dispatch } = props;
    dispatch(getChatThreads(page, searchText))
      .then((res: any) => {
        setCardLoading(false)
        setChatThreads((prev: any) => [...prev, ...res.data]);
        setPage(page + 1);
        if (res.data.length === 0) {
          setNoMoreData(true);
        }
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        setCardLoading(false)
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      }).finally(() => {
        abortControllerRef.current = null;
      });
  };

  const readMassgess = (meassges: any) => {
    const { dispatch } = props;
    const body = {
      threadId: currentChatData?.threadId,
      chatAccessToken: currentChatData?.myAccessToken,
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
      threadId: currentChatData?.threadId,
      chatAccessToken: currentChatData?.myAccessToken,
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
    getunreadCount();
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
          toast.success("Request send user Successfull!", {
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
      chatUser={currentChatData}
      changeChatList={changeChatList}
      newChatShow={newChatShow}
      newChatClose={newChatClose}
      getChatListData={getChatListData}
      isLoading={isLoading}
      chatType="user"
      bakctogetChat={bakctogetChat}
      setIndexThread={setIndexThread}
      noMoreData={noMoreData}
      getMoreChatThreads={getMoreChatThreads}
      cardLoading={cardLoading}
      setPage={setPage}
    />
  );
};

export default connect()(UserChat);

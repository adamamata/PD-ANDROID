import React, { useEffect, useState } from "react";
import {
  openChatThread,
  getChatThreads,
  getSearchFriend,
  postRequestConsultation,
  getChatMessage,
  getUnReadAlldata,
  readMeassgess,
  getEndpoint,
  getindexLists,
} from "../../../services/homeService";

import {
  auth_details,
  set_chat_data,
  set_Chat_Count,
  set_Show_Chat,
  set_Token_Credential,
  set_User_Identifier,
  set_Thread_Id,
} from "../../../reducer/auth";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatThreadModel } from "../../../models/chat-model";
import { updateNewMessageToChatList } from "../../../functions/utilities";
import { ChatClient, ChatMessage } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { LOCALSTORE } from "../../../constant/default";
import ChatList from "../../../component/chat/chatList";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { CommunicationUserIdentifier } from "@azure/communication-signaling";

const UserChat: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const profile = useSelector(auth_details);
  const [isLoading, setisLoading] = useState(false);
  const chatUser = profile?.chatData;
  const showChat = profile?.showChat;

  const [chatThreads, setChatThreads] = useState<ChatThreadModel[]>([]);

  const [searchData, setSearchData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatShow, setNewChatShow] = useState(false);
  const [DisableRequest, setDisableRequest] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [indexsList, setIndexList] = useState<any>();
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    getChatListData();
    getIndexData();
    subscribeIncomingMessage();
    if (chatUser?.myId && showChat) {
      getWholeMessage();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatUser]);

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
          return updatedChatThreads;
        });
      });
    });
  };

  const bakctogetChat = (data:any) => {
    getChatListData()
 }

 const setIndexThread = (data:any ,arrayData:any) => {
  const index = arrayData?.findIndex((res:any) => res.id === data.id)
  const newObj :any = arrayData.find((res:any) => res.id === data.id)
  if (index !== -1 && newObj) {
    arrayData?.splice(index , 1)
    arrayData?.splice(0, 0, newObj);
  }
  setChatThreads(arrayData)
 }

  const createOpenChatThread = (participantUserId: any, myUserId:any) => {
    setisLoading(true);
    const { dispatch } = props;
    dispatch(openChatThread(participantUserId, myUserId))
      .then((res: any) => {
        setisLoading(false);
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId)  as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
        }
        dispatch(set_chat_data(res?.data));
        dispatch(set_Show_Chat(true));
        setOpenChat(true);
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

  const getIndexData = () => {
    const { dispatch } = props;
    dispatch(getindexLists())
      .then((res: any) => {
        setIndexList(res.data)
      })
      .catch((Err: any) => {
        console.log("dfscghv", Err);
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
    getChatListData();
  };

  const onSearchList = () => {
    const { dispatch } = props;
    setisLoading(true);
    if (searchQuery !== "") {
      dispatch(getSearchFriend(searchQuery))
        .then((res: any) => {
          if (res.data.length === 0) {
            setError(true);
            setisLoading(false);
          } else {
            setError(false);
            setSearchData(res.data[0]);
            setisLoading(false);
          }
        })
        .catch((err: any) => {
          setisLoading(false);
        });
    } else {
      setError(false);
      setisLoading(false);
    }
  };

  const changeCHateList = (data: any) => {
    createOpenChatThread(data?.participantUserId, data?.myUserId);
  };

  const newChatClose = () => {
    setNewChatShow(false);
  };

  const requestUser = (searchData: any) => {
    const { dispatch } = props;
    setisLoading(true);
    dispatch(postRequestConsultation(searchData?.id))
      .then((res: any) => {
        if (res?.data?.isSuccess) {
          setDisableRequest(true);
          setisLoading(false);
          toast.success("Request send Successfull!", {
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
      .catch((err: any) => {});
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
      chatUser={chatUser}
      changeChatList={changeChatList}
      newChatShow={newChatShow}
      newChatClose={newChatClose}
      getChatListData={getChatListData}
      isLoading={isLoading}
      dispatch={props.dispatch}
      indexsList={indexsList}
      chatType="consultant"
      bakctogetChat={bakctogetChat}
      setIndexThread={setIndexThread}
    />
  );
};

export default connect()(UserChat);

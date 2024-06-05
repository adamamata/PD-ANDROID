import Search12Regular from "@fluentui/react-icons/lib/esm/components/Search12Regular";
import api from "../API/api";
import { GetToken } from "../constant/default";

export const getConnection = () => {
  return api.hubConnectionBuilder("signalrapi/signalr");
};

export const getFriendList = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/friends`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getSearchFriend = (name) => {
  const userIndex = localStorage.getItem('userIndex')
  const profileId = JSON.parse(userIndex)?.id

  let url = `userapi/users/search/${name}?user-id=${profileId}`;
  if (profileId) {
    url = `userapi/users/search/${name}?user-id=${profileId}`
  }

  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const postRequestConsultation = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/request/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getRequestData = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/friends-request`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const createAcceptData = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/accept-request/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const createRejectData = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/reject-request/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const changeStatusvideoCall = (id, status) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/voiceandvideo-status/${status}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getUserDetails = (id, profileId) => {
  let url = `userapi/users/${id}`;
  if (profileId) {
    url = `userapi/users/${id}?user-id=${profileId}`;
  }
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const checkDonotDisturb = (calleeUserId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`userapi/users/${calleeUserId}/donotdisturb-status`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const validateCallConnecting = (calleeUserId, callType) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/call/${calleeUserId}/validate-connecting/${callType}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const enableInCallStatus = (
  callerUserId,
  calleeUserId,
  value = true
) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(
          `userapi/users/${callerUserId}/${calleeUserId}/incall-status/${value}`
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const openChatThread = (participantUserId, myUserId) => {
  let url = `commapi/chats/${participantUserId}/open`;
  if (myUserId) {
    url = `commapi/chats/${participantUserId}/open?user-id=${myUserId}`
  }
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(url)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getEndpoint = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/endpoint`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getChatThreads = (pageNo, searchText) => {
  let url = `commapi/chats/threads?page-no=${pageNo}&page-size=20`;
  if (searchText) {
    url = `commapi/chats/threads?page-no=${pageNo}&page-size=20&username=${searchText}`
  }
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(url)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const sendChatMessage = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chats/send-message`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getChatMessage = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chats/get-messages`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getChatMessageSreach = (name) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/chats/threads?username=${name}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getNewChatData = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/chats/new-chats/users`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const readMeassgess = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`commapi/chats/set-receipt`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getUnReadAlldata = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/chats/unread-all`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const acceptIncomingCall = (callConnectionId, callerUserId, calleeUserId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/incoming-call/${callConnectionId}/accept?caller=${callerUserId}&callee=${calleeUserId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const rejectIncomingCall = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`commapi/incoming-call/reject`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const callConnecting = (calleeUserId, callType) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/call/${calleeUserId}/connecting/${callType}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const phoneCallConnecting = (roomId, calleeUserId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/${roomId}/call/${calleeUserId}/connecting`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const updateCallConnected = (roomId, callConnectionId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`commapi/call/${roomId}/connected/${callConnectionId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const detectIncomingCall = (body, profileId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`commapi/incoming-call/detect?user-id=${profileId}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const endCall = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/call/end`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const endCallImmediately = (body) => {
  api.postwithToken(`commapi/call/end`, body);
};

export const missedCallImmediately = (body) => {
  api.postwithToken(`commapi/call/missed`, body);
};

export const missedCall = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/call/missed`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const validateInsufficientCredit = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/call/validate-sufficient-credit`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const sendMediaFile = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postFormWithToken(`commapi/chat/send-media`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getAllinbox = (userId, searchText) => {
  const body = {
    sort: [{ selector: 'created', desc: true }],
  } 
  if(searchText) {
    body.filter = [
      ["senderName", "contains", searchText]
    ] 
  } 

  let url = `commapi/inbox/messages/list`;
  if (userId) {
    url = `commapi/inbox/messages/list?user-id=${userId}`;
  }

  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`${url}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log('error', err);
          reject(err);
        });
    });
  };
};

export const getUnreadIndex = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/inbox/unread-all`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getOneUnreadIndex = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/inbox/messages/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const attachedFile = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/inbox/attached`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const searchInbox = (name) => {
  const userIndex = localStorage.getItem('userIndex')
  const profileId = JSON.parse(userIndex)?.id

  let url = `userapi/users/search/${name}`;
  if (profileId) {
    url = `userapi/users/search/${name}?user-id=${profileId}`
  }

  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const messageSend = (body, userId) => {
  let url = `commapi/inbox/messages/send`;
  if (userId) {
    url = `commapi/inbox/messages/send?user-id=${userId}`;
  }
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`${url}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const addNewCardData = (body) => {
  let url = `paymentapi/payments/infos`;
  if (!GetToken()) {
    url = `paymentapi/payments/infos/register`;
  }
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`${url}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getCardData = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`paymentapi/payments/accounts/${id}/infos`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const createTopUpMenu = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`paymentapi/payments/deposit`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const withdrawData = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`paymentapi/payments/withdraw`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getMediaUrl = (id, messageId, mediaId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/chat/${id}/${messageId}/media-url/${mediaId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getMediaUrls = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/chat/${id}/list-media`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const acceptMediaFile = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chat/${id}/accept-media`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const denyMediaFile = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chat/${id}/deny-media`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const downloadMediaFile = (url) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getWithoutToken(url)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const myTransctions = (pageNo) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(
          `paymentapi/payments/my-transactions?page-no=${pageNo}&page-size=50`
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const openInboxMessage = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/inbox/messages/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const requestGift = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chat/request-gift`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const SendGiftData = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chat/send-gift`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const acceptGift = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chat/${id}/accept-gift`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const rejectGift = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/chat/${id}/reject-gift`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const changeBusyStatus = (id, status) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/busy-status/${status}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const changeDoNotDisturbStatus = (id, status) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/donotdisturb-status/${status}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getallcontryList = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`paymentapi/countries?skip=0&take=100`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getStateSearchList = (id, name) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`paymentapi/countries/${id}/states?skip=0&take=100`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getuserData = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/service-providers`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const getSPProfileList = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`userapi/users/my-profiles`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const postSelectUser = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/connected-users?user-id=${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const getNotes = (chatRoomId, userId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/call/${chatRoomId}/notes?user-id=${userId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const deleteNote = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .deleteWithToken(`commapi/call/note/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const addNote = (data) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`commapi/call/note`, data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const updateNote = (data) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`commapi/call/note`, data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getindexLists = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/chats/profiles`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getInboxIndexLists = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`commapi/inbox/profiles`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const ChangeStatus = (status, id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/status/${status}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const ChangeStatusOnlineTOffline = (id, status) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/online/${status}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getUserCategories = (getForFilter) => {
  let url = `userapi/categories/name/list`;
  if (getForFilter) {
    url = `userapi/categories/name/list?get-for-filter=true`;
  }
  
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const putFavorites = (id, value) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/fovorites/${id}/${value}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getAllFavorites = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/favorites`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const indexSwitchUser = (userId, searchText) => {
  let url = `commapi/chats/threads/?user-id=${userId}`

  if (searchText) {
    url = `commapi/chats/threads/?user-id=${userId}&username=${searchText}`
  }

  return new Promise(async (resolve, reject) => {
    return api
      .getwithToken(url)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("error", err);
        reject(err);
      });
  });
};

export const putHeartbeat = () => {
  return new Promise(async (resolve, reject) => {
    return api
      .putwithToken(
        `userapi/users/heartbeat`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTotalCredit = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`paymentapi/payments/accounts/${id}/balances`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getPublicHomPageSpData = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .post(
          `userapi/users/service-providers/public`, body
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); 
    });
  }
}

export const uploadCkEditorImage = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .put(
          `userapi/users/infos-upload-images`, body
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); 
    });
  }
}

export const enableDisableDoNotDisturb = (status) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(
          `userapi/users/donotdisturb-status/${status}`
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); 
    });
  }
}

export const verifyEmail = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .put(
          `authapi/accounts/verify-email`, body
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); 
    });
  }
}

export const deleteCardData = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .deleteWithToken(`paymentapi/payments/infos/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const updateClientStatus = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/status/list`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
}

export const getSharableUrl = (profileId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`userapi/users/${profileId}/profile-url`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getUserByUserName = (uniqueUsername, isOver18) => {
  let url = `userapi/users/unique/${uniqueUsername}`
  
  if(isOver18) {
    url = `userapi/users/unique/${uniqueUsername}?over-18=true`
  }

  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .get(`${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getUserByUserNameWithToken = (uniqueUsername, isOver18) => {
  let url = `userapi/users/unique/${uniqueUsername}`
  
  if(isOver18) {
    url = `userapi/users/unique/${uniqueUsername}?over-18=true`
  }

  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`${url}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const updateUserDetails = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .patchtwithToken(`userapi/users/${id}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}

export const getBlockUserList = (profileId, page, pageSize) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`userapi/users/${profileId}/blocked?page-no=${page}&page-size=${pageSize}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const addBlockUser = (id, blockedId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/blocked/${blockedId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const unblockUser = (id, blockedId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/unblocked/${blockedId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};


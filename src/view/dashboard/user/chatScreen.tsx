import React, { useEffect, useState } from "react";
import {
  AddPhoneNumberOptions,
  CallAgent,
  CallClient,
  DeviceManager,
  GroupCallLocator,
} from "@azure/communication-calling";
import phoneCall from "../../../assets/images/phoneCall.svg";
import voiceCall from "../../../assets/images/voiceCall.svg";
import videoCall from "../../../assets/images/videoCall.svg";
import videoCallOneWay from "../../../assets/images/videoCallOneWay.svg";
import viewFile from "../../../assets/images/viewFile.png";
import OpenMediaFile from "../consultant/openMediaFile";
import RctPageLoader from "../../../component/RctPageLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import {
  ChatComposite,
  useAzureCommunicationChatAdapter,
  AvatarPersonaData,
  MessageProps,
  MessageRenderer,
  CommunicationParticipant,
} from "@azure/communication-react";

import {
  CommunicationUserIdentifier,
  CommunicationTokenCredential,
  PhoneNumberIdentifier,
} from "@azure/communication-common";
import {
  sendChatMessage,
  sendMediaFile,
  acceptMediaFile,
  denyMediaFile,
  getMediaUrl,
  SendGiftData,
  acceptGift,
  rejectGift,
  getMediaUrls,
  checkDonotDisturb,
  getTotalCredit
} from "../../../services/homeService";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendGift from "./sendGift";
import {
  set_Show_Chat,
  auth_details,
  set_toggle_video_call,
  set_Total_Credit,
} from "../../../reducer/auth";
import {
  getCallDurationMessage,
} from "../../../functions/call-functions";
import axios from "axios";
import GiftSent from "./giftSent";
import TopUpModal from "./topUpModal";
import {
  playRingTone,
} from "../../../functions/utilities";
import { isMobile } from "react-device-detect";
import SendBox from "../../../component/chat/send-box";
import ViewMediaGallary from "./viewMediaGallary";
import { RingtoneEnum } from "../../../enums/enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faXmark } from "@fortawesome/free-solid-svg-icons";

interface Cprops {
  chatThread: any;
  chatThreads: any;
  showChat: any;
}

const ChatScreen: React.FC<any> = (props: Cprops | any) => {
  const chatThreads = props.chatThreads;
  const showChat = props.showChat;
  const profile = useSelector(auth_details);
  const callAgent: CallAgent = profile?.callAgent;
  const tokenCredential: CommunicationTokenCredential = profile?.tokenCredential;
  const userIdentifier: CommunicationUserIdentifier = profile?.userIdentifier;

  const credit = profile.user_profile.credit;

  const [chatThread, setChat] = useState(props.chatThread);
  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [viewMedia, setViewMedia] = useState<boolean>(false);
  const [viewImage, setViewImage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [giftSent, setGiftSent] = useState(false);
  const [allfiles, setAllFiles] = useState([]);
  const [insufficientCreditsOnGift, setInsufficientCreditsOnGift] =
    useState<boolean>(false);
  const [viewMediaGallary, setViewMediaGallary] = useState(false);

  const [addCredit, setAddCredit] = useState<boolean>(false);
  const [emojiWidthBox, setEmojiWidthBox] = useState(350);

  const [accpetDisable, setAccpetDisable] = useState(false);
  const [accpetDisablemedia, setAccpetDisablemedia] = useState(false);
  const [denyDisablemedia, setDenyDisablemedia] = useState(false);
  const [denyDisablSend, setDenyDisableSend] = useState(false);

  const navigate = useNavigate();

  const endpoint = chatThread?.endpointUrl || "";
  const myDisplayName = chatThread?.myUserName || "";
  const threadId = chatThread?.threadId || "";

  const adapter = useAzureCommunicationChatAdapter({
    endpoint: endpoint,
    userId: userIdentifier,
    displayName: myDisplayName,
    credential: tokenCredential,
    threadId: threadId,
  });

  useEffect(() => {
    setChat(props.chatThread);
    const disposeAdapter = (): void => adapter?.dispose();

    initDeviceManager();
    const onBeforeUnload = () => {
      disposeAdapter();
    };

    window.addEventListener("resize", () => {
      if (isMobile) {
        setEmojiWidthBox(300);
      } else {
        setEmojiWidthBox(350);
      }
    });

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [adapter, props.chatThread]);

  const initDeviceManager = () => {
    const callClient = new CallClient();
    callClient.getDeviceManager().then((dm) => {
      setDeviceManager(dm);
    });
  }

  const onFetchAvatarPersonaData = (): Promise<AvatarPersonaData> =>
    new Promise((resolve) => {
      return resolve({
        imageUrl: chatThread?.participantImageUrl,
        initialsColor: "black",
      });
    });

  const sendMassages = (value: any) => {
    const { dispatch } = props;
    const body = {
      threadId: chatThread?.threadId,
      chatAccessToken: chatThread?.myAccessToken,
      message: value,
    };
    dispatch(sendChatMessage(body))
      .then((res: any) => {
        if (res.status === 200) {
        }
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  };

  const onProfile = (data: any) => {
    navigate(`/user/profileDetails/${data?.participantUserId}`);
  };

  const onPhoneCall = async () => {
    toast.info("This feature is coming soon.", {
      theme: "colored",
      autoClose: 3000,
    });
    // if (!deviceManager) return;

    // const deviceAccess = await deviceManager.askDevicePermission({
    //   video: false,
    //   audio: true,
    // });

    // if (!deviceAccess.audio) {
    //   toast.error("Need audio permission to perform this action.", {
    //     theme: "colored",
    //     autoClose: 3000,
    //   });
    //   return;
    // }
    // const microphones = (await deviceManager.getMicrophones())[0];
    // if (!microphones) {
    //   // Show error message here
    //   toast.error("No microphone found on the system.", {
    //     theme: "colored",
    //     autoClose: 3000,
    //   });
    //   return;
    // }

    // const { dispatch } = props;
    // const result = await dispatch(checkDonotDisturb(chatThread.participantUserId));
    // if (result.data.data) {
    //   toast.error("Please do not disturb.", {
    //     theme: "colored",
    //     autoClose: 3000,
    //   });
    //   return;
    // }

    // navigate(`/user/outgoing-call/phone/${chatThread.participantUserId}`);
  };

  const onVoiceCall = async () => {
    if (!deviceManager) return;

    const deviceAccess = await deviceManager.askDevicePermission({
      video: false,
      audio: true,
    });

    if (!deviceAccess.audio) {
      toast.error("Need audio permission to perform this action.", {
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }
    const microphones = (await deviceManager.getMicrophones())[0];
    if (!microphones) {
      // Show error message here
      toast.error("No microphone found on the system.", {
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }

    const { dispatch } = props;
    const result = await dispatch(checkDonotDisturb(chatThread.participantUserId));
    if (result.data.data) {
      toast.error("Please do not disturb.", {
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }

    navigate(`/user/outgoing-call/voice/${chatThread.participantUserId}`);
  };

  const handleVideoCall = async () => {
    if (!deviceManager) return false;

    const deviceAccess = await deviceManager.askDevicePermission({
      video: true,
      audio: true,
    });

    if (!deviceAccess.audio || !deviceAccess.video) {
      toast.error(
        "Need audio permission and video permission to perform this action.",
        { theme: "colored", autoClose: 3000 }
      );
      return false;
    }

    const microphones = (await deviceManager.getMicrophones())[0];
    if (!microphones) {
      // Show error message here
      toast.error("No microphone found on the system.", {
        theme: "colored",
        autoClose: 3000,
      });
      return false;
    }

    const camera = (await deviceManager.getCameras())[0];
    if (!camera) {
      // Show error message here
      toast.error("No camera device found on the system.", {
        theme: "colored",
        autoClose: 3000,
      });

      return false;
    }

    const { dispatch } = props;
    const result = await dispatch(checkDonotDisturb(chatThread.participantUserId));
    if (result.data.data) {
      toast.error("Please do not disturb.", {
        theme: "colored",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  }

  const onVideoCall = async () => {
    if (!(await handleVideoCall()))
      return;

    const { dispatch } = props;
    dispatch(set_toggle_video_call(true));
    navigate(`/user/outgoing-call/video/${chatThread.participantUserId}`);
  };

  const onVideoCallOneWay = async () => {
    if (!(await handleVideoCall()))
      return;

    navigate(`/user/outgoing-call/video-one-way/${chatThread.participantUserId}`);
  };

  const onClickSendGift = () => {
    setGiftShow(true);
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const onViewMediaFile = () => {
    setViewMedia(true);
  };

  const closeChat = () => {
    const { dispatch } = props;
    dispatch(set_Show_Chat(false));
  };

  const acceptMedia = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      chatAccessToken: chatThread.myAccessToken,
      mediaUrl: data?.metadata?.mediaFile,
      messageId: data?.messageId,
    };
    setAccpetDisablemedia(true);
    dispatch(acceptMediaFile(chatThread?.id, body))
      .then((res: any) => {
        toast.success("Accept Media Successful!", {
          theme: "colored",
          autoClose: 3000,
        });
        setLoading(false);
        setAccpetDisablemedia(false);
      })
      .catch((err: any) => {
        setAddCredit(true);
        setAccpetDisablemedia(false);
        setLoading(false);
      });
  };

  const denyMedia = (data: any) => {
    const { dispatch } = props;
    setLoading(true);
    const body = {
      chatAccessToken: chatThread.myAccessToken,
      mediaUrl: data?.metadata?.mediaFile,
      messageId: data?.messageId,
    };
    setDenyDisablemedia(true);
    dispatch(denyMediaFile(chatThread?.id, body))
      .then((res: any) => {
        toast.success("Deny Media Successful!", {
          theme: "colored",
          autoClose: 3000,
        });
        setLoading(false);
        setDenyDisablemedia(false);
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
        setLoading(false);
        setDenyDisablemedia(false);
      });
  };

  const onAccpetGift = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      chatAccessToken: chatThread.myAccessToken,
      messageId: data?.messageId,
    };
    setAccpetDisable(true);
    dispatch(acceptGift(chatThread?.id, body))
      .then((res: any) => {
        setLoading(false);
        toast.success("Accept gift Successful!", {
          theme: "colored",
          autoClose: 3000,
        });
        setAccpetDisable(false);
      })
      .catch((err: any) => {
        setLoading(false);
        setAddCredit(true);
        // const massage = err.response.data.message;
        // toast.error(massage, {
        //   theme: "colored",
        //   autoClose: 3000,
        // });
      });
  };

  const onRejectGift = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      chatAccessToken: chatThread.myAccessToken,
      messageId: data?.messageId,
    };
    setDenyDisableSend(true);
    dispatch(rejectGift(chatThread?.id, body))
      .then((res: any) => {
        setLoading(false);
        toast.success("Deny gift Successful!", {
          theme: "colored",
          autoClose: 3000,
        });
        setDenyDisableSend(false);
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
        setDenyDisableSend(false);
      });
  };


  const onClickViewMedias = () => {
    const id = chatThread?.id;
    const { dispatch } = props;
    let getFile: any = [];
    // setLoading(true);
    dispatch(getMediaUrls(id))
      .then((res: any) => {
        res.data.data.listMedia.map((item: any) => {
          axios({
            method: "get",
            url: item.mediaUrl,
          }).then((img: any) => {
            const body = {
              image: `data:${img?.data?.contentType};base64,${img?.data?.fileContents}`,
            };
            getFile.push(body);
            setAllFiles(getFile);
            if (getFile.length !== 0) {
              setViewMediaGallary(true);
            }
          });
        });
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const onRenderTypingIndicator = (typingUsers: CommunicationParticipant[]) => {
    if (typingUsers.length == 0 || typingUsers[0].userId != chatThread.participantId) {
      return <></>;
    }

    playRingTone(RingtoneEnum.MessageTyping);

    if (!chatThread.participantDisplayName) {
      return (
        <>
          <div className="pl-3.5">
            <span>Your partner is typing ...</span>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="pl-3.5">
          <span>{chatThread.participantDisplayName + " "}</span>
          <span>is typing ...</span>
        </div>
      </>
    );
  };

  const onRenderMessage = (
    messageProps: MessageProps,
    defaultOnRender?: MessageRenderer
  ) => {

    const messages: any = messageProps?.message;
    const messageData = messages.content;
    const gift = messages?.metadata?.giftPrice ? true : false;
    const mediaFile =
      messages.metadata !== undefined &&
        messages.metadata.hasAttachment == "true"
        ? true
        : false;

    const call =
      messages.metadata !== undefined &&
      !!messages.metadata.StartTime &&
      !!messages.metadata.EndTime;

    let callDuration = "";
    if (call) {
      callDuration = getCallDurationMessage(
        messages.metadata.StartTime,
        messages.metadata.EndTime
      );
    }

    if (chatThread?.myDisplayName === messages?.senderDisplayName) {
      return (
        <>
          {call ? (
            <div className="senderClass">
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div>
                  <div className="flex flex-wrap">
                    <div className="block">{messageData}</div>
                  </div>
                  <div className="text-[#7C7C7C] font-[600] pt-1 text-right">
                    {" "}
                    {callDuration}{" "}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${mediaFile ? "fill-width" : ""} senderClass`}>
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div
                  className={`${mediaFile ? "sendMeassgesWithMedia word-break" : ""
                    }`}
                >
                  <div className="flex flex-wrap">
                    <div
                      className={`${mediaFile || gift ? "hidden" : "block"}`}
                    >
                      {messageData}
                    </div>

                    <div
                      className={`${gift ? "block" : "hidden"
                        } font-['Montserrat']`}
                    >
                      <p className="font-[500] ">
                        You have sent a <span className="font-bold">Gift.</span>
                      </p>
                      <p className="text-[#7C7C7C] font-semibold mt-1">
                        Gift - ${messages?.metadata?.giftPrice}
                      </p>
                    </div>

                    <div
                      className={`${mediaFile ? "block" : "hidden"
                        } flex flex-wrap`}
                    >
                      <div>You have sent a</div>
                      <div className="font-bold">&nbsp;Media file.</div>
                    </div>
                    <div className="pl-2 justify-end">
                      {moment(messages?.createdOn).calendar(null, {
                        sameDay: 'h:mm A',
                        lastDay: '[Yesterday]',
                        lastWeek(m: any, now: any) {
                          if (moment(messages?.createdOn).year() < m?.year()) {
                            return moment(messages?.createdOn).format('DD/MM/yyyy HH:mm');
                          } else {
                            return moment(messages?.createdOn).format('DD/MM HH:mm');
                          }
                        },
                        sameElse(m: any) {
                          if (moment(messages?.createdOn).year() < m?.year()) {
                            return moment(messages?.createdOn).format('DD/MM/yyyy HH:mm');
                          } else {
                            return moment(messages?.createdOn).format('DD/MM HH:mm');
                          }
                        }
                      })}
                    </div>

                  </div>
                  {mediaFile ? (
                    <div className="text-[#7C7C7C] font-[600] pt-1">Image </div>
                  ) : (
                    ""
                  )}
                </div>
                {mediaFile ? (
                  <div
                    className="sendMediaFile min-w-fit flex flex-wrap lg:flex-nowrap items-center cursor-pointer"
                    onClick={() => onClickMedial(messages)}
                  >
                    <img src={viewFile} alt="" className="cursor-pointer" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          {call ? (
            <div className="senderClass">
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div>
                  <div className="flex flex-wrap">
                    <div className="block">{messageData}</div>
                  </div>
                  <div className="text-[#7C7C7C] font-[600] pt-1 text-right">
                    {" "}
                    {callDuration}{" "}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${mediaFile || messages?.metadata?.giftStatus === "Requested"
                ? "fill-width"
                : ""
                } reciverClass`}
            >
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div className={`${mediaFile ? "word-break" : ""}`}>
                  <div className="flex">
                    <div
                      className={`${mediaFile ? "hidden" : "block"} reciveName`}
                    >
                      {chatThread?.participantUserName}
                    </div>
                    <div className="pl-2">
                      {moment(messages?.createdOn).calendar(null, {
                        sameDay: 'h:mm A',
                        lastDay: '[Yesterday]',
                        lastWeek(m: any, now: any) {
                          if (moment(messages?.createdOn).year() < m?.year()) {
                            return moment(messages?.createdOn).format('DD/MM/yyyy HH:mm');
                          } else {
                            return moment(messages?.createdOn).format('DD/MM HH:mm');
                          }
                        },
                        sameElse(m: any) {
                          if (moment(messages?.createdOn).year() < m?.year()) {
                            return moment(messages?.createdOn).format('DD/MM/yyyy HH:mm');
                          } else {
                            return moment(messages?.createdOn).format('DD/MM HH:mm');
                          }
                        }
                      })}
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    <div
                      className={`${mediaFile || gift ? "hidden" : "block"}`}
                    >
                      {messageData}
                    </div>

                    <div
                      className={`${gift ? "block" : "hidden"
                        } font-['Montserrat']`}
                    >
                      <div className="font-[500]">
                        {gift &&
                          messages?.metadata?.giftStatus === "Accepted" ? (
                          <p>You have accepted the Gift Request.</p>
                        ) : messages?.metadata?.giftStatus === "Rejected" ? (
                          <p className="text-[#A32323]">
                            You have denied the Gift Request .
                          </p>
                        ) : (
                          <p>
                            {messages.senderDisplayName} has{" "}
                            <span className="font-bold">Requested a Gift.</span>
                          </p>
                        )}
                      </div>
                      <p className="text-[#7C7C7C] font-semibold mt-1">
                        Gift - ${messages?.metadata?.giftPrice}
                      </p>
                    </div>
                    {messages?.metadata?.mediaStatus === "Accepted" ? (
                      <div>
                        You have accepted the{" "}
                        <span className="font-bold">
                          &nbsp;Media file. &nbsp;
                        </span>{" "}
                      </div>
                    ) : messages?.metadata?.mediaStatus === "Denied" ? (
                      <div className="text-[#A32323]">
                        You have denied the
                        <span className="font-bold">
                          &nbsp;Media file. &nbsp;
                        </span>{" "}
                      </div>
                    ) : (
                      <div
                        className={`${mediaFile ? "block" : "hidden"
                          } flex flex-wrap pt-1`}
                      >
                        <div className="">
                          {chatThread?.participantUserName} has sent you a{" "}
                        </div>
                        <div className="font-bold">
                          &nbsp;Media file. &nbsp;
                        </div>
                        <span> Press accept to view.</span>
                      </div>
                    )}
                  </div>
                  {mediaFile ? (
                    <div className="text-[#7C7C7C] font-[600] pt-1">
                      Image - ${messages?.metadata?.mediaPrice}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {mediaFile && messages?.metadata?.mediaStatus === "Accepted" ? (
                  <div
                    className="sendMediaFile min-w-fit flex flex-wrap lg:flex-nowrap items-center cursor-pointer"
                    onClick={() => onClickMedial(messages)}
                  >
                    <img
                      src={viewFile}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => onClickMedial(messages)}
                    />
                  </div>
                ) : messages?.metadata?.mediaStatus === "Denied" ? (
                  ""
                ) : (
                  <>
                    <div
                      className={`${mediaFile ? "block" : "hidden"
                        } sendMediaFile min-w-fit flex flex-wrap lg:flex-nowrap items-center`}
                    >
                      <button
                        className={`bg-[#FFFFFF] font-['Montserrat'] font-[500] text-[#1CA810]
                        ${accpetDisablemedia && "opacity-25"}
                        py-3 px-10 border border-solid border-[#1CA810] rounded-full`}
                        onClick={() => acceptMedia(messages)}
                        disabled={accpetDisablemedia}
                      >
                        Accept
                      </button>
                      <button
                        className={`ml-2 bg-[#A32323] font-['Montserrat'] font-[500] text-[#FFFFFF]
                        ${denyDisablemedia && "opacity-25"}
                         py-3 px-10 border border-solid border-[#C22929] rounded-full`}
                        onClick={() => denyMedia(messages)}
                        disabled={denyDisablemedia}
                      >
                        Deny
                      </button>
                    </div>
                  </>
                )}

                {gift && messages?.metadata?.giftStatus === "Accepted" ? (
                  ""
                ) : messages?.metadata?.giftStatus === "Rejected" ? (
                  ""
                ) : (
                  <>
                    <div
                      className={`${gift ? "block" : "hidden"
                        } sendMediaFile min-w-fit flex flex-wrap lg:flex-nowrap items-center`}
                    >
                      <button
                        className={`bg-[#FFFFFF] font-['Montserrat'] font-[500] text-[#1CA810] py-3 px-10 border border-solid border-[#1CA810] 
                        ${accpetDisable && "opacity-25"}
                        rounded-full`}
                        onClick={() => onAccpetGift(messages)}
                        disabled={accpetDisable}
                      >
                        Accept
                      </button>
                      <button
                        className={`ml-2 bg-[#A32323] font-['Montserrat'] font-[500] text-[#FFFFFF] 
                        ${denyDisablSend && "opacity-25"}
                        py-3 px-10 border border-solid border-[#C22929] rounded-full`}
                        onClick={() => onRejectGift(messages)}
                        disabled={denyDisablSend}
                      >
                        Deny
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      );
    }
  };

  const onChange = (e: any) => {
    const body: any = {
      ThreadId: chatThread.threadId,
      ChatAccessToken: chatThread.myAccessToken,
      Type: "Media",
      message: e.target.files[0].name,
      Price: "",
    };

    const { dispatch } = props;
    let formData = new FormData();
    const data = JSON.stringify(body);
    formData.append("file", e.target.files[0]);
    formData.append("message", data);

    dispatch(sendMediaFile(formData))
      .then((res: any) => {
        toast.success("Media Upload Successfull!", {
          theme: "colored",
          autoClose: 3000,
        });
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  };

  const onCancleModal = () => {
    setOpenMedia(false);
  };

  const onClickMedial = (data: any) => {
    const media = data.metadata.mediaFile.substr(6);
    const id = chatThread?.id;
    const messageID = data?.messageId;
    const mediaID = media;
    const { dispatch } = props;
    setLoading(true);
    dispatch(getMediaUrl(id, messageID, mediaID))
      .then((res: any) => {
        axios({
          method: "get",
          url: res.data.message,
        })
          .then((item: any) => {
            const base64 = `data:${item?.data?.contentType};base64,${item?.data?.fileContents}`;
            setViewImage(base64);
            setOpenMedia(true);
            setLoading(false);
          })
          .catch((err: any) => {
            setLoading(false);
          });
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  };

  const onSubmitGift = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      threadId: chatThread.threadId,
      chatAccessToken: chatThread.myAccessToken,
      message: "gift",
      type: "gift",
      price: data,
    };
    dispatch(SendGiftData(body))
      .then((res: any) => {
        dispatch(getTotalCredit(profile?.totalCredit?.accountId)).then((credit: any) => {
          setLoading(false);
          dispatch(set_Total_Credit(credit?.data))
        }).catch(() => {
          setLoading(false)
        })
        toast.success("Gift send Successfull!", {
          theme: "colored",
          autoClose: 3000,
        });
        setGiftShow(false);
        setGiftSent(true);
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  };

  const onCloseGiftSent = () => {
    setGiftSent(false);
  };

  const onSendGiftInsufficientCredits = () => {
    setInsufficientCreditsOnGift(true);
    setGiftShow(false);
  };

  const onCancelCredit = () => {
    setAddCredit(false);
  };

  const addCeditData = () => {
    setAddCredit(true);
  };

  const onTopUpGiftCancel = () => {
    setInsufficientCreditsOnGift(false);
    setGiftShow(true);
  };

  const onTyping = async () => {
    await adapter?.sendTypingIndicator();
  };

  const onSendMessage = async (content: string) => {
    sendMassages(content);
  };

  const mediaGallaryClose = () => {
    setViewMediaGallary(false);
  };

  return (
    <>

      {loading && <RctPageLoader />}
      <div
        className={`${showChat ? "bg-white" : "bg-[#ffffffb5]"} w-full ${showChat ? "block" : "hidden"} 
        md:block px-2 md:px-6 py-4 md:w-[61.7%] xl:w-[68.7%]  rounded-2xl h-[calc(100vh_-_105px)] md:h-[calc(100vh_-_140px)]`}
      >
        {showChat && !!chatThread.participantUserId ? (
          chatThreads.length !== 0 ? (
            <>
              <div className="flex justify-between pb-2">
                <FontAwesomeIcon onClick={() => closeChat()} icon={faXmark} className={`${showChat ? "block" : "hidden"} md:hidden text-primary text-3xl`} />

                <div className="text-primary">
                  <p
                    className="md:text-[23px] leading-none cursor-pointer"
                    onClick={() => onProfile(chatThread)}
                  >
                    {chatThread?.participantUserName}
                  </p>
                  <p
                    className="text-[13px] cursor-pointer"
                    onClick={onClickViewMedias}
                  >
                    View Media Gallery
                  </p>
                  {/* <span className={`px-6 ${(isBusy || doNotDisturb) ? 'block' : 'hidden'}`}>|</span> */}
                  {/* <p className={`text-[#B02A2A] text-sm ${isBusy || doNotDisturb ? 'block' : 'hidden'}`}>Currently Unavailable</p> */}
                </div>
                <div>
                  <div className="flex items-center">
                    <button
                      className="bg-primary text-white text-sm xl:text-lg py-1 px-2 md:px-4 xl:px-6 rounded-full border-4 border-solid border-boderDark border-[#686868]"
                      onClick={onClickSendGift}
                    >
                      Send Gift
                    </button>

                    <img
                      src={phoneCall}
                      className="ml-2 md:ml-4 w-[32px] h-[32px]  cursor-pointer"
                      alt="phone"
                      onClick={onPhoneCall}
                    />

                    <img
                      src={voiceCall}
                      className="ml-2 md:ml-4 w-[22px] cursor-pointer"
                      alt="voice"
                      onClick={onVoiceCall}
                    />

                    <img
                      src={videoCallOneWay}
                      className="ml-2 md:ml-4 w-[32px] h-[32px] cursor-pointer"
                      alt="video"
                      onClick={onVideoCallOneWay}
                    />
                    <img
                      src={videoCall}
                      className="ml-2 md:ml-4 w-[32px] h-[32px] cursor-pointer"
                      alt="video"
                      onClick={onVideoCall}
                    />
                  </div>
                </div>
              </div>
              <div className="h-[calc(110vh_-_241px)] md:h-[calc(112vh_-_320px)] xl:h-[calc(105vh_-_251px)] custombp:h-[calc(105vh_-_380px)] px-4 overflow-y-auto no-scrollbar">
                {credit >= 1.99 ? (
                  adapter && (
                    <div className="w-full flex mx-auto h-full py-4 md:px-4 overflow-y-auto no-scrollbar">
                      <div className="py-4 flex items-end relative">
                        <button>
                          <label className="custom-file-upload">
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              onChange={(e) => {
                                onChange(e);
                              }}
                            />
                            <FontAwesomeIcon icon={faPaperclip} className="text-primary text-xl" />
                          </label>
                        </button>
                      </div>
                      <div className="w-full mx-auto h-full py-4 md:px-4 relative">
                        <div className="w-full mx-auto h-[calc(100%_-_65px)] overflow-y-auto no-scrollbar chat-composite">
                          <ChatComposite
                            adapter={adapter}
                            options={{
                              autoFocus: "sendBoxTextField",
                              topic: false,
                            }}
                            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
                            onRenderMessage={onRenderMessage}
                          />
                        </div>

                        <div className="absolute bottom-[0] w-full">
                          <SendBox
                            emojiWidthBox={emojiWidthBox}
                            onSendMessage={onSendMessage}
                            onTyping={onTyping}
                          />
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full  flex mx-auto h-full py-4 md:px-4 overflow-y-auto no-scrollbar">
                    <div className="py-2 px-4 rounded-lg h-content mt-auto bg-[#E8E8E8] w-full flex justify-between items-end">
                      <div className="flex ">
                        <button>
                          <label className="custom-file-upload">
                            <FontAwesomeIcon icon={faPaperclip} className="text-primary text-xl" />

                          </label>
                        </button>

                        <p className="font-['Montserrat'] font-500 text-sm text-[#A32323] ml-4">
                          <span
                            className="underline cursor-pointer"
                            onClick={addCeditData}
                          >
                            Top Up{" "}
                          </span>
                          credits to enable chat.
                        </p>
                      </div>

                      <button className="bg-[#0000004d] text-white py-1 px-6 rounded-lg">
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            ""
          )
        ) : (
          <div>
            No chats open yet. Click on a chat on your left to get started.
          </div>
        )}
        {giftShow && (
          <SendGift
            close={giftClose}
            chatThread={chatThread}
            onSubmitGift={onSubmitGift}
            onInsufficientCredits={onSendGiftInsufficientCredits}
            lable="Send Gift"
          />
        )}
        {giftSent && (
          <GiftSent onMainClose={onCloseGiftSent} chatThread={chatThread} />
        )}
        {/* {viewMedia && <ViewMediaFile close={giftClose} />} */}
        {openMedia && (
          <OpenMediaFile cancel={onCancleModal} image={viewImage} />
        )}
        {insufficientCreditsOnGift && (
          <TopUpModal
            onCancel={onTopUpGiftCancel}
            onSuccess={onTopUpGiftCancel}
            amount=""
            insufficientCredits={true}
          />
        )}
        {addCredit && (
          <TopUpModal
            onCancel={onCancelCredit}
            onSuccess={onCancelCredit}
            amount=""
            insufficientCredits={true}
          />
        )}
        {viewMediaGallary && (
          <ViewMediaGallary cancel={mediaGallaryClose} allfiles={allfiles} />
        )}
      </div>
    </>
  );
};

export default connect()(ChatScreen);

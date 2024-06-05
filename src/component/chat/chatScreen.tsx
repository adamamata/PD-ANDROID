import React, { useEffect, useState } from "react";
import { CallClient, DeviceManager } from "@azure/communication-calling";
import twoWayVideo from "../../assets/images/twoWayVideo.svg";
import viewFile from "../../assets/images/viewFile.png";
import accpet from "../../assets/images/accpet.png";
import denny from "../../assets/images/denny.png";
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
} from "@azure/communication-common";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  auth_details,
  set_Show_Chat,
  set_toggle_video_call,
  set_Total_Credit,
  set_Phone_Calling,
} from "../../reducer/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";
import {
  SendGiftData,
  acceptGift,
  requestGift,
  acceptMediaFile,
  denyMediaFile,
  getMediaUrl,
  getMediaUrls,
  rejectGift,
  sendChatMessage,
  sendMediaFile,
  getTotalCredit,
  validateCallConnecting,
  callConnecting,
  phoneCallConnecting,
  downloadMediaFile,
} from "../../services/homeService";
import axios from "axios";
import { playRingTone } from "../../functions/utilities";
import { getCallDurationMessage } from "../../functions/call-functions";
import RctPageLoader from "../RctPageLoader";
import SendBox from "./send-box";
import SendGift from "../../view/dashboard/user/sendGift";
import GiftSent from "../../view/dashboard/user/giftSent";
import TopUpModal from "../../view/dashboard/user/topUpModal";
import ViewMediaGallary from "../../view/dashboard/consultant/viewMediaGallary";
import StickyNotes from "../../view/dashboard/commons/sticky-notes";
import ViewMediaFIle from "../../view/dashboard/consultant/viewMediaFile";
import { BroadcastTargetEnum, CallTypeEnum, RingtoneEnum } from "../../enums/enum";
import { azureCommunicationDetails } from "../../reducer/chatDataSlice";
import OutgoingCall from "../call/outgoing-call";
import { HubConnection } from "@microsoft/signalr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faNoteSticky, faPhone, faTty, faVideo, faXmark } from "@fortawesome/free-solid-svg-icons";

interface Cprops {
  chatUser: any;
  chatThreads: any;
  showChat: boolean;
  openChat: boolean;
  getAllChat: any;
}

const ChatScreen: React.FC<any> = (props: Cprops | any) => {
  const chatThreads = props.chatThreads;
  const showChat = props.showChat;
  const getAllChat = props.getAllChat;
  const location = useLocation();
  const profile = useSelector(auth_details);
  const { azureCommunicationData, chatTokenCredential } = useSelector(azureCommunicationDetails)
  const tokenCredential: CommunicationTokenCredential = profile?.tokenCredential;
  const userIdentifier: CommunicationUserIdentifier = profile?.userIdentifier;
  const threadId = profile?.threadId

  const chatUser = azureCommunicationData;

  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [giftRequest, setGiftRequest] = useState<boolean>(false);
  const [viewMedia, setViewMedia] = useState<boolean>(false);
  const [viewImage, setViewImage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPhoneCalling, setIsPhoneCalling] = useState<boolean>(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [giftSent, setGiftSent] = useState(false);
  const [giftSentMassges, setGiftSentMassges] = useState("");
  const [allfiles, setAllFiles] = useState([]);
  const [insufficientCreditsOnGift, setInsufficientCreditsOnGift] =
    useState<boolean>(false);
  const [insufficientCreditsOnCall, setInsufficientCreditsOnCall] =
    useState<boolean>(false);
  const [viewMediaGallary, setViewMediaGallary] = useState(false);
  const [sendMass, setSendMass] = useState("");
  const [addCredit, setAddCredit] = useState<boolean>(false);
  const [emojiWidthBox, setEmojiWidthBox] = useState(350);

  const [accpetDisable, setAccpetDisable] = useState(false);
  const [accpetDisablemedia, setAccpetDisablemedia] = useState(false);
  const [denyDisablemedia, setDenyDisablemedia] = useState(false);
  const [denyDisablSend, setDenyDisableSend] = useState(false);
  const [isShowNote, setIsShowNote] = useState(false);
  const [mediaPrice, setMediaPrice] = useState(false);
  const [file, setFile] = useState<File>();
  const [showChatComposite, setShowChatComposite] = useState(true);
  const [callType, setCallType] = useState<CallTypeEnum>();

  const navigate = useNavigate();
  const persistDispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [])

  const endpoint = chatUser?.endpointUrl ?? azureCommunicationData?.endpointUrl;
  const myDisplayName = chatUser?.myUserName ?? azureCommunicationData?.myUserName;

  const adapter = useAzureCommunicationChatAdapter({
    endpoint: endpoint,
    userId: userIdentifier,
    displayName: myDisplayName,
    credential: chatTokenCredential,
    threadId: threadId,
  });

  useEffect(() => {
    setShowChatComposite(false);
    setIsShowNote(false);
    if (threadId) {
      setTimeout(() => {
        setShowChatComposite(true);
      }, 0);
    }
  }, [threadId, adapter, userIdentifier, tokenCredential])

  useEffect(() => {
    setIsPhoneCalling(profile.isPhoneCalling);
  }, [profile.isPhoneCalling])

  useEffect(() => {
    const timer = setTimeout(() => {
      getAllChatData();
    }, 2000);
    return () => clearTimeout(timer);
  }, [sendMass]);

  const getAllChatData = () => {
    getAllChat("test");
    updateCredit();
  };

  useEffect(() => {
    const { dispatch } = props;
    // setChat(props.chatUser ?? azureCommunicationData);
    const disposeAdapter = (): void => adapter?.dispose();
    initDeviceManager();
    const onBeforeUnload = () => {
      disposeAdapter();
      dispatch(set_Show_Chat(false))
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
  }, [adapter, props.chatUser]);

  const initDeviceManager = () => {
    const callClient = new CallClient();
    callClient.getDeviceManager().then((dm: any) => {
      setDeviceManager(dm);
    });
  };

  const onFetchAvatarPersonaData = (): Promise<AvatarPersonaData> =>
    new Promise((resolve) => {
      return resolve({
        imageUrl: chatUser?.participantImageUrl,
        initialsColor: "black",
      });
    });

  const sendMassages = (value: any) => {
    const { dispatch } = props;
    const body = {
      threadId: chatUser?.threadId,
      chatAccessToken: chatUser?.myAccessToken,
      message: value,
    };
    dispatch(sendChatMessage(body))
      .then((res: any) => {
        if (res.status === 200) {
          setSendMass("massgess");
        }
      })
      .catch((err: any) => {
        const massage = err.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  };

  const onProfile = (data: any) => {
    const path = location?.pathname?.split("/");
    if (path[1] === "user") {
      navigate(`/${path[1]}/profileDetails/${data?.participantUniqueUserName}`);
    } else {
      navigate(`/${path[1]}/viewClientProfile/${data?.participantUserId}`);
    }
  };

  const validateCall = async (type: CallTypeEnum) => {
    setCallType(type);
    try {
      const { dispatch } = props;
      setLoading(true);
      await dispatch(validateCallConnecting(chatUser.participantUserId, type))
        .finally(() => {
          setLoading(false);
        });
      return true;
    } catch (err: any) {
      if (err.name == "InsufficientCredit" || err.data.name == "InsufficientCredit") {
        setInsufficientCreditsOnCall(true);
      } else {
        toast.error(err.message || err.data.message, {
          theme: "colored",
          autoClose: 3000,
        });
      }
      return false;
    }
  }

  const onPhoneCall = async () => {
    const { dispatch } = props;

    dispatch(set_Phone_Calling(true));
    setCallType(CallTypeEnum.PhoneCall);
    dispatch(phoneCallConnecting(chatUser.id, chatUser.participantUserId))
      .catch(async (err: any) => {
        dispatch(set_Phone_Calling(false));
        if (err.name == "InsufficientCredit" || err.data.name == "InsufficientCredit") {
          setInsufficientCreditsOnCall(true);
        } else {
          toast.error(err.message || err.data.message, {
            theme: "colored",
            autoClose: 3000,
          });
        }
      });
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
    const microphones = await deviceManager.getMicrophones();
    if (!microphones || microphones.length == 0) {
      // Show error message here
      toast.error("No microphone found on the system.", {
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }

    if (!(await validateCall(CallTypeEnum.AudioCall))) {
      return;
    }

    setIsShowNote(false);
    navigate(`/user/outgoing-call/voice/${chatUser.participantUserId}`);
  };

  const validateVideoCall = async (type: CallTypeEnum) => {
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

    const microphones = await deviceManager.getMicrophones();
    if (!microphones || microphones.length == 0) {
      // Show error message here
      toast.error("No microphone found on the system.", {
        theme: "colored",
        autoClose: 3000,
      });
      return false;
    }

    const camera = await deviceManager.getCameras();
    if (!camera || camera.length == 0) {
      // Show error message here
      toast.error("No camera device found on the system.", {
        theme: "colored",
        autoClose: 3000,
      });

      return false;
    }

    return (await validateCall(type));
  };

  const onVideoCallOneWay = async () => {
    if (!(await validateVideoCall(CallTypeEnum.VideoCallOneWay))) return;

    const { dispatch } = props;
    dispatch(set_toggle_video_call(true));
    setIsShowNote(false);
    navigate(`/user/outgoing-call/video-one-way/${chatUser.participantUserId}`);
  };

  const onVideoCall = async () => {
    if (!(await validateVideoCall(CallTypeEnum.VideoCallTwoWay))) return;

    const { dispatch } = props;
    dispatch(set_toggle_video_call(true));
    setIsShowNote(false);
    navigate(`/user/outgoing-call/video/${chatUser.participantUserId}`);
  };

  const onClickSendGift = () => {
    setGiftShow(true);
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const onClickRequestGift = () => {
    setGiftRequest(true);
  };

  const giftCloseRequest = () => {
    setGiftRequest(false);
  };

  const onViewMediaFile = () => {
    setViewMedia(true);
  };

  const closeChat = () => {
    const { dispatch } = props;
    dispatch(set_Show_Chat(false));
    if (props.chatType === "consultant") {
      navigate(`/consultant/chat`);
    }
  };

  const acceptMedia = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      chatAccessToken: chatUser.myAccessToken,
      mediaUrl: data?.metadata?.mediaFile,
      messageId: data?.messageId,
    };
    setAccpetDisablemedia(true);
    dispatch(acceptMediaFile(chatUser?.id, body))
      .then((res: any) => {
        updateCredit()
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
      chatAccessToken: chatUser.myAccessToken,
      mediaUrl: data?.metadata?.mediaFile,
      messageId: data?.messageId,
    };
    setDenyDisablemedia(true);
    dispatch(denyMediaFile(chatUser?.id, body))
      .then((res: any) => {
        setLoading(false);
        setDenyDisablemedia(false);
      })
      .catch((err: any) => {
        const massage = err.data.message;
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
      chatAccessToken: chatUser.myAccessToken,
      messageId: data?.messageId,
    };
    setAccpetDisable(true);
    dispatch(acceptGift(chatUser?.id, body))
      .then((res: any) => {
        updateCredit();
        setLoading(false);
        setAccpetDisable(false);
      })
      .catch((err: any) => {
        setLoading(false);
        setAddCredit(true);
      });
  };

  const onRejectGift = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      chatAccessToken: chatUser.myAccessToken,
      messageId: data?.messageId,
    };
    setDenyDisableSend(true);
    dispatch(rejectGift(chatUser?.id, body))
      .then((res: any) => {
        setLoading(false);
        setDenyDisableSend(false);
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
        setDenyDisableSend(false);
      });
  };

  const onClickViewMedias = () => {
    const id = chatUser?.id;
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
    if (
      typingUsers.length == 0 ||
      typingUsers[0].userId != chatUser.participantId
    ) {
      return <></>;
    }

    playRingTone(RingtoneEnum.MessageTyping);

    if (!chatUser.participantDisplayName) {
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
          <span>{chatUser.participantDisplayName + " "}</span>
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

    if (chatUser?.myDisplayName === messages?.senderDisplayName) {
      return (
        <>
          {call ? (
            <div className="senderClass">
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div>
                  <div className="flex flex-wrap">
                    <div className="block whitespace-pre-line">{messageData}</div>
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
              className={`${mediaFile ? "fill-width" : ""
                } text-[#000000] senderClass my-1 max-w-10/12 bg-primary bg-opacity-[21%]`}
            >
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div
                  className={`${mediaFile ? "sendMeassgesWithMedia word-break" : ""
                    }`}
                >
                  <div className="flex">
                    <div
                      className={`${mediaFile || gift ? "hidden" : ""
                        } max-w-3xl word-break whitespace-pre-line`}
                    >
                      {messageData}
                    </div>

                    {mediaFile ||
                      (messages?.metadata?.giftStatus !== "Requested" && (
                        <div
                          className={`${gift ? "block" : "hidden"
                            } font-['Montserrat']`}
                        >
                          {chatUser.myUserName === messages?.senderDisplayName && <p className="font-[500]">
                            {messages?.metadata?.giftStatus !== 'Sent' && <b>{chatUser?.participantUserName}</b>}
                            {messages?.metadata?.giftStatus === 'Sent' ? `You have successfully sent a gift to ` : messages?.metadata?.giftStatus === 'Accepted' ? ` has accepted the gift request.` : ` has denied the gift request.`}
                            {messages?.metadata?.giftStatus === 'Sent' && <b>{chatUser?.participantUserName}</b>}
                          </p>}
                          {chatUser.myUserName !== messages?.senderDisplayName && <p className="font-[500]">
                            <b>{chatUser.myUserName}</b> has sent gift to{" "}
                            <b>{chatUser?.participantUserName}</b>
                          </p>}
                          <p className="text-[#7C7C7C] font-semibold mt-1">
                            Gift - ${messages?.metadata?.giftPrice}
                          </p>
                        </div>
                      ))}
                    {gift && messages?.metadata?.giftStatus === "Requested" && (
                      <div
                        className={`${gift ? "block" : "hidden"
                          } font-['Montserrat']`}
                      >
                        <p className="font-[500]">
                          <b>{chatUser.myUserName}</b> has requested a gift from{" "}
                          <b>{chatUser?.participantUserName}</b>
                        </p>
                        <p className="text-[#7C7C7C] font-semibold mt-1">
                          Gift - ${messages?.metadata?.giftPrice}
                        </p>
                      </div>
                    )}

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
            <div className="senderClass text-[#000000] bg-[#F7F7F7]">
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div>
                  <div className="flex flex-wrap">
                    <div className="block whitespace-pre-line">{messageData}</div>
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
                      {chatUser?.participantUserName}
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
                      className={`${mediaFile || gift ? "hidden" : "block"} "whitespace-pre-line"`}
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
                        ) : messages?.metadata?.giftStatus === "Sent" ? (
                          <p className="pr-[30px]">
                            <b>{messages.senderDisplayName}</b> has sent gift to{" "}
                            <b>{chatUser.myUserName}</b>
                          </p>
                        ) : (
                          <p className="pr-[30px]">
                            <b>{messages.senderDisplayName}</b> has requested a
                            gift from <b>{chatUser.myUserName}</b>
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
                          {chatUser?.participantUserName} has sent you a{" "}
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
                        py-2 px-6 border flex border-solid border-[#1CA810] rounded-full`}
                        onClick={() => acceptMedia(messages)}
                        disabled={accpetDisablemedia}
                      >
                        <img src={accpet} alt="dfdf" />
                        <span className="pt-[6px] pl-[9px]">Accept</span>
                      </button>
                      <button
                        className={`ml-2 bg-[#A32323] font-['Montserrat'] font-[500] text-[#FFFFFF]
                        ${denyDisablemedia && "opacity-25"}
                        py-2 px-6 flex border border-solid border-[#C22929] rounded-full`}
                        onClick={() => denyMedia(messages)}
                        disabled={denyDisablemedia}
                      >
                        <img src={denny} alt="fds" />
                        <span className="pt-[6px] pl-[9px]">Deny</span>
                      </button>
                    </div>
                  </>
                )}

                {gift && messages?.metadata?.giftStatus === "Requested" && (
                  <>
                    <div
                      className={`${gift ? "block" : "hidden"
                        } sendMediaFile min-w-fit flex flex-wrap lg:flex-nowrap items-center`}
                    >
                      <button
                        className={`bg-[#FFFFFF] font-['Montserrat'] flex font-[500] text-[#1CA810] py-2 px-6 border border-solid border-[#1CA810] 
                         ${accpetDisable && "opacity-25"}
                         rounded-full`}
                        onClick={() => onAccpetGift(messages)}
                        disabled={accpetDisable}
                      >
                        <img src={accpet} alt="dfdf" />
                        <span className="pt-[6px] pl-[9px]">Accept</span>
                      </button>
                      <button
                        className={`ml-2 bg-[#A32323] flex font-['Montserrat'] font-[500] text-[#FFFFFF] 
                         ${denyDisablSend && "opacity-25"}
                         py-2 px-6 border border-solid border-[#C22929] rounded-full`}
                        onClick={() => onRejectGift(messages)}
                        disabled={denyDisablSend}
                      >
                        <img src={denny} alt="fds" />
                        <span className="pt-[6px] pl-[9px]">Deny</span>
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

  const uploadFile = (price?: any) => {
    const body: any = {
      ThreadId: chatUser.threadId,
      ChatAccessToken: chatUser.myAccessToken,
      Type: "Media",
      message: file?.name,
      Price: price ? price : "",
    };

    const { dispatch } = props;
    let formData = new FormData();
    const data = JSON.stringify(body);
    formData.append("file", file!);
    formData.append("message", data);

    dispatch(sendMediaFile(formData))
      .catch((err: any) => {
        const massage = err.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  }

  useEffect(() => {
    if (props.chatType !== "consultant" && file) {
      uploadFile()
    }
  }, [mediaPrice, file])

  const onChange = (e: any) => {
    if (props.chatType === "consultant") {
      setFile(e.target.files[0]);
      setMediaPrice(true);
    } else {
      setFile(e.target.files[0]);
    }
  };

  const onCancleModal = () => {
    setOpenMedia(false);
  };

  const onClickMedial = (data: any) => {
    const media = data.metadata.mediaFile.substr(6);
    const id = chatUser?.id;
    const messageID = data?.messageId;
    const mediaID = media;
    const { dispatch } = props;
    setLoading(true);
    dispatch(getMediaUrl(id, messageID, mediaID))
      .then((res: any) => {
        dispatch(downloadMediaFile(res.data.message))
        .then((item: any) => {
          const base64 = `data:${item?.data?.contentType};base64,${item?.data?.fileContents}`;
          setViewImage(base64);
          var a = document.createElement("a"); //Create <a>
          a.href = base64 //Image Base64 Goes here
          a.download = item?.data?.fileDownloadName; //File name Here
          a.click();
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
        });
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.data?.message;
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
      threadId: chatUser.threadId,
      chatAccessToken: chatUser.myAccessToken,
      message: "gift",
      type: "gift",
      price: data,
    };
    dispatch(SendGiftData(body))
      .then((res: any) => {
        setLoading(false);
        updateCredit();
        setGiftShow(false);
        setGiftSent(true);
        setGiftSentMassges("send");
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 3000,
        });
      });
  };

  const updateCredit = () => {
    const { dispatch } = props;
    dispatch(getTotalCredit(profile?.totalCredit?.accountId)).then((credit: any) => {
      dispatch(set_Total_Credit(credit?.data))
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

  const onSubmitGiftRequest = (data: any) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      threadId: chatUser.threadId,
      chatAccessToken: chatUser.myAccessToken,
      message: "gift",
      type: "gift",
      price: data,
    };
    dispatch(requestGift(body))
      .then((res: any) => {
        setGiftRequest(false);
        setGiftSent(true);
        setGiftSentMassges("request");
        setLoading(false);
      })
      .catch((err: any) => {
        if (err.status === 403) {
          const massage = err.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 3000,
          });
          setLoading(false);
          setGiftRequest(false);
        } else {
          setLoading(false);
          setGiftRequest(false);
          const massage = err.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 3000,
          });
        }
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

  const onTopUpCallCancel = async () => {
    setInsufficientCreditsOnCall(false);
  };

  const handleTopUpCallSuccess = () => {
    setInsufficientCreditsOnCall(false);

    let type: string | undefined = undefined;
    switch (callType) {
      case CallTypeEnum.PhoneCall:
        type = 'phone';
        onPhoneCall();
        return;
      case CallTypeEnum.AudioCall:
        type = 'voice';
        break;
      case CallTypeEnum.VideoCallOneWay:
        type = 'video-one-way';
        break;
      case CallTypeEnum.VideoCallTwoWay:
        type = 'video';
        break;
    }

    if (!!type) {
      navigate(`/user/outgoing-call/${type}/${chatUser.participantUserId}`);
    }
  }

  const onTyping = async () => {
    await adapter?.sendTypingIndicator();
  };

  const onSendMessage = async (content: string) => {
    sendMassages(content);
  };

  const mediaGallaryClose = () => {
    setViewMediaGallary(false);
  };

  function onToggleShowNotes() {
    setIsShowNote(c => { return !c; });
  }

  function onPhoneCallingClosed() {
    const { dispatch } = props;
    dispatch(set_Phone_Calling(false));
  }

  const mediaPriceClose = () => {
    setMediaPrice(false);
  };

  return (
    <>
      {loading && <RctPageLoader />}
      <div
        className={`mx-auto ${showChat ? "bg-white" : "bg-[#ffffffb5]"
          } w-full ${showChat ? "block" : "hidden lg:block"} 
        lg:block px-2 md:px-6 py-4 xxl:w-[68.7%] rounded-2xl lg:h-[calc(100dvh_-_140px)]`}
      >
        {showChat && !!chatUser?.participantUserId && adapter ? (
          // chatThreads.length !== 0  && (
          <>
            <div className={"flex justify-between flex-wrap lg:flex-nowrap "}>
              <div className="flex items-center w-full lg:w-auto justify-between">
                <div className="flex items-center">
                  <div className="w-[57px] h-[7px] min-w-[57px] min-h-[57px] relative">
                    <img
                      src={chatUser?.participantImageUrl}
                      className="w-full h-full rounded-full"
                      alt=""
                    />

                    {props.chatType !== "consultant" &&
                      <p
                        className={`absolute ${chatUser?.participantStatus === "Available"
                          ? "bg-[#20B514]"
                          : chatUser?.participantStatus === "Busy" ||
                            chatUser?.participantStatus === "DoNotDisturb"
                            ? "bg-[#E99312]"
                            : "bg-[#EBEBEB]"
                          } bottom-[0] h-[10px] right-1 rounded-full w-[10px]`}
                      />
                    }

                  </div>

                  <div className="text-primary ml-4">
                    <p
                      className="md:text-[23px] leading-none cursor-pointer"
                      onClick={() => onProfile(chatUser)}
                    >
                      {chatUser?.participantUserName}
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
                </div>
                <FontAwesomeIcon icon={faXmark} onClick={() => closeChat()} className={`${showChat ? "block" : "hidden"} lg:hidden text-primary text-3xl`} />
              </div>
              <div className="mt-4 w-full lg:w-auto">
                {props.chatType === "consultant" ? (
                  <div className="flex justify-between lg:justify-start items-center">
                    <button className="lg:border lg:border-2 border-primary font-semibold lg:h-[40px] mr-3 lg:mr-4 lg:px-2 lg:py-1 rounded-full text-primary text-sm lg:w-[128px]"
                      onClick={onToggleShowNotes}>
                      <FontAwesomeIcon icon={faNoteSticky} className="block lg:hidden text-4xl" />
                      <span className="hidden lg:block">View Notes</span>
                    </button>
                    <button
                      className="border border-2 border-primary font-semibold h-[40px] px-2 py-1 rounded-full bg-primary text-white text-sm w-[128px]"
                      onClick={onClickRequestGift}
                    >
                      Request Gift
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-row-reverse lg:flex-row items-center justify-between flex-wrap lg:flex-nowrap">
                    <div>
                      <button className="lg:border lg:border-2 border-primary font-semibold lg:h-[40px] mr-3 lg:mr-4 lg:px-2 lg:py-1 rounded-full text-primary text-sm lg:w-[128px]"
                        onClick={onToggleShowNotes}>
                        <FontAwesomeIcon icon={faNoteSticky} className="block lg:hidden text-4xl" />
                        <span className="hidden lg:block">View Notes</span>
                      </button>
                      <button
                        className="lg:border lg:border-2 border-primary font-semibold lg:h-[40px] mr-3 lg:mr-4 lg:px-2 lg:py-1 rounded-full text-primary text-sm lg:w-[128px]"
                        onClick={onClickSendGift}
                      >
                        <FontAwesomeIcon icon={faGift} className="block lg:hidden text-4xl" />
                        <span className="hidden lg:block">Send Gift</span>
                      </button>
                    </div>

                    <div className="flex items-center">
                      {
                        (chatUser?.spProfile?.enablePhoneCall) && (
                          <div>
                            <div>
                              <FontAwesomeIcon icon={faTty} onClick={onPhoneCall} className="text-primary text-4xl mx-2 sm:mx-4 cursor-pointer" />
                            </div>

                            <p className="text-center font-semibold text-[#6839b5]">$ {chatUser?.spCommunication?.phoneCallUnitPrice}</p>
                          </div>
                        )
                      }

                      {
                        chatUser?.spProfile?.enableAudioCall && (
                          <div>
                            <div className="flex justify-center">
                              <FontAwesomeIcon icon={faPhone} onClick={onVoiceCall} className="text-primary text-4xl mx-2 sm:mx-4 cursor-pointer" />
                            </div>
                            <p className="text-center font-semibold text-[#6839b5] pl-0.5">$ {chatUser?.spCommunication?.audioCallUnitPrice}</p>
                          </div>
                        )
                      }

                      {
                        chatUser?.spProfile?.enableOneWayVideoCall && (
                          <div>
                            <div>
                              <FontAwesomeIcon icon={faVideo} onClick={onVideoCallOneWay} className="text-primary text-4xl mx-2 sm:mx-4 cursor-pointer" />
                            </div>

                            <p className="text-center font-semibold text-[#6839b5]">$ {chatUser?.spCommunication?.videoCallOneWayUnitPrice}</p>
                          </div>
                        )
                      }

                      {
                        chatUser?.spProfile?.enableTwoWayVideoCall && (
                          <div>
                            <div>
                              <img
                                src={twoWayVideo}
                                className="mx-2 sm:mx-4 w-[36px] h-[36px] cursor-pointer"
                                alt="video"
                                onClick={onVideoCall}
                              />
                            </div>

                            <p className="text-center font-semibold text-[#6839b5]">$ {chatUser?.spCommunication?.videoCallTwoWayUnitPrice}</p>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[calc(110dvh_-_300px)] md:h-[calc(112dvh_-_320px)] xl:h-[calc(105dvh_-_251px)]  overflow-y-auto no-scrollbar">
              {adapter && (
                <div className="w-full flex mx-auto h-full lg:py-4 overflow-y-auto no-scrollbar">
                  <div className="w-full mx-auto h-full py-4 relative">
                    <div className="w-full mx-auto h-[calc(100%_-_65px)] overflow-y-auto no-scrollbar chat-composite">
                      {showChatComposite ?

                        <ChatComposite
                          adapter={adapter}
                          options={{
                            autoFocus: "sendBoxTextField",
                            topic: false,
                          }}
                          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
                          onRenderMessage={onRenderMessage}
                        />
                        :
                        <RctPageLoader />
                      }
                    </div>

                    <div className="absolute bottom-[0] md:bottom-[30px] w-full z-10">
                      <SendBox
                        onChange={onChange}
                        emojiWidthBox={emojiWidthBox}
                        onSendMessage={onSendMessage}
                        onTyping={onTyping}
                        type={props.chatType}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
          // )
        ) : (
          <div className="flex h-full items-center justify-center">
            No chats open yet. Click on a chat on your left to get started.
          </div>
        )}
        {giftShow && (
          <SendGift
            close={giftClose}
            chatUser={chatUser}
            onSubmitGift={onSubmitGift}
            onInsufficientCredits={onSendGiftInsufficientCredits}
            lable="Send Gift"
          />
        )}
        {giftRequest && (
          <SendGift
            close={giftCloseRequest}
            chatUser={chatUser}
            onSubmitGift={onSubmitGiftRequest}
            lable="Request Gift"
          />
        )}
        {giftSent && (
          <GiftSent
            onMainClose={onCloseGiftSent}
            chatUser={chatUser}
            giftSentMassges={giftSentMassges}
          />
        )}
        {/* {viewMedia && <ViewMediaFile close={giftClose} />} */}
        {/* {openMedia && (
          <OpenMediaFile cancel={onCancleModal} image={viewImage} />
        )} */}
        {insufficientCreditsOnGift && (
          <TopUpModal
            onCancel={onTopUpGiftCancel}
            onSuccess={onTopUpGiftCancel}
            amount=""
            insufficientCredits={true}
          />
        )}
        {insufficientCreditsOnCall && (
          <TopUpModal
            onCancel={onTopUpCallCancel}
            onSuccess={handleTopUpCallSuccess}
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
        {mediaPrice && (
          <ViewMediaFIle close={mediaPriceClose} onUploadFile={uploadFile} />
        )}
        {isShowNote && chatUser && <StickyNotes roomId={chatUser.id} userId={chatUser.myUserId} onClosed={onToggleShowNotes} />}

        {isPhoneCalling && <OutgoingCall
          callerUserId={chatUser.myUserId}
          calleeUserId={chatUser.participantUserId}
          calleeName={chatUser.participantUserName}
          calleeImageUrl={chatUser.participantImageUrl}
          onClosed={onPhoneCallingClosed}></OutgoingCall>}
      </div>
    </>
  );
};

export default connect()(ChatScreen);

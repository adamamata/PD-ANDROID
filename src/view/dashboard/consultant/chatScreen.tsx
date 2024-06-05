import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import viewFile from "../../../assets/images/viewFile.png";
import listNotes from "../../../assets/images/event-note.svg";
import RctPageLoader from "../../../component/RctPageLoader";
import {
  ChatComposite,
  AvatarPersonaData,
  MessageProps,
  MessageRenderer,
  useAzureCommunicationChatAdapter,
  CommunicationParticipant,
} from "@azure/communication-react";
import {
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
} from "@azure/communication-common";
import {
  getMediaUrl,
  sendChatMessage,
  sendMediaFile,
  requestGift,
  getMediaUrls,
} from "../../../services/homeService";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendGift from "../user/sendGift";
import { set_Show_Chat, auth_details } from "../../../reducer/auth";
import axios from "axios";
import ViewMediaFile from "./viewMediaFile";
import OpenMediaFile from "./openMediaFile";
import moment from "moment";
import { getCallDurationMessage } from "../../../functions/call-functions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewMediaGallary from "./viewMediaGallary";
import { playRingTone } from "../../../functions/utilities";
import SendBox from "../../../component/chat/send-box";
import StickyNotes from "../commons/sticky-notes";
import { ChatThreadModel } from "../../../models/chat-model";
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
  const tokenCredential: CommunicationTokenCredential =
    profile?.tokenCredential;
  const userIdentifier: CommunicationUserIdentifier = profile?.userIdentifier;

  const [chatThread, setChat] = useState<ChatThreadModel>(props.chatThread);
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [viewMedia, setViewMedia] = useState<boolean>(false);
  const [mediaPrice, setMediaPrice] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [uploadFile, setUploadFile] = useState<File>();
  const [viewImage, setViewImage] = useState("");
  const [viewMediaGallary, setViewMediaGallary] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [giftSent, setGiftSent] = useState(false);
  const [emojiWidthBox, setEmojiWidthBox] = useState(350);
  const [allfiles, setAllFiles] = useState([]);
  const navigate = useNavigate();
  const [showMediaUpdate, setShowMediaUpdate] = useState("");
  const [isShowNote, setIsShowNote] = useState(false);

  const authData = useSelector(auth_details);
  const isBusy = authData.user_profile.isBusy;
  const doNotDisturb = authData.user_profile.doNotDisturb;

  const endpoint = chatThread?.endpointUrl || "";
  const myDisplayName = chatThread?.myUserName || "";
  const participantUserName = chatThread?.participantUserName || "";
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
  }, [adapter, props.chatThread, profile.callConnected]);

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
      .catch((err: any) => { });
  };

  const onProfile = (data: any) => {
    navigate(`/consultant/viewClientProfile/${data?.participantUserId}`);
  };

  const onClickSendGift = () => {
    setGiftShow(true);
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const closeChat = () => {
    const { dispatch } = props;
    dispatch(set_Show_Chat(false));
  };

  const onChange = (e: any) => {
    setUploadFile(e.target.files[0]);
    setMediaPrice(true);
  };

  const mediaPriceClose = () => {
    setMediaPrice(false);
  };

  const mediaGallaryClose = () => {
    setViewMediaGallary(false);
  };

  const onFetchAvatarPersonaData = (): Promise<AvatarPersonaData> =>
    new Promise((resolve) => {
      return resolve({
        imageUrl: chatThread?.participantImageUrl,
        initialsColor: "black",
      });
    });

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
    console.log("messagesmessages", messages.createdOn);
    const messageData = messages.content;
    if (messages?.metadata?.viewProfile !== undefined) {
      setShowMediaUpdate(messages?.metadata?.viewProfile);
    }
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
          ) : messages?.metadata?.viewProfile === "true" ? (
            ""
          ) : (
            <div
              className={`${mediaFile == true ? "fill-width" : ""} senderClass`}
            >
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
                      className={`${mediaFile ? "block" : "hidden"
                        } flex flex-wrap`}
                    >
                      {" "}
                      {/* <div> {chatThread?.myDisplayName}</div> */}
                      <div> You have successfully sent a </div>
                      {/* <div className="font-bold">&nbsp;sent a Media file.</div> */}
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
                    <div className="text-[#7C7C7C] font-[600] pt-1">
                      Image - ${messages?.metadata?.mediaPrice} |
                      {messages?.metadata?.mediaStatus === "Accepted" ? (
                        <span className="text-[#061989]">&nbsp; Accepted</span>
                      ) : messages?.metadata?.mediaStatus === "Denied" ? (
                        <span className="text-[#E85626]">&nbsp; Rejected</span>
                      ) : (
                        "Pending Acceptance"
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  {gift ? (
                    <>
                      <div className="font-[500]">
                        <p className="font-[500]">You have requested a gift</p>
                        {gift &&
                          messages?.metadata?.giftStatus === "Accepted" ? (
                          <p className="text-[#7C7C7C] font-semibold mt-1">
                            Gift - ${messages?.metadata?.giftPrice} |{" "}
                            <span className="text-primary">Accepted</span>{" "}
                          </p>
                        ) : messages?.metadata?.giftStatus === "Rejected" ? (
                          <p className="text-[#7C7C7C] font-semibold mt-1">
                            Gift - ${messages?.metadata?.giftPrice} |{" "}
                            <span className="text-[#E85626]">Rejected</span>{" "}
                          </p>
                        ) : (
                          <p className="text-[#7C7C7C] font-semibold mt-1">
                            Gift - ${messages?.metadata?.giftPrice} | Pending
                            Acceptance
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                {mediaFile && messages?.metadata?.mediaStatus === "Accepted" ? (
                  ""
                ) : mediaFile &&
                  messages?.metadata?.mediaStatus === "Denied" ? (
                  ""
                ) : (
                  <div
                    className={`${mediaFile ? "block" : "hidden"
                      } sendMediaFile min-w-fit flex flex-wrap lg:flex-nowrap items-center`}
                  >
                    <img
                      src={viewFile}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => onClickMedial(messages)}
                    />
                  </div>
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
            <div className={`${mediaFile ? "fill-width" : ""} reciverClass`}>
              <div className="flex flex-wrap justify-between lg:flex-nowrap">
                <div className={`${mediaFile ? "word-break" : ""}`}>
                  <div className="flex">
                    <div
                      className={`${mediaFile || gift ? "hidden" : "block"
                        } reciveName`}
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
                      <p className="font-[500] ">
                        {messages.senderDisplayName} sent you a{" "}
                        <span className="font-bold">Gift.</span>
                      </p>
                      <p className="text-[#7C7C7C] font-semibold mt-1">
                        Gift - ${messages?.metadata?.giftPrice}
                      </p>
                    </div>
                    <div
                      className={`${mediaFile ? "block" : "hidden"
                        } flex flex-wrap`}
                    >
                      {" "}
                      <div> {chatThread?.participantUserName} sent a </div>
                      <div className="font-bold">&nbsp;Media file.</div>
                    </div>
                  </div>
                  {mediaFile ? (
                    <div className="text-[#7C7C7C] font-[600] pt-1">Image</div>
                  ) : (
                    ""
                  )}
                </div>
                {mediaFile ? (
                  <span className="sendMediaFile">
                    <img
                      src={viewFile}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => onClickMedial(messages)}
                    />
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </>
      );
    }
  };

  const onUploadFile = (value: any) => {
    if (!uploadFile) {
      console.error("Upload file is empty");
      return;
    }
    const body: any = {
      ThreadId: chatThread.threadId,
      ChatAccessToken: chatThread.myAccessToken,
      Type: "Media",
      message: uploadFile.name,
      Price: value,
    };
    setLoading(true);
    const { dispatch } = props;
    let formData = new FormData();
    const data = JSON.stringify(body);
    formData.append("file", uploadFile);
    formData.append("message", data);

    dispatch(sendMediaFile(formData))
      .then((res: any) => {
        if (res.data.isSuccess) {
          setMediaPrice(false);
          setLoading(false);
          toast.success("Media upload Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        setMediaPrice(false);
        setLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
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
        console.log("err", err);
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

  const onCancleModal = () => {
    setOpenMedia(false);
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
    dispatch(requestGift(body))
      .then((res: any) => {
        toast.success("Gift send Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });
        setGiftShow(false);
        setGiftSent(true);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const onTyping = async () => {
    await adapter?.sendTypingIndicator();
  };

  const onSendMessage = async (content: string) => {
    sendMassages(content);
  };

  const gotoProfileImage = (data: any) => {
    navigate(`/consultant/viewClientProfile/${data?.participantUserId}`);
  };

  function onToggleShowNotes() {
    setIsShowNote(c => { return !c; });
  }

  return (
    <>
      {loading && <RctPageLoader />}
      <div
        className={`${showChat ? "bg-white" : "bg-[#ffffffb5]"} w-full ${showChat ? "block" : "hidden"
          } 
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
                  // onClick={() => onProfile(chatThread)}
                  >
                    {chatThread?.participantUserName}
                  </p>
                  <div className="flex items-center">
                    <p
                      className="text-[13px] cursor-pointer"
                      onClick={onClickViewMedias}
                    >
                      View Media Gallery
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <button
                      className="bg-primary text-white text-sm xl:text-lg py-1 px-2 md:px-4 xl:px-6 rounded-full border-4 border-solid border-boderDark border-[#686868]"
                      onClick={onClickSendGift}
                    >
                      Request Gift
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-[calc(110vh_-_241px)] md:h-[calc(112vh_-_320px)] xl:h-[calc(105vh_-_251px)] custombp:h-[calc(105vh_-_380px)] px-4 overflow-y-auto no-scrollbar">
                {adapter && (
                  <div className="w-full flex mx-auto h-full py-4 md:px-4 overflow-y-auto no-scrollbar">
                    <div className="py-4 flex items-end relative">
                      <button>
                        <label className="custom-file-upload cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e);
                            }}
                          />
                          <FontAwesomeIcon icon={faPaperclip} className="text-primary text-xl" />
                        </label>
                      </button>
                      <button onClick={onToggleShowNotes}>
                        <label className="chat-note cursor-pointer">
                          <img src={listNotes} width="24px" height="24px" className="ml-[10px]" alt="listNote" />
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
                        {showMediaUpdate === "true" && (
                          <div className="flex justify-center">
                            <span
                              className="cursor-pointer"
                              onClick={() => gotoProfileImage(chatThread)}
                            >
                              {chatThread?.participantUserName}
                            </span>{" "}
                            has updated their{" "}
                            <span
                              className="underline cursor-pointer"
                              onClick={() => gotoProfileImage(chatThread)}
                            >
                              menu item prices{" "}
                            </span>
                            .
                          </div>
                        )}
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
            lable="Request Gift"
          />
        )}
        {viewMedia && <ViewMediaFile close={giftClose} />}
        {mediaPrice && (
          <ViewMediaFile close={mediaPriceClose} onUploadFile={onUploadFile} />
        )}
        {openMedia && (
          <OpenMediaFile cancel={onCancleModal} image={viewImage} />
        )}
        {viewMediaGallary && (
          <ViewMediaGallary cancel={mediaGallaryClose} allfiles={allfiles} />
        )}
        {isShowNote && chatThread && <StickyNotes roomId={chatThread.id} userId={chatThread.myUserId} onClosed={onToggleShowNotes} />}
      </div>
    </>
  );
};

export default connect()(ChatScreen);

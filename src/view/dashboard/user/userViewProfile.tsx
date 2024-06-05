import React, { useState, useEffect } from "react";
import twoWayVideo from "../../../assets/images/twoWayVideo.svg";
import {
  openChatThread,
  SendGiftData,
  putFavorites,
  getTotalCredit,
  getUserByUserNameWithToken,
  addBlockUser,
} from "../../../services/homeService";
import { connect, useDispatch, useSelector } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth_details, set_Show_Chat, set_Thread_Id, set_Token_Credential, set_Total_Credit, set_User_Identifier, set_chat_data } from "../../../reducer/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopUpModal from "./topUpModal";
import GiftSent from "./giftSent";
import SendGift from "./sendGift";
import Footer from "../../../component/footer";
import Header from "../commons/header";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from "@azure/communication-common";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { set_azure_communication_data, set_chat_token_credential_data } from "../../../reducer/chatDataSlice";
import { homePageData, set_user_home_persist_page_data } from "../../../reducer/homePageSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMessage, faPhone, faTty, faVideo } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from '@fortawesome/fontawesome-free-regular';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import UserBlockConformationModal from "../../../component/common/ui/userBlockConformationModal";
import { split } from "lodash";

const ViewProfile: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const profile = useSelector(auth_details);
  const [isLoading, setisLoading] = useState(false);
  const [user_details, setuser_details] = useState<any>();
  const params = useParams();
  const [navbar, setNavbar] = useState<boolean>(false);
  const [giftSent, setGiftSent] = useState(false);
  const [chatData, setChatData] = useState<any>();
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [chatDisable, setchatDisable] = useState<boolean>(false);
  const [insufficientCredits, setInsufficientCredits] =
    useState<boolean>(false);
  const [blockConformationModal, setBlockConformationModal] = useState(false);
  const { userHomePagePersistData } = useSelector(homePageData);
  const authData = useSelector(auth_details);

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = () => {
    setisLoading(true);
    const { dispatch } = props;
    dispatch(getUserByUserNameWithToken(params?.uniqueUsername,))
      .then((res: any) => {
        setuser_details(res?.data);

        const arr = userHomePagePersistData.map((client: any) => {
          if (client.id === res?.data?.id) {
            return res?.data
          } else {
            return client
          }
        })
        persistDispatch(set_user_home_persist_page_data(arr))
        setisLoading(false);
      })
      .catch((err: any) => {
        const massage = err.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
      });
  };

  const onGotoChat = (data: any) => {
    const { dispatch } = props;
    setchatDisable(true);
    setisLoading(true)
    dispatch(openChatThread(data?.id))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId) as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))

          dispatch(set_Show_Chat(true))
          persistDispatch(set_azure_communication_data(res?.data))
          persistDispatch(set_chat_token_credential_data(new AzureCommunicationTokenCredential(res?.data?.myAccessToken)))
        }
        setchatDisable(false)
        setisLoading(false)

        dispatch(set_chat_data(res?.data));
        const data: any = null;
        localStorage.setItem("indexData", data);
        navigate(`/user/chat`);
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        setchatDisable(false)
        setisLoading(false)
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const sendGiftSp = (data: any) => {
    createOpenChatThread(data?.id);
  };

  const createOpenChatThread = (id: any) => {
    setisLoading(true)
    setchatDisable(true)
    const { dispatch } = props;
    dispatch(openChatThread(id))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId) as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
        }
        setChatData(res?.data);
        setGiftShow(true);
        setchatDisable(false)
        setisLoading(false)
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        setchatDisable(false)
        setisLoading(false)
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const onInsufficientCredits = () => {
    setInsufficientCredits(true);
    setGiftShow(false);
  };

  const onSubmitGift = (data: any) => {
    setisLoading(true);
    const { dispatch } = props;
    const body = {
      threadId: chatData.threadId,
      chatAccessToken: chatData.myAccessToken,
      message: "gift",
      type: "gift",
      price: data,
    };
    dispatch(SendGiftData(body))
      .then((res: any) => {
        dispatch(getTotalCredit(profile?.totalCredit?.accountId)).then((credit: any) => {
          setisLoading(false);
          dispatch(set_Total_Credit(credit?.data))
        }).catch(() => {
          setisLoading(false)
        })
        toast.success("Gift send Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });

        setGiftShow(false);
        setGiftSent(true);
      })
      .catch((err: any) => {
        setisLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const onCloseGiftSent = () => {
    setGiftSent(false);
  };

  const onTopCredit = () => {
    setInsufficientCredits(false);
    setGiftShow(true);
  };

  const onGotoFavorite = (data: any, value: any) => {
    const { dispatch } = props;
    setisLoading(true);
    dispatch(putFavorites(data?.id, value))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getUserData();
        }
      })
      .catch((err: any) => {
        setisLoading(false);
        toast.error(err?.data?.message, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const onSubmitBlockUser = () => {
    setBlockConformationModal(false)
    setisLoading(true)
    const { dispatch } = props;
    dispatch(addBlockUser(authData?.login?.id, user_details?.id)).then((res: any) => {
      if (res.data.isSuccess) {
        const SPlist = userHomePagePersistData.filter((user: any) => {
          if (user?.id !== user_details?.id) {
            return user
          }
        })
        persistDispatch(set_user_home_persist_page_data(SPlist))

        navigate(-1)
      }
    }).catch((err: any) => {
      setisLoading(false)
      toast.error(err.data.message, {
        theme: "colored",
        autoClose: 5000,
      })
    })
  }

  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className="bg-[#F8F3FD] pb-6 min-h-screen">
        <Header navbar={navbar} onClick={navbarClick} />
        <div
          className={`${navbar ? "hidden" : "block"
            } md:block mx-auto w-11/12 2xl:w-[1284px] 2xl:mt-12 bg-[#ffffffb5] rounded-lg py-6 px-4 md:px-10`}
        >
          <div className="w-full md:grid md:grid-cols-2">
            <div className="text-4xl text-primary text-center md:text-start">
              {" "}
              {user_details?.username}
            </div>
            <div className="hidden md:block ml-auto">
              <div className="flex items-center flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                <button
                  className={`bg-white mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-primary text-2xl hover:bg-primary hover:text-white w-[150px] h-[50px] rounded-full border-2 border-solid border-primary ${chatDisable && "opacity-25"}`}
                  onClick={() => sendGiftSp(user_details)}
                  disabled={chatDisable}
                >
                  Send Gift
                </button>
                <span className="ml-2.5">
                  <button
                    className={`bg-primary mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-white hover:text-primary text-white text-2xl  w-[150px] h-[50px] rounded-full border-2 border-solid border-primary px-8 ${chatDisable && "opacity-25"}`}
                    onClick={() => onGotoChat(user_details)}
                    disabled={chatDisable}
                  >
                    Chat
                  </button>
                </span>

                <div className="hidden md:block">
                  {user_details?.isFavorite ? (
                    <span onClick={() => onGotoFavorite(user_details, false)}>
                      <FontAwesomeIcon icon={faHeart} className="text-primary text-3xl ml-2" />
                    </span>
                  ) : (
                    <span onClick={() => onGotoFavorite(user_details, true)}>
                      <FontAwesomeIcon icon={regularHeart as IconProp} className="text-primary text-3xl ml-2" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:flex justify-between gap-4 mt-2 md:mt-0">
            <div className="relative w-fit h-[300px] md:h-[388px] overflow-hidden rounded-2xl">
              <img
                className="rounded-2xl w-[388px] md:min-h-[388px] md:shrink-0 relative"
                src={user_details?.profileImageUrl}
                alt="product"
              />

              <div className="absolute cursor-pointer right-3 top-3 md:hidden">
                {user_details?.isFavorite ? (
                  <FontAwesomeIcon icon={faHeart} className="text-3xl text-primary" onClick={(e) =>
                    onGotoFavorite(user_details, false)
                  } />
                ) : (
                  <FontAwesomeIcon icon={regularHeart as IconProp} className="text-3xl text-white" onClick={(e) =>
                    onGotoFavorite(user_details, true)
                  } />
                )}
              </div>

            </div>
            <div className="block md:hidden ml-auto">
              <div className="flex mt-4 flex-wrap md:justify-between w-full">
                <button
                  className={`bg-primary  mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-white text-2xl hover:text-white w-full h-[50px] border-2 border-solid border-primary px-8 rounded-full ${chatDisable && "opacity-25"}`}
                  onClick={() => onGotoChat(user_details)}
                  disabled={chatDisable}
                >
                  Chats
                </button>
              </div>

              <div className="flex mt-4 flex-wrap md:justify-between w-full">
                <button
                  className={`bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-full h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full ${chatDisable && "opacity-25"}`}
                  onClick={() => sendGiftSp(user_details)}
                  disabled={chatDisable}
                >
                  Send Gift
                </button>
              </div>
            </div>
            <div className="w-full md:w-7/12 2xl:w-[769px] grid content-between">
              <div className="">
                <div className="text-[#6E6E6E]">About</div>
                <div className="font-['Montserrat'] text-[#444444]">
                  {user_details?.description}
                </div>
              </div>
              <div className="text-[#6E6E6E] text-base">Menu</div>
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-4 w-fit mx-auto">
                <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                  <FontAwesomeIcon icon={faMessage} className="text-primary text-4xl text-center w-full" />

                  <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                    Chat
                  </div>

                  <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                    ${user_details?.communication?.shortMessageUnitPrice}
                  </div>
                </div>

                {user_details?.enablePhoneCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faTty} className="text-primary text-4xl text-center w-full" />
                    <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                      Phone
                    </div>

                    <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                      ${user_details?.communication?.phoneCallUnitPrice}
                    </div>
                  </div>
                } 
                {user_details?.enableAudioCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faPhone} className="text-primary text-4xl text-center w-full" />
                    <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                      Audio
                    </div>

                    <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                      ${user_details?.communication?.audioCallUnitPrice}
                    </div>
                  </div>
                }

                {user_details?.enableOneWayVideoCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faVideo} className="text-primary text-4xl text-center w-full" />
                    <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                      1 Way
                    </div>

                    <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                      ${user_details?.communication?.videoCallOneWayUnitPrice}
                    </div>
                  </div>
                }

                {user_details?.enableTwoWayVideoCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <img
                      src={twoWayVideo}
                      className="mx-auto w-[40px] h-[40px]"
                      alt="image1"
                    />
                    <div className="text-center w-full font-['Montserrat'] pt-3 font-bold text-[16px] text-[#3E3E3E]">
                      2 Way
                    </div>

                    <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                      ${user_details?.communication?.videoCallTwoWayUnitPrice}
                    </div>
                  </div>
                }

              </div>
            </div>
          </div>


          {user_details?.profileInfo &&
            <div dangerouslySetInnerHTML={{ __html: user_details?.profileInfo }} className="mt-4 ck ck-content break-words ck-editor__editable ck-rounded-corners ck-blurred overflow-auto px-[0.6em] border border-[#37085B] ckPreview" />
          }

          <div className="flex justify-center mt-4">
            <button
              className={`bg-primary mx-auto rounded-full xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[150px] h-[50px]  border-2 border-solid border-primary ${chatDisable && "opacity-25"}`}
              onClick={() => setBlockConformationModal(true)}
            >
              Block User
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {giftSent && (
        <GiftSent onMainClose={onCloseGiftSent} chatUser={chatData} />
      )}

      {giftShow && (
        <SendGift
          close={giftClose}
          chatUser={chatData}

          onSubmitGift={onSubmitGift}
          onInsufficientCredits={onInsufficientCredits}
          lable="Send Gift"
        />
      )}

      {insufficientCredits && (
        <TopUpModal
          onCancel={onTopCredit}
          onSuccess={onTopCredit}
          amount=""
          insufficientCredits={true}
        />
      )}

      {blockConformationModal && (
        <UserBlockConformationModal
          setBlockConformationModal={setBlockConformationModal}
          onSubmitBlockUser={onSubmitBlockUser}
        />
      )}
    </>
  );
};

export default connect()(ViewProfile);

import React, { useState, useEffect } from "react";
import Header from "../../../component/header";
import {
  getRequestData,
  createAcceptData,
  createRejectData,
  getSearchFriend,
  postRequestConsultation,
  openChatThread,
  SendGiftData,
  getTotalCredit
} from "../../../services/homeService";
import { connect, useSelector } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { useNavigate } from "react-router-dom";
import defultUserRound from "../../../assets/images/defaultRound.svg";
import { auth_details, set_Thread_Id, set_Token_Credential, set_Total_Credit, set_User_Identifier, set_chat_data } from "../../../reducer/auth";
import { set_Inbox_Data } from "../../../reducer/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopUpModal from "./topUpModal";
import GiftSent from "./giftSent";
import SendGift from "./sendGift";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from "@azure/communication-common";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const ViewRequest: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const profile = useSelector(auth_details);
  const [searchQuery, setSearchQuery] = useState("");
  const [reqData, setreqData] = useState([]);
  const [showChate, setShowChate] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [disableRequest, setDisableRequest] = useState(false);
  const [showChateSerach, setShowChateSerach] = useState(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [giftSent, setGiftSent] = useState(false);
  const [chatData, setChatData] = useState<any>();
  const [chatDisable ,setchatDisable] = useState<boolean>(false)
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [insufficientCredits, setInsufficientCredits] =
  useState<boolean>(false);

  useEffect(() => {
    getFriendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFriendData = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getRequestData())
      .then((res: any) => {
        setreqData(res.data.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const requestAccept = (data: any, index: any) => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(createAcceptData(data?.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          toast.success("Request Accpet Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });

          if (index !== "accept") {
            setShowChate([index]);
          } else {
            setShowChateSerach(true);
          }
          setLoading(false);
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

  const requestReject = (data: any) => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(createRejectData(data?.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          toast.success("Request Reject Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
          getFriendData();
          setLoading(false);
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

  const onRedirectProfile = (data: any) => {
    navigate(`/user/profileDetails/${data.id}`);
  };

  const onSearch = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (e.key === "Enter" && value !== "") {
      setLoading(true);
      const { dispatch } = props;
      dispatch(getSearchFriend(value))
        .then((res: any) => {
          setLoading(false);
          setSearchData(res?.data);
        })
        .catch((err: any) => {
          setLoading(false);

          setSearchQuery("");
          setSearchData(null);
        });
    }
  };

  const requestConsultation = () => {
    const { dispatch } = props;
    dispatch(postRequestConsultation(searchData?.id))
      .then((res: any) => {
        if (res?.data?.isSuccess) {
          setDisableRequest(true);
          toast.success("Requests send ServiceProvider !", {
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
      });
  };

  const goToChat = (data: any) => {
    setLoading(true);
    setchatDisable(true)
    const { dispatch } = props;
    dispatch(openChatThread(data?.id))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId)  as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
        }
        dispatch(set_chat_data(res?.data));
        setLoading(false);
        navigate(`/user/chat`);
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

  const redirectInbox = (data: any) => {
    const { dispatch } = props;
    const obj = {
      value: data.username,
      label: data.username,
      id: data.id,
    };
    dispatch(set_Inbox_Data(obj));
    navigate(`/user/sendMail`);
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const sendGiftSp = (data: any) => {
    createOpenChatThread(data?.id);
  };

  const createOpenChatThread = (id: any) => {
    const { dispatch } = props;
    dispatch(openChatThread(id))
      .then((res: any) => {
        if (res.data) {
          const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
          const userId = fromFlatCommunicationIdentifier(res?.data?.myId)  as CommunicationUserIdentifier;
          dispatch(set_User_Identifier(userId));
          dispatch(set_Token_Credential(tokenCredential));
          dispatch(set_Thread_Id(res?.data?.threadId))
        }
        setChatData(res?.data);
        setGiftShow(true);
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
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
    setLoading(true);
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
          setLoading(false);
          dispatch(set_Total_Credit(credit?.data))
        }).catch(() => {
          setLoading(false)
        })
        toast.success("Gift send Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });
        setGiftShow(false);
        setGiftSent(true);
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

  
  const onCloseGiftSent = () => {
    setGiftSent(false);
  };

  const onTopCredit = () => {
    setInsufficientCredits(false);
    setGiftShow(true);
  }

  return (
    <>
      
      {loading && <RctPageLoader />}
      <div
        className={`bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 min-h-screen 2xl:h-screen ${
          navbar ? "pb-none" : "pb-[22px]"
        } md:pb-[22px]`}
      >
        <Header navbar={navbar} onClick={navbarClick} />
        <div
          className={`${
            navbar ? "hidden" : "block"
          } md:block mx-auto w-11/12  2xl:w-[1336px] mt-8 custombp:mt-20 custombp:h-[215px] bg-[#ffffffb5] rounded-lg py-6 px-4 md:px-10`}
        >
          <div className="mt-4 font-semibold text-base md:text-[22px] text-primary font-['Montserrat']">
            Search for a consultants
          </div>
          <div className="relative mt-4 w-full mx-auto flex items-center xl:w-auto">
            <input
              placeholder="Enter username"
              type="text"
              className="w-full placeholder-current rounded-3xl bg-[#FFFFFF]/70 text-md md:text-lg text-primary leading-none px-3 py-1 border border-solid border-primary focus:outline-none focus:bg-white"
              onKeyPress={(e: any) => {
                onSearch(e);
              }}
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 w-3.5 h-3.5 md:w-auto md:h-auto" />

            {searchQuery !== "" && searchData && (
              <div className="absolute top-10 w-full text-gray-900">
                <div className="bg-white w-full mt-2 border border-2 border-primary mx-auto flex items-center justify-between  rounded-[28px] px-3 py-3 flex items-centers">
                  <div className="flex flex-wrap w-full justify-between items-center">
                    <div
                      className="flex cursor-pointer"
                      onClick={() => onRedirectProfile(searchData)}
                    >
                      {searchData?.profileImageUrl === null ||
                      searchData?.profileImageUrl === "" ? (
                        <img
                          src={defultUserRound}
                          className="w-[74px] h-[74px] my-auto shadow-2xl  rounded-full"
                          alt=""
                        />
                      ) : (
                        <img
                          src={searchData?.profileImageUrl}
                          className="w-[74px] h-[74px] my-auto shadow-2xl  rounded-full"
                          alt=""
                        />
                      )}
                      <div className="ml-4 my-auto text-[#041058] text-xl">
                        {/* <p className="">{searchData?.name}</p> */}
                        <p>{searchData?.username}</p>
                      </div>
                    </div>

                    {searchData?.isMyFriend ? (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <button
                          className={`bg-primary mx-auto rounded-full xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[150px] h-[50px]  border-2 border-solid border-primary"
                          }`}
                          onClick={() => sendGiftSp(searchData)}
                        >
                          Send Gift
                        </button>
                        <span className="ml-2.5">
                          <button
                            className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-[150px] h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full"
                            onClick={() => goToChat(searchData)}
                            disabled={chatDisable}
                          >
                            Chat
                          </button>
                        </span>
                      </div>
                    ) : showChateSerach ? (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <span className="ml-2.5">
                          <button
                            className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-[150px] h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full"
                            onClick={() => goToChat(searchData)}
                            disabled={chatDisable}
                          >
                            Chat
                          </button>
                        </span>
                      </div>
                    ) : searchData?.isOfferMe ? (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <button
                          className="bg-[#37085Bd9] hover:bg-primary text-white text-2xl hover:text-white py-1 px-8 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent rounded-full"
                          onClick={() => requestAccept(searchData, "accept")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-white ml-2 hover:bg-primary text-red-700 text-2xl hover:text-white py-1 px-10 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent border-red-700 rounded-full"
                          onClick={() => requestReject(searchData)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : searchData?.isPendingRequests ? (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <button
                          className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-[167px] h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full"
                          onClick={() => redirectInbox(searchData)}
                        >
                          Inbox
                        </button>
                        {/* <span className="ml-2.5">
                          <button className="bg-primary mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[280px] h-[50px]  border-2 border-solid border-primary rounded-full opacity-50">
                            Request Consultation
                          </button>
                        </span> */}
                      </div>
                    ) : (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <button
                          className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-[167px] h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full"
                          onClick={() => redirectInbox(searchData)}
                        >
                          Inbox
                        </button>
                        {/* <span className="ml-2.5">
                          <button
                            className={`bg-primary mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[280px] h-[50px]  border-2 border-solid border-primary  rounded-full ${
                              disableRequest && "opacity-25"
                            }`}
                            onClick={requestConsultation}
                            disabled={disableRequest}
                          >
                            Request Consultation
                          </button>
                        </span> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${
            navbar ? "hidden" : "block"
          } md:block mx-auto w-11/12 2xl:w-[1336px] mt-2 2xl:mt-4 h-[calc(100vh_-_320px)] custombp:h-[calc(100vh_-_500px)] bg-[#ffffffb5] rounded-lg py-6 px-6`}
        >
          <div className="text-[22px] text-primary font-semibold  font-['Montserrat']">
            New Request
          </div>
          {reqData.length === 0 ? (
            <div>No requests were found. </div>
          ) : (
            reqData.map((res: any, index: any) => (
              <div className="flex flex-wrap mt-4 cursor-pointer">
                {res?.profileImageUrl === null ||
                res?.profileImageUrl === "" ? (
                  <img
                    src={defultUserRound}
                    className="w-[74PX] h-[74px] rounded-full "
                    alt="test1"
                    onClick={() => onRedirectProfile(res)}
                  />
                ) : (
                  <img
                    src={res?.profileImageUrl}
                    className="w-[74PX] h-[74px] rounded-full "
                    alt="test1"
                    onClick={() => onRedirectProfile(res)}
                  />
                )}
                <div
                  className="w-[750px] md:ml-2 font-['Montserrat']"
                  onClick={() => onRedirectProfile(res)}
                >
                  <p className="font-semibold text-[22px] text-primary ">
                    {res?.username}
                  </p>
                  <p
                    className="overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {res?.description}
                  </p>
                </div>
                {showChate?.includes(index) ? (
                  <div className="my-auto ml-auto">
                    <button
                      className="bg-white ml-2 text-black text-2xl py-1 px-14 2xl:px-14 border-4 border-solid border-boderDark border-[#686868] rounded-full"
                      onClick={() => goToChat(res)}
                      disabled={chatDisable}
                    >
                      Chat
                    </button>
                  </div>
                ) : res?.isPendingRequests ? (
                  <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                    {/* <button className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-[167px] h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full">
                    Inbox
                  </button> */}
                    {/* <span>
                      <button className="bg-primary mx-auto xl:mx-[0px] xl:ml-10 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[280px] h-[50px]  border-2 border-solid border-primary rounded-full opacity-50">
                        Request Consultation
                      </button>
                    </span> */}
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-between mt-auto md:ml-auto">
                    <button
                      className="bg-[#37085Bd9] hover:bg-primary text-white text-2xl hover:text-white py-1 px-6 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent rounded-full"
                      onClick={() => requestAccept(res, index)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-white ml-2 hover:bg-primary text-red-700 text-2xl hover:text-white py-1 px-10 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent border-red-700 rounded-full"
                      onClick={() => requestReject(res)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
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
    </>
  );
};

export default connect()(ViewRequest);

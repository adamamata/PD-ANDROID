import React, { useState, useEffect } from "react";
import Header from "../../../component/header";
import {
  getRequestData,
  createAcceptData,
  createRejectData,
  getSearchFriend,
  postRequestConsultation,
  openChatThread,
} from "../../../services/homeService";
import { connect } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { useNavigate } from "react-router-dom";
import defultUser from "../../../assets/images/defaultRound.svg";
import { set_chat_data } from "../../../reducer/auth";
import { set_Inbox_Data } from "../../../reducer/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const ConsultantViewRequest: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [reqData, setreqData] = useState([]);
  const [showChate, setShowChate] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [disableRequest, setDisableRequest] = useState(false);
  const [showChateSerach, setShowChateSerach] = useState(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [accpetDisable, setAccpetDisable] = useState<boolean>(false);
  const [rejectDisable, setRejectDisable] = useState<boolean>(false);
  const [chatDisable, setchatDisable] = useState<boolean>(false)


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
        console.log("dfsdgfsdf", err);
        setLoading(false);
      });
  };

  const requestAccept = (data: any, index: any) => {
    const { dispatch } = props;
    setAccpetDisable(true);
    setLoading(true);
    dispatch(createAcceptData(data?.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          toast.success("Request Accept Successfull!", {
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
    setRejectDisable(true);
    setLoading(true);
    dispatch(createRejectData(data?.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getFriendData();
          setLoading(false);
          toast.success("Request Reject Successfull!", {
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

  const requestUser = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(postRequestConsultation(searchData?.id))
      .then((res: any) => {
        if (res?.data?.isSuccess) {
          setDisableRequest(true);
          setLoading(false);
          toast.success("Requests send User Successfull!", {
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

  const onRedirectProfile = (data: any) => {
    navigate(`/consultant/viewClientProfile/${data.id}`);
  };

  const goToChat = (data: any) => {
    setLoading(true);
    setchatDisable(true)
    const { dispatch } = props;
    dispatch(openChatThread(data?.id))
      .then((res: any) => {
        dispatch(set_chat_data(res?.data));
        setLoading(false);
        navigate(`/consultant/chat`);
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
    navigate(`/consultant/sendMail`);
  };

  return (
    <>
      
      {loading && <RctPageLoader />}
      <div
        className={`bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 min-h-screen ${
          navbar ? "pb-none" : "pb-[22px]"
        } md:pb-[22px]`}
      >
        <Header navbar={navbar} onClick={navbarClick} />
        <div
          className={`${
            navbar ? "hidden" : "block"
          } md:block mx-auto w-11/12 h-full 2xl:w-[1336px] mt-8 2xl:mt-20 2xl:h-[215px] bg-[#ffffffb5] rounded-lg py-6 px-4 md:px-10`}
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
                  <div className="flex flex-wrap w-full justify-between">
                    <div
                      className="flex cursor-pointer"
                      onClick={() => onRedirectProfile(searchData)}
                    >
                      {" "}
                      {searchData?.profileImageUrl === null ||
                      searchData?.profileImageUrl === "" ? (
                        <img
                          src={defultUser}
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
                    {searchData?.isMyFriend || showChateSerach ? (
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
                      <div className="flex md:justify-between mt-4 w-min md:w-auto mx-auto md:mx-0">
                        <button
                          className={`bg-[#37085Bd9] hover:bg-primary text-white text-2xl hover:text-white py-1 px-6 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent rounded-full ${
                            accpetDisable && "opacity-25"
                          }`}
                          onClick={() => requestAccept(searchData, "accept")}
                          disabled={accpetDisable}
                        >
                          Accept
                        </button>
                        <button
                          className={`bg-white ml-2 hover:bg-primary text-red-700 text-2xl hover:text-white py-1 px-6 md:px-8 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent border-red-700 rounded-full
                          ${rejectDisable && "opacity-25"}
                          `}
                          onClick={() => requestReject(searchData)}
                          disabled={rejectDisable}
                        >
                          Reject
                        </button>
                      </div>
                    ) : searchData?.isPendingRequests ? (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <span className="ml-2.5">
                          <button className="bg-primary mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[280px] h-[50px]  border-2 border-solid border-primary rounded-full opacity-50">
                            Offer Consultation
                          </button>
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                        <button
                          className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-[167px] h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full"
                          onClick={() => redirectInbox(searchData)}
                        >
                          Inbox
                        </button>
                        <span className="ml-2.5">
                          <button
                            className={`bg-primary mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[280px] h-[50px]  border-2 border-solid border-primary  rounded-full ${
                              disableRequest && "opacity-25"
                            }`}
                            disabled={disableRequest}
                            onClick={requestUser}
                          >
                            Offer Consultation
                          </button>
                        </span>
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
          } md:block mx-auto w-11/12 h-auto 2xl:w-[1336px] mt-2 2xl:mt-4 2xl:h-auto bg-[#ffffffb5] rounded-lg py-6 px-4 md:px-10`}
        >
          <div className="text-[22px] text-primary font-semibold  font-['Montserrat']">
            New Request
          </div>
          {reqData.length === 0 ? (
            <div>No requests were found. </div>
          ) : (
            reqData.map((res: any, index: any) => (
              <div className="flex flex-wrap mt-4">
                {res?.profileImageUrl === null ||
                res?.profileImageUrl === "" ? (
                  <img
                    src={defultUser}
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
                  className="w-full md:w-[40%] lg:w-[56%] xl:w-[740px] md:ml-2 font-['Montserrat']"
                  onClick={() => onRedirectProfile(res)}
                >
                  <p className="font-semibold text-[22px] text-primary ">
                    {res?.username}
                  </p>
                  <p
                    className="overflow-hidden text-primary"
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
                  <div className="my-auto md:ml-auto">
                    <button
                      className="bg-white text-black text-2xl py-1 px-14 2xl:px-14 border-4 border-solid border-boderDark border-[#686868] rounded-full"
                      onClick={() => goToChat(res)}
                    >
                      Chat
                    </button>
                  </div>
                ) : res?.isMyFriend ? (
                  <div className="my-auto md:ml-auto">
                    <button
                      className="bg-white text-black text-2xl py-1 px-14 2xl:px-14 border-4 border-solid border-boderDark border-[#686868] rounded-full"
                      onClick={() => goToChat(res)}
                    >
                      Chat
                    </button>
                  </div>
                ) : res?.isPendingRequests ? (
                  <div className="my-auto md:ml-auto">
                    <button className="bg-primary text-white text-2xl hover:text-white w-[280px] h-[50px]  border-2 border-solid border-primary rounded-full opacity-50">
                      Offer Consultation
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-between mt-auto md:ml-auto">
                    <button
                      onClick={() => requestAccept(res, index)}
                      className={`bg-[#37085Bd9] hover:bg-primary text-white text-2xl hover:text-white py-1 px-6 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent rounded-full ${
                        accpetDisable && "opacity-25"
                      }`}
                      disabled={accpetDisable}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => requestReject(res)}
                      className={`bg-white ml-2 hover:bg-primary text-red-700 text-2xl hover:text-white py-1 px-6 md:px-8 2xl:px-14 border-4 border-solid border-boderDark hover:border-transparent border-red-700 rounded-full
                          ${rejectDisable && "opacity-25"}
                          `}
                      disabled={rejectDisable}
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
    </>
  );
};

export default connect()(ConsultantViewRequest);

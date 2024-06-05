import React, { useState, useEffect, useRef } from "react";
import buttonPlusSign from "../../../assets/images/buttonPlusSign.svg";
import deleteIcon from "../../../assets/images/delete.svg";
import Header from "../commons/header";
import { useSelector } from "react-redux";
import {
  auth_details,
  set_profile,
  set_Account_Data,
  set_Total_Credit,
} from "../../../reducer/auth";
import ChangePassword from "../../auth/changePassword";
import { useNavigate } from "react-router-dom";
import defultUser from "../../../assets/images/defaultRound.svg";
import AddNewCard from "./addNewCard";
import { deleteCardData, getBlockUserList, getCardData, getTotalCredit, myTransctions, unblockUser } from "../../../services/homeService";
import { getProfileData, getAccountsData } from "../../../services/authService";
import moment from "moment";
import { connect } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import TopUpModal from "./topUpModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOCALSTORE } from "../../../constant/default";
import InfiniteScroll from "react-infinite-scroller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getValue } from "../../../functions/utilities";
import { CircularProgress } from "@mui/material";

const UserProfile: React.FC<any> = (props: any) => {
  const navigate = useNavigate();

  const details = useSelector(auth_details);
  let user_details = details?.user_profile;

  const blockedUserListRef = useRef<any>()

  const [cards, setCards] = useState<any>([]);
  const [isLoading, setisLoading] = useState(false);
  const [changePassword, seChangePassword] = useState(false);
  const [showAddNewCard, setShowAddNewCard] = useState(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [topUp, setTopup] = useState<boolean>(false);
  const [amout, setAmout] = useState<any>("");
  const [activity, setActivity] = useState<any>([]);
  const [limit, setLimit] = useState<any>(10);
  const loginId = localStorage.getItem(LOCALSTORE.id);
  const [transaction, setTransaction] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [noMoreData, setNoMoreData] = useState<Boolean>(false);
  const [blockedUserList, setBlockedUserList] = useState<any>([])
  const [blockedUserListExpand, setBlockedUserListExpand] = useState(false);
  const [noMoreBlockedData, setNoMoreBlockedData] = useState<boolean>(false);
  const [pageStart, setPageStart] = useState<number>(1);
  const [blockedUserListLoader, setBlockedUserListLoader] = useState(false);

  const onCancleModal = () => {
    seChangePassword(false);
  };

  const updateCredit = () => {
    setisLoading(true)
    const { dispatch } = props;
    dispatch(getTotalCredit(details?.totalCredit?.accountId || details?.accountData?.id)).then((credit: any) => {
      dispatch(set_Total_Credit(credit?.data))
      setisLoading(false);
    }).catch(() => {
      setisLoading(false);
    })
  };

  useEffect(() => {
    if (details) {
      updateCredit()
    }
  }, [details.accountData])

  useEffect(() => {
    getAccount();
    const { dispatch } = props;
    getCardDetails();
    dispatch(getProfileData(loginId))
      .then((res: any) => {
        dispatch(set_profile(res.data));
      })
      .catch((err: any) => { });
    getTransctionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAccount = () => {
    setisLoading(true);
    const { dispatch } = props;
    dispatch(getAccountsData())
      .then((res: any) => {
        setUserDetails(res.data);
        setisLoading(false);
        dispatch(set_Account_Data(res.data));
      })
      .catch((err: any) => {
        setisLoading(false);
        console.log("error", err);
      });
  };

  const onchangePassword = () => {
    seChangePassword(true);
  };

  const editProfile = () => {
    navigate("/user/profileEdit");
  };

  const onCancleAddNewCardModal = () => {
    setShowAddNewCard(false);
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const getCardDetails = () => {
    setisLoading(true);
    const { dispatch } = props;
    dispatch(getCardData(details?.totalCredit?.accountId || details?.accountData?.id))
      .then((res: any) => {
        setCards(res?.data);
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

  const getTransctionDetails = () => {
    const { dispatch } = props;
    dispatch(myTransctions(page))
      .then((res: any) => {
        setActivity(res.data);
        setPage(page + 1);
        if (res.data.length === 0) {
          setNoMoreData(true);
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

  const getMoreTransctionDetails = () => {
    const { dispatch } = props;
    dispatch(myTransctions(page))
      .then((res: any) => {
        setActivity((prev: any) => [...prev, ...res.data]);
        setPage(page + 1);
        if (res.data.length === 0) {
          setNoMoreData(true);
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

  const onClickAmout = (value: any) => {
    setAmout(value);
    setTopup(true);
  };

  const onTopUpCancle = () => {
    setTopup(false);
  };

  const setMoreActivity = () => {
    setLimit(limit + 10);
  };

  const onCancelTransctionHistory = () => {
    setTransaction(false);
  };

  const onTransctionClick = () => {
    setTransaction(true);
  };

  const onCardDeleteClick = (id: any) => {
    const { dispatch } = props;
    setisLoading(true);

    dispatch(deleteCardData(id)).then((res: any) => {
      getCardDetails()
    }).catch((err: any) => {
      setisLoading(false)
    })
  }

  useEffect(() => {
    if (blockedUserListRef?.current && blockedUserListExpand) {
      blockedUserListRef?.current?.scrollIntoView({
        behavior: "smooth",
      });
    }

    if (blockedUserListExpand) {
      setBlockedUserListLoader(true)
      resetBlockedUserList();
    }
  }, [blockedUserListRef, blockedUserListExpand])

  const resetBlockedUserList = () => {
    setNoMoreBlockedData(false);
    setPageStart(1);

    setTimeout(() => {
      getMoreBlockedUserList(1);
    }, 200);
  }

  const getMoreBlockedUserList = (pageNumber: number) => {
    const nmbd = getValue(setNoMoreBlockedData);
    let pi = getValue(setPageStart);
    let loading = getValue(setisLoading);

    if (nmbd || !details?.login?.id || loading) { return; }

    // setisLoading(true);
    const { dispatch } = props;
    dispatch(getBlockUserList(details?.login?.id, pi, 30))
      .then((res: any) => {
        if (pi == 1) {
          setBlockedUserList(res.data.data);
        } else {
          setBlockedUserList((prev: any) => [...prev, ...res.data.data]);
        }
        setPageStart(i => i + 1);
        if (res.data.data.length === 0) {
          setNoMoreBlockedData(true);
        }
        setisLoading(false);
        setBlockedUserListLoader(false)
      }).catch((err: any) => {
        setBlockedUserListLoader(false)
        setisLoading(false);
      });
  };

  const onUnblockUserClick = (blockedid: string) => {
    setBlockedUserListLoader(true)
    const { dispatch } = props;
    dispatch(unblockUser(details?.login?.id, blockedid))
      .then((res: any) => {
        setisLoading(false);
        resetBlockedUserList();
      })
      .catch((err: any) => {
        console.log("err", err);
        setisLoading(false);
        setBlockedUserListLoader(false)
      });
  }

  return (
    <>
      <div className="bg-[#F8F3FD] min-h-screen">
        {isLoading && <RctPageLoader />}
        <Header navbar={navbar} onClick={navbarClick} />
        <div className={`${navbar ? "hidden" : "block"} md:block`}>
          <div className="text-4xl px-6 py-4 2xl:ml-7 text-primary font-['Montserrat']">
            Welcome back, {user_details?.username}.
          </div>
          <div className="flex justify-center md:justify-between flex-wrap xl:px-8 2xl:px-10">
            <div className="w-11/12 mx-auto md:mx-auto lg:w-[33%] 2xl:w-[448px] h-full bg-[#ffffffb5] rounded-lg py-6 px-6">
              <p className="text-[22px] text-center text-[#37085B] font-semibold font-['Montserrat']">
                My Account Overview
              </p>
              {user_details?.profileImageUrl === null ||
                user_details?.profileImageUrl === "" ? (
                <img
                  src={defultUser}
                  className="w-[147px] h-[147px] mx-auto rounded-full mt-4"
                  alt="buttonPlussing"
                />
              ) : (
                <img
                  src={user_details?.profileImageUrl}
                  className="w-[147px] h-[147px] mx-auto rounded-full mt-4"
                  alt="buttonPlussing"
                />
              )}

              <p className="text-2xl mt-4 text-center break-all text-[#37085B] font-semibold font-['Montserrat']">
                {user_details?.username}
              </p>

              <p className="text-xs mt-4 text-start text-[#37085B] font-[500] font-['Montserrat']">
                First Name:
              </p>

              <p className="text-base mt-2 text-start break-all text-[#37085B] font-[500] font-['Montserrat']">
                {userDetails?.firstName}
              </p>

              <p className="text-xs mt-4 text-start text-[#37085B] font-[500] font-['Montserrat']">
                Last Name:
              </p>

              <p className="text-base mt-2 text-start break-all text-[#37085B] font-[500] font-['Montserrat']">
                {userDetails?.lastName}
              </p>

              <p className="text-xs mt-4 text-start text-[#37085B] font-[500] font-['Montserrat']">
                Email:
              </p>

              <p className="text-base mt-2 text-start break-all text-[#37085B] font-[500] font-['Montserrat']">
                {userDetails?.email}
              </p>

              <p className="text-xs mt-4 text-start text-[#37085B] font-[500] font-['Montserrat']">
                Phone Number:
              </p>

              <p className="text-base mt-2 text-start break-all text-[#37085B] font-[500] font-['Montserrat']">
                {userDetails?.dialCode} {userDetails?.phoneNumber}
              </p>

              <p className="text-xs mt-4 text-start text-[#37085B] font-[500] font-['Montserrat']">
                Description:
              </p>

              <p className="text-base text-justify break-all mt-4 text-[#37085B] font-[500] font-['Montserrat']">
                {user_details?.description}
              </p>

              <div className="flex flex-wrap w-full justify-between mt-6 ">
                <button
                  className="bg-white mx-auto mr-2 mt-4 sm:mt-0 sm:mx-0 hover:bg-[#37085B] text-[#37085B] text-base hover:text-white py-2 border-2 border-solid border-[#37085B] px-8 hover:border-transparent rounded-full"
                  onClick={onchangePassword}
                >
                  Change Password
                </button>
                <button
                  className="bg-[#37085B] mx-auto mt-4 sm:mt-0 sm:mx-0 text-white text-base hover:text-white py-2 px-10  border-2 border-solid border-[#37085B]  rounded-full"
                  onClick={editProfile}
                >
                  Edit My Profile
                </button>
              </div>
            </div>

            <div className="w-11/12 mx-auto md:mx-auto lg:w-[65%] mt-4 lg:mt-0 w-full 2xl:w-[856px] ">
              <div className="bg-[#ffffffb5]  rounded-lg py-6 px-6">
                <p className="text-[22px] text-center text-[#37085B] font-semibold font-['Montserrat']">
                  My Account
                </p>

                <div>
                  <div className="flex flex-wrap justify-between items-center mt-8">
                    <div>
                      <p className="text-base text-[#37085B] font-['Montserrat']">
                        My Credits
                      </p>
                      <p className="text-[40px] font-bold text-[#37085B] font-['Montserrat']">
                        ${details && details?.totalCredit && details?.totalCredit?.balance ? details?.totalCredit?.balance.toFixed(2) : ""}
                      </p>
                    </div>
                    <div>
                      {" "}
                      <button
                        className={`${transaction
                          ? "bg-[#37085B] text-white"
                          : "bg-[white] text-[#37085B]"
                          } text-base py-2 border-2 border-solid border-[#37085B] px-8 hover:border-transparent rounded-full`}
                        onClick={() => onTransctionClick()}
                      >
                        Transaction History
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-4 mt-4">
                    <div className="w-full h-[62px] flex justify-center md:flex-none">
                      <button
                        className="bg-[#37085B] w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]"
                        onClick={() => onClickAmout("40")}
                      >
                        <div className="flex items-center justify-center w-full">
                          <img src={buttonPlusSign} alt="buttonPlussing" />
                          <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                            $40
                          </span>
                        </div>
                      </button>
                    </div>

                    <div className="w-full h-[62px] flex justify-center md:flex-none">
                      <button
                        className="bg-[#37085B] w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]"
                        onClick={() => onClickAmout("60")}
                      >
                        <div className="flex items-center justify-center w-full">
                          <img src={buttonPlusSign} alt="buttonPlussing" />
                          <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                            $60
                          </span>
                        </div>
                      </button>
                    </div>

                    <div className="w-full h-[62px] flex justify-center md:flex-none">
                      <button
                        className="bg-[#37085B] w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]"
                        onClick={() => onClickAmout("100")}
                      >
                        <div className="flex items-center justify-center w-full">
                          <img src={buttonPlusSign} alt="buttonPlussing" />
                          <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                            $100
                          </span>
                        </div>
                      </button>
                    </div>

                    <div className="w-full h-[62px] flex justify-center md:flex-none">
                      <button
                        className="bg-[#37085B] w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]"
                        onClick={() => onClickAmout("other")}
                      >
                        <div className="flex items-center justify-center w-full">
                          <img src={buttonPlusSign} alt="buttonPlussing" />
                          <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                            Other
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-base text-[#37085B] font-['Montserrat']">
                    My Cards
                  </p>

                  {cards.map((card: any) => {
                    const number = card?.cardNo.substr(card?.cardNo.length - 4);
                    return (
                      <div className="flex items-center mt-2">
                        <p className="bg-[#37085B] w-full text-white font-['Montserrat'] text-base md:w-[47%] rounded text-left px-4 py-2 focus:outline-none">
                          {card?.cardType} * {number}
                        </p>

                        <img src={deleteIcon} alt="delete" className="ml-3" onClick={() => onCardDeleteClick(card?.id)} />
                      </div>
                    );
                  })}

                  <button
                    className="bg-[#37085B] opacity-50 mt-2 w-full text-white font-['Montserrat'] text-base md:w-[47%] rounded text-left px-4 py-2 focus:outline-none"
                    onClick={() => setShowAddNewCard(true)}
                  >
                    Add a New Card
                  </button>
                </div>
              </div>

              <div
                className={`${transaction ? "block" : "hidden"
                  } bg-[#ffffffb5] text-[#37085B] font-['Montserrat'] mt-4 rounded-lg py-6 px-6`}
              >
                <div className="flex justify-between items-center text-[22px] text-[#37085B] font-semibold ">
                  <div>Transaction Activity</div>

                  <div onClick={() => onCancelTransctionHistory()}>
                    <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                  </div>
                </div>

                <div className="mt-2 h-[calc(100vh_-_245px)] overflow-y-auto smallScroll pr-2">

                  <InfiniteScroll
                    pageStart={1}
                    initialLoad={false}
                    loadMore={getMoreTransctionDetails}
                    hasMore={!noMoreData}
                    useWindow={false}
                  >
                    <div className="grid xl:grid-cols-2 gap-2 mt-2">
                      {activity.map((res: any) => {
                        let amount;
                        if (res?.total.toString().includes("-")) {
                          amount = true;
                        } else {
                          amount = false;
                        }

                        return (
                          <div className="flex justify-between items-center px-4 bg-[#F0F0F0] h-[64px] rounded-lg">
                            <div className="w-2/4">
                              <p className="text-[11px]">
                                {moment(res?.createdDate).format("l")}
                              </p>
                              <p className="text-[14px] font-bold">
                                {res?.title}
                              </p>
                            </div>

                            <div
                              className={`${amount ? "text-[#E83D26]" : "text-[#47B514]"
                                } text-2xl font-semibold`}
                            >
                              {amount ? <span></span> : <span>+</span>}
                              {res?.total.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                </div>

              </div>

              {!blockedUserListExpand &&
                <div className="bg-[#ffffffb5] text-primary font-bold flex justify-center my-4 cursor-pointer rounded-lg py-6 px-6" onClick={() => setBlockedUserListExpand(true)}>
                  See My Blocked Users
                </div>
              }

              {blockedUserListExpand &&
                <div
                  ref={blockedUserListRef}
                  className={`bg-[#ffffffb5] text-[#37085B] font-['Montserrat'] my-4 rounded-lg py-6 px-6`}
                >
                  <div className="flex justify-between items-center text-[22px] text-[#37085B] font-semibold ">
                    <div>My Blocked Users</div>

                    <div onClick={() => setBlockedUserListExpand(false)}>
                      <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                    </div>
                  </div>

                  <div className="relative w-full h-full">
                    {blockedUserListLoader &&
                      <>
                        <div className="absolute bg-white flex justify-center items-center h-full w-full z-10">
                          <CircularProgress style={{ color: "#37085B" }} thickness={7} />
                        </div>
                      </>
                    }

                    {!blockedUserList?.length ?
                      <div className="mt-2 h-[calc(100vh_-_300px)] overflow-y-auto smallScroll pr-2">
                        <InfiniteScroll
                          pageStart={pageStart}
                          initialLoad={false}
                          loadMore={getMoreBlockedUserList}
                          hasMore={!noMoreBlockedData}
                          useWindow={false}
                        >
                          <div className="grid xl:grid-cols-2 gap-2 mt-2">
                            {blockedUserList?.map((res: any) => {
                              return (
                                <div className="flex justify-between items-center px-4 bg-[#F0F0F0] h-[64px] rounded-lg">
                                  <div className="flex w-2/4 items-center">
                                    <div className="w-[40px] h-[40px] min-w-[40px] relative min-h-[40px]">
                                      <img
                                        src={res?.profileImageUrl}
                                        className="w-full h-full rounded-full"
                                        alt=""
                                      />
                                    </div>

                                    <p className="text-primary text-lg font-semibold ml-3">
                                      {res?.username}
                                    </p>

                                  </div>

                                  <div
                                    className={`text-2xl font-semibold`}
                                  >
                                    <button
                                      className={`bg-[white] text-[#37085B] text-base py-2 border-2 border-solid border-[#37085B] px-4 hover:border-transparent hover:bg-primary hover:text-white rounded-full`}
                                      onClick={() => onUnblockUserClick(res?.id)}
                                    >
                                      Unblock User
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </InfiniteScroll>


                      </div>
                      :
                      <div className="bg-[#ffffffb5] p-4 text-primary font-bold flex cursor-pointer rounded-lg h-full w-full items-center justify-center">
                        No Blocked User Found.
                      </div>
                    }
                  </div>

                </div>
              }

            </div>

          </div>
          {changePassword && <ChangePassword cancel={onCancleModal} />}
          {showAddNewCard && (
            <AddNewCard
              cancel={onCancleAddNewCardModal}
              getCardDetails={getCardDetails}
            />
          )}

          {topUp && (
            <TopUpModal
              onCancel={onTopUpCancle}
              onSuccess={onTopUpCancle}
              amount={amout}
              insufficientCredits={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default connect()(UserProfile);

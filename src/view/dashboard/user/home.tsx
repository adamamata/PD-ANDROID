import React, { useState, useEffect, useRef, useCallback } from "react";
import heroImage from "../../../assets/images/heroImage.png";
import { useDispatch, useSelector } from "react-redux";
import { getProfileData } from "../../../services/authService";
import { connect } from "react-redux";
import GiftSent from "./giftSent";
import Header from "../commons/header";
import SendGift from "./sendGift";
import Footer from "../../../component/footer";
import {
  set_profile,
  auth_details,
  set_Chat_Count,
  set_Total_Credit,
} from "../../../reducer/auth";
import RctPageLoader from "../../../component/RctPageLoader";
import {
  getuserData,
  getUnReadAlldata,
  SendGiftData,
  getSPProfileList,
  putFavorites,
  postSelectUser,
  getUserCategories,
  getTotalCredit,
  updateClientStatus,
} from "../../../services/homeService";
import { useNavigate } from "react-router-dom";
import TopUpModal from "./topUpModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOCALSTORE } from "../../../constant/default";
import twoWayVideo from "../../../assets/images/twoWayVideo.svg";
import { reset_home_scroll_position, homePageData, set_home_scroll_position, set_user_home_persist_page_no, set_user_home_persist_page_data } from "../../../reducer/homePageSlice";
import { CircularProgress } from "@mui/material";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from '@fortawesome/fontawesome-free-regular';
import { faAngleDown, faAngleUp, faHeart, faMagnifyingGlass, faMessage, faPhone, faTty, faVideo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const Home: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const login = useSelector(auth_details);
  const { homePageScrollPosition, userHomePersistPageNo, userHomePagePersistData } = useSelector(homePageData);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientsDetails, setClientsDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [topUp, setTopUP] = useState(false);
  const [giftSent, setGiftSent] = useState(false);
  const [chatData, setChatData] = useState<any>();
  const loginId = localStorage.getItem(LOCALSTORE.id);
  const [insufficientCredits, setInsufficientCredits] =
    useState<boolean>(false);
  const [categories, setcategories] = useState<any>([]);
  const [filterBody, setFilterBody] = useState<any>({
    // sort: [{ selector: "created", desc: true }],
    requireTotalCount: true,
  });
  const [page, setPage] = useState<number>(1);
  const restorationRef = React.useRef<null | HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>();
  const [cardLoading, setCardLoading] = useState(false);

  const [searchText, setSearchText] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<any>({
    name: null,
    index: null,
    isDropDownOpen: false,
    subcategories: null
  })
  const [refetchClientData, setRefetchClientData] = useState(false);
  const [hideSeeMoreButton, setHideSeeMoreButton] = useState(false);
  const [totalNumberOfClients, setTotalNumberOfClients] = useState(0)

  useEffect(() => {
    if (totalNumberOfClients && clientsDetails && totalNumberOfClients === clientsDetails?.length) {
      setHideSeeMoreButton(true);
    }
  }, [clientsDetails, totalNumberOfClients])

  // const [y, setY] = useState(window.scrollY);

  //code for close dropdown on scroll
  // const handleNavigation = useCallback((e: any) => {
  //   const window = e.currentTarget;
  //   if ((y + 500) < window.scrollY) {
  //     // setSelectedCategory({ ...selectedCategory, index: null, isDropdow })
  //     setSelectedCategory({ ...selectedCategory, isDropDownOpen: false });
  //     setTimeout(() => {
  //       setSelectedCategory({ ...selectedCategory, index: null, isDropDownOpen: false });
  //       // setRefetchClientData(true)
  //     }, 1200);
  //   }
  //   setY(window.scrollY);
  // }, [y]
  // );

  useEffect(() => {
    const onBeforeUnload = (ev: any) => {
      window.scrollTo(0, 0)
      persistDispatch(set_user_home_persist_page_no(null))
      persistDispatch(set_user_home_persist_page_data(null))
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const handleUpdateClientStatus = () => {
    const { dispatch } = props;

    const includeIds = clientsDetails.map((user: any) => {
      return user.id
    })

    const body = {
      ids: includeIds
    }

    dispatch(updateClientStatus(body)).then((res: any) => {
      Object.freeze(clientsDetails)
      const copyClientDetails = [...clientsDetails]

      const arr = copyClientDetails.map((client) => {
        Object.freeze(client);
        const obj = { ...client }
        res.data.map((result: any) => {
          if (result?.userId === client?.id) {
            obj.status = result.status
          }
        })

        return obj
      })

      setClientsDetails(arr)
    })
  }

  useEffect(() => {
    let interval = setInterval(() => {
      handleUpdateClientStatus()
    }, 180000);
    return () => {
      clearInterval(interval);
    };
  }, [clientsDetails]);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      if (window?.location?.pathname === "/user/home") {
        navigate("/user/home");
      }
    });

    window.addEventListener("scroll", (e) => {
      // handleNavigation(e)
    })

    return (() => {
      window.removeEventListener("popstate", () => {
        if (window?.location?.pathname === "/user/home") {
          navigate("/user/home");
        }
      })

      window.removeEventListener("scroll", (e) => {
        // handleNavigation(e)
      })
    })
  }, []);

  useEffect(() => {
    if (clientsDetails.length) {
      persistDispatch(set_user_home_persist_page_data(clientsDetails))
    }

    if (page > 1) {
      persistDispatch(set_user_home_persist_page_no(page))
    }
  }, [page])

  useEffect(() => {
    if (homePageScrollPosition && restorationRef && restorationRef?.current && clientsDetails?.length) {
      restorationRef?.current?.scrollIntoView({ behavior: 'instant' as any, block: 'center', inline: 'start' })
      persistDispatch(reset_home_scroll_position())
    }
  }, [homePageScrollPosition, restorationRef, clientsDetails]);

  const myPromise = new Promise((resolve, reject) => {
    if (userHomePersistPageNo && userHomePagePersistData) {
      resolve({ userData: userHomePagePersistData, pageNo: userHomePersistPageNo })
    } else {
      reject("")
    }
  });

  useEffect(() => {
    myPromise.then((res: any) => {
      setClientsDetails(res.userData)
      setPage(res?.pageNo)
    }).catch(() => {
      getFriendDetails();
    })
  }, [])

  useEffect(() => {
    if (searchText !== null || refetchClientData) {
      setClientsDetails([])
      getFriendDetails(true)
    }
  }, [searchText, refetchClientData])

  useEffect(() => {
    getAllUser();
    getUserProfileDetails();
    getCategoriesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login?.login?.id, props]);

  const getAllUser = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getProfileData(loginId))
      .then((res: any) => {
        dispatch(set_profile(res.data));
        dispatch(getTotalCredit(res.data.id)).then((credit: any) => {
          setLoading(false);
          dispatch(set_Total_Credit(credit?.data))
        }).catch(() => {
          setLoading(false)
        })
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const getCategoriesList = () => {
    setLoading(true)
    const { dispatch } = props;
    dispatch(getUserCategories(true))
      .then((res: any) => {
        setcategories(res?.data);
        setLoading(false)
      })
      .catch((err: any) => {
        setLoading(false)
      });
  };

  const getFriendDetails = (resetClientsDetails?: boolean) => {
    if (abortControllerRef.current) {
      return;
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setCardLoading(true);

    if (resetClientsDetails) {
      setClientsDetails([])
    }
    const { dispatch } = props;

    const excludeIds = clientsDetails.map((user: any) => {
      return user.id
    })

    const body = {
      ...filterBody,
      pageNo: resetClientsDetails ? 1 : page ? page : 1,
      pageSize: 24,
      searchText: searchText ? searchText : '',
      categories2: selectedCategory?.name ? [
        { name: selectedCategory?.name, subcategories: [selectedCategory?.subcategories ?? ''] }
      ] : []
    }

    if (!resetClientsDetails) {
      body.excludeIds = excludeIds
    }

    dispatch(getuserData(body))
      .then((res: any) => {
        setCardLoading(false);
        setLoading(false);
        setTotalNumberOfClients(res?.data?.totalCount)
        if (res.data.data.length === 0 && !resetClientsDetails) {
        } else if (resetClientsDetails && res.data.data.length === 0) {
          setClientsDetails([]);
          setPage(1);
        } else if (resetClientsDetails && res.data.data.length !== 0) {
          setClientsDetails(res.data.data);
          setPage(2);
        } else {
          setClientsDetails((oldArray: any) => [...oldArray, ...res.data.data]);
          setPage(page + 1);
        }
      })
      .catch((err: any) => {
        toast.error(err.data.message);
        setCardLoading(false);
        setLoading(false);
      }).finally(() => {
        abortControllerRef.current = null;
        setRefetchClientData(false)
      })
  };

  const onRedirectProfile = (data: any) => {
    persistDispatch(set_home_scroll_position(data?.id))
    navigate(`/user/profileDetails/${data?.uniqueUsername}`);
  };

  const onCloseGiftSent = () => {
    setGiftSent(false);
  };

  const onTopUpCancel = () => {
    setTopUP(false);
  };

  const onTopCredit = () => {
    setInsufficientCredits(false);
    setGiftShow(true);
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
  useEffect(() => {
    getunreadCount();
  }, []);

  const giftClose = () => {
    setGiftShow(false);
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
        dispatch(getTotalCredit(login?.totalCredit?.accountId)).then((credit: any) => {
          setLoading(false);
          dispatch(set_Total_Credit(credit?.data))
        }).catch(() => {
          setLoading(false)
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

  const getUserProfileDetails = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getSPProfileList())
      .then((res: any) => {
        const userList: any = [];
        res.data.map((item: any) => {
          const obj: any = {
            name: item.username,
            id: item.id,
          };
          userList.push(obj);
        });
        dispatch(postSelectUser(userList[0].id))
          .then((res: any) => {
            if (res?.data?.data) setClientsDetails(res?.data?.data);
            setLoading(false);
          })
          .catch((err: any) => {
            console.log("err");
          });
      })
      .catch((err: any) => {
        console.log("dfdsfds", err);
      });
  };

  const onGotoFavorite = (data: any, value: any, e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = props;
    setLoading(true);
    dispatch(putFavorites(data?.id, value))
      .then((res: any) => {
        if (res.data.isSuccess) {
          if (value === true) {
            toast.success("Profile Added To Favorites Successful", {
              theme: "colored",
              autoClose: 5000,
            });
          }

          if (value === false) {
            toast.success("Profile Remove From Favorites Successful", {
              theme: "colored",
              autoClose: 5000,
            });
          }

          Object.freeze(clientsDetails)
          const copyClientDetails = [...clientsDetails]

          const arr = copyClientDetails.map((client) => {
            Object.freeze(client);
            const obj = { ...client }

            if (data?.id === client?.id) {
              obj.isFavorite = !obj.isFavorite
            }

            return obj
          })

          setClientsDetails(arr)
          persistDispatch(set_user_home_persist_page_data(arr))
          setLoading(false);
        }
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const ongoTocategoryAll = () => {
    setSelectedCategory({
      name: null,
      index: null,
      isDropDownOpen: false,
      subcategories: null
    })
    setRefetchClientData(true)
  };

  const onChange = (e: any) => {
    setSearchText(e.target.value)
  };

  const debouncedOnChange = debounce(onChange, 1000);

  useEffect(() => {
    if (categories.length) {
      const scroller: any = document.querySelector(".scroll-wrap");
      const dropDown: any = document.querySelectorAll(".dropdown");

      const checkScroll = () => {
        for (let i = 0; i < dropDown.length; i++) {
          dropDown[i].style.transform = "translateX(-" + scroller.scrollLeft + "px)";
        }
      };

      scroller.addEventListener("scroll", checkScroll);

      return () => {
        scroller.removeEventListener("scroll", checkScroll);
      };
    }
  }, [categories]);

  const onCategoryClick = (index: any, subcategories: any) => {
    if (!subcategories?.length) {
      setSelectedCategory({ name: categories[index].name, index: index, isDropDownOpen: false, subcategories: null });
      setRefetchClientData(true)
    } else if (selectedCategory?.name !== categories[index].name) {
      setSelectedCategory({ name: categories[index].name, index: index, isDropDownOpen: false, subcategories: null });

      setTimeout(() => {
        setSelectedCategory({ name: categories[index].name, index: index, isDropDownOpen: true, subcategories: null });
        setRefetchClientData(true)
      }, 10)
    } else {
      if (!selectedCategory?.isDropDownOpen) {
        setSelectedCategory({ ...selectedCategory, name: categories[index].name, index: index, isDropDownOpen: false });
        setTimeout(() => {
          setSelectedCategory({ ...selectedCategory, name: categories[index].name, index: index, isDropDownOpen: true });
        }, 10)

      } else {
        setSelectedCategory({ ...selectedCategory, index: index, isDropDownOpen: false, name: categories[index].name });
        setTimeout(() => {
          setSelectedCategory({ ...selectedCategory, index: null, name: categories[index].name, isDropDownOpen: false });
        }, 10);
      }
    }
  }

  const onSubCatClick = (e: any, subCat: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!subCat) {
      setSelectedCategory({ ...selectedCategory, subcategories: null })
    } else {
      setSelectedCategory({ ...selectedCategory, subcategories: subCat })
      setSelectedCategory({ ...selectedCategory, isDropDownOpen: false, subcategories: subCat });
      setTimeout(() => {
        setSelectedCategory({ ...selectedCategory, index: null, isDropDownOpen: false, subcategories: subCat });
      }, 1200);
    }

    setRefetchClientData(true)
  }

  return (
    <>
      {loading && <RctPageLoader />}

      <div className={`bg-[#F8F3FD] min-h-screen`}>
        <Header />
        <div className={`lg:mt-[-70px]`}>
          <img src={heroImage} width="100%" />
        </div>
        <div className="body-section">
          <div className={`min-h-screen px-3 md:px-6`}>
            <div className="w-full mt-6">
              <div className="flex items-center px-6 py-2 rounded-full border-2 border-primary w-full bg-[#F8F3FD]">
                <input
                  className="grow placeholder-primary placeholder-opacity-70 bg-[#F8F3FD] outline-none bottom-0 focus:outline-none text-lg font-semibold text-primary"
                  placeholder="Search here..."
                  onChange={debouncedOnChange}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="pl-2 text-primary text-lg" />
              </div>
            </div>

            {searchQuery === "" && (
              <div className="mt-6 antialiased min-h-screen text-gray-900 max-h-[60%] ">
                <div className="">
                  <div id="scroll-wrap" className="scroll-wrap overflow-auto flex py-2 smallScroll">
                    {categories?.length ?
                      <>
                        <div className={`cursor-pointer text-md min-w-fit px-6 border-2 border-primary flex items-center font-semibold place-content-center py-4 rounded-full text-[14px] w-44 mr-3 ${!selectedCategory?.name ? "bg-primary text-white" : "bg-transparent text-primary"}`} onClick={() => ongoTocategoryAll()}>
                          All categories
                        </div>

                        {categories.map((category: any, index: any) => (
                          <>
                            <div className={`group cursor-pointer min-w-fit border-2 border-primary flex font-semibold place-content-center py-4 rounded-full text-[14px] w-44 mr-3 ${selectedCategory?.name === category?.name ? 'bg-primary' : 'bg-transparent'}`} onClick={() => onCategoryClick(index, category?.subcategories)}>
                              <div className={`text-primary font-semibold px-6 text-md flex items-center ${selectedCategory?.name === category?.name ? 'text-white' : 'text-primary'}`}>
                                <div>{category.name}</div>
                                {category?.subcategories?.length ?
                                  <div><FontAwesomeIcon icon={(selectedCategory?.index === index && selectedCategory?.isDropDownOpen) ? faAngleUp : faAngleDown} className="mt-1 ml-2 font-bold text-lg" /></div>
                                  : null
                                }
                              </div>

                              <div className={`px-6 shadow-2xl py-3 w-max rounded-lg text-primary mt-12 bg-white dropdown transition-opacity duration-900 absolute z-[999] ease-linear ${selectedCategory?.isDropDownOpen ? 'opacity-1 ' : 'opacity-0'} ${selectedCategory?.index === index ? 'block' : 'hidden'}`}>
                                <div className={`text-center w-full mb-3 ${!selectedCategory?.subcategories ? 'font-extrabold' : ''}`} onClick={(e) => onSubCatClick(e, null)}>All</div>
                                {category?.subcategories?.map((subCat: any) => {
                                  return (
                                    <>
                                      <div className={`text-center w-full mb-3 ${selectedCategory?.subcategories === subCat ? 'font-extrabold' : ''}`} onClick={(e) => onSubCatClick(e, subCat)}>{subCat}</div>
                                    </>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                      : null
                    }
                  </div>

                  {(clientsDetails.length === 0 && !loading && !cardLoading) ? (
                    <div className="text-primary flex justify-center px-4 font-bold text-2xl mt-8 font-[Montserrat]">
                      No client found.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-x-4 gap-y-8 2xl:gap-x-4 2xl:gap-y-8 my-4">
                        <>
                          {clientsDetails.map((client: any) => {
                            return (
                              <div className="w-full "
                                style={{ scrollMarginTop: "30px" }}
                                onClick={() => onRedirectProfile(client)}
                                ref={homePageScrollPosition === client?.id ? restorationRef : null}
                              >
                                <div className="w-full max-w-[360px] h-[450px] mx-auto rounded-md shadow-lg bg-white cursor-pointer transition-all duration-900 ease-linear">
                                  {client.profileImageUrl === null ||
                                    client.profileImageUrl === "" ? (
                                    <div className="relative h-[320px] overflow-hidden">
                                      <img
                                        className="pt-[82px] pl-[70px]"
                                        src={client.profileImageUrl}
                                        alt="product"
                                      />
                                    </div>
                                  ) : (
                                    <div className="relative h-[320px] overflow-hidden">
                                      <img
                                        className="w-full min-h-[320px] rounded-t-md"
                                        src={client.profileImageUrl}
                                        alt="client profile"
                                      />
                                      <div className="absolute cursor-pointer right-3 top-3">
                                        {client.isFavorite ? (
                                          <FontAwesomeIcon icon={faHeart} className="text-3xl text-primary" onClick={(e) =>
                                            onGotoFavorite(client, true, e)
                                          } />
                                        ) : (
                                          <FontAwesomeIcon icon={regularHeart as IconProp} className="text-3xl text-white" onClick={(e) =>
                                            onGotoFavorite(client, true, e)
                                          } />
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div
                                    className="px-4 py-2"
                                  // onClick={() => onRedirectProfile(client)}
                                  >
                                    <div className="text-base font-[Montserrat] font-semibold flex items-center">
                                      <span
                                        className={`w-[12px] h-[12px] rounded-full ${client.status === "Available"
                                          ? "bg-[#20B514]"
                                          : client.status === "Busy" ||
                                            client.status === "DoNotDisturb"
                                            ? "bg-[#E99312]"
                                            : "bg-[#EBEBEB]"
                                          } mr-2`}
                                      ></span>
                                      <p className="max-w-[90%] line-clamp-1 break-all">{client.username}</p>
                                    </div>
                                    <p
                                      className="text-[#000000] font-[Montserrat] text-[14px] overflow-hidden min-h-[45px]"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                      }}
                                    >
                                      {client.description}
                                    </p>
                                    <div>Services</div>
                                    <div className="grid grid-cols-5 gap-2">
                                      <div className="flex items-center">
                                        <FontAwesomeIcon icon={faMessage} className="text-primary" />
                                        <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                          $
                                          {
                                            client?.communication?.shortMessageUnitPrice.toFixed(2) ?? 0
                                          }
                                        </p>
                                      </div>

                                      {client?.enablePhoneCall &&
                                        <div className="flex items-center">
                                          <FontAwesomeIcon icon={faTty} className="text-primary" />
                                          <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                            $
                                            {
                                              client?.communication?.phoneCallUnitPrice.toFixed(2) ?? 0
                                            }
                                          </p>
                                        </div>
                                      }

                                      {client?.enableAudioCall &&
                                        <div className="flex items-center">
                                          <FontAwesomeIcon icon={faPhone} className="text-primary" />
                                          <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                            $
                                            {
                                              client?.communication?.audioCallUnitPrice.toFixed(2) ?? 0
                                            }
                                          </p>
                                        </div>
                                      }


                                      {client?.enableOneWayVideoCall &&
                                        <div className="flex items-center">
                                          <FontAwesomeIcon icon={faVideo} className="text-primary" />

                                          <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                            $
                                            {
                                              client?.communication?.videoCallOneWayUnitPrice.toFixed(2) ?? 0
                                            }
                                          </p>
                                        </div>
                                      }

                                      {client?.enableTwoWayVideoCall &&
                                        <div className="flex items-center">
                                          <img
                                            src={twoWayVideo}
                                            className="w-[18px] h-[18px]"
                                            alt="videochat"
                                          />
                                          <p className="ml-1 text-[#2F2F2F] font-bold text-[12px]">
                                            $
                                            {
                                              client?.communication?.videoCallTwoWayUnitPrice.toFixed(2) ?? 0
                                            }
                                          </p>
                                        </div>
                                      }

                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      </div>

                      {(!hideSeeMoreButton && !cardLoading) ?
                        <div className="w-full flex justify-center">
                          <div className={`cursor-pointer text-md min-w-fit mb-3 px-6 border-2 border-primary flex items-center font-semibold place-content-center py-4 rounded-full text-[14px] w-44 mr-3 bg-transparent text-primary`} onClick={() => getFriendDetails()}>
                            See more
                          </div>
                        </div>
                        : null
                      }

                      {(cardLoading && !loading) ?
                        <div className="w-full flex justify-center py-2">
                          <CircularProgress style={{ color: "#37085B" }} thickness={7} />
                        </div>
                        : null
                      }

                    </>
                  )}
                </div>
              </div>
            )}
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
          {topUp ? (
            <TopUpModal
              onCancel={onTopUpCancel}
              onSuccess={onTopUpCancel}
              amount=""
              insufficientCredits={false}
            />
          ) : (
            ""
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default connect()(Home);

import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import downArrow from "../../../assets/images/downArrow.png";
import navSearch from "../../../assets/images/navSearch.png";
import { auth_details, set_Chat_Count, set_Inbox_Count, set_Show_Chat } from "../../../reducer/auth";
import { LOCALSTORE } from "../../../constant/default";
import { reset_States } from "../../../reducer/auth";
import { UserRoleEnum } from "../../../enums/enum";
import { useNavigate, useLocation } from "react-router-dom";
import TopUpModal from "../../../view/dashboard/user/topUpModal";
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import { enableDisableDoNotDisturb, getUnReadAlldata, getUnreadIndex, putHeartbeat } from "../../../services/homeService";
import { logoutuser } from "../../../services/authService";
import { reset_azure_communication_data } from "../../../reducer/chatDataSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Switch from "../../../component/common/ui/Switch";
import { dndDetails, setDndEnabled } from "../../../reducer/dndDataSlice";

export const disableScrollOnWindow = () => {
  const html: any = document.querySelector("html");
  html.style.overflow = "hidden";
};

export const enableScrollOnWindow = () => {
  const html: any = document.querySelector("html");
  html.style.overflow = "";
};

const Header: React.FC<any> = (props: any) => {
  const [dropDown, setDropdown] = useState(false);
  const data = useSelector(auth_details);
  const [userDetails, setUserDetails] = useState(data?.user_profile);
  const [accountData, setAccountData] = useState(data?.accountData);
  const [totalCredit, setTotalCredit] = useState(data?.totalCredit);
  const [navbar, setNavbar] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [idleTimes, setIdleTimes] = useState(0);
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const location = useLocation();
  const type = location.pathname.split("/");
  const [topUp, setTopUP] = useState(false);
  const [isDNDChecked, setDNDIsChecked] = useState<boolean>(false);
  const { isDndEnable } = useSelector(dndDetails)
  let interval: any

  useEffect(() => {
    setDNDIsChecked(isDndEnable)
  }, [isDndEnable])

  useEffect(() => {
    if (navbar) {
      disableScrollOnWindow();
    } else {
      enableScrollOnWindow();
    }
  }, [navbar]);

  const getunreadCount = () => {
    const { dispatch } = props;
    dispatch(getUnReadAlldata())
      .then((res: any) => {
        // setCount(res?.data?.data);
        dispatch(set_Chat_Count(res?.data?.data));
      })
      .catch((err: any) => { });
  };

  const getunreadInbox = () => {
    const { dispatch } = props;
    dispatch(getUnreadIndex())
      .then((res: any) => {
        dispatch(set_Inbox_Count(res?.data?.data));
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    putHeartbeatData();
    getunreadCount();
    getunreadInbox();
  }, [])

  useEffect(() => {
    setUserDetails(data?.user_profile);
  }, [data?.user_profile])

  useEffect(() => {
    setAccountData(data?.accountData);
  }, [data?.accountData])

  useEffect(() => {
    setTotalCredit(data?.totalCredit);
  }, [data?.totalCredit])

  useEffect(() => {
    interval = setInterval(() => {
      putHeartbeatData();
      timerIncrement();
    }, 60000);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", function (e) {
      setIdleTime(0);
    });

    document.addEventListener("keypress", function (e) {
      setIdleTime(0);
    });
  }, []);

  function timerIncrement() {
    let idles = parseInt(localStorage.getItem('IdleTimes') || '0');
    if (!idles) { idles = 0; }
    // Stop interval if idle for 6 hours
    if (idles >= 35) {
      clearInterval(interval);
      return;
    }

    let idle = 0;
    setIdleTime(i => { idle = i + 1; return idle; });
    // Reload page after 10 minutes of inactivity
    if (idle > 10) { // 10 minutes
      window.location.reload();
      return;
    }

    // increase idle times upto 6 hours
    localStorage.setItem('IdleTimes', `${idles + 1}`);
  }

  const putHeartbeatData = () => {
    putHeartbeat()
      .then((res: any) => {
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const logoutData = () => {
    const { dispatch } = props;
    dispatch(logoutuser())
      .then((res: any) => {
        clearInterval(interval);
        const userRole = localStorage.getItem(LOCALSTORE.role) as any;
        window.localStorage.clear();
        dispatch(reset_States(null));
        persistDispatch(reset_azure_communication_data())

        if (userRole == UserRoleEnum.ServiceProvider) {
          window.location.href = "/login";
        } else {
          window.location.href = "/login";
        }
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const onTopUpCancel = () => {
    setTopUP(false);
  };

  const onGopageChat = () => {
    const { dispatch } = props;
    dispatch(set_Show_Chat(false));
    const data: any = null;
    localStorage.setItem("indexData", data);
    navigate(`/${type && type[1]}/chat`);
  };

  const onGopageHome = () => {
    navigate(`/${type && type[1]}/home`);
  };

  const onGopageProfile = () => {
    navigate(`/${type && type[1]}/profile`);
  };

  const onGopageFavorite = () => {
    navigate(`/${type && type[1]}/favorites`);
  };

  const onGopageinbox = () => {
    navigate(`/${type && type[1]}/inbox`);
  };

  const onDNDSwitchChange = () => {
    const { dispatch } = props
    dispatch(enableDisableDoNotDisturb(!isDNDChecked)).then(() => {
      setDNDIsChecked(!isDNDChecked)
      dispatch(setDndEnabled(!isDNDChecked))
    }).catch((err: any) => {
      toast.error("Something Went Wrong.....!!")
    })
  }

  return (
    <>
      <div className="relative lg:p-6 z-30">
        <nav className="sticky flex flex-wrap items-center justify-between p-4 rounded-full lg:bg-white">
          <div className="flex justify-between lg:w-auto w-full pl-6 pr-2">
            <div className="flex w-full lg:w-auto justify-center lg:mr-16 items-center">
              {navbar && (
                <div className="block lg:hidden mr-4">
                  <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} onClick={() => setNavbar(!navbar)} />
                </div>
              )}

              <img
                src={phoneDarlingsLogo}
                alt="logo"
                // className="mx-auto w-[183px] h-[26px]"
                className="mx-auto cursor-pointer"
                onClick={() => navigate(`/${type && type[1]}/home`)}
              />
            </div>

            {!navbar && (
              <div className="block lg:hidden ">
                <button
                  onClick={() => setNavbar(!navbar)}
                  id="nav"
                  className="flex items-center px-3 py-2 border-2 rounded text-primary border-primary hover:text-primary-700 hover:border-primary-700"
                >
                  <svg
                    className="fill-current h-3 w-3"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div
            className={`${navbar ? "block" : "hidden"
              } left-0 lg:relative top-[80%] py-8 lg:py-0 bg-[#F8F3FD] lg:bg-white menu w-full h-[100dvh] lg:h-auto lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8`}
          >
            <div className="lg:flex text-md bg:white font-bold text-primary-700 lg:flex-grow">
              <ul className="items-center space-y-8 lg:flex lg:space-x-6 lg:space-y-0">
                <li
                  className={`text-primary cursor-pointer text-lg ${location?.pathname === `/${type && type[1]}/home`
                    ? "font-bold"
                    : "font-normal"
                    }`}
                  onClick={() => onGopageHome()}
                >
                  Home
                </li>
                <li
                  className={`text-primary cursor-pointer text-lg ${location?.pathname === `/${type && type[1]}/chat`
                    ? "font-bold"
                    : "font-normal"
                    }`}
                  onClick={() => onGopageChat()}
                >
                  {`Chat ${data?.chatCount > 0 ? `(${data?.chatCount})` : ""} `}
                </li>
                {type[1] === "user" && (
                  <li
                    className={`text-primary cursor-pointer text-lg ${location?.pathname === `/${type && type[1]}/favorites`
                      ? "font-bold"
                      : "font-normal"
                      }`}
                    onClick={() => onGopageFavorite()}
                  >
                    Favorite
                  </li>
                )}
                <li
                  className={`text-primary cursor-pointer text-lg ${location?.pathname === `/${type && type[1]}/inbox`
                    ? "font-bold"
                    : "font-normal"
                    }`}
                  onClick={() => onGopageinbox()}
                >
                  {`Inbox ${data?.inboxCount > 0 ? `(${data?.inboxCount})` : ""} `}
                </li>
                {type[1] === "user" && (
                  <li
                    onClick={() => setTopUP(true)}
                    className="text-primary text-lg font-normal cursor-pointer"
                  >
                    Top Up
                  </li>
                )}
              </ul>
              {/* <div
                className={`${
                  navbar ? "my-9" : ""
                } lg:ml-9 lg:pl-7 flex items-center text-primary text-md font-normal`}
              >
                <img src={navSearch} className="" />
                <p className="ml-2">Search</p>
              </div> */}
            </div>

            <div className="lg:flex items-center">
              <div className="flex mt-8 lg:mt-0 items-center">
                <Switch
                  isChecked={isDNDChecked}
                  checkedBorder="#37085B"
                  unCheckedBorder="#37085B"
                  checkedRound="#37085B"
                  unCheckedRound="#37085B"
                  checkedBackground="#fffff"
                  unCheckedBackground="#fffff"
                  onSwitchChange={onDNDSwitchChange}
                />

                <div>
                  <p className="font-medium text-primary">Do Not Disturb</p>
                </div>
              </div>

              <div className="hidden lg:block mr-8 ml-8 cursor-pointer" onClick={logoutData}>
                <p className="font-medium text-primary">Sign Out</p>
              </div>

              <div
                className="relative flex items-center mt-8 lg:mt-0"
                onClick={() => setDropdown(!dropDown)}
              >
                <FontAwesomeIcon icon={faUser} className="text-primary" />
                <p className="ml-2 text-primary text-lg font-[Montserrat] cursor-pointer">
                  {type[1] === "user" ?
                    `${userDetails && userDetails.username ? userDetails.username : ""} ${totalCredit && totalCredit.balance !== undefined ? `($${totalCredit.balance.toFixed(2)})` : ""}`
                    :
                    `${accountData && accountData.firstName ? accountData.firstName : ""} ${totalCredit && totalCredit.balance !== undefined ? `($${totalCredit.balance.toFixed(2)})` : ""}`
                  }

                </p>
                <button className="text-primary ml-4">
                  <img src={downArrow} />
                </button>
                <div
                  className={`absolute lg:right-0 top-6 py-2 mt-2 bg-white bg-gray-100 rounded-md shadow-xl w-44 ${dropDown ? "block" : "hidden"
                    }`}
                >
                  <div
                    className="w-[15px] h-[15px] absolute ml-2 sm:ml-0 sm:left-[6px] z-[-1] top-[-5px] bg-white  rotate-[45deg]"
                    id="arrow"
                  ></div>
                  <div>
                    <div
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-400 hover:text-white cursor-pointer"
                      onClick={onGopageProfile}
                    >
                      My Account
                    </div>
                    <div
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-400 hover:text-white cursor-pointer"
                      onClick={logoutData}
                    >
                      Log-out
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
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
    </>
  );
};

export default connect()(Header);

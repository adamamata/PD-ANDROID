import React, { useState, useEffect } from "react";
import phoneDarlingsLogo from "../../assets/images/phoneDarlingsLogo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  set_Show_Chat,
  set_Inbox_Count,
  auth_details,
  set_Chat_Count,
  reset_States,
} from "../../reducer/auth";
import { getUnReadAlldata, getUnreadIndex } from "../../services/homeService";
import { logoutuser } from "../../services/authService";
import TopUpModal from "../../view/dashboard/user/topUpModal";
import { LOCALSTORE } from "../../constant/default";
import { UserRoleEnum } from "../../enums/enum";
import { reset_azure_communication_data } from "../../reducer/chatDataSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const persistDispatch = useDispatch();
  const location = useLocation();

  const [dropDown, setDropdown] = useState(false);
  const [count, setCount] = useState();
  const type = location.pathname.split("/");
  const [topUp, setTopUP] = useState(false);
  const data = useSelector(auth_details);
  let user_details = data?.user_profile;

  useEffect(() => {
    getunreadInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectHome = () => {
    navigate(`/${type && type[1]}/home`);
  };

  const logoutData = () => {
    const userRole = localStorage.getItem(LOCALSTORE.role) as any;
    const { dispatch } = props;
    window.localStorage.clear();
    dispatch(reset_States(null));
    persistDispatch(reset_azure_communication_data())

    if (userRole == UserRoleEnum.ServiceProvider) {
      window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }
  };

  const myProfile = () => {
    navigate(`/${type && type[1]}/profile`);
  };

  const onGotoReuest = () => {
    navigate(`/${type && type[1]}/request`);
  };

  const onGoChat = () => {
    const { dispatch } = props;
    dispatch(set_Show_Chat(false));
    navigate(`/${type && type[1]}/chat`);
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

  const onGotoInbox = () => {
    navigate(`/${type && type[1]}/inbox`);
  };

  const onTopUpCancel = () => {
    setTopUP(false);
  };

  return (
    <div className={` w-full bg-[#ffffff80] bg-center ${props.bgClass}`} style={props.style}>
      <nav className="w-full">
        <div
          className={`justify-between ${props.navbar ? "min-h-screen md:min-h-0" : "h-auto"
            } lg:h-auto px-4 mx-auto lg:max-w-8xl md:items-center md:flex md:px-8}`}
        >
          <div>
            <div className="flex flex-row-reverse items-center justify-between py-3 md:py-5 md:block">
              <div className="w-full md:w-auto">
                <img
                  src={phoneDarlingsLogo}
                  alt="logo"
                  className="mx-auto w-[150px] h-[27px] md:w-[264px] md:h-[47px]"
                />
              </div>
              <div className="md:hidden mr-auto w-fit">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none"
                  onClick={props.onClick}
                >
                  {props.navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pr-8 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${props.navbar ? "block" : "hidden"
                }`}
            >
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                <li
                  className="text-white text-lg hover:text-blue-600"
                  style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  onClick={redirectHome}
                >
                  Home
                </li>
                <li
                  className={`text-white text-lg hover:text-blue-600 ${location?.pathname === `/${type && type[1]}/chat` &&
                    "font-bold"
                    }`}
                  style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  onClick={onGoChat}
                >
                  Chat{" "}
                  {data?.chatCount === 0 || data?.chatCount === undefined
                    ? ""
                    : `(${data?.chatCount})`}
                </li>
                <li
                  className={`text-white text-lg hover:text-blue-600 ${location?.pathname === `/${type && type[1]}/request` &&
                    "font-bold"
                    }`}
                  style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  onClick={onGotoReuest}
                >
                  Requests
                </li>
                <li
                  className={`text-white text-lg hover:text-blue-600 ${location?.pathname === `/${type && type[1]}/inbox` &&
                    "font-bold"
                    }`}
                  style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  onClick={onGotoInbox}
                >
                  Inbox{" "}
                  {data?.inboxCount === 0 || data?.inboxCount === undefined
                    ? ""
                    : `(${data?.inboxCount})`}
                </li>
                {type[1] === "user" ? (
                  <li
                    className="text-white text-lg hover:text-blue-600"
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                    onClick={() => setTopUP(true)}
                  >
                    Top Up
                  </li>
                ) : (
                  ""
                )}
                <li
                  className={`text-white ${props.navbar ? "block" : "hidden"
                    } text-lg hover:text-blue-600`}
                  style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  onClick={myProfile}
                >
                  Profile
                </li>
                <li
                  className={`text-white ${props.navbar ? "block" : "hidden"
                    } text-lg hover:text-blue-600`}
                  style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  onClick={logoutData}
                >
                  Log Out
                </li>
                <li className="text-white text-lg hidden md:block">
                  <div className="relative flex">
                    <FontAwesomeIcon icon={faUser} onClick={() => setDropdown(!dropDown)} />
                    <p
                      className="ml-2 text-lg font-[Montserrat] cursor-pointer"
                      onClick={() => setDropdown(!dropDown)}
                    >
                      {user_details?.username} ($
                      {user_details?.credit && user_details?.credit.toFixed(2)})
                    </p>
                    <div
                      style={{ cursor: "pointer" }}
                      className={`absolute sm:left-0 top-6 py-2 mt-2 bg-white bg-gray-100 rounded-md shadow-xl w-44 ${dropDown ? "block" : "hidden"
                        }`}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        className="w-[15px] h-[15px] absolute ml-2 sm:ml-0 sm:left-[6px] z-[-1] top-[-5px] bg-white  rotate-[45deg]"
                        id="arrow"
                      ></div>
                      <div>
                        <div
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-400 hover:text-white"
                          onClick={myProfile}
                        >
                          My Profile
                        </div>
                        <div
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-400 hover:text-white"
                          onClick={logoutData}
                        >
                          Log-out
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
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
  );
};

export default connect()(Header);

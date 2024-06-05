import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import { useQuery } from "../../../utils/useQueryHoook";

const HeaderHome: React.FC<any> = () => {
  const [navbar, setNavbar] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const refCode = query.get('refcode');

  const redirectLogin = () => {
    navigate(`/login`, {state: {refCode: refCode}});
  };

  const redirectRegister = () => {
    navigate(`/login`, {state: {refCode: refCode}});
  };

  return (
    <>
      <div className="relative lg:p-6">
        <nav className="sticky flex flex-wrap items-center justify-between p-4 rounded-full lg:bg-white">
          <div className="flex justify-between lg:w-auto w-full pl-6 pr-2">
            <div className="flex items-center flex-shrink-0 text-gray-800">
              <img
                src={phoneDarlingsLogo}
                alt="PDlogo"
                className="cursor-pointer"
                onClick={() => navigate("/")}
              ></img>
            </div>
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
          </div>

          <div
            className={`${
              navbar ? "block" : "hidden"
            } left-0 absolute lg:relative top-[80%] py-8 lg:py-0 bg-white menu w-full lg:block lg:flex lg:items-center lg:w-auto lg:px-3 px-8`}
          >
            <div className="flex">
              <div className="relative flex">
              
                <div
                  className="text-lg mr-5 text-[#2F2F2F] cursor-pointer"
                  onClick={redirectLogin}
                >
                  Log In
                </div>
                <div
                  className="text-lg mr-5 text-[#2F2F2F] cursor-pointer"
                  onClick={redirectRegister}
                >
                  Sign Up
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default HeaderHome;

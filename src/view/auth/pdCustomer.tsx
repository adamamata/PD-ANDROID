import React, { useState } from "react";
import phoneDarlingsLogoWhite from "../../assets/images/phoneDarlingsLogoWhite.svg";
import { useNavigate } from "react-router-dom";

function PdCustomer() {
  const [navbar, setNavbar] = useState(false);
  const navigate = useNavigate();

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const onClickAdvisors = () => {
    navigate("/login");
  };

  const onClickHome = () => {
    navigate("/");
  };

  const onClickAdvisoreLink = () => {
    navigate("/pd/advisors");
  };

  return (
    <div>
      {" "}
      <div className=" w-full bg-[#F8F3FD]-to-br from-[#2E0689E5] to-[#F4B98FE5] bg-center md:bg-[image:url('./assets/images/bgElement.svg')] bg-no-repeat relative">
        <nav className="w-full md:bg-[#F8F3FD]-to-br from-[#2E0689E5] to-[#F4B98FE5]">
          <div
            className={`justify-around ${
              navbar ? "min-h-screen md:min-h-0" : "h-auto"
            }  md:items-center md:flex w-full`}
          >
            <div>
              <div className="flex flex-row-reverse px-[22px] md:px-0 items-center justify-between md:py-5 md:block">
                <div className="w-full md:w-auto ">
                  <img
                    src={phoneDarlingsLogoWhite}
                    alt="logo"
                    className="mx-auto w-[150px] h-[27px] md:w-[220px] md:h-[37px]"
                  />
                </div>
                <div className="md:hidden mr-auto w-fit">
                  
                  <button
                    className="py-2 text-gray-700 rounded-md outline-none"
                    onClick={navbarClick}
                  >
                    {navbar ? (
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
                className={`flex-1 justify-self-center pr-8 pb-3 mt-8 lg:block pt-160 md:block md:pb-0 md:mt-0 ${
                  navbar ? "block" : "hidden"
                }`}
              >
                <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 pl-[30px]">
                  <li
                    className="text-white text-lg hover:text-blue-600"
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                    onClick={onClickHome}
                  >
                    Home
                  </li>
                  <li
                    className={`text-white text-lg hover:text-blue-600`}
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                    onClick={onClickAdvisoreLink}
                  >
                    Advisors
                  </li>
                  <li
                    className={`text-white text-lg hover:text-blue-600 `}
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  >
                    Customers
                  </li>
                  <li
                    className={`text-white text-lg hover:text-blue-600`}
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  >
                    Contact Us
                  </li>
                  {/* <li
                    className={`text-white text-lg hover:text-blue-600`}
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  >
                    Legal
                  </li> */}
                  <li
                    className={`text-white text-lg hover:text-blue-600`}
                    style={{ fontFamily: "Montserrat", cursor: "pointer" }}
                  >
                    <p className="text-white py-2 px-3 border-2 border-white rounded-[5px]">
                      Join Beta Testing
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <h1 className="font-['Manrope'] font-bold  text-[36px] md:text-[79px] pb-[80px] md:px-24 px-[22px] mt-9 xs:tracking-tighter text-white">
          Invited Customers
        </h1>
      </div>
      <div className="font-['Manrope']">
        <h6 className="font-extrabold text-[12px] text-center text-[#4135EF] pt-[50px] pb-[20px]">
          GET STARTED
        </h6>
        <div className="pl-7 pr-10 font-['Manrope']">
          <p className="font-extrabold text-sm sm:leading-6 md:leading-normal md:text-[32px] text-center md:px-[150px]">
            Welcome to the newest and most secure private connection platform on
            the web. To use our platform, you will need a unique username
            provided by your favorite advisor. Once you set up your account, you
            will be connected directly to them through our platform for text
            chat and calls. Your call history and identity are completely
            private, and billing will be discreetly charged to your credit card
            as Phone Darlings.
          </p>
          <p className="font-extrabold text-sm sm:leading-6 md:leading-normal md:text-[32px] text-center md:px-[150px] mt-6">
            Our platform offers a completely secure, double-blind connection
            service, ensuring that your advisor will only know your chosen
            screen name. This anonymity allows you to speak freely and privately
            with your advisor about sensitive topics. Thank you for choosing
            Phone Darlings for your connection needs.
          </p>
        </div>

        <div className="bg-[#F8F3FD]-to-br from-[#4135EF] to-[#061989] p-[2px] rounded text-center mt-[50px] mb-[30px] block mx-auto w-fit">
          <div className="bg-white" onClick={onClickAdvisors}>
            <a className="border-3 font-['Manrope'] font-bold md:font-extrabold text-[17px] md:text-[36px] px-[30px] text-[#5A6EE2]">
              Sign Up
            </a>
          </div>
        </div>
      </div>
      <div className="bg-[#13161E] px-[22px] md:px-24 mt-[50px]">
        <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 pt-[50px] pb-[50px]">
          <div>
            <h6 className="font-['Manrope'] font-bold text-[12px] text-white">
              ABOUT US
            </h6>
            <h4 className="font-['Manrope'] font-bold text-[14px] text-white pt-[25px]">
              A new approach to connecting
            </h4>
            <h5 className="w-4/5 font-['Manrope'] font-[600] text-[#ffffffb3] text-[14px] text-white pt-[30px]">
              We combine the best advisors across fields for your learning
              convenience.
            </h5>
          </div>
          <div className="mt-8 md:mt-0 xl:pl-20 lg:pl-20 md:pl-20 pl-0 ">
            <h6 className="font-['Manrope'] text-[12px] text-white font-extrabold">
              NAVIGATION
            </h6>
            <ul className="pt-[25px] font-bold font-['Manrope'] leading-7">
              <li>
                <a
                  className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer"
                  onClick={onClickHome}
                >
                  Home page
                </a>
              </li>
              <li className="pt-[5px] font-bold">
                <a
                  className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer"
                  onClick={onClickAdvisoreLink}
                >
                  Advisors
                </a>
              </li>
              <li className="pt-[5px] font-bold">
                <a className="text-[16px]  text-[#27AE60] hover:text-[#27AE60] cursor-pointer">
                  Customers
                </a>
              </li>
              <li className="pt-[5px] font-bold">
                <a className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer">
                  Contact Us
                </a>
              </li>

              <li className="pt-[5px] font-bold">
                <a
                  className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer"
                  onClick={() => navigate("/legal/TOS")}
                >
                  Terms of Service
                </a>
              </li>

              <li className="pt-[5px] font-bold">
                <a
                  className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer"
                  onClick={() => navigate("/legal/PP")}
                >
                  Privacy Policy
                </a>
              </li>
              {/* <li className="pt-[5px] font-bold">
                <a className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer">
                  Legal
                </a>
              </li> */}
            </ul>
          </div>
          <div className="mt-4 md:mt-0 lg:pl-8">
            <h6 className="font-['Manrope'] font-extrabold text-[12px] text-white mt-10 md:mt-0">
              BETA APPLICATION
            </h6>
            <h4 className="font-['Manrope'] font-bold text-[22px] text-white pt-[25px]">
              Join the beta testing
            </h4>
            <a className="font-['Manrope'] border-4 rounded font-bold text-[17px] py-[5px] px-[15px] mt-[20px] inline-block text-white">
              Join Beta Testing
            </a>
          </div>
        </div>
        {/* <span className="block w-full h-[2px] bg-[#FFFFFF1A] mx-auto"></span>
        <p className="font-regular text-[#FFFFFFB2] text-[14px] pt-[15px] pb-[15px]">
          PhoneDarlings ©2022. All rights reserved. This site, PhoneDarlings is for
          entertainment purposes only. All advisors are not employees of PhoneDarlings
        </p> */}
      </div>
    </div>
  );
}

export default PdCustomer;

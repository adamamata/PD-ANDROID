import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import masterCard from "../../assets/images/Mastercard-logo.png";
import visa from "../../assets/images/visa.svg";
import footerLogo from "../../assets/images/footerLogo.png";

const Footer = () => {
  const navigates = useNavigate();
  const navigate = ["Home page", "About Us"];
  const legalLink = ["Privacy Policy", "Terms of Service", "2557"];
  const signUpLinks = ["Darlings", "Customers",];
  const location = useLocation();
  const type = location.pathname.split("/");

  const ongotoNav = (data: any) => {
    if (data === "Privacy Policy") {
      navigates("/legal/PP");
    } else if (data === "2557") {
      navigates("/legal/2557");
    } else if (data === "About Us") {
      navigates("/legal/about");
    } else if (data === "Terms of Service") {
      navigates("/legal/TOS");
    } else if (type[1] === "user" || type[1] === "consultant") {
      navigates(`/${type[1]}/home`);
    } else {
      navigates(`/user/home`);
    }
  };

  const ongotoNavSing = (data: any) => {
    if (data === "Darlings") {
      navigates("/consultant/learn-more");
    } else {
      navigates("/user/registration");
    }
  };

  return (
    <div className="relative">
      <div
        className="px-16"
        style={{
          background:
            "linear-gradient(91.78deg, #37085B 0%, #E780F3 155.95%, #E780F3 155.95%), linear-gradient(90.1deg, #EC766F 0%, #F9D4AD 100%)",
        }}
      >
        <div className="grid lg:grid-cols-5 grid-cols-1 pt-16 pb-12">
          <div>
            <img src={footerLogo} alt="PDlogo"></img>
            <h4 className="font-bold pt-[15px] text-2xl text-white">
              Your Gateway to Sensual Conversations
            </h4>
            <h5 className="text-[#ffffffb3] whitespace-break-spaces text-[16px] text-white pt-[20px]">
              Explore the newest adult connection platform for phone sex with crystal clear connections.
              <p className="mt-2 whitespace-break-spaces">Phone Darlings: Your place for a sensual phone sex connection.</p>
            </h5>
          </div>

          <div className="mt-8 lg:mt-0 lg:pl-10 pl-0 lg:ml-9 ">
            <h6 className="text-[12px] text-white font-semibold">NAVIGATION</h6>
            <ul>
              {navigate.map((link) => (
                <li className="pt-3" onClick={() => ongotoNav(link)}>
                  <a className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer font-semibold">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 lg:mt-0 lg:pl-10 pl-0">
            <h6 className="text-[12px] text-white font-semibold">LEGAL</h6>
            <ul className="">
              {legalLink.map((legal) => (
                <li className="pt-3" onClick={() => ongotoNav(legal)}>
                  <a className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer font-semibold">
                    {legal}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 lg:mt-0 pl-0">
            <h6 className="text-[12px] text-white font-semibold">Learn More</h6>
            <ul>
              {signUpLinks.map((link) => (
                <li className="pt-3" onClick={() => ongotoNavSing(link)}>
                  <a className="text-[16px] text-white hover:text-[#27AE60] cursor-pointer font-semibold">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 lg:mt-0 pl-0">
            <h6 className="text-[12px] text-white font-semibold">CONTACT US</h6>
            <div className="text-[#ffffffb3] text-[16px] text-white pt-[20px]">
              PD Consultants LLC
            </div>
            <div className="text-[#ffffffb3] text-[16px] text-white pt-[20px]">
              522 W RIVERSIDE AVE, STE N,<br></br> Spokane, Washington, 99201,
            </div>
            <div className="text-[#ffffffb3] text-[16px] text-white pt-[30px]">
              contact@phonedarlings.com
            </div>
          </div>
        </div>

        <span className="block w-full h-[2px] bg-[#FFFFFF1A] mx-auto"></span>

        <div className="flex  justify-between">
          <div>
            <p className="font-regular text-[#FFFFFFB2] text-[14px] py-6 whitespace-break-spaces">
              PhoneDarlings © 2023 All Rights Reserved. This site is for
              entertainment purposes only. All advisors are not employees of
              PhoneDarlings.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center ml-4">
            <div>
              <img
                src={masterCard}
                alt="mastercard"
                className="w-16 md:w-12 mr-2"
              />
            </div>

            <div className="md:ml-4">
              <img src={visa} alt="visa" className="w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import React, { useState } from "react";
import Background from "../../assets/images/background.png";
import logo from "../../assets/images/logo.png";
import RctPageLoader from "../../component/RctPageLoader";
import { useNavigate } from "react-router-dom";

const ChooseAccount: React.FC<any> = (props: any) => {
  const navigate = useNavigate();

  const [isLoading] = useState(false);

  const onClickuser = () => {
    navigate("/login");
  };

  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="h-screen p-2 hidden sm:block">
          <img
            src={Background}
            alt="backgroud"
            className="h-full w-11/12 object-cover object-bottom"
          ></img>
        </div>

        <div className="h-screen flex items-center place-content-center p-2">
          <div className="grid  grid-rows-12  ">
            <div className="flex place-content-center">
              <img src={logo} alt="logo"></img>
            </div>
            <div className="mb-3 xl:w-96 mt-8 text-xl">Choose your account</div>
            <div className="grid grid-cols-2">
              <div className="bg-white w-[120px] h-[131px] drop-shadow-lg">
                <div className="ml-9 mt-5 w-[47px] h-[47px] bg-[#929ACB] rounded-sm"></div>
                <div className="pt-2 flex text-[#545454] text-base font-bold font-['Montserrat'] justify-center">
                  Monkey123
                </div>
                <div className="flex text-[#545454] text-xs font-normal font-['Montserrat'] justify-center">
                  Nathan Myers
                </div>
              </div>
              <div className="bg-white w-[120px] h-[131px] drop-shadow-lg">
                <div className="ml-9 mt-5 w-[47px] h-[47px] bg-[#253596] rounded-sm"></div>
                <div className="pt-2 flex text-[#545454] text-base font-bold font-['Montserrat'] justify-center">
                  Bestbetty
                </div>
                <div className="flex text-[#545454] text-xs font-normal font-['Montserrat'] justify-center">
                  Betty Boop
                </div>
              </div>
            </div>
            {/* <div className="text-[#E85626] text-xl mt-4">
              Please select an account to continue.{" "}
            </div> */}
            <div className="text-center mt-10">
              <button
                className="bg-btnprimary hover:bg-primary text-white text-2xl py-1 px-14 rounded-full border-4 border-solid border-borderlight"
                type="submit"
                onClick={onClickuser}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseAccount;

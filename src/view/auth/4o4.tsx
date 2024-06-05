import React from "react";
import { useNavigate } from "react-router-dom";
import { GetToken, getRole } from "../../constant/default";

const NotFound: React.FC<any> = (props: any) => {
  const navigate = useNavigate();

  const onClickGoHome = () => {
    if (GetToken()) {
      let role = "user"
      if(getRole() === "User"){
        role = "user"
      }else if(getRole() === "ServiceProvider") {
        role = "consultant"
      }
      navigate(`/${role}/home`);
    } else {
      navigate('/')
    }
  };
  return (
    <>
      <div className="bg-[#F8F3FD]-to-r flex justify-center items-center from-[#061989]/90 to-[#7C688C]/90 h-screen 2xl:h-screen pb-[22px]">
        <div>
          <div className="text-primary text-4xl font-bold">
            404 page not found
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-primary text-white text-base hover:text-white py-2 px-10  border-2 border-solid border-primary  rounded-full" onClick={onClickGoHome}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

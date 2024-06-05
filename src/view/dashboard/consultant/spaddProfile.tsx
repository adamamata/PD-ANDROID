import React from "react";
import { connect } from "react-redux";
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import SpProfileForm from "../../../component/common/ui/SpProfileForm";
import ManageProfile from "./manageProfile";

const SPAddProfile: React.FC<any> = (props: any) => {
  const { dispatch } = props;
  return (
    <div className="bg-[#36007a] min-h-screen p-6">
      <div className="w-full py-8 rounded-b-full rounded-t-full">
        <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
          <img
            src={phoneDarlingsLogo}
            alt="logo"
            className="mx-auto w-[183px] h-[26px]"
          />
        </div>
      </div>
      {/* <SpProfileForm dispatch={dispatch} /> */}
      <div className="mb-4">
        <ManageProfile dispatch={dispatch} registrationFlow={true} />
      </div>
    </div>
  );
};

export default connect()(SPAddProfile);

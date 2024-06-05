import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { chnagePassword } from "../../services/authService";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { auth_details } from "../../reducer/auth";
import RctPageLoader from "../../component/RctPageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Values {
  password: string;
  newPassword: string;
  reEnterPassword: string;
}

interface DProps {
  cancel: any;
}
const Adult: React.FC<DProps> = (props: DProps | any) => {
    const {cancel} = props
  return (
    <>
      <div className="w-11/12 justify-center mx-auto items-center flex overflow-x-hidden md:p-10 overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div
              className="flex justify-end text-2xl font-bold text-black mr-4 cursor-pointer"
              onClick={cancel}
            >
              x
            </div>
          </div>
        </div>
      </div>
      {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
      <div className="fixed inset-0 z-40 bg-[#676767]"></div>
    </>
  );
};

export default connect()(Adult);

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const OpenMediaFile = (props: any) => {
  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={props.cancel}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>
          <div className="mt-4 w-11/12 flex justify-center h-72 max-w-3xl">
            <img src={props.image} className="w-11/12 h-72 max-w-3xl" />
          </div>
        </div>
      </div>
      <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default OpenMediaFile;

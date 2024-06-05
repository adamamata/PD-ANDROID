import React, { useState } from "react";

const ViewMediaGallary = (props: any) => {

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-11/12 md:w-[50%] mx-auto max-w-lg bg-white rounded px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {props?.allfiles.map((data: any) => (
              <div>
                <img
                  src={data?.image}
                  alt=""
                  className="w-full h-28 object-cover"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="bg-btnprimary hover:bg-primary text-white text-lg py-1 px-14 rounded-full border-4 border-solid border-borderlight"
              onClick={props.cancel}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ViewMediaGallary;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface Sprops {
  cancle: any;
}
const RegestrationSubmit: React.FC<any> = (props: Sprops | any) => {
  const { cancle } = props;

  return (
    <>
    <div className="w-full">
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-auto mx-auto max-w-lg bg-white rounded px-10 py-8">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={cancle}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>
          <div className="text-primary text-center text-3xl font-bold 2xl:mt-4">
          Welcome
          </div>
          <div
            className="text-center mt-5"
          >
           Thank you for registering with PhoneDarlings. Search for clients to begin.
          </div>
            <div className="w-full flex justify-center mt-10">
              <button
                className="bg-btnprimary hover:bg-primary text-white text-xl py-1 px-16 rounded-full border-4 border-solid border-borderlight"
                onClick={cancle}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
    </>

  );
};
export default RegestrationSubmit;

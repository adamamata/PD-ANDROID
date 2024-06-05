import React, { useState, useEffect } from "react";
import { LOCALSTORE } from "../../constant/default";


const ConformationModal: React.FC<any> = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);


  const handleConfirmClick = () => {
    setIsModalOpen(false);
    localStorage.setItem(LOCALSTORE.isOver18, "no");
  }

  return (
    <>
      {isModalOpen &&
        <>
          <div className="fixed top-[50px] inset-x-0 flex items-center z-50 outline-none focus:outline-none rounded-2xl">
            <div className="relative font-['jaldi'] w-auto mx-auto max-w-3xl bg-white rounded p-3">
              <div className="text-[20px] 2xl:mt-1">
                To begin, verify your age.
              </div>

              <div className="w-full flex justify-center mt-3">
                <button
                  className={`bg-primary text-white text-2xl py-2 px-6
                  md:px-24 border-4 border-solid border-borderlight hover:opacity-50`}
                  onClick={() => handleConfirmClick()}
                >
                  I AM OVER THE AGE OF 18
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      }
    </>
  );
};

export default ConformationModal;

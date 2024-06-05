import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ViewMediaFIle = (props: any) => {
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [fileDisble, setDisable] = useState(false);
  const minAmount = 0.01
  const maxAmount = 1000

  const onSubmit = () => {
    if (!priceError) {
      setPriceError(false);
      setDisable(true);
      props.onUploadFile(price);
      props.close();
    }
  };

  const onChangePrice = (event: any) => {
    setPrice(event);
    if (event < 0.01 || event > 1000) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  };

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-11/12 md:w-[50%] mx-auto max-w-lg bg-white rounded px-4 py-6">
          <div
            className="flex justify-end text-2xl font-bold text-black mr-4 cursor-pointer"
            onClick={props.close}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className="px-10">
            <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
              Media Price
            </div>
            <div className="mt-6">
              <span className="">Enter your media price</span>
            </div>
            <div className="flex border border-[#C4C4C4]">
              <span className="text-base py-1 px-3">$</span>
              <input
                type="number"
                min={0.01}
                max={1000}
                className="w-full py-1 px-3 text-sm font-medium focus:outline-none"
                onChange={(e: any) => onChangePrice(e.target.value)}
              />
            </div>
            {priceError ? (
              <div className="text-[#ff0505] mt-2">
                {`Please enter valid amount between ${minAmount} and ${maxAmount}.`}
              </div>
            ) : (
              ""
            )}
            <div className="text-center mt-12">
              <button
                className={`bg-btnprimary hover:bg-primary
                ${fileDisble && "opacity-25"}
                text-white text-lg py-1 px-14 rounded-full border-4 border-solid border-borderlight`}
                type="submit"
                disabled={fileDisble}
                onClick={onSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ViewMediaFIle;

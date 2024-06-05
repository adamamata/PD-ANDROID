import React, { useState } from "react";
import buttonPlusSign from "../../../assets/images/buttonPlusSign.svg";
import { connect, useSelector } from "react-redux";
import { auth_details } from "../../../reducer/auth";
import ModalLoader from "../../../component/ModalLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faXmark } from "@fortawesome/free-solid-svg-icons";

const SendGift = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showCreateGift, setShowCreateGift] = useState(true);
  const [amount, setAmount] = useState<any>("");
  const [showAmount, setShowAmount] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<boolean>(false);
  const [bgColor, setbgColor] = useState<any>("");
  const details = useSelector(auth_details);
  const [giftDisabled, setgiftDisabled] = useState(false);


  const onClikNext = () => {
    if (!amountError) {
      const { dispatch } = props;
      setLoading(true);
      setgiftDisabled(true);
      if (props.lable === "Send Gift") {
        if (details?.totalCredit?.balance >= amount) {
          props.onSubmitGift(amount);
          // setLoading(false)
        } else {
          setLoading(false);
          props.onInsufficientCredits();
        }
      } else if (props.lable === "Request Gift") {
        props.onSubmitGift(amount);
      }
    }
  };

  const onClickAmount = (value: any) => {
    setbgColor(value);
    if (value === "other") {
      setShowAmount(true);
    } else {
      setAmount(value);
      setShowAmount(false);
    }
  };

  const onChangeAmount = (event: any) => {
    setAmount(event);
    if (event > 1000) {
      setAmountError(true);
    } else setAmountError(false);
  };
  return (
    <>
      {showCreateGift && (
        <>
          <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
            {loading && <ModalLoader />}
            <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6">
              <div
                className="flex justify-end text-xl font-bold text-black cursor-pointer"
                onClick={props.close}
              >
                <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
              </div>

              <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
                {props.lable}
              </div>
              <div className="w-full flex justify-center mt-4">
                <FontAwesomeIcon icon={faGift} className="text-8xl text-primary font-bold"/>
              </div>
              <p className="mt-4 font-medium text-[#C4C4C4] text-sm">
                Please select an option
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  className={`${
                    bgColor === "40" ? "bg-[#37085B]" : "bg-[#C4C4C4]"
                  } text-white font-bold py-4 px-[38px] rounded-[4px]`}
                  onClick={() => onClickAmount("40")}
                >
                  <div className="flex items-center justify-center w-full">
                    <img src={buttonPlusSign} alt="buttonPlusSign" />
                    <span className="font-['Montserrat'] text-2xl font-medium text-white ml-4">
                      $40
                    </span>
                  </div>
                </button>
                <button
                  className={`${
                    bgColor === "60" ? "bg-[#37085B]" : "bg-[#C4C4C4]"
                  } text-white font-bold py-4 px-[38px] rounded-[4px]`}
                  onClick={() => onClickAmount("60")}
                >
                  <div className="flex items-center justify-center w-full">
                    <img src={buttonPlusSign} alt="buttonPlusSign" />
                    <span className="font-['Montserrat'] text-2xl font-medium text-white ml-4">
                      $60
                    </span>
                  </div>
                </button>
                <button
                  className={`${
                    bgColor === "100" ? "bg-[#37085B]" : "bg-[#C4C4C4]"
                  } text-white font-bold py-4 px-[38px] rounded-[4px]`}
                  onClick={() => onClickAmount("100")}
                >
                  <div className="flex items-center justify-center w-full">
                    <img src={buttonPlusSign} alt="buttonPlusSign" />
                    <span className="font-['Montserrat'] text-2xl font-medium text-white ml-4">
                      $100
                    </span>
                  </div>
                </button>
                <button
                  className={`${
                    bgColor === "other" ? "bg-[#37085B]" : "bg-[#C4C4C4]"
                  } text-white font-bold py-4 px-[38px] rounded-[4px]`}
                  onClick={() => onClickAmount("other")}
                >
                  other
                </button>
              </div>
              {showAmount ? (
                <>
                  <div>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      onChange={(e) => onChangeAmount(e.target.value)}
                      placeholder="If Other, please specify amount"
                      className="w-full py-2.5 px-3 text-sm font-medium mt-6 border border-[#C4C4C4] focus:outline-none"
                    />
                  </div>
                  {amountError && (
                    <div className="text-[#E85626]">
                      The value you have entered is above the maximum price
                      allowed for this service.
                    </div>
                  )}
                </>
              ) : (
                ""
              )}

              <div className="flex justify-center mt-4">
                <button
                  className={`bg-[#37085B] mx-auto text-white text-sm xl:text-lg py-2.5 px-4 md:px-4 xl:px-7 rounded-full ${
                    giftDisabled && "opacity-25"
                  }`}
                  onClick={() => onClikNext()}
                  disabled={giftDisabled}
                >
                  {props.lable}
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {/* {showSentGift && <GiftSent onMainClose={props.close} />} */}
    </>
  );
};

export default connect()(SendGift);

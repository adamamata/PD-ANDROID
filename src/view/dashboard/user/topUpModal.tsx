import React, { useState, useEffect } from "react";
import buttonPlusSign from "../../../assets/images/buttonPlusSign.svg";
import { connect, useSelector } from "react-redux";
import { auth_details, set_Total_Credit, set_profile } from "../../../reducer/auth";
import { getCardData, createTopUpMenu, getTotalCredit } from "../../../services/homeService";
import { getProfileData } from "../../../services/authService";
import AddNewCard from "./addNewCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOCALSTORE } from "../../../constant/default";
import ModalLoader from "../../../component/ModalLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Cprops {
  onCancel: () => void;
  onSuccess: () => void;
  amount: any;
  insufficientCredits: boolean;
}

const TopUpModal: React.FC<any> = (props: Cprops | any) => {
  const [otherValue, setOtherValue] = useState<any>(false);
  const authData = useSelector(auth_details);
  const [cards, setCards] = useState<boolean>(false);
  const [addCard, setaddCard] = useState<boolean>(false);
  const [cardList, setCardList] = useState<any>([]);
  const [selectCard, setSelectCard] = useState<any>("");
  const [amount, setamount] = useState<any>("");
  const [amoutError, setAmoutError] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<any>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const loginId = localStorage.getItem(LOCALSTORE.id);
  const [errorCard, setErrorCard] = useState<boolean>(false);
  const [topDisble, setTopDisable] = useState(false);
  const [insufficientCredits, setInsufficientCredits] = useState<boolean>(
    props.insufficientCredits
  );
  const [credit, setCredit] = useState<any>();

  useEffect(() => {
    setCredit(authData?.totalCredit?.balance);
  }, []);

  const onClickData = (value: any) => {
    setBgColor(value);
    if (value === "other") {
      setOtherValue(true);
    } else {
      setamount(Number(value));
      setOtherValue(false);
    }
  };

  useEffect(() => {
    getCardDetails();
    setBgColor(props.amount);
    if (props.amount === "other") {
      setOtherValue(true);
    } else {
      setamount(Number(props.amount));
      setOtherValue(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCardDetails = () => {
    const { dispatch } = props;

    dispatch(getCardData(loginId))
      .then((res: any) => {
        setCardList(res?.data);
        if (res?.data?.length === 0) {
          setCards(true);
        } else {
          setCards(false);
        }
      })
      .catch((err: any) => {
        // setCards(true);
      });
  };

  const onsetCard = () => {
    setaddCard(true);
  };

  const onCancleAddNewCardModal = () => {
    setaddCard(false);
  };

  const onChangeCard = (name: any) => {
    if (name !== "") {
      setSelectCard(name);
      setErrorCard(false);
    } else {
      setSelectCard(true);
    }
  };

  const onChangeAmount = (value: any) => {
    setamount(value);
    if (value >= 10 && value <= 300) {
      setAmoutError(false);
    } else {
      setAmoutError(true);
    }
  };

  const getUserData = () => {
    const { dispatch } = props;
    dispatch(getProfileData(loginId))
      .then((res: any) => {
        dispatch(set_profile(res.data));
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const onSubmitData = () => {
    if (amount >= 10) {
      setAmoutError(false);
    } else {
      setAmoutError(true);
    }
    if (selectCard) {
      setErrorCard(false);
    } else {
      setErrorCard(true);
    }
    if (!amoutError && selectCard) {
      setLoading(true);
      const { dispatch } = props;
      const body = {
        paymentInfoId: selectCard,
        userId: loginId,
        amount: amount,
      };
      setTopDisable(true);
      dispatch(createTopUpMenu(body))
        .then((res: any) => {
          if (res.data) {
            setLoading(false);
            props.onSuccess();
            // setInsufficientCredits(false);
            toast.success("Top up create Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });

            dispatch(getTotalCredit(authData?.totalCredit?.accountId)).then((credit: any) => {
              setLoading(false);
              dispatch(set_Total_Credit(credit?.data))
            }).catch(() => {
              setLoading(false)
            })
            // getUserData();
          }
        })
        .catch((err: any) => {
          setLoading(false);
          // setInsufficientCredits(false);
          const massage = err.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
          props.onCancel();
        });
    }
  };

  const onClickonCancel = () => {
    props.onCancel();
  };

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        {isLoading && <ModalLoader />}
        <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={onClickonCancel}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
            {insufficientCredits ? "Insufficient Credits" : "Top Up Now"}
          </div>

          <p
            className={`${
              insufficientCredits ? "block" : "hidden"
            } mt-2 font-500 text-primary w-full text-center`}
          >
            You have insufficient credits. Please top up to continue.
          </p>

          <p className="mt-8 text-[#383839] font-[500] text-sm">
            Please select an option
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              className={`${
                bgColor === "40" ? "bg-primary" : "bg-[#C4C4C4]"
              } text-white font-bold py-4 px-[38px] rounded-[4px]`}
            >
              <div
                className="flex items-center justify-center w-full"
                onClick={() => onClickData("40")}
              >
                <img src={buttonPlusSign} alt="buttonPlusSign" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2 md:ml-4">
                  $40
                </span>
              </div>
            </button>
            <button
              className={`${
                bgColor === "60" ? "bg-primary" : "bg-[#C4C4C4]"
              } text-white font-bold py-4 px-[38px] rounded-[4px]`}
            >
              <div
                className="flex items-center justify-center w-full"
                onClick={() => onClickData("60")}
              >
                <img src={buttonPlusSign} alt="buttonPlusSign" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2 md:ml-4">
                  $60
                </span>
              </div>
            </button>
            <button
              className={`${
                bgColor === "100" ? "bg-primary" : "bg-[#C4C4C4]"
              } text-white font-bold py-4 px-[38px] rounded-[4px]`}
            >
              <div
                className="flex items-center justify-center w-full"
                onClick={() => onClickData("100")}
              >
                <img src={buttonPlusSign} alt="buttonPlusSign" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2 md:ml-4">
                  $100
                </span>
              </div>
            </button>
            <button
              className={`${
                bgColor === "other" ? "bg-primary" : "bg-[#C4C4C4]"
              } text-white font-bold py-4 px-[38px] rounded-[4px]`}
            >
              <span
                className="font-['Montserrat'] text-2xl font-medium text-white"
                onClick={() => onClickData("other")}
              >
                other
              </span>
            </button>
          </div>
          {otherValue ? (
            <div>
              <input
                type="number"
                min={1}
                onChange={(e) => onChangeAmount(e.target.value)}
                placeholder="If Other, please specify amount"
                className="w-full py-2.5 px-3 text-sm font-medium mt-6 border border-[#C4C4C4] focus:outline-none"
              />
              <div>
              {amoutError ? (
                <div className="text-[#e12f2f] font-[500] text-base text-[14px]">
                  {" "}
                  Please enter valid number between 10 and 300{" "}
                </div>
              ) : (
                ""
              )}
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="mt-8 w-full">
            <p className="text-sm text-[#383839] font-[500] font-['Montserrat']">
              Please select a payment method
            </p>
            {cards ? (
              <button
                className="bg-[#37085B] mt-4 w-full text-white font-['Montserrat'] text-base rounded text-left px-4 py-2 focus:outline-none"
                onClick={onsetCard}
              >
                Add a New Card
              </button>
            ) : (
              <select
                name="cardType"
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2"
                onChange={(e) => onChangeCard(e.target.value)}
              >
                <option selected disabled value={""}>
                  Select Card
                </option>
                {cardList.map((item: any) => {
                  const number = item?.cardNo.substr(item?.cardNo.length - 4);
                  return (
                    <option value={item?.id}>
                      {item?.cardType} *{number}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          {errorCard ? (
            <div className="text-[#e12f2f] font-[500] text-base text-[14px]">
              {" "}
              Please select card{" "}
            </div>
          ) : (
            ""
          )}
          <div className="w-full flex justify-center mt-12">
            <button
              className={`bg-primary hover:bg-primary text-white text-xl py-2 px-8 
              ${topDisble && "opacity-25"}
              md:px-8 rounded-full border-4 border-solid border-borderlight`}
              onClick={onSubmitData}
              disabled={topDisble}
            >
              Top Up
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
      {addCard && (
        <AddNewCard
          cancel={onCancleAddNewCardModal}
          getCardDetails={getCardDetails}
        />
      )}
    </>
  );
};

export default connect()(TopUpModal);

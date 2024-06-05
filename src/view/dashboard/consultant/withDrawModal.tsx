import React, { useState, useEffect, useLayoutEffect } from "react";
import buttonPlusSign from "../../../assets/images/buttonPlusSign.svg";
import { connect, useSelector } from "react-redux";
import { auth_details, set_profile } from "../../../reducer/auth";
import { getCardData, withdrawData } from "../../../services/homeService";
import { getProfileData } from "../../../services/authService";
import AddNewBank from "./addNewBank";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOCALSTORE } from "../../../constant/default";
import ModalLoader from "../../../component/ModalLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const WithDrawModal: React.FC<any> = (props: any) => {
  const authData = useSelector(auth_details);
  const [cards, setCards] = useState<boolean>(false);
  const [addCard, setaddCard] = useState<boolean>(false);
  const [cardList, setCardList] = useState<any>([]);
  const [selectCard, setSelectCard] = useState<any>("");
  const [amount, setamount] = useState<any>("");
  const [amountError, setAmountError] = useState<any>({
    minAmountError: false,
    maxAmountError: false
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const loginId = localStorage.getItem(LOCALSTORE.id);
  const [errorCard, setErrorCard] = useState<boolean>(false);
  const [withdrawDisable, setWithdrawDisable] = useState<boolean>(false);
  const [withdrawAll, setWithdrawAll] = useState<boolean>(false);
  const [userCredit, setUserCredit] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (authData && authData?.totalCredit && authData?.totalCredit?.balance !== undefined) {
      setUserCredit(authData?.totalCredit?.balance)
    }
  }, [authData])

  useEffect(() => {
    getCardDetails();
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

  const onChangeAmount = (value: any) => {
    setWithdrawAll(false)
    setWithdrawDisable(false)
    setAmountError({
      minAmountError: false,
      maxAmountError: false,
    })
    setamount(value);
    if (value <= 10) {
      setAmountError({
        minAmountError: true,
        maxAmountError: false,
      });
    } else if (userCredit) {
      if (value > userCredit) {
        setAmountError({
          minAmountError: false,
          maxAmountError: true,
        })
      }
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
    if (selectCard) {
      setErrorCard(false);
    } else {
      setErrorCard(true);
    }

    if (((!amountError.minAmountError && !amountError.maxAmountError) || (withdrawAll && userCredit)) && selectCard) {
      if (userCredit! > 10) {
        setLoading(true);
        setWithdrawDisable(true);
        const { dispatch } = props;
        const body = {
          paymentInfoId: selectCard,
          userId: authData?.login?.id,
          amount: (withdrawAll && userCredit) ? userCredit?.toFixed(2) : amount,
        };

        dispatch(withdrawData(body))
          .then((res: any) => {
            if (res.data) {
              setLoading(false);
              props.updateCredit();
              props.cancel();
              setErrorCard(false);
              setAmountError({
                minAmountError: false,
                maxAmountError: false
              });
              toast.success("Withdraw data Successfull!", {
                theme: "colored",
                autoClose: 5000,
              });
              setWithdrawDisable(false);
              getUserData();
            }
          })
          .catch((err: any) => {
            setLoading(false);
            const massage = err.message;
            setWithdrawDisable(false);
            setErrorCard(false);
            setAmountError({
              minAmountError: false,
              maxAmountError: false
            });
            toast.error(massage, {
              theme: "colored",
              autoClose: 5000,
            });
            props.cancel();
          });
      } else {
        toast.error("Minimum withdraw amount is $10.", {
          theme: "colored",
          autoClose: 5000,
        });
      }
    }
  };

  const onSelectValue = (name: any) => {
    if (name !== "") {
      setErrorCard(false);
      setSelectCard(name);
    } else {
      setErrorCard(true);
    }
  };

  const onClickWithDrawAll = () => {
    if (userCredit) {
      setamount("")
      setAmountError({
        minAmountError: false,
        maxAmountError: false
      });
      setWithdrawAll(!withdrawAll)
    }
  }

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl py-8">
        {isLoading && <ModalLoader />}
        <div className="relative font-['Montserrat'] bg-white rounded px-10 py-6 h-[100%] smallScroll overflow-auto mx-auto w-11/12 lg:w-[40%]">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={props.cancel}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
            Withdraw
          </div>

          <div className="mt-10">
            <p className="text-base text-primary font-['Montserrat'] font-bold">
              My Total Credits
            </p>
            <p className="text-[40px] font-bold text-primary font-['Montserrat'] leading-none">
              $
              {authData &&
                authData?.totalCredit &&
                authData?.totalCredit?.balance !== undefined
                ? authData?.totalCredit?.balance.toFixed(2)
                : ""}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-base text-primary font-['Montserrat'] font-bold leading-none">
              Withdraw all your credits or specify an amount
            </p>
          </div>


          <button
            className={`${withdrawAll ? "bg-[#37085B]" : "bg-[#C4C4C4]"
              } text-white font-medium w-full text-2xl py-3 rounded-[4px] mt-1.5`}

            onClick={() => onClickWithDrawAll()}
          >
            Withdraw All
          </button>

          <div>
            <input
              type="number"
              min={1}
              onChange={(e) => onChangeAmount(e.target.value)}
              value={amount}
              placeholder="If Other, please specify amount"
              className="w-full py-2.5 px-3 text-sm font-medium mt-1.5 border border-solid border-gray-300 rounded focus:outline-none"
            />
          </div>

          {amountError.minAmountError ? (
            <div className="text-[#e12f2f] font-[500] text-base text-[14px]">
              {" "}
              Please enter valid number bigger than 10{" "}
            </div>
          ) : (
            ""
          )}

          {amountError.maxAmountError ? (
            <div className="text-[#e12f2f] font-[500] text-base text-[14px]">
              {" "}
              Please enter valid number which should be less than your credit
            </div>
          ) : (
            ""
          )}

          <div className="mt-8 w-full">
            <p className="text-primary font-[600] text-base font-['Montserrat']">
              Please select an account
            </p>
            {cards ? (
              <button
                className="bg-[#37085B] mt-4 w-full text-white font-['Montserrat'] text-base rounded text-left px-4 py-2 focus:outline-none"
                onClick={onsetCard}
              >
                Add New Account
              </button>
            ) : (
              <select
                name="cardType"
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2"
                onChange={(e) => onSelectValue(e.target.value)}
              >
                <option selected disabled value={""}>
                  Saved Accounts
                </option>
                {cardList.map((item: any) => (
                  <option value={item?.id}>{item?.bankName || item?.paypalUsername}</option>
                ))}
              </select>
            )}
          </div>

          {errorCard ? (
            <div className="text-[#e12f2f] font-[500] text-base text-[14px]">
              {" "}
              Please select an account to withdraw the amount.
            </div>
          ) : (
            ""
          )}


          <p className="text-primary font-[600] text-base font-['Montserrat'] mt-8">
            Confirm Withdrawal Request
          </p>

          <div className="flex items-end h-[85px] p-2 bg-[#320c5799] w-full rounded ">
            <p className="font-[600] font-['Montserrat'] text-white">Total Request:
              <span className="ml-8 text-[40px] font-['Montserrat'] font-bold">
                {withdrawAll && userCredit ? `$${userCredit?.toFixed(2)}`
                  : amount ? `$${amount}` : ""}
              </span>
            </p>
          </div>

          <div className="w-full flex justify-center mt-12">
            <button
              onClick={onSubmitData}
              className={`bg-[#37085B] hover:bg-primary text-white text-xl py-2 px-8 
             ${withdrawDisable && "opacity-25"}
             md:px-8 rounded-full border-4 border-solid border-borderlight`}
              disabled={withdrawDisable}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
      {addCard && (
        <AddNewBank
          cancel={onCancleAddNewCardModal}
          getCardDetails={getCardDetails}
        />
      )}
    </>
  );
};

export default connect()(WithDrawModal);

import React, { useEffect, useRef, useState } from 'react'
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import buttonPlusSign from "../../../assets/images/buttonPlusSign.svg";
import { connect, useSelector } from 'react-redux';
import { createTopUpMenu, getCardData, getTotalCredit } from '../../../services/homeService';
import { GetToken, LOCALSTORE, siteKey } from '../../../constant/default';
import RctPageLoader from '../../../component/RctPageLoader';
import { toast } from 'react-toastify';
import { auth_details, auth_login, set_Total_Credit } from '../../../reducer/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { authLogin } from '../../../services/authService';

const UserTopUp: React.FC<any> = (props: any) => {
  const navigate = useNavigate()
  const location = useLocation()
  const captchaRef = useRef(null)
  const userDetail = useSelector(auth_details);
  const loginId = localStorage.getItem(LOCALSTORE.id);
  const [otherValue, setOtherValue] = useState<any>(false);
  const [amoutError, setAmoutError] = useState<boolean>(false);
  const [topDisble, setTopDisable] = useState(false);
  const [bgColor, setBgColor] = useState<any>("");
  const [amount, setamount] = useState<any>("");
  const [cardList, setCardList] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { dispatch } = props;
    dispatch(getCardData(loginId))
      .then((res: any) => {
        setCardList(res?.data);
      })
      .catch((err: any) => {
        // setCards(true);
      });
  }, [])

  const onClickAmout = (value: any) => {
    setBgColor(value);
    setTopDisable(false)
    setAmoutError(false)
    if (value === "other") {
      setamount("")
      setOtherValue(true);
    } else {
      setamount(Number(value));
      setOtherValue(false);
    }
  };

  const onChangeAmount = (value: any) => {
    setTopDisable(false)
    setAmoutError(false)
    setamount(value);
    if (value >= 10 && value <= 300) {
      setAmoutError(false);
    } else {
      setAmoutError(true);
    }
  };

  const onSubmitLogin = () => {
    const payload = {
      email: location.state.email,
      password: location.state.password,
      rememberMe: false
    }
    const { dispatch } = props
    let token: any = captchaRef?.current
    let tokendata = token?.executeAsync()
    tokendata.then((res: any) => {
      if (res) {
        dispatch(authLogin(payload, res)).then((res: any) => {
          dispatch(auth_login(res.data))
          localStorage.setItem(LOCALSTORE.id, res.data.id)
          localStorage.setItem(LOCALSTORE.token, res.data.jwtToken)
          localStorage.setItem(LOCALSTORE.refreshToken, res.data.refreshToken)
          localStorage.setItem(LOCALSTORE.role, res.data.role)
          localStorage.setItem(
            LOCALSTORE.communicationIdentifier.token,
            res.data.communicationIdentifier.token
          )
          localStorage.setItem(
            LOCALSTORE.communicationIdentifier.expiredOn,
            res.data.communicationIdentifier.expires_on
          )
          localStorage.setItem(
            LOCALSTORE.communicationIdentifier.userId,
            res.data.communicationIdentifier.user_id
          )

          setLoading(false)
          navigate(`/thankyouuser`);
          // setConditionError(false)
        }).catch(() => {
          toast.error("Something Went Wrong!!!", {
            theme: "colored",
            autoClose: 5000,
          });
          navigate("/login")
        })
      }
    })
  }

  const onSubmitData = () => {
    if (amount >= 10) {
      setAmoutError(false);
    } else {
      setAmoutError(true);
    }
    // if (selectCard) {
    //   setErrorCard(false);
    // } else {
    //   setErrorCard(true);
    // }
    if (amount && amount >= 10 && cardList.length > 0) {
      setLoading(true);
      const { dispatch } = props;
      const body = {
        paymentInfoId: cardList[0]?.id,
        userId: loginId,
        amount: amount,
      };
      setTopDisable(true);
      dispatch(createTopUpMenu(body))
        .then((res: any) => {
          if (res.data) {
            setLoading(false);
            // setInsufficientCredits(false);
            toast.success("Top up create Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });

            if (!userDetail?.login?.isSuccess) {
              onSubmitLogin()
            }


            // dispatch(getTotalCredit()).then((credit: any) => {
            //   setLoading(false);
            //   dispatch(set_Total_Credit(credit?.data))
            // }).catch(() => {
            //   setLoading(false)
            // })
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
        });
    } else {
      toast.error("Please select any amount")
    }
  };



  return (
    <div className="bg-[#F8F3FD] min-h-screen px-6">
      {isLoading && <RctPageLoader />}
      <div className="w-full mb-6 py-8 h-[80px] rounded-b-full rounded-t-full">
        <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
          <img
            src={phoneDarlingsLogo}
            alt="logo"
            className="mx-auto w-[183px] h-[26px]"
          />
        </div>
      </div>

      <div className='text-center bg-[#FFFFFF] mt-8 h-[calc(100vh_-_140px)] rounded-lg p-4 overflow-auto smallScroll'>
        <p className='text-center text-[32px] font-semibold'>
          Top Up Your Account
        </p>

        <p className='text-center text-[12px] font-bold mt-2'>
          PROMO
        </p>

        <p className='mt-4 text-center mx-auto lg:max-w-[50%]'>
          For you, we are offering a one-time bonus credit offer. Top Up these amounts below and receive the credits immediately.
        </p>

        <div className='w-full flex justify-center'>
          <div className='w-fit mt-4 overflow-hidden rounded-sm'>
            <table className="table-auto border-spacing-0">
              <thead>
                <tr className='border-b border-[#9c64e233]'>
                  <td className='bg-[#F3F3F3] py-2 leading-none pl-3 pr-4 font-bold'>TOP UP</td>
                  <td className='bg-[#ebe0f9] text-[#673AB7] py-2 leading-none pr-3 pl-4 font-bold'>FREE</td>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-[#9c64e233]'>
                  <td className='bg-[#F3F3F3] py-2 leading-none pl-3 pr-4 font-semibold'>Sign Up</td>
                  <td className='bg-[#ebe0f9] text-[#673AB7] py-2 leading-none pr-3 pl-4 font-bold'>$5</td>
                </tr>
                <tr className='border-b border-[#9c64e233]'>
                  <td className='bg-[#F3F3F3] py-2 leading-none pl-3 pr-4 font-semibold'>$60-80</td>
                  <td className='bg-[#ebe0f9] text-[#673AB7] py-2 leading-none pr-3 pl-4 font-bold'>$5</td>
                </tr>
                <tr className='border-b border-[#9c64e233]'>
                  <td className='bg-[#F3F3F3] py-2 leading-none pl-3 pr-4 font-semibold'>$80-100</td>
                  <td className='bg-[#ebe0f9] text-[#673AB7] py-2 leading-none pr-3 pl-4 font-bold'>$10</td>
                </tr>
                {/* <tr className=''>
                  <td className='bg-[#F3F3F3] py-2 leading-none pl-3 pr-4 font-semibold'>$100++</td>
                  <td className='bg-[#ebe0f9] py-2 leading-none pr-3 pl-4 font-semibold'>$20</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 xl:grid-cols-4 mt-4 lg:max-w-[50%] mx-auto">
          <div className="w-full h-[62px] flex justify-center md:flex-none">
            <button
              className={`${bgColor === "40" ? "bg-[#673AB7]" : "bg-[#9b83ad]"} w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]`}
              onClick={() => onClickAmout("40")}
            >
              <div className="flex items-center justify-center w-full">
                <img src={buttonPlusSign} alt="buttonPlussing" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                  $40
                </span>
              </div>
            </button>
          </div>

          <div className="w-full h-[62px] flex justify-center md:flex-none">
            <button
              className={`${bgColor === "60" ? "bg-[#673AB7]" : "bg-[#9b83ad]"} w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]`}
              onClick={() => onClickAmout("60")}
            >
              <div className="flex items-center justify-center w-full">
                <img src={buttonPlusSign} alt="buttonPlussing" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                  $60
                </span>
              </div>
            </button>
          </div>

          <div className="w-full h-[62px] flex justify-center md:flex-none">
            <button
              className={`${bgColor === "100" ? "bg-[#673AB7]" : "bg-[#9b83ad]"} w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]`}
              onClick={() => onClickAmout("100")}
            >
              <div className="flex items-center justify-center w-full">
                <img src={buttonPlusSign} alt="buttonPlussing" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                  $100
                </span>
              </div>
            </button>
          </div>

          <div className="w-full h-[62px] flex justify-center md:flex-none">
            <button
              className={`${bgColor === "other" ? "bg-[#673AB7]" : "bg-[#9b83ad]"} w-full md:w-full h-full text-white font-bold py-2 px-4 rounded-[10px]`}
              onClick={() => onClickAmout("other")}
            >
              <div className="flex items-center justify-center w-full">
                <img src={buttonPlusSign} alt="buttonPlussing" />
                <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                  Other
                </span>
              </div>
            </button>
          </div>

        </div>


        {otherValue ? (
          <div className='w-full lg:max-w-[50%] mx-auto mt-4'>
            <p className='text-left'>Other Amount</p>
            <div className='w-full flex justify-start'>
              <input
                type="number"
                min={1}
                onChange={(e) => onChangeAmount(e.target.value)}
                placeholder="If Other, please specify amount"
                className="w-[60%] lg:w-[50%] py-2.5 px-3 text-sm font-medium mt-2 border border-[#C4C4C4] focus:outline-none mr-auto"
              />
            </div>


            <div className='flex'>
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


        <div>
          <ReCAPTCHA
            sitekey={siteKey}
            ref={captchaRef}
            size="invisible"
          />
        </div>

        <div className="w-full flex justify-center mt-8">
          <button
            className={`bg-[#673AB7] px-14 py-2 rounded-lg text-2xl text-white ${(topDisble || amoutError) && "opacity-25"}`}
            onClick={onSubmitData}
            disabled={topDisble || amoutError}
          >
            Top Up & Begin
          </button>
        </div>
      </div>
    </div>
  )
}

export default connect()(UserTopUp);
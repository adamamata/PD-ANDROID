import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { sendOtp, verifyOtp } from "../../services/authService";
import ModalLoader from "../../component/ModalLoader";

interface OTPValidationProps {
  phoneNumber: string;
  dialCode: string;  
  accountId?: string;
  onVerified: (value: boolean) => void;
}

const OTPValidation: React.FC<any> = (props: OTPValidationProps | any) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [allowResend, setAllowResend] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [minutes, setMinutes] = useState(1);
  const [intervalTimer, setIntervalTimer] = useState<any>(null);
  const [hiddenPhoneNumber, setHiddenPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setHiddenPhoneNumber(props.phoneNumber.replace(/.(?=.{4})/g, '*'));
  }, [props.phoneNumber]);

  useEffect(() => {
    intervalResend();
  }, [allowResend]);
  
  const initialValues = {
    otp: [
      { digit: "" },
      { digit: "" },
      { digit: "" },
      { digit: "" },
      { digit: "" },
      { digit: "" }
    ]
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const { dispatch } = props;
      const body = {
        phoneNumber: props.phoneNumber,
        dialCode: props.dialCode,
        oneTimePassword: otp,
      }
      setIsLoading(true);
      dispatch(verifyOtp(body))
        .then((res: any) => {
          formik.resetForm();
          setIsLoading(false);
          if (res.data.isSuccess) {
            toast.success("Phone number verified!", {
              theme: "colored",
              autoClose: 3000,
            });
            
            props.onVerified(true);
          } else {
            toast.error("Invalid OTP!", {
              theme: "colored",
              autoClose: 3000,
            });
          }
        })
        .catch((err: any) => {
          formik.resetForm();                  
          setIsLoading(false);
        });
      }
  });
  
  const resendOTPClicked = () => {
    if (!allowResend) {
      return;
    }

    const { dispatch } = props;
    
    const body = {
      phoneNumber: props.phoneNumber,
      dialCode: props.dialCode,
      accountId: props.accountId
    }

    dispatch(sendOtp(body))
      .then((res: any) => {
        formik.resetForm();
        clearInterval(intervalTimer);
        setIntervalTimer(null);
        setSeconds(30);
        setMinutes(1);
        
        if (res.data.isSuccess) {
          setAllowResend(false);
          toast.success("OTP Sent Successfully!", {
            theme: "colored",
            autoClose: 3000,
          });
        } else {
          toast.error(res.data.message, {
            theme: "colored",
            autoClose: 3000,
          });
        }
      })
      .catch((err: any) => {
        formik.resetForm();
      });    
  }

  const updateOtp = (element: any) => {
    if (element && element.parentElement) {
      const otp = Array.from(element.parentElement.children).map((input: any) => input.value).join('');
      setOtp(otp);
    }
  }

  const inputOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    element: string
  ) => {
    const target = e.target as HTMLInputElement;
    formik.setFieldValue(element, "").then(() => {
      updateOtp(target);
    });    

    if (e.key !== "Backspace" || target.value !== "") {
      return;
    }

    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const handleOTPChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    element: string,
  ) => {
    if (event.target.value === "") {
      return;
    }
    formik.setFieldValue(element, event.target.value);
    const nextElementSibling = event.target
      .nextElementSibling as HTMLInputElement | null;
  
    if (nextElementSibling) {
      nextElementSibling.focus();
    }

    updateOtp(event.target);
  };

  function intervalResend() {
    if (allowResend || intervalTimer) {
      return;
    }
    
    const timer = setInterval(() => {
      let sec: number = seconds;
      let min: number = minutes;
      
      setSeconds(seconds => {
        sec = seconds - 1;
        if (seconds == 0) {
          return -1;
        }
        return sec;
      });

      if (sec == -1) {
        sec = 59;
        setSeconds(59);
        setMinutes(minutes => {
          min = minutes - 1;
          if (min == -1) {
            min = 0;
            sec = 0;
            setSeconds(0);
          }
          return min;
        });
      }

      if (min == 0 && sec == 0) {
        setAllowResend(true);
        clearInterval(timer);
        setIntervalTimer(null);
      }
    }, 1000);
    
    setIntervalTimer(timer);
  }

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        {isLoading && <ModalLoader />}
        <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6">
          <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
            OTP Validation
          </div>

          <p className={`mt-2 font-500 text-primary w-full text-center`}>
            One Time Password (OTP) has been sent via SMS to <br/><b>{props?.dialCode}{hiddenPhoneNumber}</b>
          </p>

          <form className="otp-container" onSubmit={formik.handleSubmit}>
            <p className="mt-8 text-[#383839] font-[500] text-sm text-center">
              Enter OTP (6 digits) below to verify it
            </p>

            <div className="otp-inputs grid grid-cols-6 gap-4 mt-2">
              {initialValues.otp.map((item, index) => {
                return (
                  <input
                    className="otp-input w-[45px] md:w-[60px] md:h-[60px] h-[45px] text-center md:text-4xl text-2xl"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    disabled={isLoading}
                    {...formik.getFieldProps(`otp.${index}.digit`)}
                    onChange={(event) => handleOTPChange(event, `otp.${index}.digit`)}
                    onKeyDown={(event) => inputOnKeyDown(event, `otp.${index}.digit`)}
                  />
                );
              })}
            </div>

            <div>
              <p className="text-[#383839] font-[500] text-sm text-center">
                Didn't receive OTP? <span className={'text-primary ' + (allowResend ? 'cursor-pointer underline text-[#0000ff]' : '')} onClick={resendOTPClicked}>Resend</span>{allowResend ? '' : ` in 0${minutes}:${seconds > 9 ? seconds : '0' + seconds}`}
              </p>
            </div>
            
            <div className="w-full flex justify-center mt-12">
              <button type="submit"
                className={'bg-primary hover:bg-primary text-white text-xl py-2 px-8 md:px-8 rounded-full border-4 border-solid border-borderlight ' + (isLoading || otp.length != 6 ? ' opacity-50 cursor-not-allowed' : '')}
                disabled={isLoading || otp.length != 6}>
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default connect()(OTPValidation);

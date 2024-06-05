import React, { useState, useEffect, useRef } from "react";
import Background from "../../assets/images/loginPageBanner.jpg";
import phoneDarlingsLogo from "../../assets/images/phoneDarlingsLogo.svg";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RctPageLoader from "../../component/RctPageLoader";
import ForgotPassword from "./forgot-password";
import { useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import signInImage from "../../assets/images/signInImage.png";
import { useParams } from "react-router-dom";
import { LOCALSTORE } from "../../constant/default";
import { affiliatesVisits, authLogin } from "../../services/authService";
import "react-toastify/dist/ReactToastify.css";
import { GetToken, siteKey } from "../../constant/default";
import { auth_login, auth_details } from "../../reducer/auth";
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import twemojiBitingLip from "../../assets/images/twemojiBitingLip.svg"
import { toast } from "react-toastify";
import { useQuery } from "../../utils/useQueryHoook";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from "@fortawesome/free-solid-svg-icons";
interface Values {
  email: string;
  password: string;
}

const SignIn: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const query = useQuery();
  // const refCode = query.get('refcode')
  const userDetail = useSelector(auth_details);
  const [isLoading, setLoading] = useState(false);
  const type = localStorage.getItem(LOCALSTORE.role);
  const captchaRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const code = useSelector(auth_details);
  const [passwordError, setPasswordError] = useState(false);
  const [loginDisable, setLoginDisable] = useState(false);
  const [imageLodaed, setImageLoaded] = useState(false);
  const [loginType] = useState(["consultant", "user"]);
  const token = localStorage.getItem(LOCALSTORE.token)
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Incorrect email entered. Please try again. ")
      .required("Enter Email"),
    password: Yup.string().required("Enter Password"),
  });

  const location = useLocation()


  // useEffect(() => {
  //   const { dispatch } = props;

  //   if (refCode) {
  //     let token: any = captchaRef?.current;
  //     let tokendata = token?.executeAsync();
  //     tokendata.then((res: any) => {
  //       if (res) {
  //         dispatch(affiliatesVisits(refCode, res)).then(() => { }).catch(() => { })
  //       }
  //     })
  //   }
  // }, [refCode])

  useEffect(() => {
    if (token && userDetail?.login?.isSuccess) {
      navigate(`/${type === "User" ? "user" : "consultant"}/home`);
    }
  }, [token])

  const OnSubmit = (values: Values) => {
    setLoading(true);
    const { dispatch } = props;
    const body = {
      email: values.email,
      password: values.password,
      rememberMe: rememberMe,
    };
    setLoginDisable(true);
    let token: any = captchaRef?.current;
    let tokendata = token?.executeAsync();
    tokendata.then((res: any) => {
      if (res) {
        dispatch(authLogin(body, res))
          .then((res: any) => {
            if (res !== undefined) {
              setPasswordError(false);
              dispatch(auth_login(res.data));
              localStorage.setItem(LOCALSTORE.id, res.data.id);
              localStorage.setItem(LOCALSTORE.token, res.data.jwtToken);
              localStorage.setItem(
                LOCALSTORE.refreshToken,
                res.data.refreshToken
              );
              localStorage.setItem(LOCALSTORE.role, res.data.role);
              localStorage.setItem(
                LOCALSTORE.communicationIdentifier.token,
                res.data.communicationIdentifier.token
              );
              localStorage.setItem(
                LOCALSTORE.communicationIdentifier.expiredOn,
                res.data.communicationIdentifier.expires_on
              );
              localStorage.setItem(
                LOCALSTORE.communicationIdentifier.userId,
                res.data.communicationIdentifier.user_id
              );


              navigate(`/${res.data.role === "User" ? "user" : "consultant"}/home`);
              setLoginDisable(false);
              setLoading(false);
            }
            setLoading(false);
          })
          .catch((err: any) => {
            localStorage.setItem(LOCALSTORE.token, err.data.jwtToken);
            localStorage.setItem(LOCALSTORE.id, err.data.id)

            if (err?.status === 412) {
              if (err?.data?.isMissingIdCard || err?.data?.isMissingProfile || err?.data?.isMissingCreditCard || err?.data?.isMissingCredit || !err?.data?.isEmailVerified) {
                if (err?.data?.isEmailVerified) {
                  if (err?.data?.role === "ServiceProvider") {
                    if (err?.data?.isMissingIdCard) {
                      navigate(`/consultant/uploadImage/${err?.data?.id}`, {
                        state: { email: values?.email, password: values.password }
                      })
                    }

                    if (err?.data?.isMissingProfile && !err?.data?.isMissingIdCard) {
                      navigate(`/consultant/${err?.data?.id}/addProfile`, {
                        state: {
                          password: values.password, email: values?.email
                        }
                      });
                    }
                  }

                  if (err?.data?.role === "User") {
                    if (err?.data?.isMissingCreditCard) {
                      navigate(`/user/addCard/${err?.data?.id}`, {
                        state: {
                          email: values?.email,
                          password: values.password,
                        }
                      })
                    }

                    if (err?.data?.isMissingCredit && !err?.data?.isMissingCreditCard) {
                      navigate(`/user/TopUp`, { state: { email: values?.email, password: values.password, id: err?.id } })
                    }
                  }
                } else {
                  toast.error('Please verify your account by clicking the link in your email. If you do not see an email, check your junk or spam inbox');
                  setLoading(false);
                  setLoginDisable(false);
                }
              }
            } else {
              setPasswordError(true);
              setLoading(false);
              setLoginDisable(false);
            }
          });
      }
    });
  };

  const onClickModal = () => {
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onClickRegistration = () => {
    if (type === "user") {
      navigate("/user/registration");
    } else {
      navigate("/consultant/registration");
    }
  };

  const onClickConsultant = () => {
    navigate("/consultant/learn-more", { state: { refCode: location?.state?.refCode } });
  };

  const onClickUser = () => {
    navigate("/user/learn-more", { state: { refCode: location?.state?.refCode } });
  };

  const changePassword = (password: any) => {
    if (password === "" && passwordError) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const onChangeKeep = (e: any) => {
    setRememberMe(e.target.checked);
  };

  return (
    <>
      {isLoading && <RctPageLoader />}

      <div className="bg-white">
        <div className="w-full flex my-4 tall:my-8 justify-center">
          <div className="p-4 my-auto flex flex-col sm:p-0 w-full xl:h-[calc(100dvh_-_64px)] lg:max-h-[calc(100dvh_-_64px)] xl:max-h-auto  3xl:max-w-[30%]">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values: Values) => {
                OnSubmit(values);
              }}
              validationSchema={LoginSchema}
            >
              {({ errors, touched, handleSubmit }: any) => (
                <div className="p-2 my-auto flex items-center justify-center xl:h-[calc(100dvh_-_64px)] lg:max-h-[calc(100dvh_-_64px)] xl:max-h-auto">
                  <div className="pt-6 md:pt-8 lg:pt-0 place-content-center h-fit flex bg-[#FFFFFF] rounded-[25px] w-full lg:w-10/12 tall:w-full py-2 px-6 xl:h-[calc(100dvh_-_64px)] lg:max-h-[calc(100dvh_-_64px)] xl:max-h-auto overflow-auto smallScroll">
                    <div className="flex flex-col items-center w-full py-4 3xl:justify-center">
                      <img
                        src={phoneDarlingsLogo}
                        alt="logo"
                        className="mx-auto cursor-pointer"
                        onClick={() => navigate("/")}
                      />

                      <p className="flex mb-6 w-full leading-none lg:justify-normal text-[2rem] mt-6 tall:-[74px] text-[#525252] font-semibold">
                        Welcome, create an account.
                      </p>

                      <button
                        className={`w-full p-2.5 bg-[#F0E3FF] rounded h-15 items-center text-left text-[#36007A] text-xl font-normal`}
                        onClick={() => onClickUser()}
                      >
                        <p className="flex items-center justify-center">
                          <span className="mr-[15px]">
                            <FontAwesomeIcon icon={faCrown} />
                          </span>
                          Customers Sign Up
                        </p>
                      </button>

                      <button
                        className={`w-full mt-4 p-2.5 bg-[#36007A] border-[#969696] border rounded h-15 items-center text-left text-[#FFF] text-xl font-normal`}
                        onClick={() => onClickConsultant()}
                        autoFocus={false}
                      >
                        <p className="flex items-center justify-center pr-6">
                          <span className="mr-[15px]">
                            <img src={twemojiBitingLip} alt="twemojiBitingLip" />
                          </span>
                          Darlings Sign Up
                        </p>
                      </button>

                      <div className="my-4 tall:my-[30px] flex items-center justify-center">
                        <p>OR</p>
                      </div>

                      <div className="w-full">
                        <p className="text-[#525252] text-[2rem] font-semibold leading-none">
                          Already have an account?
                        </p>
                      </div>

                      <div className="w-full  my-3 tall:mt-8 mx-auto">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label inline-block mb-1 text-xl font-normal text-black"
                        >
                          Email:
                        </label>
                        <Field
                          type="text"
                          name="email"
                          autocomplete="off"
                          onKeyUp={(e: any) => {
                            if (e.keyCode === 13) {
                              handleSubmit()
                            }
                          }}
                          className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-1 ${errors.email &&
                            touched.email &&
                            "border-[#E85626]"
                            }`}
                        />
                        {errors.email && touched.email && (
                          <div className="text-[#E85626]">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="mb-3 tall:mb-4 w-full mx-auto">
                        <label
                          htmlFor="examplePassword0"
                          className="form-label inline-block mb-1 text-xl font-normal text-black"
                        >
                          Password:
                        </label>
                        <Field
                          type="password"
                          name="password"
                          onKeyUp={(e: any) => {
                            changePassword(e.target.value)
                            if (e.keyCode === 13) {
                              handleSubmit()
                            }
                          }
                          }
                          className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-1 ${(errors.password &&
                            touched.password &&
                            "border-[#E85626]") ||
                            (passwordError && "border-[#E85626]")
                            }`}
                        />
                        {errors.password && touched.password && (
                          <div className="text-[#E85626]">
                            {errors.password}
                          </div>
                        )}
                        {passwordError && (
                          <div className="text-[#E85626]">
                            Incorrect password entered. Please try again.
                          </div>
                        )}
                        <div
                          className="cursor-pointer text-right"
                          onClick={onClickModal}
                        >
                          Forgot Password
                        </div>
                      </div>

                      <div className="w-full mx-auto">
                        <div className="custombp:mt-4 mb-6 flex items-center">
                          <input
                            className="h-5 w-5 rounded-lg border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600  focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                            type="checkbox"
                            value=""
                            id="keepMeLoggedIn"
                            onChange={onChangeKeep}
                          />
                          <label
                            className="text-[15px] font-normal inline-block text-black"
                            htmlFor="keepMeLoggedIn"
                            style={{ fontFamily: "Montserrat" }}
                          >
                            Keep me logged in
                          </label>
                        </div>
                      </div>

                      <div>
                        <div>
                          {" "}
                          <ReCAPTCHA
                            sitekey={siteKey}
                            ref={captchaRef}
                            size="invisible"
                          />
                        </div>
                      </div>

                      <div className="text-center w-full py-4 ">
                        <button
                          className={`w-full bg-[#673AB7] border-[#969696] border rounded h-15 items-center text-left text-[#FFF] text-xl font-normal  ${loginDisable && "opacity-25"}`}
                          type="submit"
                          disabled={loginDisable}
                          onClick={() => handleSubmit()}
                          autoFocus
                        >
                          <p className="flex items-center justify-center">
                            Log In
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Formik>
          </div>

          <div className={`${imageLodaed ? "w-auto" : "w-[80%]"} ${imageLodaed ? "hidden" : "lg:block"}`}></div>
          <img
            src={Background}
            className={`hidden ${imageLodaed ? "lg:block" : "lg:hidden"} h-full max-h-[calc(100dvh_-_64px)] my-auto rounded-s-[25px] 3xl:rounded-[25px]`}
            alt="background"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        {showModal && <ForgotPassword cancel={onCloseModal} />}
      </div>
    </>
  );
};

export default connect()(SignIn);

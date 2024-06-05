import React, { useState, useEffect, useRef } from "react"
import phoneDarlingsLogo from "../../assets/images/phoneDarlingsLogo.svg"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import RctPageLoader from "../../component/RctPageLoader"
import { useLocation, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import {
  createConsult,
  createUser,
  sendOtp
} from "../../services/authService"
import { connect } from "react-redux"
import { useSelector } from "react-redux"
import { auth_details } from "../../reducer/auth"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { phoneNumberRegex, siteKey } from "../../constant/default"
import ReCAPTCHA from "react-google-recaptcha"
import whiteBackButton from "../../assets/images/whiteBackButton.svg"
import purpleBackButton from "../../assets/images/purpleBackButton.svg"
import { getallcontryList } from "../../services/homeService"
import Select, { components } from "react-select";
import { selectStyle } from "../../utils/selcetStyle"
import VerificationMailSentModal from "./verificationMailSentModal"
import { phoneRegex } from "../../utils/phoneRegex"
import { handleValidationError } from "../../functions/utilities"
import OTPValidation from "./OTP-Validation"
import { InputAdornment, TextField } from "@mui/material"

interface Values {
  lastName: string
  firstName: string
  email: string
  password: string
  reEnterPassword: string
  phoneNumber: string
  userName: string
  dialCode: string
}

const SignIn: React.FC<any> = (props: any) => {
  const navigate = useNavigate()
  const location = useLocation()
  const captchaRef = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const { type } = useParams()
  const errorMassges = ["Email"]
  const [errorEmail, setErrorEmail] = useState(false)
  const [erroruserName, setErroruserName] = useState(false)
  const code = useSelector(auth_details)
  const [condition, setCondition] = useState({ pp: false, tos: false, isOver18: false })
  const [condtionError, setConditionError] = useState({ pp: false, tos: false, isOver18: false })
  const formRef = useRef(null)
  const [countryList, setCountryList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [emailSentModal, setEmailSentModal] = useState(false);
  const [phoneValid, setPhoneValid] = useState("");
  const [phoneOTPValid, setPhoneOTPValid] = useState(true);
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const [dialCode, setDialCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const registerSchema = Yup.object().shape({
    email: Yup.string()
      .email("Incorrect email entered. Please try again. ")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    dialCode: Yup.string().required("Please select Country dial code"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string()
    .matches(phoneRegex, "Please enter valid phone number")
    .required("Phone Number is required")
    .test("phone-number-is-valid", phoneValid, a => !phoneValid),
    userName: Yup.string().required("UserName is required"),
    reEnterPassword: Yup.string()
    .required("Re-enter Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  })

  const spRegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email("Incorrect email entered. Please try again. ")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    dialCode: Yup.string().required("Please select Country dial code"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string()
      .matches(phoneRegex, "Please enter valid phone number")
      .required("Phone Number is required")
      .test("phone-number-is-valid", phoneValid, a => !phoneValid),
    reEnterPassword: Yup.string()
      .required("Re-enter Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  })

  useEffect(() => { }, [type])

  const OnSubmit = async (values: Values) => {
    if (!(phoneOTPValid && !!values.dialCode && !!values.phoneNumber)) {
      toast.error("Please verify your phone number", {
        theme: "colored",
        autoClose: 5000
      });
      return;
    }

    setLoading(true);
    setPhoneValid("");

    let schema = spRegisterSchema;
    if (type === "user")
      schema = registerSchema;

    schema.validateAt("phoneNumber", { phoneNumber: values.phoneNumber });

    const { dispatch } = props
    let token: any = captchaRef?.current
    let tokendata = token?.executeAsync()
    tokendata.then((tokenCap: any) => {
      if (type === "user") {
        if (condition?.pp && condition?.tos && condition?.isOver18) {
          const body: any = {
            email: values.email,
            firstName: values.firstName,
            password: values.password,
            passwordConfirmed: values.reEnterPassword,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            userName: values.userName,
            dialCode: values.dialCode,
            isPhoneNumberVerified: phoneOTPValid
          }
          if (location?.state && location?.state?.refCode) {
            body["refcode"] = location?.state?.refCode
          }

          dispatch(createUser(body, tokenCap))
            .then((res: any) => {
              setLoading(false)
              if (res.status === 201) {
                setEmailSentModal(true)
              }
            })
            .catch((err: any) => {
              setLoading(false);
              if (err.data.name == 'Validations' && err.data.message.indexOf("PhoneNumber") >= 0) {
                const errObj = handleValidationError(err.data.message);
                setPhoneValid(errObj.PhoneNumber);
                const ele = document.getElementsByName("phoneNumber")[0];
                ele.focus();
                schema.validateAt("phoneNumber", { phoneNumber: values.phoneNumber }).then(() => {
                  ele.blur();
                });
              } else {
                const massage = err.data.message
                const name = err.data.name
                if (errorMassges.includes(name)) {
                  setErrorEmail(true)
                } else {
                  toast.error(massage, {
                    theme: "colored",
                    autoClose: 5000
                  })
                }
              }              
            })
        } else {
          setLoading(false)
          setConditionError({ pp: condition?.pp ? false : true, tos: condition?.tos ? false : true, isOver18: condition?.isOver18 ? false : true })
        }
      } else {
        if (condition?.pp && condition?.tos && condition?.isOver18) {
          const body: any = {
            email: values.email,
            firstName: values.firstName,
            password: values.password,
            passwordConfirmed: values.reEnterPassword,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            dialCode: values.dialCode,
            isPhoneNumberVerified: phoneOTPValid
          }
          if (location?.state && location?.state?.refCode) {
            body["refcode"] = location?.state?.refCode
          }

          dispatch(createConsult(body, tokenCap))
            .then((res: any) => {
              if (res) {
                setConditionError({ pp: false, tos: false, isOver18: false })
                setLoading(false)

                if (res.status === 201) {
                  setEmailSentModal(true)
                }
              }
            })
            .catch((err: any) => {
              if (err.data.name == 'Validations' && err.data.message.indexOf("PhoneNumber") >= 0) {
                const errObj = handleValidationError(err.data.message);
                setPhoneValid(errObj.PhoneNumber);
                const ele = document.getElementsByName("phoneNumber")[0];
                ele.focus();
                schema.validateAt("phoneNumber", { phoneNumber: values.phoneNumber }).then(() => {
                  ele.blur();
                });
              } else {
                const massage = err.data.message
                const name = err.data.name
                if (errorMassges.includes(name)) {
                  setErrorEmail(true)
                } else {
                  toast.error(massage, {
                    theme: "colored",
                    autoClose: 3000
                  })
                }
              }
              
              setLoading(false)
            })
        } else {
          setConditionError({ pp: condition?.pp ? false : true, tos: condition?.tos ? false : true, isOver18: condition?.isOver18 ? false : true })
          setLoading(false)
        }
      }
    })
  }

  const onClicklogin = () => {
    navigate("/login")
  }

  const onClickConsultant = () => {
    navigate("/consultant/registration")
  }

  const changeEmail = (name: any) => {
    if (name === "" && errorEmail) {
      setErrorEmail(true)
    } else {
      setErrorEmail(false)
    }
  }

  const onChangeCondition = (e: any) => {
    if (e.target.name === "pp") {
      if (e.target.checked) {
        setConditionError({ ...condtionError, pp: false })
        setCondition({ ...condition, pp: true })
      } else {
        setConditionError({ ...condtionError, pp: true })
        setCondition({ ...condition, pp: false })
      }
    }

    if (e.target.name === "tos") {
      if (e.target.checked) {
        setConditionError({ ...condtionError, tos: false })
        setCondition({ ...condition, tos: true })
      } else {
        setConditionError({ ...condtionError, tos: true })
        setCondition({ ...condition, tos: false })
      }
    }

    if (e.target.name === "isOver18") {
      if (e.target.checked) {
        setConditionError({ ...condtionError, isOver18: false })
        setCondition({ ...condition, isOver18: true })
      } else {
        setConditionError({ ...condtionError, isOver18: true })
        setCondition({ ...condition, isOver18: false })
      }
    }
  }

  const onClickPolicy = () => {
    navigate("/legal/PP")
  }

  const onClickCondtion = () => {
    navigate("/legal/TOS")
  }

  useEffect(() => {
    getCountryListData();
  }, []);

  const getCountryListData = () => {
    const { dispatch } = props;
    const optionArr: any[] = []
    dispatch(getallcontryList())
      .then((res: any) => {
        console.log("res", res)
        res.data.map((country: any) => {
          optionArr.push({
            label: `(${country.dialCode}) ${country.name}`,
            value: country.dialCode,
            key: country.dialCode,
            chipLabel: `${country.dialCode}`
          });
        })
        setCountryList(optionArr);
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.data.chipLabel}
    </components.SingleValue>
  );

  const handleVerified = (value: boolean) => {
    setShowOTPVerification(false);
    //setPhoneOTPValid(value);
  }

  const onChangeDialCode = (setFieldValue: any, value: any) => {
    setFieldValue("dialCode", value);
    setDialCode(value);
    setSelectedOption(countryList.find((country: any) => country.value === value));
    setPhoneValid("");
    //setPhoneOTPValid(false);
  }

  const onPhoneNumberChanged = (setFieldValue: any, e: any) => {
    if (e.currentTarget.value === '' || phoneNumberRegex.test(e.currentTarget.value)) {
      setFieldValue("phoneNumber", e.currentTarget.value);
      setPhoneValid("");
      setPhoneNumber(e.currentTarget.value);
    }

    if (e.currentTarget.value.length > 0) {
      //setPhoneOTPValid(false);
    }
    
    let schema = spRegisterSchema;
    if (type === "user")
      schema = registerSchema;
    schema.validateAt("phoneNumber", { phoneNumber: e.currentTarget.value });    
  }

  const handleErrors = (err: any, values: any) => {
    if (err.data.name == 'Validations') {
      const errObj = handleValidationError(err.data.message);
      if (errObj.PhoneNumber) {
        setPhoneValid(errObj.PhoneNumber);
        toast.error(errObj.PhoneNumber, {
          theme: "colored",
          autoClose: 5000,
        });
        const ele = document.getElementsByName("phoneNumber")[0];
        ele.focus();
          
        let schema = spRegisterSchema;
        if (type === "user")
          schema = registerSchema;
        schema.validateAt("phoneNumber", { phoneNumber: values.phoneNumber }).then(() => {
          ele.blur();
        });
      }
    } else {
      const massage = err.data.message;
      toast.error(massage, {
        theme: "colored",
        autoClose: 5000,
      });
    }

    setLoading(false);
  };
  
  const sendVerifyOtp = (values: any) => {
    const { dispatch } = props;
    
    const body = {
      phoneNumber: values.phoneNumber,
      dialCode: values.dialCode,
      isSignUp: true
    }

    setLoading(true);
    dispatch(sendOtp(body))
      .then((res: any) => {
        if (res.data.isSuccess) {
          toast.success("OTP Sent Successfully!", {
            theme: "colored",
            autoClose: 3000,
          });
          setShowOTPVerification(true);
        } else {
          toast.error(res.data.message, {
            theme: "colored",
            autoClose: 3000,
          });
        }
        setLoading(false);
      })
      .catch((err: any) => {
        handleErrors(err, values);
      });
  }

  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className={`${type !== "user" ? "bg-[#36007a]" : "bg-[#F8F3FD]"} p-2 lg:p-6 min-h-screen`}>
        <div className="w-full bg-[#FFFFFF] h-[80px] rounded-b-full rounded-t-full">
          <div className="flex justify-center pt-[30px] font-bold flex-shrink-0 text-gray-800">
            <img
              src={phoneDarlingsLogo}
              alt="logo"
              className="mx-auto w-[183px] h-[26px]"
            />
          </div>
        </div>

        <div className="mt-4 lg:mt-2 w-full flex">
          <div className="lg:p-2 sm:p-0  w-full">
            <Formik
              initialValues={{
                lastName: "",
                firstName: "",
                email: "",
                password: "",
                reEnterPassword: "",
                userName: "",
                phoneNumber: "",
                dialCode: ""
              }}
              onSubmit={(values: Values) => {
                OnSubmit(values)
              }}
              innerRef={formRef}
              validationSchema={type !== "user" ? spRegisterSchema : registerSchema}
            >
              {({ errors, touched, values, setFieldValue, handleBlur }: any) => (
                <Form className="lg:p-2">
                  <div className={`py-6 place-content-center ${type !== "user" ? "bg-[#2b0062]" : "bg-[#FFFFFF]"} rounded-[25px] p-2 h-full  w-full mx-auto`}>
                    <div className="w-full flex items-center ">
                      <div
                        className="ml-6 mr-auto"
                        onClick={() => navigate(`/login`)}
                      >
                        {type !== "user" ?

                          <img src={whiteBackButton} alt="arrow" />
                          :
                          <img src={purpleBackButton} alt="arrow" />
                        }
                      </div>

                      <div className="mr-auto">
                        {type !== "user" ?
                          <>
                            <p className={`w-full text-center font-jaldi ${type === "user" ? "text-black" : "text-[#fff]"}  text-[32px] font-semibold`}>
                              Darlings, Welcome.
                            </p>
                            <p className={`w-full text-center text-base font-normal font-jaldi ${type === "user" ? "text-black" : "text-[#fff]"} `}>
                              Not a darling? Customers, click the back button to
                              sign up.{" "}
                            </p>
                          </>
                          :
                          <>
                            <p className="w-full font-jaldi text-center text-[32px] font-semibold">Welcome to Phone Darlings! The darlings await.</p>
                            <p className="w-full text-center text-base font-normal">Customers, create your account below.</p>
                          </>
                        }

                      </div>
                    </div>

                    <div className="mt-6 mx-auto font-jaldi w-11/12 lg:w-[70%]">
                      <div className="">
                        <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2 ">
                          <div className="custombp:mt-4">
                            <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"}  ml-0.5`}>
                              First Name
                            </label>
                            <Field
                              component={TextField}
                              size="small"
                              type="text"
                              name="firstName"
                              value={values.firstName}
                              autoComplete="off"
                              onChange={(e: any) => { 
                                setFieldValue("firstName", e.target.value)
                              }}
                              className={`px-3 py-1.5 text-base custombp:py-1 custombp:text-2xl form-control 
                        block w-full  font-normal text-gray-700 bg-[#ffffff80]
                        bg-clip-padding border border-solid border-[#C9C9C9] rounded transition 
                        ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none 
                        ${errors.firstName &&
                                touched.firstName &&
                                "border-[#E85626]"
                                }`}
                                InputProps={{
                                  name:"firstName",
                                }}
                            />
                            {errors.firstName && touched.firstName && (
                              <div className="text-[#E85626] leading-none">
                                {errors.firstName}
                              </div>
                            )}
                          </div>

                          <div className="custombp:mt-4">
                            <label
                              className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"} ml-0.5`}
                            >
                              Last Name
                            </label>
                            <Field
                              component={TextField}
                              type="text"
                              size="small"
                              value={values.lastName}
                              name="lastName"
                              autoComplete="off"
                              onChange={(e: any) => { 
                                setFieldValue("lastName", e.target.value)
                              }}
                              className={`px-3 py-1.5 custombp:py-1 custombp:text-2xl form-control block 
                        w-full text-base font-normal text-gray-700 bg-[#ffffff80] bg-clip-padding border
                         border-solid border-[#C9C9C9] rounded transition ease-in-out m-0 focus:text-gray-700
                          focus:bg-white focus:outline-none ${(errors.lastName &&
                                  touched.lastName &&
                                  "border-[#E85626]") ||
                                (erroruserName && "border-[#E85626]")
                                }`}
                                InputProps={{
                                  name:"lastName",
                                }}
                            />
                            {errors.lastName && touched.lastName && (
                              <div className="text-[#E85626] leading-none">
                                {errors.lastName}
                              </div>
                            )}
                          </div>

                          {type === "user" && (
                            <div className="custombp:mt-4">
                              <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"} ml-0.5`}>
                                User Name
                              </label>
                              <Field
                                component={TextField}
                                type="text"
                                name="userName"
                                autoComplete="off"
                                size="small"
                                value={values.userName}
                                onChange={(e: any) => { 
                                  setFieldValue("userName", e.target.value)
                                }}
                                className={`px-3 py-1.5 custombp:py-1 custombp:text-2xl form-control 
                        block w-full text-base font-normal text-gray-700 bg-[#ffffff80] 
                        bg-clip-padding border border-solid border-[#C9C9C9] rounded transition 
                        ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none 
                        ${errors.userName &&
                                  touched.userName &&
                                  "border-[#E85626]"
                                  }`}
                                  InputProps={{
                                    name:"userName",
                                  }}
                              />
                              {errors.userName && touched.userName && (
                                <div className="text-[#E85626] leading-none">
                                  {errors.userName}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="custombp:mt-4">
                            <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"}  ml-0.5`}>
                              Email
                            </label>
                            <Field
                              component={TextField}
                              type="text"
                              name="email"
                              autoComplete="off"
                              size="small"
                              onKeyUp={(e: any) => changeEmail(e.target.value)}
                              onChange={(e: any) => { 
                                setFieldValue("email", e.target.value)
                              }}
                              className={`px-3 py-1.5 text-base custombp:py-1 custombp:text-2xl form-control block w-full  font-normal text-gray-700 bg-[#ffffff80] bg-clip-padding border border-solid border-[#C9C9C9] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none  ${(errors.email &&
                                touched.email &&
                                "border-[#E85626]") ||
                                (errorEmail && "border-[#E85626]")
                                }`}
                                InputProps={{
                                  name:"email",
                                }}
                            />
                            {errors.email && touched.email && (
                              <div className="text-[#E85626] leading-none">
                                {errors.email}
                              </div>
                            )}
                            {errorEmail && (
                              <div className="text-[#E85626] leading-none">
                                This email has already been registered in the
                                system. Please log in to continue.
                              </div>
                            )}
                          </div>
                          <div className="custombp:mt-4">
                            <div className="flex md:items-center md:justify-between flex-col md:flex-row">
                              <div className="flex items-center justify-between w-[100%] md:w-[calc(100% - 95px)]">
                                <div className="w-[35%] md:w-[20%] lg:w-[25%] ">
                                  <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"}  ml-0.5`}>
                                    Country code
                                  </label>
                                  <div className="bg-[#ffffff80] rounded">
                                    <Select
                                      components={{ SingleValue }}
                                      options={countryList}
                                      value={selectedOption}
                                      onChange={(e: any) => onChangeDialCode(setFieldValue, e.value)}
                                      onBlur={handleBlur}
                                      styles={selectStyle}
                                      classNames={{
                                        control: () => `border border-solid border-[#C9C9C9] ${errors.dialCode &&
                                          touched.dialCode &&
                                          "border-[#E85626]"
                                          }`,
                                      }}
                                      classNamePrefix="react-select"
                                      placeholder=""
                                      isSearchable={false}
                                      name="dialCode"
                                    />
                                  </div>
                                </div>

                                <div className="w-[62%] md:w-[70%] lg:w-[73%]">
                                  <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"}  ml-0.5`}>
                                    Phone Number, Digits Only
                                  </label>
                                  <Field
                                    type="text"
                                    component={TextField}
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    autoComplete="new-password"
                                    className={`px-3 py-1.5 text-base custombp:py-1 custombp:text-2xl form-control block w-full font-normal text-gray-700 bg-[#ffffff80] bg-clip-padding border border-solid border-[#C9C9C9] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none ${errors.phoneNumber &&
                                      touched.phoneNumber &&
                                      "border-[#E85626]"
                                      }`}
                                    size="small"
                                    onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e)}}
                                    InputProps={{
                                      caches: false,
                                      name:"phoneNumber",
                                      autoComplete: 'new-password',
                                      // endAdornment: (
                                      //   <InputAdornment position="end" style={{ outline: "none" }}>
                                      //     { phoneOTPValid && !!values.dialCode && !!values.phoneNumber && (
                                      //       <div id="phone-number-verified" className="text-[#1ae11a]">Verified!</div>
                                      //     )}
                                      //   </InputAdornment>
                                      // ),
                                    }}
                                  />
                                </div>
                                
                              </div>

                              {
                                !phoneOTPValid && !!values.dialCode && !!values.phoneNumber && (
                                <div className="w-[100%] md:w-[90px] pt-[30px] ml-[0] md:ml-[10px]">
                                  <button className={`py-2 w-[100%] h-[40px] ${type !== "user" ? "bg-[#fff]" : "bg-[#673AB7]"} rounded-lg text-xl ${type !== "user" ? "text-[#673AB7]" : "text-[#fff]"}`}
                                    type="button" onClick={() => {sendVerifyOtp(values)}} disabled={isLoading}>
                                    Send OTP
                                  </button>
                                </div>
                                )
                              }
                              
                            </div>

                            {(errors.phoneNumber && touched.phoneNumber) || (errors.dialCode && touched.dialCode) ? (
                              <div className="text-[#E85626]">{errors.phoneNumber ? errors.phoneNumber as string : errors?.dialCode}</div>
                            ) : null}

                          </div>
                          <div className="custombp:mt-4">
                            <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"}  ml-0.5`}>
                              Password
                            </label>
                            <Field
                              type="password"
                              name="password"
                              component={TextField}
                              size="small"
                              autocomplete='new-password'
                              onChange={(e: any) => { 
                                setFieldValue("password", e.target.value)
                              }}
                              className={`px-3 py-1.5 text-base custombp:py-1 custombp:text-2xl form-control block w-full font-normal text-gray-700 bg-[#ffffff80] bg-clip-padding border border-solid border-[#C9C9C9] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none ${errors.password &&
                                touched.password &&
                                "border-[#E85626]"
                                }`}
                                InputProps={{
                                  name:"password",
                                  caches: false,
                                  autoComplete: 'new-password',
                                }}
                            />
                            {errors.password && touched.password && (
                              <div className="text-[#E85626] leading-none">
                                {errors.password}
                              </div>
                            )}
                          </div>
                          <div className="custombp:mt-4">
                            <label className={`form-label inline-block text-lg custombp:text-2xl font-normal ${type === "user" ? "text-black" : "text-[#fff]"}  ml-0.5`}>
                              Re-enter Password
                            </label>
                            <Field
                              type="password"
                              name="reEnterPassword"
                              autocomplete="new-password"
                              component={TextField}
                              size="small"
                              onChange={(e: any) => { 
                                setFieldValue("reEnterPassword", e.target.value)
                              }}
                              className={`px-3 py-1.5 text-base custombp:py-1 custombp:text-2xl form-control block w-full font-normal text-gray-700 bg-[#ffffff80] bg-clip-padding border border-solid border-[#C9C9C9] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none ${errors.reEnterPassword &&
                                touched.reEnterPassword &&
                                "border-[#E85626]"
                                }`}
                                InputProps={{
                                  name:"reEnterPassword",
                                  caches: false,
                                  autoComplete: 'new-password',
                                }}
                            />
                            {errors.reEnterPassword &&
                              touched.reEnterPassword && (
                                <div className="text-[#E85626] leading-none">
                                  {errors.reEnterPassword}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className={`w-full text-left my-3 font-jaldi ${type === "user" ? "text-black" : "text-[#fff]"}`}>
                        None of these fields will be shown on the platform.
                      </div>
                      
                      <div className="mb-4 mt-4 flex flex-wrap justify-normal ">
                        <div className="custombp:mt-4 flex items-center text-left relative">
                          <input
                            className={`accent-white appearance-none cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:top-[0px] before:left-0
                            before:border-2 before:border-solid ${type !== 'user' ? "before:border-[#C9C9C9]" : "before:border-[#898989]"} before:rounded-sm before:${type !== 'user' ? "bg-[#2b0062]" : "bg-[#ffffff80]"} 
                            
                            ${condition?.isOver18 ? "before:bg-[#2b0062] after:content-[''] after:block after:w-[5px] after:h-[10px] after:absolute after:rotate-45 after:border-white after:border-r-2 after:border-b-2 after:border-t-0 after:top-[4px] after:left-[7px]" : ""}`}
                            type="checkbox"
                            value=""
                            id="isOver18"
                            name="isOver18"
                            onChange={(e) => onChangeCondition(e)}
                            checked={condition?.isOver18}
                          />
                          <label
                            className={`text-[15px] ml-6 font-normal leading-none  ${type === "user" ? "text-black" : "text-[#fff]"} `}
                            htmlFor="isOver18"
                            style={{ fontFamily: "Montserrat" }}
                          >

                            I am over the age of 18.
                          </label>
                        </div>
                        {condtionError?.isOver18 && (
                          <div className="text-[#E85626] w-full mt-2 ml-6 lg:ml-0 lg:text-center">
                            select agree to the is over 18
                          </div>
                        )}
                      </div>

                      <div className="mb-4 mt-4 flex flex-wrap justify-normal">
                        <div className="custombp:mt-4 flex items-center text-left relative">
                          <input
                             className={`accent-white appearance-none cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:top-[0px] before:left-0
                             before:border-2 before:border-solid ${type !== 'user' ? "before:border-[#C9C9C9]" : "before:border-[#898989]"} before:rounded-sm before:${type !== 'user' ? "bg-[#2b0062]" : "bg-[#ffffff80]"} 
                             
                             ${condition?.pp ? "before:bg-[#2b0062] after:content-[''] after:block after:w-[5px] after:h-[10px] after:absolute after:rotate-45 after:border-white after:border-r-2 after:border-b-2 after:border-t-0 after:top-[4px] after:left-[7px]" : ""}`}
                            type="checkbox"
                            value=""
                            id="iAmAgree"
                            name="pp"
                            onChange={(e) => onChangeCondition(e)}
                            checked={condition?.pp}
                          />
                          <label
                            className={`text-[15px] ml-6 font-normal leading-none  ${type === "user" ? "text-black" : "text-[#fff]"} `}
                            htmlFor="iAmAgree"
                            style={{ fontFamily: "Montserrat" }}
                          >
                            I agree to the{" "}
                            <span
                              className="underline cursor-pointer"
                              onClick={onClickCondtion}
                            >
                              PrivacyPolicy
                            </span>{" "}
                          </label>
                        </div>
                        {condtionError?.pp && (
                          <div className="text-[#E85626] w-full mt-2 ml-6 lg:ml-0 lg:text-center">
                            select agree to the privacy policy
                          </div>
                        )}
                      </div>

                      <div className="mb-4 flex flex-wrap justify-normal">
                        <div className="custombp:mt-4 flex items-center text-left relative">
                          <input
                              className={`accent-white appearance-none cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:top-[0px] before:left-0
                              before:border-2 before:border-solid ${type !== 'user' ? "before:border-[#C9C9C9]" : "before:border-[#898989]"} before:rounded-sm before:${type !== 'user' ? "bg-[#2b0062]" : "bg-[#ffffff80]"} 
                              
                              ${condition?.tos ? "before:bg-[#2b0062] after:content-[''] after:block after:w-[5px] after:h-[10px] after:absolute after:rotate-45 after:border-white after:border-r-2 after:border-b-2 after:border-t-0 after:top-[4px] after:left-[7px]" : ""}`}
                            type="checkbox"
                            value=""
                            id="iAmAgree"
                            name="tos"
                            onChange={(e) => onChangeCondition(e)}
                            checked={condition?.tos}
                          />
                          <label
                            className={`text-[15px] ml-6 font-normal leading-none ${type === "user" ? "text-black" : "text-[#fff]"} `}
                            htmlFor="iAmAgree"
                            style={{ fontFamily: "Montserrat" }}
                          >
                            I agree to the{" "}
                            <span
                              className="underline cursor-pointer"
                              onClick={onClickCondtion}
                            >
                              Terms & Conditions
                            </span>{" "}
                          </label>
                        </div>
                        {condtionError?.tos && (
                          <div className="text-[#E85626] w-full mt-2 ml-6 lg:ml-0 lg:text-center">
                            select agree to the terms and condition
                          </div>
                        )}
                      </div>

                      <div>
                        {" "}
                        <ReCAPTCHA
                          sitekey={siteKey}
                          ref={captchaRef}
                          size="invisible"
                        />
                      </div>

                      <div className="text-center w-full mt-14 custombp:mt-16 font-jaldi">
                        <button
                          className={`py-2 w-full md:w-1/2  ${type !== "user" ? "bg-[#fff]" : "bg-[#673AB7]"} rounded-lg text-xl ${type !== "user" ? "text-[#673AB7]" : "text-[#fff]"}`}
                          type="submit"
                        >
                          Sign Me Up
                        </button>
                      </div>
                      <div className='flex justify-center mt-12 bottom-0 gap-4'>
                        <div className={`w-[8.875rem] h-2.5 ${type !== "user" ? "bg-[#5E4084]" : "bg-[#F8F3FD]"} rounded-sm`}></div>
                        <div className={`w-[8.875rem] h-2.5 ${type !== "user" ? "bg-[#5E4084]" : "bg-[#F8F3FD]"} rounded-sm`}></div>
                        <div className={`w-[8.875rem] h-2.5 ${type !== "user" ? "bg-[#5E4084] block" : "bg-[#F8F3FD] hidden"} rounded-sm`}></div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {emailSentModal && (
        <VerificationMailSentModal />
      )}

      {
        showOTPVerification && (
          <OTPValidation phoneNumber={phoneNumber} dialCode={dialCode} onVerified={handleVerified}>
          </OTPValidation>
        )
      }
    </>
  )
}

export default connect()(SignIn)

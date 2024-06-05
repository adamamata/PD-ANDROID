import React, { useState, useEffect } from "react";
import buttonPlusSign from "../../../assets/images/buttonPlusSign.svg";
import imageEditPlus from "../../../assets/images/imageEditPlus.svg";
import { auth_details, set_Total_Credit, set_profile } from "../../../reducer/auth";
import { useSelector } from "react-redux";
import Header from "../commons/header";
import {
  uploadImage64Base,
  updateAccountData,
  getAccountsData,
  sendOtp,
} from "../../../services/authService";
import RctPageLoader from "../../../component/RctPageLoader";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import defultUser from "../../../assets/images/defaultRound.svg";
import ImageCrop from "../../auth/imageCrop";
import TopUpModal from "./topUpModal";
import { toast } from "react-toastify";
import { LOCALSTORE, phoneNumberRegex } from "../../../constant/default";
import "react-toastify/dist/ReactToastify.css";
import { getTotalCredit, getallcontryList } from "../../../services/homeService";
import Select, { components } from "react-select";
import { selectStyle, userSelectStyle } from "../../../utils/selcetStyle";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { phoneRegex } from "../../../utils/phoneRegex";
import OTPValidation from "../../auth/OTP-Validation";
import { handleValidationError } from "../../../functions/utilities";
import { InputAdornment, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserProfileEdit: React.FC<any> = (props: any) => {

  const navigate = useNavigate();
  const [file, setFile] = useState<any>("");
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const profile = useSelector(auth_details);
  const [imagevalid, setImageValid] = useState<boolean>(false);
  const imageTypes = ["png", "jpg", "jpeg"];
  const [isLoading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [showCrop, setShowCrop] = useState(false);
  const [fileType, setFileType] = useState("");
  const [topUp, setTopup] = useState<boolean>(false);
  const [amout, setAmout] = useState<any>("");
  const loginId = localStorage.getItem(LOCALSTORE.id);
  const [userDetails, setUserDetails] = useState<any>();
  const [countryList, setCountryList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [phoneValid, setPhoneValid] = useState<string>("");
  const [phoneOTPValid, setPhoneOTPValid] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const [dialCode, setDialCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const details = useSelector(auth_details);
  let user_details = details?.user_profile;

  useEffect(() => {
    setDialCode(userDetails?.dialCode);
    setPhoneNumber(userDetails?.phoneNumber);
    setPhoneOTPValid(userDetails?.isPhoneNumberVerified);
  }, userDetails);

  const handleVerified = (value: boolean) => {
    setShowOTPVerification(false);
    setPhoneOTPValid(value);
  }

  const onSelectFile = async (e: any) => {
    setImageValid(false)
    const type = e.target.files[0].type;
    let imageType = type.substring(6);
    setFileType(imageType);
    const base64 = await convertBase64(e.target.files[0]);
    if (base64 instanceof Error) {
      return;
    }
    setFile(base64);
    setShowCrop(true);
    return { base64, file: e.target.files[0] };
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      if (file) {
        const fileReader = new FileReader();
        fileReader?.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = () => {
          reject(Error);
        };
      }
    });
  };

  const onChange64Base = async (file: any) => {
    onChangeFile(file).then((data: any) => {
      const cropImg = data.base64.split(",");
      const body = {
        base64: cropImg && cropImg[1],
        fileExtension: fileType,
      };
      setFile(data.base64);
      const { dispatch } = props;

      const valid = validationImage(fileType);
      if (!valid) {
        setLoading(true);
        dispatch(uploadImage64Base(profile?.user_profile?.id, body))
          .then((res: any) => {
            setLoading(false);
            toast.success("Image upload Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });
            setFile(res?.data?.profileImageUrl)
            dispatch(set_profile(res?.data));
          })
          .catch((err: any) => {
            setLoading(false);
            const massage = err.response.data.message;
            toast.error(massage, {
              theme: "colored",
              autoClose: 5000,
            });
          });
      }
    });
  };

  const onChangeFile = async (e: any) => {
    const base64 = await getBase64FromUrl(e);
    return { base64 };
  };

  const getBase64FromUrl = async (url: any) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const onSubmitFile = (file: any) => {
    onChange64Base(file);
  };

  const validationImage = (type: any) => {
    let valid = false;
    if (imageTypes.includes(type)) {
      setImageValid(false);
      valid = false;
    } else {
      setImageValid(true);
      valid = true;
    }
    return valid;
  };

  const handleClick = (event: any) => {
    hiddenFileInput.current?.click();
  };

  const updateCredit = () => {
    setLoading(true)
    const { dispatch } = props;
    dispatch(getTotalCredit(profile?.totalCredit?.accountId)).then((credit: any) => {
      dispatch(set_Total_Credit(credit?.data))
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    getAccount();
    updateCredit()
    setFile(profile?.user_profile?.profileImageUrl);
  }, []);

  const handleErrors = (err: any, values: any) => {
    if (err.data.name == 'Validations') {
      const errObj = handleValidationError(err.data.message);
      setPhoneValid(errObj.PhoneNumber);
      const ele = document.getElementsByName("phoneNumber")[0];
      ele.focus();
      validationSchema.validateAt("phoneNumber", { phoneNumber: values.phoneNumber }).then(() => {
        ele.blur();
      });
    } else {
      const massage = err.data.message;
      toast.error(massage, {
        theme: "colored",
        autoClose: 5000,
      });
    }

    setLoading(false);
  };
  
  const updateAccount = (values: any) => {    
    const { dispatch } = props;
    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      dialCode: values.dialCode,
      description: values.description,
      accountImageUrl: file,
      isPhoneNumberVerified: phoneOTPValid
    }

    setLoading(true);
    setPhoneValid("");
    validationSchema.validateSyncAt("phoneNumber", { phoneNumber: values.phoneNumber });

    dispatch(updateAccountData(userDetails?.id, body))
      .then((res: any) => {
        setLoading(false);
        toast.success("Profile update Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });
        navigate("/user/profile");
      })
      .catch((err: any) => {
        handleErrors(err, values);
      });
  };

  const sendVerifyOtp = (values: any) => {
    const { dispatch } = props;
    
    const body = {
      phoneNumber: values.phoneNumber,
      dialCode: values.dialCode,
      accountId: userDetails?.id
    }

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

  const onSubmitData = (values: any) => {
    setLoading(true);

    if (!phoneOTPValid && (userDetails.phoneNumber != values.phoneNumber || userDetails.dialCode != values.dialCode)) {
      sendVerifyOtp(values);
    } else {
      updateAccount(values);
    }

  };

  const getAccount = () => {
    setLoading(true);
    const { dispatch } = props;
    dispatch(getAccountsData())
      .then((res: any) => {
        console.log("res.data", res.data)
        setUserDetails(res.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("error", err);
      });
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const cloesCrop = () => {
    setShowCrop(false);
  };

  const onClickAmout = (value: any) => {
    setAmout(value);
    setTopup(true);
  };

  const onTopUpCancel = () => {
    setTopup(false);
  };

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

  const onChangeDialCode = (setFieldValue: any, value: any, phoneNo: string) => {
    setFieldValue("dialCode", value);
    setDialCode(value);
    setSelectedOption(countryList.find((country: any) => country.value === value));
    setPhoneOTPValid(userDetails.dialCode == value && userDetails.phoneNumber == phoneNo);
  }

  const onPhoneNumberChanged = (setFieldValue: any, e: any, dialCode: string) => {
    if(e.currentTarget.value === '' || phoneNumberRegex.test(e.currentTarget.value)) {
      setFieldValue("phoneNumber", e.currentTarget.value);
      setPhoneNumber(e.currentTarget.value);
      setPhoneValid("");
    }
    validationSchema.validateSyncAt("phoneNumber", { phoneNumber: e.currentTarget.value });
    setPhoneOTPValid(userDetails.phoneNumber == e.currentTarget.value && userDetails.dialCode == dialCode);
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Enter first name"),
    lastName: Yup.string().required("Enter last Name"),
    phoneNumber: Yup.string()
    .matches(phoneRegex, "Please enter valid phone number")
    .required("Enter Phone Number")
    .test("phone-number-is-valid",phoneValid, a => !phoneValid),
    dialCode: Yup.string().required("Please select Country dial code"),
  });

  return (
    <>
      <Formik
        initialValues={{
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          phoneNumber: userDetails?.phoneNumber,
          dialCode: userDetails?.dialCode,
          description: user_details?.description,
        }}
        validationSchema={validationSchema}
        validateOnChange
        validateOnMount
        enableReinitialize
        onSubmit={(values: any) => {
          onSubmitData(values);
        }}
      >
        {({ errors, touched, values, setFieldValue, handleBlur, handleChange }: any) => (
          <Form className="p-2">
            <div className="bg-[#F8F3FD] min-h-screen">
              {isLoading && <RctPageLoader />}
              <Header navbar={navbar} onClick={navbarClick} />
              <div className={`${navbar ? "hidden" : "block"} md:block`}>
                <div className="text-4xl px-6 py-4 2xl:py-12 2xl:ml-7 text-white font-['Montserrat']">
                  Welcome back, {profile?.user_profile?.username}.
                </div>
                <div className="flex justify-center md:justify-between flex-wrap xl:px-8 2xl:px-10">
                  <div className="w-11/12 mx-auto md:mx-auto lg:w-[33%] 2xl:w-[448px] h-full  ">
                    <div className="bg-[#ffffffb5] rounded-lg py-6 px-6">
                      <p className="text-[22px] text-center text-primary font-semibold font-['Montserrat']">
                        My Profile Overview
                      </p>

                      <input
                        type="file"
                        onChange={onSelectFile}
                        accept="image/png, image/gif, image/jpeg"
                        style={{ display: "none" }}
                        ref={hiddenFileInput}
                      />
                      {!file || file === null || file === "" ? (
                        <img
                          className="w-[147px] h-[147px] mx-auto rounded-full mt-4"
                          alt="profile"
                          onChange={onSelectFile}
                          onClick={handleClick}
                          src={defultUser}
                        />
                      ) : (
                        <div className="relative">
                          <img
                            className={`w-[147px] h-[147px] mx-auto rounded-full mt-4 ${hover && "opacity-40"
                              }`}
                            alt="profile"
                            onChange={onSelectFile}
                            onClick={handleClick}
                            src={file}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                          />
                          <div
                            className={`absolute -bottom-2 -right-11 w-full ${hover ? "block" : "hidden"
                              }`}
                          >
                            <img
                              src={imageEditPlus}
                              className="mx-auto"
                              alt=""
                              onChange={onSelectFile}
                              onClick={handleClick}
                            />
                          </div>
                        </div>
                      )}
                      {imagevalid && (
                        <div className="justify-center flex text-[#E85626]">
                          please enter valid image type valid image type .png , .jpg,
                          .jpeg
                        </div>
                      )}
                      <p className="text-2xl mt-4 text-center text-primary font-semibold font-['Montserrat']">
                        {profile?.user_profile?.name}
                      </p>

                      <p className="text-base mt-4 text-start text-primary font-[500] font-['Montserrat']">
                        First Name:
                      </p>
                      <Field
                        type="text"
                        name="firstName"
                        className={`text-base py-2 px-2 w-full rounded-lg border-2 text-primary font-[500] font-['Montserrat'] focus:outline-primary
                        ${errors.firstName &&
                            touched.firstName ? "border-[#E85626]" : "border-primary"}`}
                      />
                      {errors.firstName && touched.firstName && (
                        <div className="text-[#E85626] leading-none">
                          {`${errors.firstName}`}
                        </div>
                      )}

                      <p className="text-base mt-4 text-start text-primary font-[500] font-['Montserrat']">
                        Last Name:
                      </p>

                      <Field
                        type="text"
                        name="lastName"
                        className={`text-base py-2 px-2 w-full rounded-lg border-2 text-primary font-[500] font-['Montserrat'] focus:outline-primary
                        ${errors.lastName &&
                            touched.lastName ? "border-[#E85626]" : "border-primary"}`}
                      />
                      {errors.lastName && touched.lastName && (
                        <div className="text-[#E85626] leading-none">
                          {`${errors.lastName}`}
                        </div>
                      )}

                      <p className="text-base mt-4 text-start text-primary font-[500] font-['Montserrat']">
                        Email:
                      </p>
                      <input
                        type="text"
                        className="text-base bg-[#ffffffb5] w-full rounded-lg text-primary font-[500] font-['Montserrat']"
                        value={`${profile?.user_profile?.email || userDetails?.email}`}
                        disabled
                      />
                      <p className="sm:hidden text-base mt-4 text-start text-primary font-[500] font-['Montserrat']">
                        Phone Number:
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="w-[40%] md:w-[20%] lg:w-[40%]">
                          <p className="hidden sm:block text-base mt-2.5 text-start text-primary font-medium font-['Montserrat']">
                            Country Code:
                          </p>

                          <Select
                            components={{ SingleValue }}
                            options={countryList}
                            value={selectedOption ? selectedOption : userDetails?.dialCode ? countryList.find((country: any) => country.value === userDetails?.dialCode) : null}
                            onChange={(e: any) => onChangeDialCode(setFieldValue, e.value, values.phoneNumber)}
                            onBlur={handleBlur}
                            styles={userSelectStyle}
                            classNames={{
                              control: () => `border-2 border-solid !border-primary ${errors.dialCode &&
                                touched.dialCode &&
                                "border-[#E85626]"
                                }`,

                              indicatorSeparator: () => `!bg-primary`,

                              dropdownIndicator: () => `!text-primary`,

                              singleValue: () => `!text-primary !text-base !font-[500] !font-['Montserrat']`,
                            }}
                            classNamePrefix="react-select"
                            placeholder=""
                            isSearchable={false}
                            name="dialCode"
                          />
                        </div>

                        <div className="w-[55%] md:w-[70%] lg:w-[55%]">
                          <p className="hidden sm:block text-base mt-2.5 text-start text-primary font-medium font-['Montserrat']">
                            Phone Number:
                          </p>

                          <Field
                            type="text"
                            component={TextField}
                            name="phoneNumber"
                            autoComplete="new-password"
                            className={`text-base py-2 px-2 w-full rounded-lg !border-solid !border-2 text-primary font-[500] font-['Montserrat'] !focus:outline-primary [&>div>fieldset]:border-none
                              ${errors.phoneNumber &&
                                touched.phoneNumber ? "!border-[#E85626]" : "!border-primary"
                              }
                            `}
                            size="small"
                            onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e, values.dialCode)}}
                            InputProps={{
                              caches: false,
                              name:"phoneNumber",
                              autoComplete: 'new-password',
                              value: values.phoneNumber,
                              endAdornment: (
                                <InputAdornment position="end" style={{ outline: "none" }}>
                                  { phoneOTPValid && !!values.dialCode && !!values.phoneNumber && (
                                    <div id="phone-number-verified" className="text-[#1ae11a]">Verified!</div>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>

                        {/* <div className="w-[55%] md:w-[70%] lg:w-[55%]">
                          <p className="hidden sm:block text-base mt-2.5 text-start text-primary font-medium font-['Montserrat']">
                            Phone Number:
                          </p>

                          <Field
                            type="text"
                            name="phoneNumber"
                            className={`form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.phoneNumber &&
                              touched.phoneNumber ?
                              "border-[#E85626]" : "border-primary"
                              }`}
                              onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e, values.dialCode)}}
                          />
                        </div> */}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-[40%] md:w-[20%] lg:w-[40%]">
                        {(errors.dialCode && touched.dialCode) ? (
                            <div className="text-[#E85626]">{errors.dialCode}</div>
                          ) : null}
                        </div>
                        <div className="w-[55%] md:w-[70%] lg:w-[55%]">
                          {(errors.phoneNumber && touched.phoneNumber) ? (
                            <div className="text-[#E85626]">{errors.phoneNumber as string}</div>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-base mt-4 text-start text-primary font-[500] font-['Montserrat']">
                        Description:
                      </p>

                      <textarea
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        className={`text-base py-2 px-2 w-full h-[150px] resize-none rounded-lg border-2 text-primary font-[500] font-['Montserrat'] focus:outline-primary
                        ${errors.description &&
                            touched.description ? "border-[#E85626]" : "border-primary"}`}
                      />
                      {errors.description && touched.description && (
                        <div className="text-[#E85626] leading-none">
                          {`${errors.description}`}
                        </div>
                      )}

                      <div className="flex flex-wrap justify-center mt-6">
                        <button
                          className="bg-primary mx-auto mt-4 sm:mt-0 sm:mx-0 text-white text-base hover:text-white py-2 px-10  border-2 border-solid border-primary  rounded-full"
                        >
                          {
                            userDetails && !phoneOTPValid && (userDetails.phoneNumber != values.phoneNumber || userDetails.dialCode != values.dialCode)
                            ? 'Send Verification Code'
                            : 'Save'
                          }
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-11/12 mx-auto md:mx-auto lg:w-[65%] mt-4 lg:mt-0 w-full 2xl:w-[856px] h-full 2xl:h-[594px] bg-white rounded-lg py-6 px-6">
                    <p className="text-[22px] text-center text-[#37085B] font-semibold font-['Montserrat']">
                      My Account
                    </p>

                    <div>
                      <div className="flex flex-wrap justify-between items-center mt-8">
                        <div>
                          <p className="text-base text-[#37085B] font-['Montserrat']">
                            My Credits
                          </p>
                          <p className="text-[40px] font-bold text-[#37085B] font-['Montserrat']">
                            ${profile && profile?.totalCredit && profile?.totalCredit?.balance ? profile?.totalCredit?.balance.toFixed(2) : ""}
                          </p>
                        </div>
                        <div>
                          {" "}
                          {/* <button className="bg-white hover:bg-[#37085B] text-[#37085B] text-base hover:text-white py-2 border-2 border-solid border-[#37085B] px-8 hover:border-transparent rounded-full">
                      Transaction History
                    </button> */}
                        </div>
                      </div>

                      <div className="flex mt-4 justify-between flex-wrap -mx-[10px]">
                        <div className="w-full h-[62px] sm:w-1/4 md:1/4 2xl:w-1/4 flex justify-center md:flex-none">
                          <button
                            className="bg-[#37085B] w-[165px] h-full text-white font-bold py-2 px-4 rounded-[10px]"
                            onClick={() => onClickAmout("40")}
                          >
                            <div className="flex items-center justify-center w-full">
                              <img src={buttonPlusSign} alt="buttonPlusSign" />
                              <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                                $40
                              </span>
                            </div>
                          </button>
                        </div>

                        <div className="w-full h-[62px] mt-4 md:mt-0 sm:w-1/4 md:1/4 2xl:w-1/4 flex justify-center md:flex-none">
                          <button
                            className="bg-[#37085B] w-[165px] h-full text-white font-bold py-2 px-4 rounded-[10px]"
                            onClick={() => onClickAmout("60")}
                          >
                            <div className="flex items-center justify-center w-full">
                              <img src={buttonPlusSign} alt="buttonPlusSign" />
                              <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                                $60
                              </span>
                            </div>
                          </button>
                        </div>

                        <div className="w-full h-[62px] mt-4 md:mt-0 sm:w-1/4 md:1/4 2xl:w-1/4 flex justify-center md:flex-none">
                          <button
                            className="bg-[#37085B] w-[165px] h-full text-white font-bold py-2 px-4 rounded-[10px]"
                            onClick={() => onClickAmout("100")}
                          >
                            <div className="flex items-center justify-center w-full">
                              <img src={buttonPlusSign} alt="buttonPlusSign" />
                              <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                                $100
                              </span>
                            </div>
                          </button>
                        </div>

                        <div className="w-full h-[62px] mt-4 md:mt-0 sm:w-1/4 md:1/4 2xl:w-1/4 flex justify-center md:flex-none">
                          <button
                            className="bg-[#37085B] w-[165px] h-full text-white font-bold py-2 px-4 rounded-[10px]"
                            onClick={() => onClickAmout("other")}
                          >
                            <div className="flex items-center justify-center w-full">
                              <img src={buttonPlusSign} alt="buttonPlusSign" />
                              <span className="font-['Montserrat'] text-2xl font-medium text-white ml-2">
                                Other
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {showCrop && (
        <ImageCrop
          cloesCrop={cloesCrop}
          file={file}
          onSubmitFile={onSubmitFile}
          cropShape={"round"}
        />
      )}
      {topUp && (
        <TopUpModal
          onCancel={onTopUpCancel}
          onSuccess={onTopUpCancel}
          amount={amout}
          insufficientCredits={false}
        />
      )}
      
      {showOTPVerification && (
          <OTPValidation  phoneNumber={phoneNumber} 
                          dialCode={dialCode} 
                          accountId={userDetails?.id}
                          onVerified={handleVerified}>            
          </OTPValidation>
      )}
    </>
  );
};

export default connect()(UserProfileEdit);

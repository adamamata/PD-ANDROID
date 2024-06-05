import React, { useState, useEffect } from "react";
import Header from "../commons/header";
import { useSelector } from "react-redux";
import { auth_details, set_Account_Data, set_profile, set_Total_Credit } from "../../../reducer/auth";
import { sendOtp, updateAccountData, uploadImageAddProfile } from "../../../services/authService";
import RctPageLoader from "../../../component/RctPageLoader";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import defultUser from "../../../assets/images/defaultRound.svg";
import imageEditPlus from "../../../assets/images/imageEditPlus.svg";
import ImageCrop from "../../auth/imageCrop";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTotalCredit, getallcontryList, myTransctions } from "../../../services/homeService";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select, { components } from "react-select";
import { selectStyle } from "../../../utils/selcetStyle";
import { phoneRegex } from "../../../utils/phoneRegex";
import OTPValidation from "../../auth/OTP-Validation";
import { handleValidationError } from "../../../functions/utilities";
import { InputAdornment, TextField } from "@mui/material";
import { phoneNumberRegex } from "../../../constant/default";

const UserProfile: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const details = useSelector(auth_details);
  let user_details = details?.user_profile;
  const accountData = details?.accountData
  const { dispatch } = props;

  const [file, setFile] = useState<any>();
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const [imagevalid, setImageValid] = useState<boolean>(false);
  const imageTypes = ["png", "jpg", "jpeg"];
  const [isLoading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [showCrop, setShowCrop] = useState(false);
  const [fileType, setFileType] = useState("");
  const [countryList, setCountryList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [phoneValid, setPhoneValid] = useState("");
  const [phoneOTPValid, setPhoneOTPValid] = useState(true);
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const [dialCode, setDialCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  useEffect(() => {
    setDialCode(accountData?.dialCode);
    setPhoneNumber(accountData?.phoneNumber);
    setPhoneOTPValid(accountData?.isPhoneNumberVerified);
  }, accountData);

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
        dispatch(uploadImageAddProfile(body))
          .then((res: any) => {
            setLoading(false);
            toast.success("Image upload Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });
            setFile(res?.data?.data)
            // dispatch(set_profile({ ...user_details, profileImageUrl: res?.data?.data }));
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

  const onChangeFile = async (e: any) => {
    const base64 = await getBase64FromUrl(e);
    return { base64 };
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
    dispatch(getTotalCredit(details?.totalCredit?.accountId)).then((credit: any) => {
      dispatch(set_Total_Credit(credit?.data))
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    updateCredit();
    setFile(accountData?.accountImageUrl);
  }, [user_details, accountData]);

  const updateAccount = (values: any) => {
    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      dialCode: values.dialCode,
      accountImageUrl: file,
      isPhoneNumberVerified: phoneOTPValid
    }

    setPhoneValid("");
    validationSchema.validateAt("phoneNumber", { phoneNumber: values.phoneNumber });

    dispatch(updateAccountData(accountData.id, body))
      .then((res: any) => {
        setLoading(false);
        toast.success("Profile update Successfull!", {
          theme: "colored",
          autoClose: 3000,
        });
        // dispatch(set_profile(res?.data));
        dispatch(set_Account_Data(res?.data))
        navigate("/consultant/profile");
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
      accountId: accountData.id,
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

    if (!phoneOTPValid && (accountData.phoneNumber != values.phoneNumber || accountData.dialCode != values.dialCode)) {
      sendVerifyOtp(values);
    } else {
      updateAccount(values);
    }
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const cloesCrop = () => {
    setShowCrop(false);
  };

  const onSubmitFile = (file: any) => {
    onChange64Base(file);
  };

  const handleVerified = (value: boolean) => {
    setShowOTPVerification(false);
    setPhoneOTPValid(value);
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Enter first name"),
    lastName: Yup.string().required("Enter last Name"),
    phoneNumber: Yup.string()
    .matches(phoneRegex, "Please enter valid phone number")
    .required("Enter Phone Number")
    .test("phone-number-is-valid", phoneValid, a => !phoneValid),
    dialCode: Yup.string().required("Please select Country dial code"),
  });

  useEffect(() => {
    getCountryListData();
  }, []);

  const getCountryListData = () => {
    const { dispatch } = props;
    const optionArr: any[] = []
    dispatch(getallcontryList())
      .then((res: any) => {
        res.data.map((country: any) => {
          optionArr.push({
            label: `(${country.dialCode}) ${country.name}`,
            value: country.dialCode,
            key: country.dialCode,
            chipLabel: `${country.dialCode}`
          });
        })
        setCountryList(optionArr);
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
    setPhoneOTPValid(accountData.dialCode == value && accountData.phoneNumber == phoneNo);
  }

  const onPhoneNumberChanged = (setFieldValue: any, e: any, dialCode: string) => {
    if(e.currentTarget.value === '' || phoneNumberRegex.test(e.currentTarget.value)) {
      setFieldValue("phoneNumber", e.currentTarget.value);
      setPhoneNumber(e.currentTarget.value);
      setPhoneValid("");
    }
    
    validationSchema.validateAt("phoneNumber", { phoneNumber: e.currentTarget.value });

    setPhoneOTPValid(accountData.phoneNumber == e.currentTarget.value && accountData.dialCode == dialCode);
  }

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
        autoClose: 3000,
      });
    }
    setLoading(false);
  };
  
  return (
    <>
      {isLoading && <RctPageLoader />}
      <Formik
        initialValues={{
          firstName: accountData?.firstName,
          lastName: accountData?.lastName,
          phoneNumber: accountData?.phoneNumber,
          dialCode: accountData?.dialCode,
        }}
        validationSchema={validationSchema}
        validateOnChange
        validateOnMount 
        onSubmit={(values: any) => {
          onSubmitData(values);
        }}
      >
        {({ errors, touched, values, setFieldValue, handleBlur }: any) => (
          <Form className="">
            <div className="bg-[#F8F3FD] min-h-screen">
              <Header navbar={navbar} onClick={navbarClick} />
              <div className={`${navbar ? "hidden" : "block"} md:block`}>
                <div className="text-2xl md:text-4xl px-6 py-2 2xl:py-12 2xl:ml-7 text-white font-['Montserrat']">
                  Welcome back, {accountData?.firstName}.
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
                        {user_details.name}
                      </p>

                      <p className="text-base mt-4 text-start text-primary font-medium font-['Montserrat']">
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

                      <p className="text-base mt-4 text-start text-primary font-medium font-['Montserrat']">
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

                      <p className="text-base mt-4 text-start text-primary font-medium font-['Montserrat']">
                        Email:
                      </p>
                      <input
                        type="text"
                        className="text-base bg-[#ffffffb5] w-full rounded-lg text-primary font-[500] font-['Montserrat']"
                        value={`${accountData.email}`}
                        disabled
                      />

                      <div className="flex items-center justify-between">
                        <div className="w-[40%] md:w-[20%] lg:w-[40%]">
                          <p className="text-base mt-2.5 text-start text-primary font-medium font-['Montserrat']">
                            Country Code:
                          </p>

                          <Select
                            menuPlacement="top"
                            components={{ SingleValue }}
                            options={countryList}
                            value={selectedOption ? selectedOption : accountData?.dialCode ? countryList.find((country: any) => country.value === accountData.dialCode) : null}
                            onChange={(e: any) => onChangeDialCode(setFieldValue, e.value, values.phoneNumber)}
                            onBlur={handleBlur}
                            styles={selectStyle}
                            classNames={{
                              control: () => `!border-2 border-solid ! !py-1.5 !px-2 !rounded-lg !text-primary border-primary ${errors.dialCode &&
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
                          <p className="text-base mt-2.5 text-start text-primary font-medium font-['Montserrat']">
                            Phone Number:
                          </p>
                          <Field
                            type="text"
                            component={TextField}
                            name="phoneNumber"
                            autoComplete="new-password"
                            className={`text-base py-2 px-2 w-full rounded-lg !border-solid !border-2 text-primary font-[500] font-['Montserrat'] !focus:outline-primary [&>div>fieldset]:border-none
                              ${errors.phoneNumber && touched.phoneNumber ? "!border-[#E85626]" : "!border-primary"}`}
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


                      <div className="flex flex-wrap justify-center mt-6">
                        <button
                          className="bg-primary mx-auto mt-4 sm:mt-0 sm:mx-0 text-white text-base hover:text-white py-2 px-10  border-2 border-solid border-primary  rounded-full">
                          {
                            !phoneOTPValid && (accountData.phoneNumber != values.phoneNumber || accountData.dialCode != values.dialCode)
                            ? 'Send Verification Code'
                            : 'Save'
                          }
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-11/12 mx-auto md:mx-auto lg:w-[65%] mt-4 lg:mt-0 w-full 2xl:w-[856px] h-full">
                    <div className="bg-[#ffffffb5] rounded-lg py-6 px-6">
                      <p className="text-[22px] text-center text-primary font-semibold font-['Montserrat']">
                        My Account
                      </p>

                      <div>
                        <div className="flex flex-wrap justify-between items-center mt-8">
                          <div>
                            <p className="text-base text-primary font-['Montserrat'] font-bold">
                              My Credits
                            </p>
                            <p className="text-[40px] font-bold text-primary font-['Montserrat']">
                              ${details && details?.totalCredit && details?.totalCredit?.balance !== undefined ? details?.totalCredit?.balance.toFixed(2) : ""}
                            </p>
                          </div>
                          <div>
                            {" "}
                            <button className="bg-primary hover:bg-primary text-white text-base hover:text-white py-2 border-2 border-solid border-primary px-6 hover:border-transparent rounded-full font-['Montserrat']">
                              Withdraw Funds
                            </button>
                          </div>
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

      {
        showOTPVerification && (
          <OTPValidation phoneNumber={phoneNumber} 
                        dialCode={dialCode} 
                        accountId={accountData.id}
                        onVerified={handleVerified}>
            
          </OTPValidation>
        )
      }
    </>
  );
};

export default connect()(UserProfile);

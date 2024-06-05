import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import { Formik, Form, Field } from "formik";
import RctPageLoader from "../../../component/RctPageLoader";
import { usePaymentInputs, PaymentInputsWrapper } from "react-payment-inputs";
import { css } from "styled-components";
import Select from "react-select";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getallcontryList,
  addNewCardData,
  getStateSearchList,
} from "../../../services/homeService";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { phoneRegex } from "../../../utils/phoneRegex";
import { phoneNumberRegex } from "../../../constant/default";
interface Values {
  cardName: string;
  cardType: any;
  address: any;
  postalCode: any;
}

const UserPayment: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation()
  const params = useParams();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [expiry, setExpiry] = useState<any>("");
  const [cardNumber, setCardNumber] = useState<any>("");
  const [cvc, setcvc] = useState<any>("");
  const [expiryError, setExpiryError] = useState<boolean>(false);
  const [cnumberError, setCnumberError] = useState<boolean>(false);
  const [CVCError, setCVCError] = useState<boolean>(false);
  const [cardDisable, setCardDisable] = useState(false);
  const [contry, setContry] = useState<any>([]);
  const [options, setOption] = useState<any>([]);
  const [state, setState] = useState<any>("");
  const [administrativeArea, setAdministrativeArea] = useState<any>("");
  const [countryError, setCountryError] = useState(false);
  const [selectedDialCode, setSelectedDialCode] = useState()

  useEffect(() => {
    getCountryListData();
  }, []);

  const getCountryListData = () => {
    const { dispatch } = props;
    dispatch(getallcontryList())
      .then((res: any) => {
        setContry(res.data);
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    wrapperProps,
  } = usePaymentInputs();

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "1px",
      background: "transparent",
      minHeight: "auto",

      // Overwrittes the different states of border
      borderColor: state.isFocused ? null : null,
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? null : null,
      },
    }),

    indicators: (base: any, state: any) => ({
      ...base,
      background: "white !important",
    }),
  };

  const onInputChange = (id: any) => {
    const { dispatch } = props;
    if (id) {
      dispatch(getStateSearchList(id))
        .then((res: any) => {
          const temp: any = [];
          res.data.map((item: any) => {
            const obj = {
              value: item.name,
              label: item.name,
              id: item.id,
              alpha2: item.alpha2,
            };
            temp.push(obj);
          });
          setOption(temp);
        })
        .catch((err: any) => {
          console.log("err");
        });
    }
  };

  const onChangeCountry = (e: any) => {
    onInputChange(e.target.value);
    if (e.target.value) {
      setCountryError(false);
      contry.map((country: any) => {
        if (country.id == e.target.value) {
          setSelectedDialCode(country.dialCode)
        }
      })
    } else {
      setCountryError(true);
    }
  };

  const onChangeCVC = (e: any) => {
    if (e.target.value !== "") {
      setCVCError(false);
      setcvc(e.target.value);
    } else {
      setCVCError(true);
    }
  };

  const onChangeCardNmber = (e: any) => {
    if (e.target.value !== "") {
      setCnumberError(false);
      setCardNumber(e.target.value);
    } else {
      setCnumberError(true);
    }
  };

  const onChangesOption = (selectedOption: any) => {
    setAdministrativeArea(selectedOption);
  };

  const cardNewSchema = Yup.object().shape({
    cardName: Yup.string().required("Enter Card Name"),
    cardType: Yup.string().required("Enter Card Type"),
    country: Yup.string().required("Enter Country"),
    state: Yup.string().required("Enter State"),
    address: Yup.string().required("Enter Address"),
    postalCode: Yup.string().required("Enter postal Code"),
    city: Yup.string().required("City is required field"),
    phoneNumber: Yup.string().matches(phoneRegex, "Please enter valid phone number").required("Enter Phone Number"),
    email: Yup.string()
      .email("Incorrect email entered. Please try again. ")
      .required("Enter Email"),
  });

  const OnSubmit = (values: any) => {
    const { dispatch } = props;
    if (meta.error === undefined) {
      setisLoading(true);
      setCardDisable(true);
      const eDate = values.expiryDate.replace(/\s/g, "");
      const card = values.cardNumber.replace(/\s/g, "");
      const body = {
        userId: params.id,
        cardHolder: values.cardName,
        cardNo: card,
        expDate: eDate,
        cvcCode: values.cvc,
        cardType: values.cardType,
        state: values.state,
        country: contry.find((country: any) => country?.id === Number(values.country))?.name,
        address1: values.address,
        postalCode: values.postalCode,
        administrativeArea: administrativeArea,
        city: values?.city,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        dialCode: selectedDialCode
      };


      dispatch(addNewCardData(body))
        .then((res: any) => {
          if (res.data) {
            setExpiryError(false);
            setCVCError(false);
            setCnumberError(false);
            setisLoading(false);
            setCountryError(false);
            toast.success("Add Card Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });
            navigate(`/user/TopUp`, {
              state: {
                password: location.state.password,
                email: location.state.email,
              }
            });
          }
        })
        .catch((err: any) => {
          setisLoading(false);
          const massage = err.response.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
        });
    }

  };

  const onChangeData = (e: any, setFieldValue: any) => {
    if (e.target.value !== "") {
      setFieldValue("expiryDate", e.target.value);
    }
  };

  useEffect(() => {
    if (state) {
      const selectedOptionAlpha2 = options.find((option: any) => option.value === state).alpha2
      onChangesOption(selectedOptionAlpha2)
    }
  }, [state])

  const onPhoneNumberChanged = (setFieldValue: any, e: any) => {
    if (e.currentTarget.value === '' || phoneNumberRegex.test(e.currentTarget.value)) {
      setFieldValue("phoneNumber", e.currentTarget.value)
    }
  }
  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className="bg-[#F8F3FD] min-h-screen px-2 md:px-6">
        <div className="w-full mb-6 py-8 h-[80px] rounded-b-full rounded-t-full">
          <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
            <img
              src={phoneDarlingsLogo}
              alt="logo"
              className="mx-auto w-[183px] h-[26px]"
            />
          </div>
        </div>
        <div>
          <Formik
            initialValues={{
              cardName: "",
              cardType: "",
              address: "",
              postalCode: "",
              state: "",
              country: "",
              expiryDate: "",
              cardNumber: "",
              cvc: "",
              email: location?.state?.email,
              phoneNumber: phoneNumberRegex.test(location?.state?.phoneNumber) ? location?.state?.phoneNumber : '',
              city: location?.state?.city
            }}
            onSubmit={(values: any) => {
              OnSubmit(values);
            }}
            validate={() => {
              let errors = {} as any;
              if (meta.erroredInputs.cardNumber) {
                //@ts-ignore
                if (meta.focused === "cardNumber") {
                  errors.cardNumber = ""
                } else {
                  errors.cardNumber = meta.erroredInputs.cardNumber;
                }
              }
              if (meta.erroredInputs.expiryDate) {
                //@ts-ignore
                if (meta.focused === "expiryDate") {
                  errors.expiryDate = "";
                } else {
                  errors.expiryDate = meta.erroredInputs.expiryDate;
                }
              }
              if (meta.erroredInputs.cvc) {
                //@ts-ignore
                if (meta.focused === "cvc") {
                  errors.cvc = '';
                } else {
                  errors.cvc = meta.erroredInputs.cvc;
                }
              }
              return errors;
            }}
            enableReinitialize
            validateOnBlur={true}
            validationSchema={cardNewSchema}
          >
            {({ errors, touched, values, setFieldValue, handleSubmit, setErrors }: any) => (
              <Form>
                <div className="p-2">
                  <div className="p-4 md:p-8 place-content-center flex bg-[#FFFFFF] rounded-[25px]">
                    <div className="">
                      <div className="text-center">
                        <p className="w-full font-sans text-center text-[32px]">Almost There! Enter your payment information to begin.</p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="lg:mt-10 mb-6">
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Cardholder Name
                          </label>
                          <Field
                            type="text"
                            name="cardName"
                            autocomplete="off"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                          focus:outline-none border-1 ${errors.cardName &&
                              touched.cardName &&
                              "border-[#E85626]"
                              }`}
                          />
                          {errors.cardName && touched.cardName && (
                            <div className="text-[#E85626]">
                              {errors.cardName as string}
                            </div>
                          )}
                        </div>
                        <div className="lg:mt-10 mb-6">
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Card Number
                          </label>
                          <div
                            className={`${cnumberError && "border-[#E85626]"}`}
                          >
                            <PaymentInputsWrapper
                              {...wrapperProps}
                              styles={{
                                fieldWrapper: {
                                  base: css`
                                    width: 100%;
                                  `,

                                  errored: css``,
                                },
                                inputWrapper: {
                                  base: css`
                                    width: 100%;
                                  `,
                                  errored: css`
                            box-shadow: none
                            border: 2px solid #D1D5DB
                            `,
                                  focused: css`
                               box-shadow: none
                               border: 2px solid #D1D5DB
                            `,
                                },
                                input: {
                                  base: css`
                                    width: 100%;
                                  `,
                                  errored: css``,
                                  cardNumber: css`
                                    width: 100%;
                                  `,
                                  expiryDate: css``,
                                  cvc: css``,
                                },
                                errorText: {
                                  base: css`
                                    display: none;
                                  `,
                                },
                              }}
                            >
                              <Field name="cardNumber">
                                {({ field }: any) => (
                                  <input {...getCardNumberProps({ onChange: field.onChange, onBlur: field.onBlur })} />
                                )}
                              </Field>
                            </PaymentInputsWrapper>
                          </div>
                          {errors.cardNumber && touched.cardNumber && (
                            <div className="text-[#E85626]">{errors.cardNumber as string}</div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
                        <div>
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Expiry
                          </label>

                          <div>
                            <PaymentInputsWrapper
                              {...wrapperProps}
                              styles={{
                                fieldWrapper: {
                                  base: css`
                                      width: 100%;
                                    `,

                                  errored: css``,
                                },
                                inputWrapper: {
                                  base: css`
                                      width: 100%;
                                    `,
                                  errored: css`
                            box-shadow: none
                            border: 2px solid #D1D5DB
                            `,
                                  focused: css`
                               box-shadow: none
                               border: 2px solid #D1D5DB
                            `,
                                },
                                input: {
                                  base: css`
                                      width: 100%;
                                    `,
                                  errored: css``,
                                  cardNumber: css`
                                      width: 100%;
                                    `,
                                  expiryDate: css``,
                                  cvc: css``,
                                },
                                errorText: {
                                  base: css`
                                      display: none;
                                    `,
                                },
                              }}
                            >
                              <Field name="expiryDate">
                                {({ field }: any) => (
                                  <input {...getExpiryDateProps({ onBlur: field.onBlur, onChange: field.onChange })} />
                                )}
                              </Field>
                            </PaymentInputsWrapper>
                          </div>
                          {errors.expiryDate && touched.expiryDate && (
                            <div className="text-[#E85626]">{errors.expiryDate as string}</div>
                          )}
                        </div>

                        <div className="">
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className="form-label inline-block mb-1 text-xl font-normal text-black "
                          >
                            CVV/CVC
                          </label>

                          <div className="">
                            <PaymentInputsWrapper
                              {...wrapperProps}
                              styles={{
                                fieldWrapper: {
                                  base: css`
                                      width: 100%;
                                    `,

                                  errored: css``,
                                },
                                inputWrapper: {
                                  base: css`
                                      width: 100%;
                                    `,
                                  errored: css`
                          box-shadow: none
                          border: 2px solid #D1D5DB
                          `,
                                  focused: css`
                             box-shadow: none
                             border: 2px solid #D1D5DB
                          `,
                                },
                                input: {
                                  base: css`
                                      width: 100%;
                                    `,
                                  errored: css``,
                                  cardNumber: css`
                                      width: 100%;
                                    `,
                                  expiryDate: css``,
                                  cvc: css``,
                                },
                                errorText: {
                                  base: css`
                                      display: none;
                                    `,
                                },
                              }}
                            >
                              <Field name="cvc">
                                {({ field }: any) => (
                                  <input {...getCVCProps({ onBlur: field.onBlur, onChange: field.onChange })} />
                                )}
                              </Field>
                            </PaymentInputsWrapper>
                          </div>
                          {errors.cvc && touched.cvc && (
                            <div className="text-[#E85626]">{errors.cvc as string}</div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="mb-4 ">
                          <label
                            htmlFor="examplePassword0"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Card Type
                          </label>
                          <Field
                            as="select"
                            name="cardType"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.cardType &&
                              touched.cardType &&
                              "border-[#E85626]"
                              }`}
                          >
                            <option value={""}>Select Card</option>
                            <option value={"VISA"}>VISA</option>
                            <option value={"MASTER"}>MASTER</option>
                            {/* <option value={"BANK"}>BANK</option> */}
                          </Field>
                          {errors.cardType && touched.cardType && (
                            <div className="text-[#E85626]">{errors.cardType as string}</div>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label inline-block mb-1 text-xl font-normal text-black"
                        >
                          Address
                        </label>
                        <Field
                          type="text"
                          name="address"
                          autocomplete="off"
                          className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                          focus:outline-none border-1 ${errors.address &&
                            touched.address &&
                            "border-[#E85626]"
                            }`}
                        />
                        {errors.address && touched.address && (
                          <div className="text-[#E85626]">{errors.address as string}</div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                        <div className="mb-6 ">
                          <label
                            htmlFor="examplePassword0"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            City
                          </label>
                          <Field
                            type="text"
                            name="city"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.city &&
                              touched.city &&
                              "border-[#E85626]"
                              }`}
                          />
                          {errors.city && touched.city && (
                            <div className="text-[#E85626]">
                              {errors.city as string}
                            </div>
                          )}
                        </div>
                        <div className="mb-6 ">
                          <label
                            htmlFor="examplePassword0"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Country
                          </label>
                          <Field
                            as="select"
                            name="country"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.country &&
                              touched.country &&
                              "border-[#E85626]"
                              }`}
                            onChange={(e: any) => {
                              onChangeCountry(e)
                              setFieldValue("country", e.target.value)
                            }}
                          >
                            <option value={""}>Select Country</option>
                            {contry.map((res: any) => {
                              return <option value={res.id}>{res.name}</option>;
                            })}
                          </Field>
                          {errors.country && touched.country && (
                            <div className="text-[#E85626]">{errors.country as string}</div>
                          )}
                        </div>
                        <div className="mb-6 ">
                          <label
                            htmlFor="examplePassword0"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            State
                          </label>
                          <Field
                            as="select"
                            name="state"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.state &&
                              touched.state &&
                              "border-[#E85626]"
                              }`}
                            value={values?.state}
                            onChange={(e: any) => {
                              setFieldValue("state", e.target.value);
                              setState(e.target.value)
                            }}
                          >
                            <option value={""}>Select State</option>
                            {options.map((option: any) => {
                              return (
                                <option value={option?.value}>{option?.value}</option>
                              )
                            }
                            )}
                          </Field>

                          {errors.state && touched.state && (
                            <div className="text-[#E85626]">{errors.state as string}</div>
                          )}
                        </div>{" "}
                        <div className="mb-6 ">
                          <label
                            htmlFor="examplePassword0"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Postal Code
                          </label>
                          <Field
                            type="text"
                            name="postalCode"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.postalCode &&
                              touched.postalCode &&
                              "border-[#E85626]"
                              }`}
                          />
                          {errors.postalCode && touched.postalCode && (
                            <div className="text-[#E85626]">
                              {errors.postalCode as string}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
                        <div className="">
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Email
                          </label>
                          <Field
                            type="text"
                            name="email"
                            autocomplete="off"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                          focus:outline-none border-1 ${errors.email &&
                              touched.email &&
                              "border-[#E85626]"
                              }`}
                          />
                          {errors.email && touched.email && (
                            <div className="text-[#E85626]">
                              {errors.email as string}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className="form-label inline-block mb-1 text-xl font-normal text-black"
                          >
                            Phone Number
                          </label>

                          <div className="flex items-center justify-between">
                            <div className="w-[25%] md:w-[15%]">
                              <Field
                                type="text"
                                name="dialCode"
                                disabled
                                value={selectedDialCode}
                                className={`form-control w-full block px-2 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.dialCode &&
                                  touched.dialCode &&
                                  "border-[#E85626]"
                                  }`}
                              />
                            </div>

                            <div className="w-[70%] md:w-[82%]">
                              <Field
                                type="text"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e) }}
                                className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.phoneNumber &&
                                  touched.phoneNumber &&
                                  "border-[#E85626]"
                                  }`}
                              />
                            </div>

                          </div>
                            {errors.phoneNumber && touched.phoneNumber && (
                              <div className="text-[#E85626]">{errors.phoneNumber as string}</div>
                            )}

                        </div>

                      </div>

                      <div className="custombp:mt-4 mb-6 flex items-center">
                        <input
                          className="h-5 w-5 rounded-lg border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600  focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="checkbox"
                          value=""
                          id="saveCard"
                        />
                        <label
                          className="text-[15px] font-normal inline-block text-black"
                          htmlFor="saveCard"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          Save this card to my account for future use.
                        </label>
                      </div>

                      <div className="custombp:mt-4 mb-6 flex items-center">
                        <input
                          className="h-5 w-5 rounded-lg border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600  focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="checkbox"
                          value=""
                          id="iAmOver18"
                        />
                        <label
                          className="text-[15px] font-normal inline-block text-black"
                          htmlFor="iAmOver18"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          I am over the age of 18.
                        </label>
                      </div>
                      <div className="text-center mb-6">
                        <button
                          className="bg-[#673AB7] px-14 py-2 rounded-lg text-2xl text-white"
                          disabled={cardDisable}
                          type="submit"
                        >
                          Let’s go see the ladies!
                        </button>
                      </div>

                      <div className="flex justify-center mt-16 bottom-1 mb-2 gap-4">
                        <div className="md:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#2B0062] rounded-sm"></div>
                        <div className="md:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#F8F3FD] rounded-sm "></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default connect()(UserPayment);

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import {
  addNewCardData,
  getallcontryList,
  getStateSearchList,
} from "../../../services/homeService";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { auth_details } from "../../../reducer/auth";
import { usePaymentInputs, PaymentInputsWrapper } from "react-payment-inputs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { css } from "styled-components";
import Select from "react-select";
import { phoneRegex } from "../../../utils/phoneRegex";
import ModalLoader from "../../../component/ModalLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { phoneNumberRegex } from "../../../constant/default";

interface Values {
  cardName: string;
  cardType: any;
  address: any;
  postalCode: any;
  state: any
}

const AddNewCard: React.FC<any> = (props: any) => {
  const { cancel, getCardDetails, currentCardDetails } = props;
  const details = useSelector(auth_details);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [expiry, setExpiry] = useState<any>("");
  const [cardNumber, setCardNumber] = useState<any>("");
  const [cvc, setcvc] = useState<any>("");
  const [expiryError, setExpiryError] = useState<boolean>(false);
  const [cnumberError, setCnumberError] = useState<boolean>(false);
  const [CVCError, setCVCError] = useState<boolean>(false);
  const [cardDisable, setCardDisable] = useState(false);
  const [countryList, setCountryList] = useState<any>([]);
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
        setCountryList(res.data);
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
        userId: details?.user_profile?.id,
        cardHolder: values.cardName,
        cardNo: card,
        expDate: eDate,
        cvcCode: values.cvc,
        cardType: values.cardType,
        state: values.state,
        country: countryList.find((country: any) => country?.id === Number(values.country))?.name,
        address1: values.address,
        postalCode: values.postalCode,
        administrativeArea: administrativeArea,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        dialCode: selectedDialCode,
        city: values?.city
      };

      dispatch(addNewCardData(body))
        .then((res: any) => {
          if (res.data) {
            setExpiryError(false);
            setCVCError(false);
            setCnumberError(false);
            setisLoading(false);
            setCountryError(false);
            getCardDetails();
            toast.success("Add Card Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });

            cancel();
          }
        })
        .catch((err: any) => {
          setisLoading(false);
          const massage = err.response.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
          cancel();
        });
    }

  };

  const cancelData = () => {
    props.cancel();
  };

  const onInputChange = (id: any) => {
    const { dispatch } = props;
    if (id) {
      dispatch(getStateSearchList(id))
        .then((res: any) => {
          const temp: any = [];
          res.data.map((item: any) => {
            const obj = {
              label: item.name,
              value: item.name,
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
    if (e.target.value) {
      setCountryError(false);
      onInputChange(e.target.value);
      if (e.target.value) {
        countryList.map((country: any) => {
          if (country.id == e.target.value) {
            setSelectedDialCode(country.dialCode)
          }
        })
      } else {
        setCountryError(true);
      }
    };
  }

  const onChangesOption = (selectedOption: any) => {
    setAdministrativeArea(selectedOption);
    // setState(selectedOption.label);
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
      <div className="w-full">
        <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl py-8">
          {isLoading && <ModalLoader />}
          <div className="relative font-['Montserrat'] w-11/12  mx-auto max-w-3xl bg-white rounded px-6 py-8 h-[100%] smallScroll overflow-auto">
            <div
              className="flex justify-end text-xl font-bold text-black cursor-pointer"
              onClick={cancelData}
            >
              <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
            </div>
            <div className="text-primary text-center text-3xl font-bold 2xl:mt-4">
              Add New Card
            </div>
            <Formik
              initialValues={{
                cardName: currentCardDetails?.cardHolder ?? "",
                cardType: currentCardDetails?.cardType ?? "",
                address: currentCardDetails?.address1 ?? "",
                postalCode: currentCardDetails?.currentCardDetails ?? "",
                state: currentCardDetails?.state ?? "",
                country: currentCardDetails?.country ?? "",
                expiryDate: currentCardDetails?.expDate ?? "",
                cardNumber: currentCardDetails?.cardNo ?? "",
                cvc: "",
                city: currentCardDetails?.city ?? "",
                email: currentCardDetails?.email ?? details?.user_profile?.email ?? "",
                phoneNumber: currentCardDetails?.phoneNumber ?? details?.user_profile?.phoneNumber ?? "",
                dialCode: currentCardDetails?.dialCode ?? ""
              }}
              enableReinitialize
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
              validationSchema={cardNewSchema}
              validateOnBlur={true}
            >
              {({ errors, touched, values, setFieldValue, handleSubmit, setErrors }) => (
                <>
                  <Form>
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                      >
                        Cardholder Name
                      </label>

                      <Field
                        type="text"
                        name="cardName"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.cardName &&
                          touched.cardName &&
                          "border-[#E85626]"
                          }`}
                      />
                      {errors.cardName && touched.cardName && (
                        <div className="text-[#E85626]">{errors.cardName as string}</div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                      >
                        Card Number
                      </label>
                      <div className={`${cnumberError && "border-[#E85626]"}`}>
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
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
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
                    <div className="mt-4 grid grid-cols-2">
                      <div>
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
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

                      <div className="ml-2">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
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
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                      >
                        Address
                      </label>

                      <Field
                        type="text"
                        name="address"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.address && touched.address && "border-[#E85626]"
                          }`}
                      />
                      {errors.address && touched.address && (
                        <div className="text-[#E85626]">{errors.address as string}</div>
                      )}
                    </div>{" "}

                    <div className="mt-4">
                      <div className="w-[50%]">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                        >
                          City
                        </label>

                        <Field
                          type="text"
                          name="city"
                          className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.city && touched.city && "border-[#E85626]"
                            }`}
                        />
                        {errors.city && touched.city && (
                          <div className="text-[#E85626]">{errors.city as string}</div>
                        )}
                      </div>
                    </div>{" "}

                    <div className="mt-4 flex">
                      <div className="w-[50%]">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
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
                            console.log("e", e.target.value)
                            onChangeCountry(e)
                            setFieldValue("country", e.target.value)
                          }}
                        >
                          <option value={""}>Select Country</option>
                          {countryList.map((res: any) => {
                            return <option value={res.id}>{res.name}</option>;
                          })}
                        </Field>
                        {errors.country && touched.country && (
                          <div className="text-[#E85626]">{errors.country as string}</div>
                        )}
                      </div>

                      <div className="ml-4 w-[50%]">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
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
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
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
                        <div className="text-[#E85626]">{errors.postalCode as string}</div>
                      )}
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                      >
                        Email
                      </label>

                      <Field
                        type="text"
                        name="email"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.email &&
                          touched.email &&
                          "border-[#E85626]"
                          }`}
                      />
                      {errors.email && touched.email && (
                        <div className="text-[#E85626]">{errors.email as string}</div>
                      )}
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                      >
                        Phone Number
                      </label>

                      <div className="flex items-center justify-between">
                        <div className="w-[18%] md:w-[10%]">
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

                        <div className="w-[80%] md:w-[88%]">
                          <Field
                            type="text"
                            name="phoneNumber"
                            onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e)}}
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
                    {/* {administrativeArea !== "" ? (
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
                      >
                        Administrative Area
                      </label>

                      <Field
                        type="text"
                        name="administrativeArea"
                        value={administrativeArea}
                        disable={true}
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 `}
                      />
                    </div>
                  ) : (
                    ""
                  )} */}
                    <div className="mt-4">
                      <input
                        className="h-6 w-6 rounded-lg border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600  focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                        type="checkbox"
                        value=""
                        id="saveCard"
                      />
                      <label
                        className="text-base font-['Montserrat'] custombp:text-lg font-normal inline-block text-black"
                        htmlFor="saveCard"
                      >
                        Save Card
                      </label>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                      <button
                        className={`bg-primary hover:bg-white hover:text-primary text-white text-xl py-1 px-12 md:px-16 rounded-full border-2 border-primary
                      ${cardDisable && "opacity-25"}`}
                        disabled={cardDisable}
                        type="submit"
                      >
                        Add Card
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
        <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
      </div>
    </>
  );
};

export default connect()(AddNewCard);

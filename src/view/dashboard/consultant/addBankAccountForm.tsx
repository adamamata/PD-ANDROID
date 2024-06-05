import React from 'react'
import { Field, Form, Formik } from 'formik';
import Select, { components } from "react-select";
import * as Yup from "yup";
import { phoneRegex } from '../../../utils/phoneRegex';
import { selectStyle } from '../../../utils/selcetStyle';
import { phoneNumberRegex } from '../../../constant/default';

interface Values {
  fName: string;
  lName: string;
  address: string;
  city: string;
  zipCode: string;
  pNumber: string;
  email: string;
  bankName: string;
  RoutingNumber: string;
  accountNumber: string;
}

const cardNewSchema = Yup.object().shape({
  fName: Yup.string().required("Enter First Name"),
  lName: Yup.string().required("Enter Last Name"),
  address: Yup.string().required("Enter address"),
  city: Yup.string().required("Enter City"),
  zipCode: Yup.string().required("Enter zipCode"),
  pNumber: Yup.string().matches(phoneRegex, "Please enter valid phone number").required("Enter Phone Number"),
  email: Yup.string().email().required("Enter email"),
  bankName: Yup.string().required("Enter Bank Name"),
  RoutingNumber: Yup.string().required("Enter Bank Routing Number"),
  accountNumber: Yup.string().required("Enter Account Number"),
  state: Yup.string().required("State is Required"),
  country: Yup.string().required("Country is Required"),
  ein: Yup.string().when(
    "ssn", { is: (val: any) => !val || val.trim() === "", then: Yup.string().required("Enter EIN Number"), otherwise: Yup.string() }
  ).matches(/^(0[1-6]||1[0-6]|2[0-7]|[35]\d|[468][0-8]|7[1-7]|9[0-47-9])-\d{7}$/, "Please Enter Valid EIN in this format XX-XXXXXXX"),
  ssn: Yup.string().when(
    "ein", { is: (val: any) => !val || val.trim() === "", then: Yup.string().required("Enter SSN Number"), otherwise: Yup.string() }
  ).matches(/^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/, "Please Enter Valid SSN in this format XXX-XX-XXXX")
}, [['ssn', 'ein'], ['ein', 'ssn']]);

const BankAccountForm = (props: any) => {
  const {onSubmit, countryList, onChangeCountry, selectedState, onChangeState, options, selectedDialCode, accountType, onChangeAccount} = props;
  const onPhoneNumberChanged = (setFieldValue: any, e: any) => {
    if (e.currentTarget.value === '' || phoneNumberRegex.test(e.currentTarget.value)) {
      setFieldValue("pNumber", e.currentTarget.value)
    }
  }

  return (
    <Formik
      initialValues={{
        fName: "",
        lName: "",
        address: "",
        city: "",
        zipCode: "",
        pNumber: "",
        email: "",
        bankName: "",
        RoutingNumber: "",
        accountNumber: "",
        ein: "",
        ssn: "",
        state: "",
        country: ""
      }}
      onSubmit={(values: Values) => {
        onSubmit(values);
      }}
      validationSchema={cardNewSchema}
    >
      {({ errors, touched, setFieldValue, values, handleBlur }: any) => (
        <Form>

          <div className="mt-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                First Name
              </label>

              <div>
                <Field
                  type="text"
                  name="fName"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.fName && touched.fName && "border-[#E85626]"
                    }`}
                />
                {errors.fName && touched.fName && (
                  <div className="text-[#E85626]">{errors.fName}</div>
                )}
              </div>
            </div>

            <div className="ml-2">
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                Last Name
              </label>

              <div className="">
                <Field
                  type="text"
                  name="lName"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.lName && touched.lName && "border-[#E85626]"
                    }`}
                />
                {errors.lName && touched.lName && (
                  <div className="text-[#E85626]">{errors.lName}</div>
                )}
              </div>
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
              <div className="text-[#E85626]">{errors.address}</div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                City
              </label>

              <div>
                <Field
                  type="text"
                  name="city"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.city && touched.city && "border-[#E85626]"
                    }`}
                />
                {errors.city && touched.city && (
                  <div className="text-[#E85626]">{errors.city}</div>
                )}
              </div>
            </div>

            <div className="ml-2">
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                Postal Code
              </label>

              <div>
                <Field
                  type="text"
                  name="zipCode"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.zipCode &&
                    touched.zipCode &&
                    "border-[#E85626]"
                    }`}
                />
                {errors.zipCode && touched.zipCode && (
                  <div className="text-[#E85626]">{errors.zipCode}</div>
                )}
              </div>
            </div>
          </div>{" "}

          <div className="mt-4 grid items-start grid-cols-1 md:grid-cols-2">
            <div className="w-full">
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                Country
              </label>
              <Select
                value={countryList ? countryList.find((option: any) => option.value === values.country) : ''}
                onChange={(option: any) => onChangeCountry(setFieldValue, option.value)}
                onBlur={handleBlur}
                options={countryList}
                styles={selectStyle}
                className=""
                classNamePrefix="react-select"
                name="country"
              />

              {errors.state && touched.state && (
                <div className="text-[#E85626]">{errors.country}</div>
              )}
            </div>

            <div className="mt-4 md:mt-0 md:ml-2">
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                State
              </label>

              <Select
                value={selectedState}
                onChange={(option: any) => onChangeState(setFieldValue, option.value)}
                onBlur={handleBlur}
                options={options}
                styles={selectStyle}
                className=""
                classNamePrefix="react-select"
                name="state"
              />

              {!selectedState && errors.state && touched.state && (
                <div className="text-[#E85626]">{errors.state}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Phone Number
            </label>
            <div className="flex items-center justify-between">
              <div className="w-[30%] sm:w-[25%] md:w-[17%]">
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

              <div className="w-[65%] sm:w-[70%] md:w-[80%]">
                <Field
                  type="text"
                  name="pNumber"
                  onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e)}}
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.phoneNumber &&
                    touched.phoneNumber &&
                    "border-[#E85626]"
                    }`}
                />
              </div>
            </div>

            {errors.pNumber && touched.pNumber && (
              <div className="text-[#E85626]">{errors.pNumber}</div>
            )}
          </div>{" "}

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
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.email && touched.email && "border-[#E85626]"
                }`}
            />
            {errors.email && touched.email && (
              <div className="text-[#E85626]">{errors.email}</div>
            )}
          </div>{" "}

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Bank Name{" "}
            </label>

            <Field
              type="text"
              name="bankName"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.bankName &&
                touched.bankName &&
                "border-[#E85626]"
                }`}
            />
            {errors.bankName && touched.bankName && (
              <div className="text-[#E85626]">{errors.bankName}</div>
            )}
          </div>{" "}

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Bank Routing Number
            </label>

            <Field
              type="text"
              name="RoutingNumber"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.RoutingNumber &&
                touched.RoutingNumber &&
                "border-[#E85626]"
                }`}
            />
            {errors.RoutingNumber && touched.RoutingNumber && (
              <div className="text-[#E85626]">
                {errors.RoutingNumber}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Bank Account Number
            </label>

            <Field
              type="text"
              name="accountNumber"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.accountNumber &&
                touched.accountNumber &&
                "border-[#E85626]"
                }`}
            />
            {errors.accountNumber && touched.accountNumber && (
              <div className="text-[#E85626]">
                {errors.accountNumber}
              </div>
            )}
          </div>{" "}

          <div className="mt-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              >
                Account Type
              </label>

              <div>
                <input
                  type="radio"
                  className="accent-primary w-[17px] h-[17px]"
                  name="radio1"
                  value="Savings"
                  onChange={onChangeAccount}
                  checked={accountType === "Savings"}
                />
                <label
                  className="ml-2 text-[14px]"
                  htmlFor="flexRadioDefault2"
                >
                  Savings
                </label>
              </div>
            </div>

            <div className="ml-2">
              <label
                htmlFor="exampleFormControlInpu3"
                className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
              ></label>

              <div>
                <input
                  type="radio"
                  className="accent-primary w-[17px] h-[17px]"
                  name="radio1"
                  value="Checking"
                  checked={accountType === "Checking"}
                  onChange={onChangeAccount}
                />
                <label
                  className="ml-2 text-[14px]"
                  htmlFor="flexRadioDefault2"
                >
                  Checking
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Employer Identification Number (EIN)
            </label>
            <Field
              placeholder="xx-xxxxxxx"
              type="text"
              name="ein"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.ein &&
                touched.ein &&
                "border-[#E85626]"
                }`}
            />
            {errors.ein && touched.ein && (
              <div className="text-[#E85626]">
                {errors.ein}
              </div>
            )}

          </div>

          <p className="mt-4">Or</p>

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Social Security Number (SSN)
            </label>
            <Field
              placeholder="xxx-xx-xxxx"
              name="ssn"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.ssn &&
                touched.ssn &&
                "border-[#E85626]"
                }`}
            />
            {errors.ssn && touched.ssn && (
              <div className="text-[#E85626]">
                {errors.ssn}
              </div>
            )}
          </div>

          <div className="w-full flex justify-center mt-4">
            <button className="bg-btnprimary hover:bg-primary text-white text-xl py-1 px-12 md:px-16 rounded-full border-4 border-solid border-borderlight">
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default BankAccountForm;

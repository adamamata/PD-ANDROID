import React from 'react'
import { Field, Form, Formik } from 'formik';
import Select, { components } from "react-select";
import * as Yup from "yup";
import { phoneRegex } from '../../../utils/phoneRegex';
import { selectStyle } from '../../../utils/selcetStyle';

interface Values {
  fName: string;
  lName: string;
  bankAddress: string;
  city: string;
  zipCode: string;
  email: string;
  bankName: string;
  accountNumber: string;
}

const cardNewSchema = Yup.object().shape({
  bankName: Yup.string().required("Enter Bank Name"),
  bankAddress: Yup.string().required("Enter Bank address"),
  bankCity: Yup.string().required("Enter Bank City"),
  bankZipCode: Yup.string().required("Enter Bank zipCode"),
  bankCountry: Yup.string().required("Bank Country is Required"),
  bankState: Yup.string().required("Bank State is Required"),
  address: Yup.string().required("Enter address"),
  city: Yup.string().required("Enter City"),
  zipCode: Yup.string().required("Enter zipCode"),
  country: Yup.string().required("Country is Required"),
  state: Yup.string().required("State is Required"),
  fName: Yup.string().required("Enter First Name"),
  lName: Yup.string().required("Enter Last Name"),
  accountNumber: Yup.string().required("Enter Account Number"),
  swiftCode: Yup.string().required("BIC/SWIFT Code is Required"),
  email: Yup.string().email().required("Enter email"),
});

const AddWiseBankAccountForm = (props: any) => {
  const { onSubmit, countryList, onChangeCountry, selectedState, onChangeState, options } = props;


  return (
    <Formik
      initialValues={{
        bankName: "",
        bankAddress: "",
        bankCity: "",
        bankZipCode: "",
        bankCountry: "",
        bankState: "",
        address: "",
        city: "",
        zipCode: "",
        country: "",
        state: "",
        fName: "",
        lName: "",
        accountNumber: "",
        swiftCode: "",
        email: ""
      }}
      onSubmit={(values: Values) => {
        onSubmit(values);
      }}
      validationSchema={cardNewSchema}
    >
      {({ errors, touched, setFieldValue, values, handleBlur }: any) => (
        <Form>
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
          </div>

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Bank Address{" "}
            </label>

            <Field
              type="text"
              name="bankAddress"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.bankAddress &&
                touched.bankAddress &&
                "border-[#E85626]"
                }`}
            />
            {errors.bankAddress && touched.bankAddress && (
              <div className="text-[#E85626]">{errors.bankAddress}</div>
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
                  name="bankCity"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.bankCity && touched.bankCity && "border-[#E85626]"
                    }`}
                />
                {errors.bankCity && touched.bankCity && (
                  <div className="text-[#E85626]">{errors.bankCity}</div>
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
                  name="bankZipCode"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.bankZipCode &&
                    touched.bankZipCode &&
                    "border-[#E85626]"
                    }`}
                />
                {errors.bankZipCode && touched.bankZipCode && (
                  <div className="text-[#E85626]">{errors.bankZipCode}</div>
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
                value={countryList ? countryList.find((option: any) => option.value === values.bankCountry) : ''}
                onChange={(option: any) => onChangeCountry(setFieldValue, option.value, "bankCountry")}
                onBlur={handleBlur}
                options={countryList}
                styles={selectStyle}
                className=""
                classNamePrefix="react-select"
                name="bankCountry"
              />

              {errors.bankCountry && touched.bankCountry && (
                <div className="text-[#E85626]">{errors.bankCountry}</div>
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
                // value={selectedState}
                onChange={(option: any) => onChangeState(setFieldValue, option.value, "bankState")}
                onBlur={handleBlur}
                options={options}
                styles={selectStyle}
                className=""
                classNamePrefix="react-select"
                name="bankState"
              />

              {!selectedState && errors.bankState && touched.bankState && (
                <div className="text-[#E85626]">{errors.bankState}</div>
              )}
            </div>
          </div>

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
              Address{" "}
            </label>

            <Field
              type="text"
              name="address"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.bankAddress &&
                touched.bankAddress &&
                "border-[#E85626]"
                }`}
            />
            {errors.bankAddress && touched.bankAddress && (
              <div className="text-[#E85626]">{errors.bankAddress}</div>
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
                onChange={(option: any) => onChangeCountry(setFieldValue, option.value, "country")}
                onBlur={handleBlur}
                options={countryList}
                styles={selectStyle}
                className=""
                classNamePrefix="react-select"
                name="country"
              />

              {errors.country && touched.country && (
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
                // value={selectedState}
                onChange={(option: any) => onChangeState(setFieldValue, option.value, "state")}
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
              Account Number or IBAN
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

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              BIC/SWIFT Code
            </label>

            <Field
              type="text"
              name="swiftCode"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.swiftCode &&
                touched.swiftCode &&
                "border-[#E85626]"
                }`}
            />
            {errors.swiftCode && touched.swiftCode && (
              <div className="text-[#E85626]">
                {errors.swiftCode}
              </div>
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

export default AddWiseBankAccountForm

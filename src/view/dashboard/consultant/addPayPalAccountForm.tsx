import React, {useState} from 'react'
import { Field, Form, Formik } from 'formik';
import Select, { components } from "react-select";
import * as Yup from "yup";
import { phoneRegex } from '../../../utils/phoneRegex';
import { selectStyle } from '../../../utils/selcetStyle';
import { phoneNumberRegex } from '../../../constant/default';

interface Values {
  fName: string;
  lName: string;
  payPalUserName: string;
  email?: string;
  phoneNumber?: string;
}

const cardNewSchema = Yup.object().shape({
  fName: Yup.string().required("Enter First Name"),
  lName: Yup.string().required("Enter Last Name"),
  payPalUserName: Yup.string().required("Enter Pay Pal Username"),
  phoneNumber: Yup.string().when(
    "email", { is: (val: any) => !val || val.trim() === "", then: Yup.string().required("Enter Phone Number"), otherwise: Yup.string() }
  ).matches(phoneRegex, "Please enter valid phone number"),
  email: Yup.string().when(
    "phoneNumber", { is: (val: any) => !val || val.trim() === "", then: Yup.string().email().required("Enter Email"), otherwise: Yup.string() }
  ),
  dialCode: Yup.string().when(
    "phoneNumber", { is: (val: any) => val, then: Yup.string().required("Please select Country dial code"), otherwise: Yup.string() }
  ),
}, [['email', 'phoneNumber'], ['phoneNumber', 'email']]);

const AddPayPalAccountForm = (props: any) => {
  const { onSubmit, countryList } = props;
  const [selectedOption, setSelectedOption] = useState("")


  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.data.chipLabel}
    </components.SingleValue>
  );

  const onChangeDialCode = (setFieldValue: any, value: any) => {
    setFieldValue("dialCode", value)
    setSelectedOption(countryList.find((country: any) => country.value === value))
  }

  const onPhoneNumberChanged = (setFieldValue: any, e: any) => {
    if (e.currentTarget.value === '' || phoneNumberRegex.test(e.currentTarget.value)) {
      setFieldValue("phoneNumber", e.currentTarget.value)
    }
  }

  return (
    <Formik
      initialValues={{
        fName: "",
        lName: "",
        payPalUserName: "",
        email: "",
        dialCode: "",
        phoneNumber: ""
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
              PayPal Username
            </label>

            <Field
              type="text"
              name="payPalUserName"
              className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.payPalUserName &&
                touched.payPalUserName &&
                "border-[#E85626]"
                }`}
            />
            {errors.payPalUserName && touched.payPalUserName && (
              <div className="text-[#E85626]">
                {errors.payPalUserName}
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
          </div>

          <div className="mt-4">
            <label
              htmlFor="exampleFormControlInpu3"
              className="form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black"
            >
              Phone Number
            </label>
            <div className="flex items-center justify-between">
              <div className="w-[35%] md:w-[20%] lg:w-[25%]">
                <Select
                  components={{ SingleValue  }}
                  options={countryList}
                  value={selectedOption}
                  onChange={(e: any) => onChangeDialCode(setFieldValue, e.value)}
                  onBlur={handleBlur}
                  styles={selectStyle}
                  classNames={{
                    control: () => `border-2 border-solid border-gray-300 ${errors.dialCode &&
                      touched.dialCode &&
                      "border-[#E85626]"
                      }`,
                  }}
                  classNamePrefix="react-select"
                  placeholder=""
                  name="dialCode"
                />
              </div>

              <div className="w-[62%] md:w-[70%] lg:w-[73%]">
                <Field
                  type="text"
                  name="phoneNumber"
                  onChange={(e: any) => { onPhoneNumberChanged(setFieldValue, e)}}
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none ${errors.phoneNumber && touched.phoneNumber && "border-[#E85626]"
                }`}
                />
              </div>
            </div>

            {(errors.phoneNumber && touched.phoneNumber) || (errors.dialCode && touched.dialCode) ? (
              <div className="text-[#E85626]">{errors.phoneNumber ? errors.phoneNumber as string : errors?.dialCode}</div>
            ) : null}
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

export default AddPayPalAccountForm

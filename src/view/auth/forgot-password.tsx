import React, { useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { forgotPasswords } from "../../services/authService";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { siteKey } from "../../constant/default";
interface Values {
  email: string;
}

interface DProps {
  cancel: any;
}
const ForgotPassword: React.FC<DProps> = (props: DProps | any) => {
  const { cancel } = props;
  const captchaRef = useRef(null);
  const [emailError, setemailError] = useState(false);
  const forgotSchema = Yup.object().shape({
    email: Yup.string()
      .email("Incorrect email entered. Please try again. ")
      .required("Enter Email"),
  });

  const OnSubmit = (values: Values) => {
    const { dispatch } = props;
    const body = {
      email: values.email,
    };
    let token: any = captchaRef?.current;
    let tokendata = token?.executeAsync();
    tokendata.then((res: any) => {
      if (res) {
        dispatch(forgotPasswords(body ,res))
          .then((res: any) => {
            if (res.data.isSuccess) {
              toast.success("please check your email !", {
                theme: "colored",
                autoClose: 5000,
              });
              setemailError(false);
              cancel();
            } else {
              setemailError(true);
            }
          })
          .catch((err: any) => {
            console.log("error");
          });
      }
    });
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden p-12 overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative w-auto my-6 mx-auto max-w-xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div
              className="flex justify-end text-2xl font-bold text-black mr-4 cursor-pointer"
              onClick={cancel}
            >
              x
            </div>
            <Formik
              initialValues={{
                email: "",
              }}
              onSubmit={(values: Values) => {
                OnSubmit(values);
              }}
              validationSchema={forgotSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="relative p-6 flex-auto">
                    <div className="flex justify-center text-2xl font-bold text-[#061989]">
                      Forgot Password
                    </div>
                    <div className="mb-3 xl:w-96 mt-8 mx-8">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label inline-block mb-1 text-xl font-normal text-black"
                      >
                        Please enter the registered email
                      </label>
                      <Field
                        type="text"
                        name="email"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${
                          (errors.email &&
                            touched.email &&
                            "border-[#E85626]") ||
                          (emailError && "border-[#E85626]")
                        }`}
                      />
                      {errors.email && touched.email && (
                        <div className="text-[#E85626]">{errors.email}</div>
                      )}
                      {emailError && (
                        <div className="text-[#E85626]">Email not found.</div>
                      )}

                      <p className="mt-4 text-center">Instructions to reset your password will be sent to the email address above. </p>
                    </div>
                  </div>
                  <div>
                    {" "}
                    <ReCAPTCHA
                      sitekey={siteKey}
                      ref={captchaRef}
                      size="invisible"
                    />
                  </div>

                  <div className="text-center mt-2 mb-12">
                    <button
                      className="bg-btnprimary hover:bg-primary text-white text-lg py-1 px-14 rounded-full border-4 border-solid border-borderlight"
                      type="submit"
                    >
                      Reset My Password
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default connect()(ForgotPassword);

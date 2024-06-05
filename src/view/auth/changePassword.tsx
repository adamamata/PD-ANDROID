import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { chnagePassword } from "../../services/authService";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { auth_details } from "../../reducer/auth";
import RctPageLoader from "../../component/RctPageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Values {
  password: string;
  newPassword: string;
  reEnterPassword: string;
}

interface DProps {
  cancel: any;
}
const ChangePassword: React.FC<DProps> = (props: DProps | any) => {
  const details = useSelector(auth_details);
  let login = details?.login;
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { cancel } = props;
  const changePasswordSchema = Yup.object().shape({
    password: Yup.string().required("Enter Password"),
    newPassword: Yup.string()
      .required("Enter New Password")
      .min(8, "Password must be at least 8 characters"),
    reEnterPassword: Yup.string()
      .required("Enter re Enter Password")
      .min(8, "Password must be at least 8 characters")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const OnSubmit = (values: Values) => {
    const { dispatch } = props;
    setLoading(true);
    const body = {
      currentPassword: values.password,
      newPassword: values.newPassword,
      newPasswordConfirmed: values.reEnterPassword,
    };
    dispatch(chnagePassword(login.id, body))
      .then((res: any) => {
        if (res.data.isSuccess) {
          toast.success("passwrod Change successfull !", {
            theme: "colored",
            autoClose: 5000,
          });
          cancel();
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        if (err.response.data.name === "Current Password") {
          setPasswordError(true);
        } else {
          setPasswordError(false);
        }
      });
  };

  return (
    <>
      {loading && <RctPageLoader />}
      <div className="w-11/12 justify-center mx-auto items-center flex overflow-x-hidden md:p-10 overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div
              className="flex justify-end text-2xl font-bold text-black mr-4 cursor-pointer"
              onClick={cancel}
            >
              x
            </div>
            <Formik
              initialValues={{
                password: "",
                newPassword: "",
                reEnterPassword: "",
              }}
              onSubmit={(values: Values) => {
                OnSubmit(values);
              }}
              validationSchema={changePasswordSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="relative p-6 flex-auto">
                    <div className="flex justify-center text-2xl font-bold text-[#37085B]">
                      Change Password
                    </div>
                    <div className="mb-3 xl:w-96 mt-8 mx-8">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label inline-block mb-1 text-xl font-normal text-black"
                      >
                        Enter your password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${
                          errors.password &&
                          touched.password &&
                          "border-[#E85626]"
                        }`}
                      />
                      {errors.password && touched.password && (
                        <div className="text-[#E85626]">{errors.password}</div>
                      )}
                      {passwordError && (
                        <div className="text-[#E85626]">
                          Incorrect password entered . please try again
                        </div>
                      )}
                    </div>
                    <div className="mb-3 xl:w-96 mt-8 mx-8">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label inline-block mb-1 text-xl font-normal text-black"
                      >
                        Enter your new password
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${
                          errors.newPassword &&
                          touched.newPassword &&
                          "border-[#E85626]"
                        }`}
                      />
                      {errors.newPassword && touched.newPassword && (
                        <div className="text-[#E85626]">
                          {errors.newPassword}
                        </div>
                      )}
                    </div>{" "}
                    <div className="mb-3 xl:w-96 mt-8 mx-8">
                      <label
                        htmlFor="exampleFormControlInpu3"
                        className="form-label inline-block mb-1 text-xl font-normal text-black"
                      >
                        Re-enter your new password
                      </label>
                      <Field
                        type="password"
                        name="reEnterPassword"
                        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${
                          errors.reEnterPassword &&
                          touched.reEnterPassword &&
                          "border-[#E85626]"
                        }`}
                      />
                      {errors.reEnterPassword && touched.reEnterPassword && (
                        <div className="text-[#E85626]">
                          {errors.reEnterPassword}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-2 mb-12">
                    <button
                      className="bg-primary hover:bg-white text-white hover:text-primary text-lg py-1 px-14 rounded-full border-2  border-primary"
                      type="submit"
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
      <div className="fixed inset-0 z-40 bg-[#676767]"></div>
    </>
  );
};

export default connect()(ChangePassword);

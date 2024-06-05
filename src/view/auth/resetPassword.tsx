import React, { useState, useEffect } from "react";
import phoneDarlingsLogo from "../../assets/images/phoneDarlingsLogo.svg";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RctPageLoader from "../../component/RctPageLoader";
import Background from "../../assets/images/background.svg";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { connect } from "react-redux";
import { getRole } from "../../constant/default";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Values {
  newPassword: string;
  curentpassword: string;
}

const ResetPassword: React.FC<any> = (props: any) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [imageLodaed, setImageLoaded] = useState(false);
  const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required("Enter new Password"),
    curentpassword: Yup.string()
      .required("Enter current  Password")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  useEffect(() => { }, [params]);

  const OnSubmit = (values: Values) => {
    let role = "user";
    if (getRole() === "User") {
      role = "user";
    } else if (getRole() === "ServiceProvider") {
      role = "consultant";
    }
    setisLoading(true);
    const { dispatch } = props;
    const body = {
      email: params.email,
      passwordResetToken: params.token,
      password: values.newPassword,
      passwordConfirmed: values.curentpassword,
    };
    dispatch(resetPassword(body))
      .then((res: any) => {
        if (res.data.isSuccess) {
          navigate(`/login`);
          toast.success("Password reset Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
        setisLoading(false);
      })
      .catch((err: any) => {
        setisLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className="bg-white">
        <div className="w-full flex my-4 tall:my-8 justify-center">
          <div className="p-2 lg:p-4 my-auto flex flex-col sm:p-0 w-full xl:h-[calc(100dvh_-_64px)] lg:max-h-[calc(100dvh_-_64px)] xl:max-h-auto max-w-[80%] lg:max-w-auto  3xl:max-w-[30%]">
            <Formik
              initialValues={{
                newPassword: "",
                curentpassword: "",
              }}
              onSubmit={(values: Values) => {
                OnSubmit(values);
              }}
              validationSchema={ResetPasswordSchema}
            >
              {({ errors, touched, handleSubmit }: any) => (
                <div className="lg:p-2 my-auto flex items-center justify-center xl:h-[calc(100dvh_-_64px)] lg:max-h-[calc(100dvh_-_64px)] xl:max-h-auto">
                  <div className="pt-6 md:pt-8 lg:pt-0 place-content-center h-fit flex bg-[#FFFFFF] rounded-[25px] w-full lg:w-full tall:w-full py-2 sm:px-2 lg:px-6 xl:h-[calc(100dvh_-_64px)] lg:max-h-[calc(100dvh_-_64px)] xl:max-h-auto overflow-auto smallScroll">
                    <div className="flex flex-col justify-center items-center w-full py-4 3xl:justify-center max-w-full xs:max-w-[80%] lg:max-w-full">
                      <img
                        src={phoneDarlingsLogo}
                        alt="logo"
                        className="mx-auto"
                      />

                      <p className="flex mb-6 w-full leading-none lg:justify-normal text-[2rem] mt-24 tall:-[74px] text-[#525252] font-semibold">
                        Reset Your Password
                      </p>

                      <div className="mb-3 w-full">
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className="form-label inline-block mb-1 text-xl font-normal text-black"
                        >
                          Enter a new password
                        </label>
                        <Field
                          type="text"
                          name="newPassword"
                          onKeyUp={(e: any) => {
                            if (e.keyCode === 13) {
                              handleSubmit()
                            }
                          }}
                          className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.newPassword &&
                            touched.newPassword &&
                            "border-[#E85626]"
                            }`}
                        />
                        {errors.newPassword && touched.newPassword && (
                          <div className="text-[#E85626]">{errors.newPassword}</div>
                        )}
                      </div>

                      <div className="mb-3 w-full">
                        <label
                          htmlFor="examplePassword0"
                          className="form-label inline-block mb-1 text-xl font-normal text-black"
                        >
                          Confirm your new password
                        </label>
                        <Field
                          type="password"
                          name="curentpassword"
                          onKeyUp={(e: any) => {
                            if (e.keyCode === 13) {
                              handleSubmit()
                            }
                          }}
                          className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none border-2 ${errors.curentpassword &&
                            touched.curentpassword &&
                            "border-[#E85626]"
                            }`}

                        />
                        {errors.curentpassword && touched.curentpassword && (
                          <div className="text-[#E85626]">
                            {errors.curentpassword}
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-6">
                        <button
                          className="bg-btnprimary hover:bg-primary text-white text-2xl py-1 px-14 rounded-full border-4 border-solid border-borderlight"
                          type="submit"
                          onClick={() => handleSubmit()}
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Formik>
          </div>

          <div className={`${imageLodaed ? "w-auto" : "w-[80%]"} ${imageLodaed ? "hidden" : "lg:block"}`}></div>
          <img
            src={Background}
            className={`hidden ${imageLodaed ? "lg:block" : "lg:hidden"} h-full max-h-[calc(100dvh_-_64px)] my-auto 3xl:rounded-[25px]`}
            alt="background"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </>
  );
};

export default connect()(ResetPassword);

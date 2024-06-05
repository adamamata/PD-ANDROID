import React, { useState } from "react"
import { connect } from "react-redux"
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg"
import { Formik, Form, Field } from "formik"
import { uploadImage64BaseSPIdCard } from "../../../services/authService"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {  toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import RctPageLoader from "../../../component/RctPageLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

const SPImage: React.FC<any> = (props: any) => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [fileType, setFileType] = useState("");
  const params = useParams();
  const imageTypes = ["png", "jpg", "jpeg"];
  const [imagevalid, setImageValid] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = async (e: any) => {
    setImageValid(false);
    const type = e.target.files[0].type;
    let imageType = type.substring(6);
    setFileType(imageType);
    const base64: any = await convertBase64(e.target.files[0]);
    if (base64 instanceof Error) {
      return
    }
    setUploadedImage(base64);
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

  const onGtoNext = () => {
    const { dispatch } = props;
    setLoading(true);
    const body = {
      fileExtension: fileType,
      base64: uploadedImage,
    };
    const valid = validationImage(fileType);
    if (!valid) {
      dispatch(uploadImage64BaseSPIdCard(params.id, body))
        .then((res: any) => {
          toast.success("Image Upload Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
          setLoading(false);
          navigate(`/consultant/${params.id}/addProfile`, { state: { 
            password: location.state.password,
            email: location.state.email
          } });
        })
        .catch((err: any) => {
          console.log("errr", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className="bg-[#36007a] min-h-screen px-6">
        <div className="w-full mb-6 py-8 h-[80px] rounded-b-full rounded-t-full">
          <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
            <img
              src={phoneDarlingsLogo}
              alt="logo"
              className="mx-auto w-[183px] h-[26px]"
            />
          </div>
        </div>
        <div className="mt-8">
          <Formik
            initialValues={{
              spimage: "",
            }}
            onSubmit={(values: any) => { }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="p-2">
                  <div className="bg-[#2b0062] flex place-content-center px-8 rounded-[25px]">
                    <div className="md:grid grid-rows-1 gap-4">
                      <div className="mt-12 text-center ">
                        <p className="font-semibold text-[#fff] text-[32px]">Let’s start by verifying your identity.</p>
                        <p className="text-xs text-[#FFFFFF] max-w-[80%] lg:max-w-[40%] mx-auto mt-4">To ensure compliance with age verification laws in the United States, certain states such as Louisiana, Arkansas, Montana, Mississippi, Utah, Virginia, and Texas have enacted regulations that mandate stricter age verification measures for access to "adult" websites. In order to provide a safe and legal online environment, we require users to upload their identification documents as part of our age verification process. This helps us verify the user's age accurately and fulfills the legal requirements, ensuring that only individuals of the appropriate age can access our platform. Your privacy and security are our top priorities, and this measure is essential to maintain a responsible and legal online community.</p>
                      </div>
                     
                      <div className="mt-10 mb-6">
                        <label>
                          <div
                            style={{ aspectRatio: "16/9" }}
                            className="bg-[#ffffff33] border cursor-pointer border-[#FFF] flex items-center justify-center max-h-[232px] max-w-[369px] mx-auto rounded-lg"
                          >
                            {uploadedImage ? (
                              <img
                                src={uploadedImage}
                                alt="add"
                                className="w-full h-full"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faPlus} />
                            )}
                          </div>
                          <Field
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            name="spimage"
                            className="hidden"
                            onChange={handleChange}
                          />
                        </label>
                        {imagevalid && (
                          <div className="justify-center flex text-[#E85626]">
                            please enter valid image type valid image type .png
                            , .jpg, .jpeg
                          </div>
                        )}
                      </div>

                      <div className="text-center w-[60%] lg:w-[40%] mx-auto mt-14">
                        <button
                          className="border border-[#673AB7] text-[#673AB7] rounded-lg bg-white w-3/4 h-15"
                          onClick={onGtoNext}
                        >
                          Next
                        </button>
                        <div className="flex justify-center mt-32 bottom-1 mb-4 gap-4">
                          <div className="md:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#FFF] rounded-sm"></div>
                          <div className="md:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#5E4084] rounded-sm "></div>
                          <div className="md:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#5E4084] rounded-sm"></div>
                        </div>
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
  )
}

export default connect()(SPImage)

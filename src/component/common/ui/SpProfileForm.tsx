import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import Checkbox from "./Checkbox";
import {
  uploadImage64BaseAccount,
  addMultiUserData,
  uploadImageAddProfile,
  createmultipleAccounts,
  editProfile,
} from "../../../services/authService";
import { callSettingList, menuSettingList, serviceType } from "../staticValues";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RctPageLoader from "../../../component/RctPageLoader";
import { LOCALSTORE, siteKey } from "../../../constant/default";
import * as Yup from "yup";
import { authLogin } from "../../../services/authService";
import { auth_login } from "../../../reducer/auth";
import { getUserCategories, uploadCkEditorImage } from "../../../services/homeService";
import ReCAPTCHA from "react-google-recaptcha";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import PreviewConformationModal from "../../../view/dashboard/consultant/previewConformationModal";
import ProfilePreviewModal from "../../../view/dashboard/consultant/profilePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

interface ErrorName {
  shortMessageUnitPrice: string;
  phoneCallUnitPrice: string;
  audioCallUnitPrice: string;
  videoCallTwoWayUnitPrice: string;
  videoCallOneWayUnitPrice: string;
}

const SpProfileForm: React.FC<any> = ({
  type,
  closeModal,
  dispatch,
  user_details,
  getSPProfileData,
  selectedProfile
}: any) => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [fileType, setFileType] = useState("");
  const captchaRef = useRef(null);
  const params = useParams();
  const imageTypes = ["png", "jpg", "jpeg"];
  const [imagevalid, setImageValid] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [enablePhoneCall, setEnablePhoneCall] = useState(false);
  const [enableAudioCall, setEnableAudioCall] = useState(false);
  const [enableOneWayVideoCall, setEnableOneWayVideoCall] = useState(false);
  const [enableTwoWayVideoCall, setEnableTwoWayVideoCall] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setcategories] = useState<any>([]);
  const [selectCat, setSelectCat] = useState<any>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    "chat",
  ]);

  const [profileDisable, setProfileDisable] = useState(false)

  const [conformationModal, setConformationModal] = useState(false)
  const [previewModal, setPreviewModal] = useState(false)
  const [updatedProfileDetails, setUpdatedProfileDetails] = useState(null)

  useEffect(() => {
    getCategoriesList();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      const selectedCallSetting = []
      setUploadedImage(selectedProfile.profileImageUrl)
      setSelectCat([...selectedProfile.categories])
      if (selectedProfile.enableAudioCall) {
        setEnableAudioCall(selectedProfile.enableAudioCall)
        selectedCallSetting.push('audio')
      }
      if (selectedProfile.enablePhoneCall) {
        setEnablePhoneCall(selectedProfile.enablePhoneCall)
        selectedCallSetting.push('phone')
      }
      if (selectedProfile.enableOneWayVideoCall) {
        setEnableOneWayVideoCall(selectedProfile.enableOneWayVideoCall)
        selectedCallSetting.push('oneWayVideo')
      }
      if (selectedProfile.enableTwoWayVideoCall) {
        setEnableTwoWayVideoCall(selectedProfile.enableTwoWayVideoCall)
        selectedCallSetting.push('twoWayVideo')
      }
      if (selectedCallSetting) {
        setSelectedCheckboxes([...selectedCheckboxes, ...selectedCallSetting])
      }
    }
  }, [selectedProfile])
  const handleChange = async (e: any) => {
    setImageValid(false);
    const type = e.target.files[0].type;
    let imageType = type.substring(6);
    setFileType(imageType);
    const base64: any = await convertBase64(e.target.files[0]);
    if (base64 instanceof Error) {
      return;
    }
    setUploadedImage(base64);
    return { base64, file: e.target.files[0] };
  };

  const getCategoriesList = () => {
    dispatch(getUserCategories())
      .then((res: any) => {
        setcategories(res?.data);
      })
      .catch((err: any) => {
        console.log("dfsdgh", err);
      });
  };

  const handleCheckChat = (name: any) => {
    if (selectCat.includes(name)) {
      setSelectCat(selectCat.filter((catName: any) => catName !== name))
    } else {
      setSelectCat([...selectCat, name])
    }
  }

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

  const communicationSchema = Yup.object().shape({
    shortMessageUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(0.05, "Short message price must be greater than 0.05")
      .max(5, "Short message price must be less than 5")
      .required("Required"),
    audioCallUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.audio) ? 0.25 : 0, "Audio call price must be greater than 0.25")
      .max(50, "Audio call price must be less than 50")
      .required("Required"),
    videoCallTwoWayUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.twoWayVideo) ? 0.35 : 0, "Video call two way price must be greater than 0.35")
      .max(50, "Video call two way price must be less than 50")
      .required("Required"),
    videoCallOneWayUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.oneWayVideo) ? 0.30 : 0, "Video call one way price must be greater than 0.30")
      .max(50, "Video call one way price must be less than 50")
      .required("Required"),
  });

  const validationSchema = Yup.object().shape({
    profileName: Yup.string().required("Profile Name is required"),
    communication: communicationSchema,
  });

  const updateProfile = (value: any, communication: any) => {
    const payload = {
      fileExtension: fileType,
      base64: uploadedImage,
    };
    const body = [
      { op: "replace", path: "/username", value: value.profileName },
      { op: "replace", path: "/description", value: value.profileDescription },
      { op: "replace", path: "/profileInfo", value: value.profileInfo },
      { op: "replace", path: "/communication/shortMessageUnitPrice", value: communication.shortMessageUnitPrice },
      { op: "replace", path: "/communication/phoneCallUnitPrice", value: communication.phoneCallUnitPrice },
      { op: "replace", path: "/communication/audioCallUnitPrice", value: communication.audioCallUnitPrice },
      { op: "replace", path: "/communication/videoCallOneWayUnitPrice", value: communication.videoCallOneWayUnitPrice },
      { op: "replace", path: "/communication/videoCallTwoWayUnitPrice", value: communication.videoCallTwoWayUnitPrice },
      { op: "replace", path: "/categories", value: selectCat.toString() },
      { op: "replace", path: "/enableAudioCall", "value": selectedCheckboxes.includes('audio') ? true : false },
      { op: "replace", path: "/enablePhoneCall", "value": selectedCheckboxes.includes('phone') ? true : false },
      { op: "replace", path: "/enableOneWayVideoCall", "value": selectedCheckboxes.includes('oneWayVideo') ? true : false },
      { op: "replace", path: "/enableTwoWayVideoCall", "value": selectedCheckboxes.includes('twoWayVideo') ? true : false },
    ]

    const valid = validationImage(fileType);
    if (!valid) {
      dispatch(uploadImageAddProfile(payload)).then((res: any) => {
        if (res.data.isSuccess) {
          body.push({ op: "replace", path: "/profileImageUrl", value: res.data.data })
          dispatch(editProfile(selectedProfile.id, body)).then((res: any) => {
            setLoading(false)
            toast.success("Profile Updated Successfully!", {
              theme: "colored",
              autoClose: 5000,
            });
            getSPProfileData()
            closeModal(false);
          }).catch((err: any) => {
            setLoading(false)
            const massage = err.response.data.message;
            toast.error(massage, {
              theme: "colored",
              autoClose: 5000,
            });
            closeModal(false);
          })
        }
      }).catch((err: any) => {
        setLoading(false)
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        closeModal(false);
      })
    } else {
      dispatch(editProfile(selectedProfile.id, body)).then((res: any) => {
        setLoading(false)
        getSPProfileData()
        closeModal(false);
        toast.success("Profile Updated Successfully!", {
          theme: "colored",
          autoClose: 5000,
        });

      }).catch((err: any) => {
        setLoading(false)
        closeModal(false)
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      })
    }
  }

  const onSubmit = (value: any) => {
    setLoading(true)
    setProfileDisable(true)
    const communication = {
      audioCallUnitPrice: enableAudioCall
        ? parseFloat(value.communication.audioCallUnitPrice)
        : 0,
      phoneCallUnitPrice: enablePhoneCall
        ? parseFloat(value.communication.phoneCallUnitPrice)
        : 0,
      shortMessageUnitPrice: parseFloat(value.communication.shortMessageUnitPrice),
      videoCallOneWayUnitPrice: enableOneWayVideoCall
        ? parseFloat(value.communication.videoCallOneWayUnitPrice)
        : 0,
      videoCallTwoWayUnitPrice: enableTwoWayVideoCall
        ? parseFloat(value.communication.videoCallTwoWayUnitPrice)
        : 0,
    };

    const payload = {
      fileExtension: fileType,
      base64: uploadedImage,
    };

    const valid = validationImage(fileType);
    if (!selectedProfile) {
      if (!valid) {
        if (params.id !== undefined) {
          dispatch(uploadImage64BaseAccount(params.id, payload))
            .then((res: any) => {
              if (res.data.isSuccess) {
                const body = {
                  username: value.profileName,
                  profileImageUrl: res.data.data,
                  description: value.profileDescription,
                  enablePhoneCall: enablePhoneCall,
                  enableAudioCall: enableAudioCall,
                  enableOneWayVideoCall: enableOneWayVideoCall,
                  enableTwoWayVideoCall: enableTwoWayVideoCall,
                  communication: communication,
                  email: localStorage.getItem(LOCALSTORE.email) ?? location.state.email,
                  categories: selectCat
                };

                dispatch(addMultiUserData(params.id, body))
                  .then((ress: any) => {
                    toast.success("Profile Add Successfull!", {
                      theme: "colored",
                      autoClose: 5000,
                    });
                    const loginReqBody = {
                      email: localStorage.getItem(LOCALSTORE.email) ?? location.state.email,
                      password: location.state.password,
                      rememberMe: false,
                    };
                    let token: any = captchaRef?.current;
                    let tokendata = token?.executeAsync();
                    tokendata.then((res: any) => {
                      dispatch(authLogin(loginReqBody, res))
                        .then((res: any) => {
                          if (res !== undefined) {
                            // setPasswordError(false);
                            dispatch(auth_login(res.data));
                            localStorage.setItem(LOCALSTORE.id, res.data.id);
                            localStorage.setItem(
                              LOCALSTORE.token,
                              res.data.jwtToken
                            );
                            localStorage.setItem(
                              LOCALSTORE.refreshToken,
                              res.data.refreshToken
                            );
                            localStorage.setItem(LOCALSTORE.role, res.data.role);
                            localStorage.setItem(
                              LOCALSTORE.communicationIdentifier.token,
                              res.data.communicationIdentifier.token
                            );
                            localStorage.setItem(
                              LOCALSTORE.communicationIdentifier.expiredOn,
                              res.data.communicationIdentifier.expires_on
                            );
                            localStorage.setItem(
                              LOCALSTORE.communicationIdentifier.userId,
                              res.data.communicationIdentifier.user_id
                            );
                            setProfileDisable(false)
                            navigate(`/thankyouconsultant`);
                            setLoading(false);
                          }
                          // setLoading(false);
                        })
                        .catch((err: any) => {
                          setProfileDisable(false)
                          setLoading(false);
                        });
                    })
                      .catch((err: any) => {
                        console.log("err");
                        setProfileDisable(false)
                        setLoading(false);
                      });
                  }).catch(() => {
                    setProfileDisable(false)
                    setLoading(false)
                  }
                  )
              }
            })
            .catch((err: any) => {
              const massage = err.message;
              toast.error(massage, {
                theme: "colored",
                autoClose: 5000,
              });
              setLoading(false);
              setProfileDisable(false)
            });
        } else {
          dispatch(uploadImageAddProfile(payload))
            .then((res: any) => {
              if (res.data.isSuccess) {
                const body = {
                  username: value.profileName,
                  profileImageUrl: res.data.data,
                  description: value.profileDescription,
                  enablePhoneCall: enablePhoneCall,
                  enableAudioCall: enableAudioCall,
                  enableOneWayVideoCall: enableOneWayVideoCall,
                  enableTwoWayVideoCall: enableTwoWayVideoCall,
                  communication: communication,
                  email: user_details.email,
                  categories: selectCat
                };

                dispatch(createmultipleAccounts(body))
                  .then((ress: any) => {
                    toast.success("Profile Add Successfull!", {
                      theme: "colored",
                      autoClose: 5000,
                    });
                    getSPProfileData();
                    closeModal(false);
                    setProfileDisable(false)
                    setLoading(false);
                  })
                  .catch((err: any) => {
                    const massage = err.message;
                    toast.error(massage, {
                      theme: "colored",
                      autoClose: 5000,
                    });
                    setProfileDisable(false)
                    setLoading(false);
                  });
              }
            })
            .catch((err: any) => {
              const massage = err.message;
              toast.error(massage, {
                theme: "colored",
                autoClose: 5000,
              });
              setProfileDisable(false)
              setLoading(false);
              closeModal(false);
            });
        }
      } else {
        setLoading(false)
      }
    }


    if (selectedProfile) {
      updateProfile(value, communication)
    }
    // onGtoNext();
  };

  const handleCallSettingList = (event: any, setting: string) => {
    const isChecked = event.target.checked;
    setSelectedCheckboxes((prevSelected) => {
      if (isChecked) {
        if (setting === serviceType.phone) {
          setEnablePhoneCall(true);
        } else if (setting === serviceType.audio) {
          setEnableAudioCall(true);
        } else if (setting === serviceType.oneWayVideo) {
          setEnableOneWayVideoCall(true);
        } else if (setting === serviceType.twoWayVideo) {
          setEnableTwoWayVideoCall(true);
        }
        return [...prevSelected, setting];
      } else {
        if (setting === serviceType.phone) {
          setEnablePhoneCall(false);
        } else if (setting === serviceType.audio) {
          setEnableAudioCall(false);
        } else if (setting === serviceType.oneWayVideo) {
          setEnableOneWayVideoCall(false);
        } else if (setting === serviceType.twoWayVideo) {
          setEnableTwoWayVideoCall(false);
        }
        return prevSelected.filter((selected) => selected !== setting);
      }
    });
  };

  function uploadAdapter(loader: any) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file: any) => {
            body.append("files", file);
            dispatch(uploadCkEditorImage(body)).then((res: any) => {
              resolve({
                default: res.data.data
              });
            }).catch((error: any) => {
              toast.error("Image Upload Failed....!!", {
                theme: "colored",
                autoClose: 5000,
              });

            })
          });
        });
      }
    };
  }

  function uploadPlugin(editor: { plugins: { get: (arg0: string) => { (): any; new(): any; createUploadAdapter: (loader: any) => { upload: () => Promise<unknown>; }; }; }; }) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const ckEditorHandleChange = (e: any, editor: any, setFieldValue: any) => {
    var content = editor.getData();
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    setFieldValue("profileInfo", content)
  };

  return (
    <div>
      {isLoading && <RctPageLoader />}
      <Formik
        initialValues={{
          profileName: selectedProfile?.username ?? "",
          profileDescription: selectedProfile?.description ?? "",
          communication: {
            shortMessageUnitPrice: selectedProfile?.communication?.shortMessageUnitPrice ?? 0.0,
            phoneCallUnitPrice: selectedProfile?.communication?.phoneCallUnitPrice ?? 0.0,
            audioCallUnitPrice: selectedProfile?.communication?.audioCallUnitPrice ?? 0.0,
            videoCallOneWayUnitPrice: selectedProfile?.communication?.videoCallOneWayUnitPrice ?? 0.0,
            videoCallTwoWayUnitPrice: selectedProfile?.communication?.videoCallTwoWayUnitPrice ?? 0.0,
          },
          profileInfo: selectedProfile?.profileInfo ?? ""
        }}
        validationSchema={validationSchema}
        validateOnChange
        onSubmit={(values: any) => {
          setUpdatedProfileDetails(values)
          setConformationModal(true)
        }}
      >
        {({ errors, touched, values, setFieldValue }: any) => (
          <Form>
            <div className={`${type === "modal" ? "" : "p-2"}`}>
              <div
                className={`${type === "modal" ? "pr-12 bg-[#FFFFFF]" : ""
                  } p-8 place-content-center flex bg-[#2b0062] rounded-[25px]`}
              >
                <div className="">
                  {type !== "modal" && (
                    <>
                      <div className="text-[#fff] text-center text-[35px] font-semibold ">
                        Thanks! Now let’s create your first public profile.
                      </div>

                      <p className="mx-auto text-[#fff] text-base text-center font-normal mb-4">
                        This profile will be shown publicly to all customers on
                        our platform.
                      </p>
                    </>
                  )}
                  <div>
                    <div className="flex font-semibold items-center mb-6 place-content-center text-[#37085B] text-center">
                      {type === "modal" && (
                        <>
                          <p className="mx-auto">My Profile</p>
                          <button
                            className="text-"
                            onClick={() => closeModal(false)}
                          >
                            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="md:grid grid-rows-1 md:grid-rows-1 md:grid-flow-col">
                      <div
                        className="md:row-span-3 mx-auto mb-4 md:mb-0 max-h-[232px] max-w-[232px]"
                        style={{ aspectRatio: "1" }}
                      >
                        <label className="cursor-pointer">
                          <div
                            style={{ aspectRatio: "1" }}
                            className={`border ${type === "modal" ? "border-[#37085B] bg-[#37085b33] " : "border-[#FFF] bg-[#ffffff33] "}  flex items-center justify-center max-h-[232px] max-w-[232px] mx-auto rounded`}
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
                      <div className="md:row-span-1 md:col-span-2">
                        <div className="xl:w-96">
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                          >
                            Profile Name
                          </label>
                          <Field
                            type="text"
                            name="profileName"
                            autocomplete="off"
                            placeholder="Profile Name"
                            className={`form-control block w-full px-3 py-1.5 text-base font-normal  ${type === "modal" ? "bg-white border-[#37085B] text-gray-700" : "bg-[#2b0062] border-[#FFF] text-[#FFFFFF]"} bg-clip-padding border border-solid  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                    focus:outline-none border-1 ${errors.profileName &&
                              touched.profileName &&
                              "border-[#E85626]"
                              }`}
                          />
                          {errors.profileName && touched.profileName && (
                            <div className="text-[#E85626]">
                              {errors.profileName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:row-span-2 md:col-span-2 mt-3">
                        <div className="xl:w-96">
                          <label
                            htmlFor="exampleFormControlInpu3"
                            className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                          >
                            Profile Description
                          </label>

                          <Field
                            rows={6}
                            as="textarea"
                            name="profileDescription"
                            autocomplete="off"
                            placeholder="Profile Description"
                            className={`max-h-[130px] form-control block w-full px-3 py-1.5 text-base font-normal  ${type === "modal" ? "bg-white border-[#37085B] text-gray-700" : "bg-[#2b0062] border-[#FFF] text-[#FFFFFF]"} bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                    focus:outline-none border-1 ${errors.profileDescription &&
                              touched.profileDescription &&
                              "border-[#E85626]"
                              }`}
                          />
                          {errors.profileDescription &&
                            touched.profileDescription && (
                              <div className="text-[#E85626]">
                                {errors.profileDescription}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-10">
                      <div className={`${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}  font-semibold mb-6`}>
                        Account Settings

                        <p className={`${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}`}>Click on all the settings that apply to you. </p>
                      </div>

                      <div className={`text-sm ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mb-6`}>
                        Privacy Settings
                      </div>

                      <div>
                        <Field
                          type="checkbox"
                          name={"isPublicUser"}
                          placeholder="Profile Description"
                          // id={name}
                          className={`border-[#37085B] h-5 w-5 rounded-lg border bg-white checked:bg-[#37085B] checked:border-[#37085B] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${errors.callSettings && touched.callSettings && "border-[#E85626]"}`}
                          // onChange={(event: any) => handleCheckBox(event, data.value)}
                          // checked={isChecked}
                        />
                        <label
                          className={`text-sm font-semibold inline-block text-[#37085B]`}
                          // htmlFor={name}
                          style={{ fontFamily: "Montserrat" }}
                        >
                          Allow my profile to be seen by the public.
                        </label>
                      </div>

                      <div className="md:grid md:grid-cols-2 gap-4">
                        <div>
                          <div>
                            <div className={`text-sm ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mb-6`}>
                              Call Settings
                            </div>
                            <div className="">
                              {callSettingList.map((list) => (
                                <div
                                  key={list?.value}
                                  className="flex mb-8 text-[#37085B]"
                                >
                                  <Checkbox
                                    name={`${list?.name}`}
                                    data={list}
                                    touched={touched}
                                    errors={errors}
                                    labelClassName={type !== "modal" ? "text-[#FFFFFF]" : ""}
                                    handleCheckBox={handleCallSettingList}
                                    isChecked={selectedCheckboxes.includes(
                                      list?.value!
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className={`text-sm ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mb-6`}>
                              Categories
                            </div>
                            <div className="">
                              <div className="grid grid-cols-2 gap-4">
                                {categories.map((cat: any, index: any) => (
                                  <div
                                    key={cat?.sequence}
                                    className=" mb-1 text-[#37085B]"
                                  >
                                    <Field
                                      type="checkbox"
                                      name={cat?.name}
                                      placeholder="Profile Description"
                                      id={cat?.name + index}
                                      onChange={(event: any) => handleCheckChat(cat?.name)}
                                      checked={selectCat.includes(cat?.name)}
                                      className={`border-[#37085B] h-5 w-5 rounded-lg border bg-white checked:bg-[#37085B] checked:border-[#37085B] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                  }`}
                                    />
                                    <label
                                      className={`text-sm font-semibold inline-block ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                      htmlFor={cat?.name + index}
                                      style={{ fontFamily: "Montserrat" }}
                                    >
                                      {cat?.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 md-mt-0 md:ml-6">
                          <div className={`text-sm ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}  font-semibold mb-6`}>
                            Menu Settings
                          </div>
                          <FieldArray
                            name="communication"
                            render={() => (
                              <div className="">
                                {menuSettingList.map((list, index) => (
                                  <div className="grid grid-cols-2 gap-6 mb-4 ">
                                    <p className={`text-sm ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}  font-semibold`}>
                                      {list.lable}
                                    </p>
                                    <div className="w-full sm:w-[159px] mb-3">
                                      <Field
                                        type="text"
                                        disabled={
                                          !selectedCheckboxes.includes(
                                            list.value
                                          )
                                        }
                                        name={`communication[${list.name}]`}
                                        autocomplete="off"
                                        placeholder={list.lable}
                                        className={`form-control block w-full px-3 py-1.5 text-sm text-[#37085B] font-normal text-gray-700 bg-clip-padding border border-[#37085B] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                                        focus:outline-none border-1 
                                        ${!selectedCheckboxes.includes(
                                          list.value
                                        )
                                            ? "bg-[#EAEAEA]"
                                            : ""
                                          }`}
                                      />

                                      {errors &&
                                        errors.communication &&
                                        errors.communication[
                                        list.name as keyof ErrorName
                                        ] &&
                                        selectedCheckboxes.includes(
                                          list.value
                                        ) &&
                                        errors.communication[
                                        list.name as keyof ErrorName
                                        ] &&
                                        touched &&
                                        touched.communication &&
                                        touched.communication[
                                        list.name as keyof ErrorName
                                        ] && (
                                          <>
                                            <div className="text-red-700">
                                              {
                                                errors.communication[
                                                list.name as keyof ErrorName
                                                ]
                                              }
                                            </div>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="mt-4">

                    <label
                      htmlFor="exampleFormControlInpu3"
                      className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${type === "modal" ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                    >
                      Profile Info
                    </label>

                    <CKEditor
                      editor={DecoupledcEditor}
                      config={{
                        extraPlugins: [uploadPlugin],
                        toolbar: {
                          items: [
                            'fontfamily',
                            'fontsize',
                            'fontColor',
                            'fontBackgroundColor',
                            "|",
                            "bold",
                            "italic",
                            "|",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "|",
                            "indent",
                            "outdent",
                            "|",
                            "insertTable",
                            "uploadImage",
                            // "mediaEmbed",
                            "undo",
                            "redo",
                          ],
                        },
                      }}
                      className="ck"
                      name="ProfileInfo"
                      data={values.profileInfo || ""}
                      onReady={(editor: any) => {
                        editor.ui
                          .getEditableElement()
                          .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
                      }}
                      onChange={(e: any, editor: any) => ckEditorHandleChange(e, editor, setFieldValue)}
                    // onBlur={() => formik.setFieldTouched("description", true)}
                    />

                    {/* <div ref={prevReviewTextRef} className="mt-4 ck ck-content break-words ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"></div>  */}
                  </div>

                  <div className="text-center my-6">
                    <button type="submit" disabled={profileDisable} className={`border  ${type === "modal" ? "border-[#37085B] text-[#37085B] px-14" : "border-[#673AB7] text-[#673AB7] bg-[#FFFFFF] px-20"} py-2 rounded-lg font-medium  ${profileDisable && "opacity-25"}`}>
                      {type === "modal" ? "Save Profile" : "Register"}
                    </button>
                  </div>

                  {type !== "modal" &&
                    <div className="flex justify-center mt-16 bottom-1 mb-4 gap-4">
                      <div className="sm:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#FFF] rounded-sm"></div>
                      <div className="sm:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#FFF] rounded-sm "></div>
                      <div className="sm:w-[8.875rem] w-[4.425rem] h-2.5 bg-[#5E4084] rounded-sm"></div>
                    </div>
                  }
                  <ReCAPTCHA
                    sitekey={siteKey}
                    ref={captchaRef}
                    size="invisible"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {conformationModal && (
        <PreviewConformationModal
          setConformationModal={setConformationModal}
          setPreviewModal={setPreviewModal}
          onSubmit={onSubmit}
          updatedProfileDetails={updatedProfileDetails}
        />
      )}

      {previewModal && (
        <ProfilePreviewModal
          updatedProfileDetails={updatedProfileDetails}
          setPreviewModal={setPreviewModal}
          onSubmit={onSubmit}
          uploadedImage={uploadedImage}
        />
      )}
    </div>
  );
};

export default connect()(SpProfileForm);

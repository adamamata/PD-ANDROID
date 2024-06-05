import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import {
  uploadImage64BaseAccount,
  addMultiUserData,
  uploadImageAddProfile,
  createmultipleAccounts,
  editProfile,
} from "../../../services/authService";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RctPageLoader from "../../../component/RctPageLoader";
import { LOCALSTORE, siteKey } from "../../../constant/default";
import * as Yup from "yup";
import { authLogin } from "../../../services/authService";
import { auth_details, auth_login } from "../../../reducer/auth";
import { getUserCategories, uploadCkEditorImage } from "../../../services/homeService";
import ReCAPTCHA from "react-google-recaptcha";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { callSettingList, menuSettingList, serviceType } from "../../../component/common/staticValues";
import Checkbox from "../../../component/common/ui/Checkbox";
import Header from "../commons/header";
import ProfilePreviewModal from "./profilePreview";
import PreviewConformationModal from "./previewConformationModal";
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import ImageCrop from "../../auth/imageCrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface ErrorName {
  shortMessageUnitPrice: string;
  phoneCallUnitPrice: string;
  audioCallUnitPrice: string;
  videoCallTwoWayUnitPrice: string;
  videoCallOneWayUnitPrice: string;
}

const ManageProfile = (props: any) => {
  const { registrationFlow } = props
  const { dispatch } = props;
  const [uploadedImage, setUploadedImage] = useState("");
  const [fileType, setFileType] = useState(null);
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
  const [profileDisable, setProfileDisable] = useState(false);
  const prevReviewTextRef = useRef<null | HTMLDivElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  const [conformationModal, setConformationModal] = useState(false)
  const [previewModal, setPreviewModal] = useState(false)
  const [updatedProfileDetails, setUpdatedProfileDetails] = useState<any>(null)
  const [showCrop, setShowCrop] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(true);
  const [uploadedHtmlEmbedImages, setUploadedHtmlEmbedImages] = useState<any[]>([])

  const hiddenCatList = ["Men", "Women", "Trans"]

  const details = useSelector(auth_details);
  let user_details = details?.user_profile;

  const adminEmail = ["bngkkb@gmail.com", "brady@phonedarlings.com"]

  useEffect(() => {
    if (location.state) {
      if (location.state.selectedProfile) {
        setSelectedProfile(location.state.selectedProfile)
      }
    }
  }, [location.state])

  useEffect(() => {
    getCategoriesList();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (selectedProfile) {
      const selectedCallSetting = []
      setUploadedImage(selectedProfile.profileImageUrl)
      setSelectCat(selectedProfile?.categories2?.length ? selectedProfile?.categories2 : [])
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
    setShowCrop(true);
    return { base64, file: e.target.files[0] };
  };

  const getCategoriesList = () => {
    dispatch(getUserCategories(false))
      .then((res: any) => {
        setcategories(res?.data);
      })
      .catch((err: any) => {
        console.log("dfsdgh", err);
      });
  };

  const handleCheckChat = (name: any) => {
    if (selectCat.some((catName: any) => catName?.name === name)) {
      setSelectCat(selectCat.filter((catName: any) => catName?.name !== name))
    } else {
      setSelectCat([...selectCat, { name: name, subcategories: [] }])
    }
  }

  const handleCheckSubCat = (catName: any, subCatName: any) => {
    let updatedCat: any = [...selectCat]

    if (!selectCat.some((cat: any) => cat?.name === catName)) {
      updatedCat.push({ name: catName, subcategories: [subCatName] })
    } else {
      updatedCat = selectCat?.map((cat: any) => {
        if (catName === cat?.name) {
          if (cat?.subcategories.includes(subCatName)) {
            cat.subcategories = cat?.subcategories.filter((subCat: any) => subCat !== subCatName)
          } else {
            cat.subcategories.push(subCatName)
          }
          return cat

        } else {
          return cat
        }
      })
    }

    setSelectCat(updatedCat)
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
    const promise = new Promise((resolve, reject) => {
      if (imageTypes.includes(type)) {
        setImageValid(false);
        resolve(null)
      } else {
        setImageValid(true);
        reject(null)
      }
    })

    return promise
  };

  const communicationSchema = Yup.object().shape({
    shortMessageUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(adminEmail.includes(selectedProfile?.email) ? 0 : 0.25, "Short message price must be greater than 0.25")
      .max(9.99, "Short message price must be less than 9.99")
      .required("Required"),
    audioCallUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.audio) ? adminEmail.includes(selectedProfile?.email) ? 0 : 0.25 : 0, "Audio call price must be greater than 0.25")
      .max(50, "Audio call price must be less than 50")
      .required("Required"),
    phoneCallUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.phone) ? adminEmail.includes(selectedProfile?.email) ? 0 : 0.25 : 0, "Phone call price must be greater than 0.25")
      .max(50, "Phone call price must be less than 50")
      .required("Required"),
    videoCallTwoWayUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.twoWayVideo) ? adminEmail.includes(selectedProfile?.email) ? 0 : 0.35 : 0, "Video call two way price must be greater than 0.35")
      .max(50, "Video call two way price must be less than 50")
      .required("Required"),
    videoCallOneWayUnitPrice: Yup.number()
      .typeError("Invalid number")
      .min(selectedCheckboxes.includes(serviceType.oneWayVideo) ? adminEmail.includes(selectedProfile?.email) ? 0 : 0.30 : 0, "Video call one way price must be greater than 0.30")
      .max(50, "Video call one way price must be less than 50")
      .required("Required"),
  });

  const validationSchema = Yup.object().shape({
    profileName: Yup.string().required("Profile Name is required"),
    communication: communicationSchema,
    isMan: Yup.bool().when(['isWomen', 'isTrans'], {
      is: (isWomen: any, isTrans: any) => !isWomen || !isTrans,
      then: Yup.bool().oneOf([true], "At least one needs to be checked")
    }),
    gender: Yup.string().required("Please select one option")
  });

  const updateProfile = async (value: any, communication: any) => {
    const payload = {
      fileExtension: fileType,
      base64: uploadedImage,
    };

    const body = [
      { op: "replace", path: "/username", value: value.username },
      { op: "replace", path: "/description", value: value.description },
      { op: "replace", path: "/profileInfo", value: value.profileInfo },
      { op: "replace", path: "/communication/shortMessageUnitPrice", value: communication.shortMessageUnitPrice },
      { op: "replace", path: "/communication/phoneCallUnitPrice", value: communication.phoneCallUnitPrice },
      { op: "replace", path: "/communication/audioCallUnitPrice", value: communication.audioCallUnitPrice },
      { op: "replace", path: "/communication/videoCallOneWayUnitPrice", value: communication.videoCallOneWayUnitPrice },
      { op: "replace", path: "/communication/videoCallTwoWayUnitPrice", value: communication.videoCallTwoWayUnitPrice },
      { op: "replace", path: "/enableAudioCall", "value": selectedCheckboxes.includes('audio') ? true : false },
      { op: "replace", path: "/enablePhoneCall", "value": selectedCheckboxes.includes('phone') ? true : false },
      { op: "replace", path: "/enableOneWayVideoCall", "value": selectedCheckboxes.includes('oneWayVideo') ? true : false },
      { op: "replace", path: "/enableTwoWayVideoCall", "value": selectedCheckboxes.includes('twoWayVideo') ? true : false },
      { op: "replace", path: "/isPublicUser", "value": value.isPublicUser },
      { op: "replace", path: "/gender", value: value.gender },
      { op: "replace", path: "/categories2", value: value.categories },
    ]

    if (fileType) {
      await validationImage(fileType).then(() => {
        dispatch(uploadImageAddProfile(payload)).then((res: any) => {
          if (res.data.isSuccess) {
            body.push({ op: "replace", path: "/profileImageUrl", value: res.data.data })
            dispatch(editProfile(selectedProfile.id, body)).then((res: any) => {
              setLoading(false)
              toast.success("Profile Updated Successfully!", {
                theme: "colored",
                autoClose: 5000,
              });
              navigate("/consultant/profile")
            }).catch((err: any) => {
              setLoading(false)
              window.scrollTo(0, 0)
              const massage = err?.data?.message;
              toast.error(massage, {
                theme: "colored",
                autoClose: 5000,
              });
            })
          }
        }).catch((err: any) => {
          setLoading(false)
          setProfileDisable(false)
          const massage = err.response.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
        })
      }).catch(() => {
        toast.error("please enter valid image type valid image type .png, .jpg, .jpeg")
      })
    } else {
      dispatch(editProfile(selectedProfile.id, body)).then((res: any) => {
        setLoading(false)
        toast.success("Profile Updated Successfully!", {
          theme: "colored",
          autoClose: 5000,
        });
        navigate("/consultant/profile")

      }).catch((err: any) => {
        setLoading(false)
        setProfileDisable(false)
        window.scrollTo(0, 0)
        const massage = err?.data?.message;
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

    if (!selectedProfile) {
      if (fileType) {
        validationImage(fileType).then(() => {
          if (params.id !== undefined) {
            dispatch(uploadImage64BaseAccount(params.id, payload))
              .then((res: any) => {
                if (res.data.isSuccess) {
                  const body = {
                    username: value.username,
                    profileImageUrl: res.data.data,
                    description: value.description,
                    profileInfo: value.profileInfo,
                    enablePhoneCall: enablePhoneCall,
                    enableAudioCall: enableAudioCall,
                    enableOneWayVideoCall: enableOneWayVideoCall,
                    enableTwoWayVideoCall: enableTwoWayVideoCall,
                    communication: communication,
                    email: localStorage.getItem(LOCALSTORE.email) ?? location.state.email,
                    categories2: value.categories,
                    gender: value.gender,
                    isPublicUser: value.isPublicUser
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
                    }).catch((err: any) => {
                      window.scrollTo(0, 0)
                      const massage = err?.data?.message;
                      toast.error(massage, {
                        theme: "colored",
                        autoClose: 5000,
                      });
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
                    username: value.username,
                    profileImageUrl: res.data.data,
                    description: value.description,
                    profileInfo: value.profileInfo,
                    enablePhoneCall: enablePhoneCall,
                    enableAudioCall: enableAudioCall,
                    enableOneWayVideoCall: enableOneWayVideoCall,
                    enableTwoWayVideoCall: enableTwoWayVideoCall,
                    communication: communication,
                    email: user_details.email,
                    categories2: value.categories,
                    isPublicUser: value.isPublicUser,
                    gender: value.gender
                  };

                  dispatch(createmultipleAccounts(body))
                    .then((ress: any) => {
                      toast.success("Profile Add Successfull!", {
                        theme: "colored",
                        autoClose: 5000,
                      });
                      navigate("/consultant/profile")
                    })
                    .catch((err: any) => {
                      window.scrollTo(0, 0)
                      const massage = err.data.message;
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
                // closeModal(false);
              });
          }
        }).catch(() => {
          setLoading(false)
          setProfileDisable(false)
          toast.error("please enter valid image type valid image type .png, .jpg, .jpeg")
        })
      } else {
        setLoading(false)
        setProfileDisable(false)
        setImageValid(true)
        toast.info("please select image for profile")
      }
    }

    if (selectedProfile) {
      updateProfile(value, communication)
    }
  };

  const handleCallSettingList = (event: any, setting: string, setFieldValue: any) => {
    const isChecked = event.target.checked;
    setSelectedCheckboxes((prevSelected) => {
      if (isChecked) {
        if (setting === "phone") {
          setEnablePhoneCall(true);
          setFieldValue("communication.phoneCallUnitPrice", 1.79)
        } else if (setting === "audio") {
          setEnableAudioCall(true);
          setFieldValue("communication.audioCallUnitPrice", 1.79)
        } else if (setting === "oneWayVideo") {
          setEnableOneWayVideoCall(true);
          setFieldValue("communication.videoCallOneWayUnitPrice", 1.99)
        } else if (setting === "twoWayVideo") {
          setEnableTwoWayVideoCall(true);
          setFieldValue("communication.videoCallTwoWayUnitPrice", 1.99)
        }
        return [...prevSelected, setting];
      } else {
        if (setting === "phone") {
          setEnablePhoneCall(false);
          setFieldValue("communication.phoneCallUnitPrice", 0.0)
        } else if (setting === "audio") {
          setEnableAudioCall(false);
          setFieldValue("communication.audioCallUnitPrice", 0.0)
        } else if (setting === "oneWayVideo") {
          setEnableOneWayVideoCall(false);
          setFieldValue("communication.videoCallOneWayUnitPrice", 0.0)
        } else if (setting === "twoWayVideo") {
          setEnableTwoWayVideoCall(false);
          setFieldValue("communication.videoCallTwoWayUnitPrice", 0.0)
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
    if (prevReviewTextRef.current) {
      prevReviewTextRef.current.innerHTML = content;
    }
  };

  const cloesCrop = () => {
    setShowCrop(false);
  };

  const onChangeFile = async (e: any) => {
    const base64 = await getBase64FromUrl(e);
    return { base64 };
  };

  const getBase64FromUrl = async (url: any) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const onChange64Base = async (file: any) => {
    onChangeFile(file).then((data: any) => {
      setUploadedImage(data?.base64)
    });
  };

  const onSubmitFile = (file: any) => {
    onChange64Base(file);
  };

  const onProfileInfoMethodClick = (textEditor: any, setFieldValue: any) => {
    if (textEditor) {
      setShowTextEditor(true)
    } else {
      setShowTextEditor(false)
    }
  }

  const handleEmbedImageChange = (e: any) => {
    setLoading(true)
    const { dispatch } = props
    const urlArr: any[] = [];

    const body = new FormData();

    for (let i = 0; i < e.currentTarget.files.length; i++) {
      body.append('images', e.currentTarget.files[i]);
    }

    dispatch(uploadCkEditorImage(body)).then((res: any) => {
      res.data.data.map((url: any) => {
        urlArr.push(url)
      })
      setUploadedHtmlEmbedImages((prev) => [...prev, ...urlArr])
      setLoading(false)
    }).catch((error: any) => {
      setLoading(false)
      toast.error(error?.data?.message, {
        theme: "colored",
        autoClose: 5000,
      });
    })
  }

  const onClickCopyUrl = async (e: any, imageUrl: any) => {
    e.preventDefault();
    await navigator.clipboard.writeText(imageUrl);
    toast.success("URL is copied in clipboard...")
  }

  return (
    <div className={`${registrationFlow ? "bg-[#36007a] " : "bg-[#F8F3FD]"}`}>
      {isLoading && <RctPageLoader />}

      {!registrationFlow ?
        <Header chatType="consultant" />
        :
        <div className="w-full p-6 rounded-b-full rounded-t-full">
          <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
            <img
              src={phoneDarlingsLogo}
              alt="logo"
              className="mx-auto w-[183px] h-[26px]"
            />
          </div>
        </div>
      }

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
          profileInfo: selectedProfile?.profileInfo ?? "",
          isPublicUser: (selectedProfile?.isPublicUser || selectedProfile?.publicUserStatus === 'Requested') ? true : false,
          gender: selectedProfile?.gender ?? "",
          showMeAs: selectedProfile?.categories2 ?? "",

        }}
        enableReinitialize
        validationSchema={validationSchema}
        validateOnChange
        onSubmit={(value: any) => {
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

          const body = {
            username: value.profileName,
            description: value.profileDescription,
            profileInfo: value.profileInfo,
            enablePhoneCall: enablePhoneCall,
            enableAudioCall: enableAudioCall,
            enableOneWayVideoCall: enableOneWayVideoCall,
            enableTwoWayVideoCall: enableTwoWayVideoCall,
            communication: communication,
            categories: selectCat,
            isPublicUser: value.isPublicUser,
            gender: value.gender
          };

          setUpdatedProfileDetails(body)
          setConformationModal(true)
        }}
      >
        {({ errors, touched, values, setFieldValue, onChange }: any) => (
          <Form className="px-4 md:px-6 pb-6">
            <div className={``}>
              <div
                className={`${!registrationFlow ? " bg-[#FFFFFF]" : "bg-[#2b0062] "
                  } px-6 md:px-8 py-6  rounded-2xl`}
              >
                <div className="md:max-w-none md:w-full mb-6">
                  {registrationFlow && (
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

                  {!registrationFlow && (
                    <>
                      <div className="w-full text-center mb-3 font-bold text-[#37085B]">
                        My Profile
                      </div>

                      <div className="w-full text-start mb-3 font-bold text-[#37085B]">
                        Public Profile Information
                      </div>

                    </>
                  )}

                  <div>
                    <div className="md:flex w-full">
                      <div
                        className="mb-4 md:mb-0 max-h-[232px] max-w-[232px]"
                        style={{ aspectRatio: "1" }}
                      >
                        <label
                          htmlFor="exampleFormControlInpu3"
                          className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                        >
                          Profile Photo
                        </label>

                        <label className="cursor-pointer">
                          <div
                            style={{ aspectRatio: "1" }}
                            className={`border ${!registrationFlow ? "border-[#37085B] bg-[#37085b33] " : "border-[#FFF] bg-[#ffffff33] "}  flex items-center justify-center h-[232px] w-[232px] mx-auto rounded`}
                          >
                            {uploadedImage ? (
                              <img
                                src={uploadedImage}
                                alt="add"
                                className="w-full h-full"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faPlus} className={`text-2xl font-bold ${!registrationFlow ? "text-primary" : "text-white"}`} />
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

                      <div className="md:ml-6 h-[232px] flex flex-col justify-between">
                        <div className="">
                          <div className="w-full md:w-72 xl:w-96">
                            <label
                              htmlFor="exampleFormControlInpu3"
                              className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                            >
                              Profile Name
                            </label>
                            <Field
                              type="text"
                              name="profileName"
                              autocomplete="off"
                              placeholder="Profile Name"
                              className={`form-control block w-full px-3 py-1.5 text-base font-normal  ${!registrationFlow ? "bg-white border-[#37085B] text-gray-700" : "bg-[#2b0062] border-[#FFF] text-[#FFFFFF]"} bg-clip-padding border border-solid  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
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
                        <div className="">
                          <div className="w-full md:w-72 xl:w-96">
                            <label
                              htmlFor="exampleFormControlInpu3"
                              className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                            >
                              Brief Public Description
                            </label>

                            <Field
                              rows={6}
                              as="textarea"
                              name="profileDescription"
                              autocomplete="off"
                              placeholder="Profile Description"
                              className={`max-h-[130px] form-control block w-full px-3 py-1.5 text-base font-normal  ${!registrationFlow ? "bg-white border-[#37085B] text-gray-700" : "bg-[#2b0062] border-[#FFF] text-[#FFFFFF]"} bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
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
                    </div>

                    <div className="mt-2">
                      <p className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`} >
                        No nudity allowed in your profile photo. You may add rated R content in the “Extended Profile Information” section below.
                      </p>
                    </div>


                    <div className="mt-6">
                      <div className="flex items-center flex-wrap">
                        <div className="md:mr-60">
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name={"isPublicUser"}
                              placeholder="Profile Description"
                              id={"isPublicUser"}
                              className={`border-[#37085B] h-5 w-5 rounded-lg border bg-white checked:bg-[#37085B] checked:border-[#37085B] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${errors.callSettings && touched.callSettings && "border-[#E85626]"}`}
                            />
                            <label
                              className={`text-sm font-semibold inline-block ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                              htmlFor={"isPublicUser"}
                              style={{ fontFamily: "Montserrat" }}
                            >
                              Allow my profile to be seen on the public home page.
                            </label>
                          </div>
                        </div>

                        <div className="">
                          <div className={`${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mt-4 mb-4 leading-none`}>
                            Show me as
                          </div>

                          <div className="flex items-center font-['Montserrat']">
                            <div className="flex items-center mr-10">
                              <Field
                                type="radio"
                                className="accent-primary w-[17px] h-[17px]"
                                name="gender"
                                value="Women"
                                id="Women"
                              />
                              <label
                                className={`ml-2 text-sm font-semibold inline-block ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                htmlFor="Women"
                              >
                                Women
                              </label>
                            </div>

                            <div className="flex items-center mr-10">
                              <Field
                                type="radio"
                                className="accent-primary w-[17px] h-[17px]"
                                name="gender"
                                value="Trans"
                                id="Trans"

                              />
                              <label
                                className={`ml-2 text-sm font-semibold inline-block ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                htmlFor="Trans"
                              >
                                Trans
                              </label>
                            </div>

                            <div className="flex items-center mr-10">
                              <Field
                                type="radio"
                                className="accent-primary w-[17px] h-[17px]"
                                name="gender"
                                value="Men"
                                id="Men"
                              />
                              <label
                                className={`ml-2 text-sm font-semibold inline-block ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                htmlFor="Men"
                              >
                                Men
                              </label>
                            </div>
                          </div>

                          {errors.gender && touched.gender && (
                            <div className="text-[#E85626] mt-2">
                              {errors.gender}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-bold mt-4`}>
                        Contact Settings
                      </div>

                      <div className="grid lg:grid-cols-2 gap-5 mt-6">
                        <div className="pr-16">
                          <div>
                            <div className={`text-sm ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mb-6`}>
                              Call Settings
                            </div>
                            <div className="">
                              {callSettingList.map((list) => (
                                <>
                                  <div
                                    key={list?.value}
                                    className="mb-8 text-[#37085B]"
                                  >
                                    <div className="flex align-items-center ">
                                      <Checkbox
                                        name={`${list?.name}`}
                                        data={list}
                                        touched={touched}
                                        errors={errors}
                                        labelClassName={registrationFlow ? "text-[#FFFFFF]" : ""}
                                        handleCheckBox={handleCallSettingList}
                                        isChecked={selectedCheckboxes.includes(
                                          list?.value!
                                        )}
                                        setFieldValue={setFieldValue}
                                        isCallList={true}
                                      />
                                    </div>
                                    <div className={`ml-7 font-['Montserrat'] leading-none text-base mt-1 font-medium w-full ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}>
                                      {list?.instructionText}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>


                        </div>

                        <div className="md:mr-24">
                          <div className={`text-sm ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold`}>
                            Call Pricing
                          </div>
                          <div className={`text-sm ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mb-6`}>
                            All prices are suggested only, you may edit.
                          </div>
                          <FieldArray
                            name="communication"
                            render={() => (
                              <div className="">
                                {menuSettingList.map((list, index) => (
                                  <div className="grid grid-cols-2 gap-6 mb-4 ">
                                    <div className={`text-sm ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}  font-semibold`}>
                                      <p>{list.lable}</p>
                                      <p className="">{list.priceRange}</p>
                                    </div>
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
                                            <div className="text-[#E85626]">
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

                        <div>
                          <div className={`text-sm ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-semibold mb-6`}>
                            Categories
                          </div>
                          <div className="">
                            <div className="grid grid-cols-2 gap-4">
                              {categories.map((cat: any, index: any) => {
                                if (!hiddenCatList.includes(cat?.name)) {
                                  const currentCat = selectCat?.find((selectedCat: any) => selectedCat?.name === cat?.name)
                                  return (
                                    <>
                                      <div
                                        key={cat?.sequence}
                                        className=" mb-1 text-[#37085B]"
                                      >
                                        <div>
                                          <Field
                                            type="checkbox"
                                            name={cat?.name}
                                            placeholder="Profile Description"
                                            id={cat?.name + index}
                                            onChange={(event: any) => handleCheckChat(cat?.name)}
                                            checked={currentCat?.name ? true : false}
                                            className={`border-[#37085B] h-5 w-5 rounded-lg border bg-white checked:bg-[#37085B] checked:border-[#37085B] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"}`}
                                          />
                                          <label
                                            className={`text-sm font-semibold inline-block ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                            htmlFor={cat?.name + index}
                                            style={{ fontFamily: "Montserrat" }}
                                          >
                                            {cat?.name}
                                          </label>
                                        </div>

                                        <div className="ml-6">
                                          {cat?.subcategories &&
                                            cat?.subcategories?.map((subCat: any) => {
                                              return (
                                                <div className="flex items-center mt-2">
                                                  <Field
                                                    type="checkbox"
                                                    name={subCat?.name}
                                                    placeholder="Profile Description"
                                                    id={subCat + index}
                                                    onChange={(event: any) => handleCheckSubCat(cat?.name, subCat)}
                                                    checked={currentCat?.subcategories.includes(subCat) ? true : false}
                                                    className={`border-[#37085B] h-5 w-5 rounded-lg border bg-white checked:bg-[#37085B] checked:border-[#37085B] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"}`}
                                                  />
                                                  <label
                                                    className={`text-sm font-semibold inline-block ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                                    htmlFor={subCat + index}
                                                    style={{ fontFamily: "Montserrat" }}
                                                  >
                                                    {subCat}
                                                  </label>
                                                </div>
                                              )
                                            })
                                          }
                                        </div>
                                      </div>

                                    </>


                                  )
                                }
                              })}
                            </div >
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className={`${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-bold mt-4`}>
                          Extended Profile Information
                        </div>

                        <div className={`text-sm ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"} font-medium`}>
                          Explicit Content allowed here.
                        </div>
                      </div>

                      <div className="w-full mt-1 flex flex-row rounded bg-[#D7CEDE]">
                        <div className={`p-2 cursor-pointer basis-1/2 text-center rounded-s ${showTextEditor ? "bg-primary" : "bg-transparent"}  font-semibold text-white`} onClick={() => onProfileInfoMethodClick(true, setFieldValue)}>Text Editor</div>

                        <div className={`p-2 cursor-pointer basis-1/2 text-center font-semibold text-white rounded-e ${!showTextEditor ? "bg-primary" : "bg-transparent"}`} onClick={() => setShowTextEditor(false)}>Embed Custom HTML</div>
                      </div>

                      {showTextEditor ?
                        (
                          <div className="mt-4">
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
                              name="profileInfo"
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
                        )
                        :
                        (
                          <>
                            <div className="mt-4">

                              <div className="flex justify-between items-center">
                                <div>
                                  <label
                                    htmlFor="exampleFormControlInpu3"
                                    className={`form-label font-['Montserrat'] leading-none inline-block text-base font-normal ${!registrationFlow ? "text-[#37085B]" : "text-[#FFFFFF]"}`}
                                  >
                                    Members Public Information
                                  </label>
                                </div>

                                <div>
                                  <label className="cursor-pointer">
                                    <div className={`border  ${!registrationFlow ? "border-[#37085B] text-[#37085B] px-14" : "border-[#673AB7] text-[#673AB7] bg-[#FFFFFF] px-20"} py-2 rounded-lg font-medium`}>
                                      Upload Image
                                    </div>

                                    <Field
                                      type="file"
                                      accept="image/png, image/gif, image/jpeg"
                                      name="htmlEmbedImage"
                                      className="hidden"
                                      multiple
                                      onChange={handleEmbedImageChange}
                                    />
                                  </label>

                                </div>

                              </div>

                              {uploadedHtmlEmbedImages?.length ?
                                <div className="flex max-w-100% overflow-auto smallScroll pb-3 mt-4">
                                  {
                                    uploadedHtmlEmbedImages?.map((imageUrl: any) => {
                                      return (
                                        <div className="w-[132px] mr-3">

                                          <div className="h-[132px] w-[132px] overflow-hidden rounded">
                                            <img src={imageUrl} width={"100%"} height={"100%"} />
                                          </div>

                                          <button className="rounded px-2 w-full py-2 mt-2 bg-secondary text-white font-semibold" onClick={(e: any) => onClickCopyUrl(e, imageUrl)}>
                                            Copy URL
                                          </button>
                                        </div>

                                      )
                                    })
                                  }
                                </div>
                                : null}

                              <div className="mt-3">
                                <Field
                                  as="textarea"
                                  name="profileInfo"
                                  rows={10}
                                  autocomplete="off"
                                  placeholder="Write html code here..."
                                  className={`form-control block w-full px-3 py-1.5 text-base font-normal  ${!registrationFlow ? "bg-white border-[#37085B] text-gray-700" : "bg-[#2b0062] border-[#FFF] text-[#FFFFFF]"} bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white 
                    focus:outline-none border-1 resize-none`}
                                />
                              </div>

                              {/* <div ref={prevReviewTextRef} className="mt-4 ck ck-content break-words ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"></div>  */}
                            </div>

                          </>
                        )}
                    </div>
                  </div>
                  <div className="text-center mt-6">
                    <button id="submitBtn" type="submit" disabled={profileDisable} className={`border  ${!registrationFlow ? "border-[#37085B] text-[#37085B] px-14" : "border-[#673AB7] text-[#673AB7] bg-[#FFFFFF] px-20"} py-2 rounded-lg font-medium  ${profileDisable && "opacity-25"}`}>
                      {!registrationFlow ? "Save Profile" : "Register"}
                    </button>
                  </div>

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

      {showCrop && (
        <ImageCrop
          cloesCrop={cloesCrop}
          file={uploadedImage}
          onSubmitFile={onSubmitFile}
          cropShape={"rect"}
        />
      )}
    </div>
  )
}

export default connect()(ManageProfile);

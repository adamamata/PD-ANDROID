import React, { useState, useEffect } from "react";
import phoneDarlingsLogo from "../../assets/images/phoneDarlingsLogo.svg";
import { userImageUpload, editProfile } from "../../services/authService";
import { connect } from "react-redux";
import { set_profile, auth_details } from "../../reducer/auth";
import { useSelector } from "react-redux";
import RctPageLoader from "../../component/RctPageLoader";
import jsonpatch from "fast-json-patch";
import AddRate from "../../view/auth/AddRates";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

interface DProps {
  cloes: any;
}

const AddProfilePhoto: React.FC<any> = (props: DProps | any) => {
  const { cloes } = props;
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState<any>("");
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const profile = useSelector(auth_details);
  const user_id = useSelector(auth_details);
  const [userProfile, setUserProfle] = useState<any>();
  const [description, setDescription] = useState<string>("");
  const [imagevalid, setImageValid] = useState<boolean>(false);
  const [showRate, setShowRate] = useState<boolean>(false);
  const [showsubmit, setShowsubmit] = useState<boolean>(true);
  const [fileError, setFileError] = useState<boolean>(false);
  const [desError, setDesError] = useState<boolean>(false);
  const imageType = ["image/png", "image/jpg", "image/jpeg"];

  useEffect(() => {
    setUserProfle(profile.user_profile);
    setDescription(profile.user_profile.description);
    setFile(profile.user_profile.profileImageUrl);
  }, [profile.user_profile]);

  const handleChange = (e: any) => {
    if (e.target.files[0] !== "") {
      setImageValid(false)
      setFileError(false);
      const { dispatch } = props;
      const userID = user_id?.login?.id;
      let formData = new FormData();
      const valid = validationImage(e.target.files[0]);
      if (!valid) {
        setLoading(true);
        formData.append("thumbnailEn", e.target.files[0]);
        dispatch(userImageUpload(userID, formData))
          .then((res: any) => {
            setLoading(false);
            dispatch(set_profile(res?.data));
            toast.success("Image Upload Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });
          })
          .catch((err: any) => {
            setLoading(false);
            console.log("errr", err);
          });
      }
      setFile(URL.createObjectURL(e.target.files[0]));
    } else {
      setFileError(true);
    }
  };

  const validationImage = (file: any) => {
    let valid = false;
    if (imageType.includes(file.type)) {
      setImageValid(false);
      valid = false;
    } else {
      setImageValid(true);
      valid = true;
    }
    return valid;
  };

  const handleClick = (event: any) => {
    hiddenFileInput.current?.click();
  };

  const OnSubmitData = () => {
    const { dispatch } = props;
    const userID = user_id?.login?.id;
    const communication = {
      shortMessageUnitPrice: userProfile.communication.shortMessageUnitPrice,
      videoCallUnitPrice: userProfile.communication.videoCallUnitPrice,
      audioCallUnitPrice: userProfile.communication.audioCallUnitPrice,
      videoCallOneWayUnitPrice: userProfile.communication.videoCallOneWayUnitPrice,
      phoneCallUnitPrice: userProfile.communication.phoneCallUnitPrice,
      id: userProfile.communication.id,
      callConnecting: null,
    };
    const body = {
      description: description,
      name: userProfile.name,
      created: userProfile.created,
      credit: userProfile.credit,
      dateOfBirth: userProfile.dateOfBirth,
      doNotDisturb: userProfile.doNotDisturb,
      email: userProfile.email,
      enableVoiceAndVideo: userProfile.enableVoiceAndVideo,
      enabled: userProfile.enabled,
      id: userProfile.id,
      isBusy: userProfile.isBusy,
      isDeleted: userProfile.isDeleted,
      isMyFriend: userProfile.isMyFriend,
      isOfferMe: userProfile.isOfferMe,
      isPendingRequests: userProfile.isPendingRequests,
      phoneNumber: userProfile.phoneNumber,
      profileImageUrl: userProfile.profileImageUrl,
      role: userProfile.role,
      communication: communication,
      updated: userProfile.updated,
      username: userProfile.username,
    };
    if ((description === null || description === "") || (file === null || file === "")) {
  
      setDesError(true);
      setFileError(true);
    } else {
      setLoading(true);
      const diff = jsonpatch.compare(userProfile, body);
      dispatch(editProfile(userID, diff))
        .then((res: any) => {
          setLoading(false);
          dispatch(set_profile(res?.data));
          setDesError(false);
          setFileError(false)
          toast.success("Profile Update Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
          if (res.data.role === "ServiceProvider") {
            setShowsubmit(false);
            setShowRate(true);

          } else {
            cloes();
          }
        })
        .catch((err: any) => {
          setShowRate(true);
          const massage = err.response.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
          setLoading(false);
          cloes();
        });
    }
  };

  const onChangeDescription = (e: any) => {
    if (e.target.value === "") {
      setDesError(true);
    } else {
      setDesError(false);
      setDescription(e.target.value);
    }
  };

  const onCancelRate = () => {
    setShowRate(false);
  };

  return (
    <>
      {" "}
      {showsubmit && (
        <>
          <div className="w-full">
            <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
              {isLoading && <RctPageLoader />}
              <div className="relative font-['Montserrat'] w-auto mx-auto max-w-3xl bg-white rounded py-6">
                <div
                  className="flex justify-end text-2xl font-bold text-black mr-4 cursor-pointer"
                  onClick={() => setShowsubmit(false)}
                >
                  <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                </div>

                <div className="flex items-center w-96 h-2/6 bg-gray-50 rounded-lg">
                  <div className="flex-1 h-2/6 w-96 mx-auto bg-white rounded-lg">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <img
                          src={phoneDarlingsLogo}
                          alt="logo"
                          className="w-[264px] h-[47px]"
                        />
                      </div>
                      <div className="w-9/12 mx-auto font-jaldi ">
                        <div className="text-primary text-2xl 2xl:text-3xl font-normal mt-2 2xl:mt-4">
                          Tell us a little more
                        </div>
                        <div className="mx-auto w-[120px] cursor-pointer mt-2">
                          {!file || imagevalid ? (
                            <>
                              <div
                                className="bg-btnprimary mx-auto w-[108px] h-[108px] flex justify-center items-center rounded-2xl"
                                onClick={handleClick}
                                style={{
                                  boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.25)",
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </div>
                              <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={handleChange}
                                style={{ display: "none" }}
                                ref={hiddenFileInput}
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type="file"
                                onChange={handleChange}
                                style={{ display: "none" }}
                                ref={hiddenFileInput}
                              />
                              <div className="w-[108px] h-[108px] mx-auto relative">
                                <img
                                  className="w-[108px] h-[108px] mx-auto rounded-2xl"
                                  onChange={handleChange}
                                  onClick={handleClick}
                                  src={file}
                                  alt="fileupload"
                                />
                                <span
                                  className="absolute top-0.5 right-1.5 bg-white rounded-full px-2"
                                  onClick={() => setFile(null)}
                                >
                                  x
                                </span>
                              </div>
                            </>
                          )}
                          <div className="mx-auto text-xl text-center font-jaldi mt-2">
                            Profile Picture
                          </div>
                        </div>
                        {imagevalid && (
                          <div>
                            please enter valid image type valid image type .png
                            , .jpg, .jpeg
                          </div>
                        )}
                        <div className="">
                          <div>
                            <label className="text-xl 2xl:text-2xl font-normal text-black ml-0.5 font-jaldi">
                              Description
                            </label>
                          </div>
                          <textarea
                            className="w-full resize-none rounded-md h-48 2xl:h-64 border border-gray-300 focus:border-primary focus:outline-none"
                            value={description}
                            onChange={onChangeDescription}
                          ></textarea>
                          {desError && fileError && (
                            <div className="text-[#E85626]">
                              Please enter profile picture and description to
                              continue
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="justify-center mt-1 mb-2 font-jaldi flex">
                      <button
                        className="bg-btnprimary hover:bg-primary text-white text-2xl py-1 px-14 rounded-full border-4 border-solid border-borderlight"
                        onClick={OnSubmitData}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showRate && <AddRate cancle={onCancelRate} />}
    </>
  );
};

export default connect()(AddProfilePhoto);

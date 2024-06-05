import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import { Notification } from "../../constant/default";
import { useSelector } from "react-redux";
import { auth_details, set_profile } from "../../../reducer/auth";
import jsonpatch from "fast-json-patch";
import { editProfile } from "../../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface DProps {
  cancel: any;
}
const EditMyMenuItems: React.FC<DProps> = (props: DProps | any) => {
  const { cancel } = props;
  const details = useSelector(auth_details);
  let user_details = details?.user_profile;
  let [shortMessageRates, setShortMessageRates] = useState(0);
  let [videoCallRates, setVideoCallRates] = useState(0);
  let [videoCallOneWayRates, setVideoCallOneWayRates] = useState(0);
  let [phoneCallRates, setPhoneCallRates] = useState(0);
  let [isSaving, setIsSaving] = useState(false);
  let [errorMassges, setErrormassges] = useState(false);
  let [errorVideo, setErrorVideo] = useState(false);
  let [errorVideoOneWay, setErrorVideoOneWay] = useState(false);
  let [errorVoice, setErrorVoice] = useState(false);
  let [errorPhone, setErrorPhone] = useState(false);
  let [voiceCallRates, setVoiceCallRates] = useState(0);

  useEffect(() => {
    setShortMessageRates(user_details?.communication?.shortMessageUnitPrice);
    setVideoCallRates(user_details?.communication?.videoCallUnitPrice);
    setVideoCallOneWayRates(user_details?.communication?.videoCallOneWayUnitPrice);
    setVoiceCallRates(user_details?.communication?.audioCallUnitPrice);
    setPhoneCallRates(user_details?.communication?.phoneCallUnitPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = () => {
    if (errorMassges || errorVideo || errorVoice || errorVideoOneWay) 
      return;

    setIsSaving(true);
    const { dispatch } = props;
    const communication = {
      shortMessageUnitPrice: shortMessageRates,
      videoCallUnitPrice: videoCallRates,
      videoCallOneWayUnitPrice: videoCallOneWayRates,
      audioCallUnitPrice: voiceCallRates,
      phoneCallUnitPrice: phoneCallRates,
      id: user_details.communication.id,
    };
    const body = {
      description: user_details.description,
      name: user_details.name,
      created: user_details.created,
      credit: user_details.credit,
      dateOfBirth: user_details.dateOfBirth,
      doNotDisturb: user_details.doNotDisturb,
      email: user_details.email,
      enableVoiceAndVideo: user_details.enableVoiceAndVideo,
      enabled: user_details.enabled,
      id: user_details.id,
      isBusy: user_details.isBusy,
      isDeleted: user_details.isDeleted,
      isMyFriend: user_details.isMyFriend,
      isOfferMe: user_details.isOfferMe,
      isPendingRequests: user_details.isPendingRequests,
      phoneNumber: user_details.phoneNumber,
      profileImageUrl: user_details.profileImageUrl,
      role: user_details.role,
      communication: communication,
      updated: user_details.updated,
      username: user_details.username,
    };
    const diff = jsonpatch.compare(user_details, body);
    let diffPatch: any = [];
    diff.map((x) => {
      if (x.path === "/communication/shortMessageUnitPrice") {
        diffPatch.push({
          op: "replace",
          path: "/communication/shortMessageUnitPrice",
          value: shortMessageRates,
        });
      } else if (x.path === "/communication/audioCallUnitPrice") {
        diffPatch.push({
          op: "replace",
          path: "/communication/audioCallUnitPrice",
          value: voiceCallRates,
        });
      } else if (x.path === "/communication/videoCallUnitPrice") {
        diffPatch.push({
          op: "replace",
          path: "/communication/videoCallUnitPrice",
          value: videoCallRates,
        });
      } else if (x.path === "/communication/videoCallOneWayUnitPrice") {
        diffPatch.push({
          op: "replace",
          path: "/communication/videoCallOneWayUnitPrice",
          value: videoCallOneWayRates,
        });
      }  else if (x.path === "/communication/phoneCallUnitPrice") {
        diffPatch.push({
          op: "replace",
          path: "/communication/phoneCallUnitPrice",
          value: phoneCallRates,
        });
      } else {
        diffPatch.push(x);
      }
    });

    dispatch(editProfile(user_details?.id, diffPatch))
      .then((res: any) => {
        dispatch(set_profile(res?.data));
        toast.success("Profile Update  Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });
        setIsSaving(false);
        cancel();
      })
      .catch((err: any) => {
        setIsSaving(false);
        console.log("err", err);
      });
  };

  const onChangeMassges = (event: any) => {
    setShortMessageRates(event);
    if (event > 5) {
      setErrormassges(true);
    } else {
      setErrormassges(false);
    }
  };

  const onChangeVideo = (event: any) => {
    setVideoCallRates(event);
    if (event > 50) {
      setErrorVideo(true);
    } else {
      setErrorVideo(false);
    }
  };
  const onChangeVideoOneWay = (event: any) => {
    setVideoCallOneWayRates(event);
    if (event > 50) {
      setErrorVideoOneWay(true);
    } else {
      setErrorVideoOneWay(false);
    }
  };
  const onChangeVoice = (event: any) => {
    setVoiceCallRates(event);
    if (event > 50) {
      setErrorVoice(true);
    } else {
      setErrorVoice(false);
    }
  };
  const onChangePhone = (event: any) => {
    setPhoneCallRates(event);
    if (event > 50) {
      setErrorPhone(true);
    } else {
      setErrorPhone(false);
    }
  };

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-auto mx-auto max-w-3xl bg-white rounded px-10 py-4">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={cancel}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} /> 
          </div>
          <div className="text-primary text-center text-2xl font-bold 2xl:mt-4">
            Edit Menu
          </div>
          <p className="mt-4">Enter your menu rate</p>
          <div className="grid md:grid-cols-2 mt-2 justify-between">
            <div className="p-2">
              <p>Short Message</p>
              <div className="border border-[#C9C9C9] rounded py-2 pl-4 pr-2">
                <span>$</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  className="w-10 md:w-20 ml-2 focus:outline-none"
                  value={shortMessageRates}
                  onChange={(e) => onChangeMassges(Number(e.target.value))}
                ></input>{" "}
                <span className="ml-2">/ msg</span>
              </div>
              {errorMassges && (
                <div className="text-[#E85626]">
                  The value you have entered is above the maximum price allowed
                  for this service.
                </div>
              )}
            </div>
            <div className="p-2">
              <p>Phone Call</p>
              <div className="border border-[#C9C9C9] rounded py-2 pl-4 pr-2">
                <span>$</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={phoneCallRates}
                  onChange={(e) => onChangePhone(Number(e.target.value))}
                  className="w-10 md:w-20 ml-2 focus:outline-none"
                ></input>{" "}
                <span className="ml-2">/ min</span>
              </div>
              {errorPhone && (
                <div className="text-[#E85626]">
                  The value you have entered is above the maximum price allowed
                  for this service.
                </div>
              )}
            </div>
            <div className="p-2">
              <p>Voice Call</p>
              <div className="border border-[#C9C9C9] rounded py-2 pl-4 pr-2">
                <span>$</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={voiceCallRates}
                  onChange={(e) => onChangeVoice(Number(e.target.value))}
                  className="w-10 md:w-20 ml-2 focus:outline-none"
                ></input>{" "}
                <span className="ml-2">/ min</span>
              </div>
              {errorVoice && (
                <div className="text-[#E85626]">
                  The value you have entered is above the maximum price allowed
                  for this service.
                </div>
              )}
            </div>
            <div className="p-2">
              <p>Video Call</p>
              <div className="border border-[#C9C9C9] rounded py-2 pl-4 pr-2">
                <span>$</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={videoCallRates}
                  onChange={(e) => onChangeVideo(Number(e.target.value))}
                  className="w-10 md:w-20 ml-2 focus:outline-none"
                ></input>{" "}
                <span className="ml-2">/ min</span>
              </div>
              {errorVideo && (
                <div className="text-[#E85626]">
                  The value you have entered is above the maximum price allowed
                  for this service.
                </div>
              )}
            </div>
            <div className="p-2">
              <p>Video Call One Way</p>
              <div className="border border-[#C9C9C9] rounded py-2 pl-4 pr-2">
                <span>$</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={videoCallOneWayRates}
                  onChange={(e) => onChangeVideoOneWay(Number(e.target.value))}
                  className="w-10 md:w-20 ml-2 focus:outline-none"
                ></input>{" "}
                <span className="ml-2">/ min</span>
              </div>
              {errorVideoOneWay && (
                <div className="text-[#E85626]">
                  The value you have entered is above the maximum price allowed
                  for this service.
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center mt-16">
            <button
              className="bg-btnprimary hover:bg-primary text-white text-xl py-1 px-8 rounded-full border-4 border-solid border-borderlight"
              type="submit"
              disabled={isSaving}
              onClick={onClickSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
      <div className="fixed inset-0 z-40 bg-[#676767]"></div>
    </>
  );
};

export default connect()(EditMyMenuItems);

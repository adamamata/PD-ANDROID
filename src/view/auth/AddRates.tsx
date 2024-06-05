import React, { useState, useEffect } from "react";
import { set_profile, auth_details } from "../../reducer/auth";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { editProfile } from "../../services/authService";
import jsonpatch from "fast-json-patch";
import RegestrationSubmit from "./RegestrationSubmit"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalLoader from "../../component/ModalLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface Rprops {
  RateCancle: any;
}

const AddRates: React.FC<any> = (props: Rprops | any) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { RateCancle } = props;
  const [isLoading, setLoading] = useState(false);
  const profile = useSelector(auth_details);
  const user_id = useSelector(auth_details);
  const [userProfile, setUserProfle] = useState<any>();
  const [shortMessageRates, setShortMessageRates] = useState<any>(0);
  const [videoCallOneWayRates, setVideoCallOneWayRates] = useState<any>(0);
  const [videoCallRates, setVideoCallRates] = useState<any>(0);
  const [voiceCallRates, setVoiceCallRates] = useState<any>(0);
  const [phoneCallRates, setPhoneCallRates] = useState<any>(0);
  const [showFinish, setShowfinish] = useState<boolean>(false);
  const [showRate, setShowRate] = useState<boolean>(true);

  const handleChange = (event: any) => {
    setIsSubscribed((current) => !current);
  };

  useEffect(() => {
    setUserProfle(profile.user_profile);
    setShortMessageRates(profile.user_profile?.communication?.shortMessageUnitPrice);
    setVideoCallRates(profile.user_profile?.communication?.videoCallUnitPrice);
    setVoiceCallRates(profile.user_profile?.communication?.audioCallUnitPrice);
    setVideoCallOneWayRates(profile.user_profile?.communication?.videoCallOneWayUnitPrice);    
    setPhoneCallRates(profile.user_profile?.communication?.phoneCallUnitPrice);    
  }, [profile.user_profile]);

  const OnSubmitData = () => {
    setShowfinish(true)
    setLoading(true)
    const { dispatch } = props;
    const userID = user_id?.login?.id;
    const communication = {
      shortMessageUnitPrice: shortMessageRates,
      videoCallUnitPrice: videoCallRates,
      audioCallUnitPrice: voiceCallRates,
      videoCallOneWayUnitPrice: videoCallOneWayRates,
      phoneCallUnitPrice: phoneCallRates,
      id:userProfile.communication.id
    };
    const body = {
      description: userProfile.description,
      name: userProfile.name,
      created: userProfile.created,
      credit: userProfile.credit,
      dateOfBirth: userProfile.dateOfBirth,
      doNotDisturb: userProfile.doNotDisturb,
      email: userProfile.email,
      enableVoiceAndVideo: isSubscribed,
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
      communication:communication,
      updated: userProfile.updated,
      username: userProfile.username,
    };
    const diff = jsonpatch.compare(userProfile, body);
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
      } else if (x.path === "/communication/phoneCallUnitPrice") {
        diffPatch.push({
          op: "replace",
          path: "/communication/phoneCallUnitPrice",
          value: phoneCallRates,
        });
      } else {
        diffPatch.push(x);
      }
    });

    dispatch(editProfile(userID, diff)).then((res: any) => {
      setLoading(false)
      dispatch(set_profile(res.data))
      setShowRate(false)
      RateCancle()
      toast.success("Rate add Successfull!", {
        theme: "colored",
        autoClose: 5000,
    });

    }).catch((err: any) => {
      const massage = err.response.data.message;
      toast.error(massage, {
        theme: "colored",
        autoClose: 5000,
      });
      setLoading(false)
    })
  }

  const onCancleModal = () => {
    setShowfinish(false)
  }

  return (
    <>
      {showRate &&
        <>
          <div className="w-full">
            <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
              {isLoading && <ModalLoader />}
              <div className="relative font-['Montserrat'] w-auto mx-auto max-w-3xl bg-white rounded px-10 py-8">
                <div
                  className="flex justify-end text-xl font-bold text-black cursor-pointer"
                  onClick={() => setShowRate(false)}
                >
                  <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                </div>
                <div className="text-primary text-center text-3xl font-bold 2xl:mt-4">
                  Add Rates
                </div>
                <p className="mt-4 font-bold">Enter your menu rate</p>
                <div className="flex mt-4 justify-between">
                  <div className="p-2">
                    <p>Chat</p>
                    <div>
                      ${" "}
                      <input
                        type="number"
                        min={0}
                        value={shortMessageRates}
                        onChange={(e) => setShortMessageRates(Number(e.target.value))}
                        className="w-16 border-b border-black focus:border-b focus:outline-none"
                      ></input>{" "}
                      / msg
                    </div>
                  </div>
                  <div className="p-2 ml-4">
                    <p>voice call</p>
                    <div>
                      ${" "}
                      <input
                        type="number"
                        min={0}
                        value={voiceCallRates}
                        onChange={(e) => setVoiceCallRates(Number(e.target.value))}
                        className="w-16  border-b border-black focus:border-b focus:outline-none"
                      ></input>{" "}
                      / min
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="p-2">
                    <p>Phone Call</p>
                    <div>
                      ${" "}
                      <input
                        type="number"
                        min={0}
                        value={phoneCallRates}
                        onChange={(e) => setPhoneCallRates(Number(e.target.value))}
                        className="w-16 border-b border-black focus:border-b focus:outline-none"
                      ></input>{" "}
                      / min
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="p-2">
                    <p>Video Call one way</p>
                    <div>
                      ${" "}
                      <input
                        type="number"
                        min={0}
                        value={videoCallOneWayRates}
                        onChange={(e) => setVideoCallOneWayRates(Number(e.target.value))}
                        className="w-16 border-b border-black focus:border-b focus:outline-none"
                      ></input>{" "}
                      / min
                    </div>
                  </div>
                </div>
                <div className="mt-2 2xl:mt-4 flex justify-center items-center mt-4">
                  <input
                    className="h-5 w-5 rounded-lg border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600  focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    value={isSubscribed as any}
                    onChange={handleChange}
                    id="subscribe"
                    name="subscribe"
                  />
                  <label
                    className="text-base 2xl:text-lg font-normal inline-block text-black"
                    htmlFor="subscribe"
                  >
                    I allow Video Calling on the platform
                  </label>
                </div>
                {isSubscribed && (
                  <div className="p-2 mt-2">
                    <p>Video Call</p>
                    <div>
                      ${" "}
                      <input
                        type="number"
                        min={0}
                        value={videoCallRates}
                        onChange={(e) => setVideoCallRates(Number(e.target.value))}
                        className="w-16 border-b border-black focus:border-b focus:outline-none"
                      ></input>{" "}
                      / min
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-center mt-12">
                  <button
                    className="bg-btnprimary hover:bg-primary text-white text-xl py-1 px-16 rounded-full border-4 border-solid border-borderlight"
                    onClick={OnSubmitData}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      }
      {showFinish && <RegestrationSubmit cancle={onCancleModal} />}
    </>
  );
}

export default connect()(AddRates);

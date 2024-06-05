import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import deleteIcon from "../../../assets/images/delete.svg"
import twoWayVideo from "../../../assets/images/twoWayVideo.svg";
import RctPageLoader from "../../../component/RctPageLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ChangeStatus,
  ChangeStatusOnlineTOffline,
} from "../../../services/homeService";
import Switch from "react-switch";
import { faMessage, faPhone, faTty, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const StyledMenuCard = styled.div`
  box-shadow: 0px 1px 12px rgba(132, 182, 186, 0.4);
`;

const status = [
  { value: "Available", label: "Available (Default)" },
  { value: "Busy", label: "Busy (Shown to customers as 'Away')" },
  { value: "DoNotDisturb", label: "Do Not Disturb (Shown to customers as 'Away' and blocks new calls.)" },
];

const MyProfileCard: React.FC<any> = (props: any) => {
  const {
    dispatch,
    onEditClick,
    onDeleteClick,
    profileData,
    getSPProfileData,
    onPreviewClick,
    onShareButtonClick
  } = props;
  const [dropDown, setDropdown] = useState(false);
  const [indexProfile, setIndexProfile] = useState(0);
  // const [profileData, setProfileData] = useState<any>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const profileMenu = (iconName: any, title: string, balance: string) => (
    <StyledMenuCard className="max-h-[115px] max-w-[90px] p-6 text-center">
      {title !== "2 Way" ?
        <FontAwesomeIcon icon={iconName as IconProp} className="text-primary text-4xl text-center w-full" />
        :
        <img className="mx-auto" src={iconName} alt={title} width={'35.99px'} height={'35.99px'} />
      }

      <p className="text-xs text-[#545454] my-2 font-bold">{title}</p>
      <p className="text-xs text-[#545454] font-bold">${balance}</p>
    </StyledMenuCard>
  );

  const openDropDwon = (index: any) => {
    setIndexProfile(index);
    setDropdown(!dropDown);
  };

  const onchangeStatus = (value: any, user: any) => {
    dispatch(ChangeStatus(value.target.value, user.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getSPProfileData();
          setisLoading(false);
          toast.success("Your status has been updated.", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        const massage = err.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const onCHangeOnlineOffline = (data: any) => {
    setisLoading(true);
    dispatch(ChangeStatusOnlineTOffline(data.id, !data.isOnline))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getSPProfileData();
          setisLoading(false);
          toast.success("Your status has been updated.", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        const massage = err.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      {isLoading && <RctPageLoader />}
      {profileData.map((profile: any, index: number) => (
        <div
          key={profile.id}
          className="mb-6 rounded-[15px] bg-white p-6 border grid lg:grid-cols-5 gap-4"
        >
          <div className="flex flex-wrap place-content-center">
            <img
              src={profile?.profileImageUrl}
              className="rounded-full w-[81px] h-[81px]"
            />

            <div className=" w-full justify-center items-center mt-2">

              <div className="flex justify-center">
                <button
                  className="text-primary bg-primary bg-opacity-[15%] mt-4 text-base font-medium hover:text-primary py-2 border-2 border-solid border-primary px-5 rounded-full font-['Montserrat']"
                  onClick={() => onEditClick(profile)}
                >
                  Edit Profile
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-primary mt-4 hover:bg-primary text-white font-medium text-base hover:text-white py-2 border-2 border-solid border-primary px-8 hover:border-transparent rounded-full font-['Montserrat']"
                  onClick={() => onPreviewClick(profile)}
                >
                  Preview
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-transparent mt-4 hover:bg-primary text-primary font-medium text-base hover:text-white py-2 border-2 border-solid border-primary px-10 hover:border-transparent rounded-full font-['Montserrat']"
                  onClick={() => onShareButtonClick(profile?.id)}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="grid sm:grid-cols-3 md:grid-cols-none lg:grid-cols-3 gap-6 lg:gap-4">
              <div className="sm:col-span-2 md:col-span-auto lg:col-span-2">
                <div>
                  <p className="font-semibold text-[#37085B]">
                    {profile.username} (Total Earnings: ${profile.totalEarnings?.toFixed(2)})
                  </p>
                  <p className="font-sm text-[#37085B] line-clamp-3">
                    {profile?.description}
                  </p>
                </div>
                <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 mt-3 mt-3">
                  {profile?.communication?.shortMessageUnitPrice
                    ? profileMenu(
                      faMessage,
                      "Chat",
                      profile?.communication?.shortMessageUnitPrice
                    )
                    : ""}
                  {profile?.communication?.phoneCallUnitPrice
                    ? profileMenu(
                      faTty,
                      "Phone",
                      profile?.communication?.phoneCallUnitPrice
                    )
                    : ""}
                  {profile?.communication?.audioCallUnitPrice
                    ? profileMenu(
                      faPhone,
                      "Audio",
                      profile?.communication?.audioCallUnitPrice
                    )
                    : ""}
                  {profile?.communication?.videoCallOneWayUnitPrice
                    ? profileMenu(
                      faVideo,
                      "1 Way",
                      profile?.communication?.videoCallOneWayUnitPrice
                    )
                    : ""}
                  {profile?.communication?.videoCallTwoWayUnitPrice
                    ? profileMenu(
                      twoWayVideo,
                      "2 Way",
                      profile?.communication?.videoCallTwoWayUnitPrice
                    )
                    : ""}
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="font-sm text-[#37085B] flex">
                    <Switch
                      checked={profile?.isOnline}
                      onChange={() => onCHangeOnlineOffline(profile)}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#37085B"
                      offColor="#3E3E3E"
                    />
                    {profile?.isOnline ? <p>Online</p> : <p>Offline</p>}
                  </div>

                  <div>
                    <button
                      className="text-[#37085B] ml-4"
                    >
                      <img src={deleteIcon} alt="delete" onClick={() => onDeleteClick(profile?.id)} />
                    </button>

                  </div>
                </div>
                {profile?.isOnline ? (
                  <div className="mt-5">
                    <p className="font-semibold text-[#37085B]">Status</p>
                    <div className="mt-4">
                      {status.map((active) => (
                        <div className="flex align-items-center mt-2">
                          <div className="w-[17px]">
                            <input
                              className="accent-primary w-[17px] h-[17px]"
                              type="radio"
                              value={active.value}
                              checked={profile.status === active.value}
                              onChange={(e) => onchangeStatus(e, profile)}
                            />
                          </div>
                          <div className="flex align-items-center leading-none">
                            <label className="font-medium text-sm text-[#37085B] ml-3">
                              {active.label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default connect()(MyProfileCard);

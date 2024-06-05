import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import ellipse from "../../assets/images/ellipse.png";
import Switch from "../common/ui/Switch";
import { enableDisableDoNotDisturb, indexSwitchUser } from "../../services/homeService";
import { set_Show_Chat } from "../../reducer/auth";
import { toast } from "react-toastify";
import { dndDetails, setDndEnabled } from "../../reducer/dndDataSlice";

interface StatusProps {
  profile: any;
  showInboxsUser: any;
  indexsList: any;
  dispatch?: any;
  inbox?: boolean
  onInboxOptionChange?: (selectedOption: any) => void
  selectedProfile?: any
}

const ChatStatusInbox = (props: StatusProps): JSX.Element => {
  const { profile, indexsList, showInboxsUser, inbox, onInboxOptionChange, selectedProfile } = props;
  const userDetails = profile.user_profile;
  const { dispatch } = props;
  const { isDndEnable } = useSelector(dndDetails)

  const [isDNDChecked, setDNDIsChecked] = useState<boolean>(false);
  const [userDetail, setuserDetails] = useState<any>();

  // useEffect(() => {
  //   if(indexsList && indexsList?.length) {
  //     setDNDIsChecked(indexsList[0].stateDoNotDisturbAll ? )
  //   }
  // }, [indexsList])

  useEffect(() => {
    setDNDIsChecked(isDndEnable)
  }, [isDndEnable])

  useEffect(() => {
    if (selectedProfile) {
      setuserDetails(selectedProfile)
    }
  }, [selectedProfile])

  useEffect(() => {
    const localstoreData: any = localStorage.getItem("userIndex");
    if (localstoreData) {
      setuserDetails(JSON.parse(localstoreData));
    } else {
      const userData = {
        username: userDetails?.username,
        profileImageUrl: userDetails?.profileImageUrl,
      };
      setuserDetails(userData);
    }
  }, []);

  const gotoChangeUser = (data: any) => {
    if (inbox && onInboxOptionChange) {
      onInboxOptionChange(data)
    } else {
      dispatch(set_Show_Chat(false));
      showInboxsUser(data);
    }
  };

  const onDNDSwitchChange = () => {
    dispatch(enableDisableDoNotDisturb(!isDNDChecked)).then(() => {
      setDNDIsChecked(!isDNDChecked)
      dispatch(setDndEnabled(!isDNDChecked))
    }).catch((err: any) => {
      toast.error("Something Went Wrong.....!!")
    })
  }

  return (
    <div className="">
      <>
        <div className="flex">
          <div className="relative">
            <img
              src={userDetail?.profileImageUrl}
              alt="user"
              className="h-[40px] w-[40px] rounded-full"
            />
            <p
              className={`absolute ${isDNDChecked ? "bg-[#E89051]" : "bg-[#47B514]"
                } bottom-[0] h-[10px] right-1 rounded-full w-[10px]`}
            />
          </div>
          <div className="ml-5">
            <div className="font-bold text-sm">{userDetail?.name ?? userDetail?.username}</div>
            {isDNDChecked && <div className="text-[10px]">busy</div>}
          </div>
        </div>
        <hr className={`border-primary my-5 -mx-2  hidden lg:block`} />

        {!inbox &&
          <>
            <div className="flex hidden lg:block">
              <div>
                <Switch
                  isChecked={isDNDChecked}
                  checkedBorder="#545454"
                  unCheckedBorder="#545454"
                  checkedRound="#545454"
                  unCheckedRound="#545454"
                  checkedBackground="#fffff"
                  unCheckedBackground="#fffff"
                  onSwitchChange={onDNDSwitchChange}
                />
              </div>
              <div className="ml-4">
                <p className="font-medium text-xs">Do Not Disturb</p>
                <p className="font-medium text-[10px]">
                  This will enable all your profiles to show a “Busy” status and block
                  all your incoming calls.{" "}
                </p>
              </div>
            </div>
            <hr className="border-primary my-5 -mx-2 hidden lg:block" />
          </>
        }
      </>

      <div>
        <p className="font-bold">Inboxes</p>
        <div className={`overflow-auto ${inbox ? "h-[calc(100vh_-_270px)]" : "h-[calc(100vh_-_415px)]" }  smallScroll`}>
          {indexsList?.map((userDetail: any) => (
            <div
              key={userDetail.id}
              onClick={() => gotoChangeUser(userDetail)}
              className={`flex items-center mr-2 cursor-pointer hover:bg-primary hover:bg-opacity-[21%] my-2 p-2 rounded ${selectedProfile?.id === userDetail.id
                ? "bg-[#37085B] bg-opacity-[21%]"
                : ""
                }`}
            >
              <img src={ellipse} alt="" />
              <img
                src={userDetail.profileImageUrl}
                alt="user"
                className="mx-4 h-[40px] w-[40px] rounded-full"
              />
              <p className="font-medium text-xs">{userDetail.username} ({userDetail.unread})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect()(ChatStatusInbox);

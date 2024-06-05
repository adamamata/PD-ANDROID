import React, { useEffect, useState } from "react";
import dollarSign from "../../../assets/images/dollarSign.svg";
import Header from "../commons/header";
import {
  getUserDetails,
  createAcceptData,
  createRejectData,
  postRequestConsultation,
  openChatThread,
  requestGift,
  addBlockUser,
} from "../../../services/homeService";
import { connect, useDispatch } from "react-redux";
import SendGift from "../user/sendGift";
import {
  set_chat_data,
  set_Show_Chat,
  set_Inbox_Data,
  set_User_Identifier,
  set_Token_Credential,
  set_Thread_Id,
} from "../../../reducer/auth";
import RctPageLoader from "../../../component/RctPageLoader";
import { useParams } from "react-router-dom";
import defultUser from "../../../assets/images/defultUser.png";
import { useNavigate } from "react-router-dom";
import Footer from "../../../component/footer";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { set_azure_communication_data, set_chat_token_credential_data } from "../../../reducer/chatDataSlice";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { CommunicationUserIdentifier } from "@azure/communication-signaling";
import { LOCALSTORE } from "../../../constant/default";
import UserBlockConformationModal from "../../../component/common/ui/userBlockConformationModal";
import { useQuery } from "../../../utils/useQueryHoook";

const ViewProfile: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const persistDispatch = useDispatch()
  const [isLoading, setisLoading] = useState(false);
  const [user_details, setuser_details] = useState<any>();
  const params = useParams();
  const [showChate, setShowChate] = useState(false);
  const [disableRequest, setDisableRequest] = useState(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [chatData, setChatData] = useState<any>();
  const [giftShow, setGiftShow] = useState<boolean>(false);
  const [chatDisable, setchatDisable] = useState<boolean>(false);
  const currentSpData: any = localStorage.getItem("userIndex");
  const [blockConformationModal, setBlockConformationModal] = useState(false);
  const query = useQuery();
  const profileId = query.get('profileId');

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [])

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = () => {
    setisLoading(true);
    const { dispatch } = props;
    dispatch(getUserDetails(params?.id, profileId))
      .then((res: any) => {
        setisLoading(false);
        setuser_details(res.data);
      })
      .catch((err: any) => {
        console.log("err", err);
        setisLoading(false);
      });
  };

  const requestAccept = (data: any) => {
    const { dispatch } = props;
    setisLoading(true);
    dispatch(createAcceptData(data?.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          setShowChate(true);
          setisLoading(false);
          toast.success("Request Accpet Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
      });
  };

  const requestReject = (data: any) => {
    const { dispatch } = props;
    setisLoading(true);
    dispatch(createRejectData(data?.id))
      .then((res: any) => {
        if (res.data.isSuccess) {
          getUserData();
          setShowChate(false);
          toast.success("Request Accpet Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
      });
  };

  const requestUser = () => {
    const { dispatch } = props;
    setisLoading(true);
    dispatch(postRequestConsultation(user_details?.id))
      .then((res: any) => {
        if (res?.data?.isSuccess) {
          setDisableRequest(true);
          setisLoading(false);
          toast.success("Requests send User Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
      });
  };

  const onGotoChat = (data: any) => {
    setisLoading(true);
    setchatDisable(true);
    const { dispatch } = props;

    // const currentParticipantData = JSON.parse(localStorage.getItem("indexData")!)

    // const currentPArticipantId = currentParticipantData?.find((participant: any) => participant?.participantUserId === params?.id)

    dispatch(openChatThread(params?.id, JSON.parse(currentSpData).id))
      .then((res: any) => {
        const tokenCredential = new AzureCommunicationTokenCredential(res?.data?.myAccessToken);
        const userId = fromFlatCommunicationIdentifier(res?.data?.myId) as CommunicationUserIdentifier;
        dispatch(set_User_Identifier(userId));
        dispatch(set_Token_Credential(tokenCredential));
        dispatch(set_Thread_Id(res?.data?.threadId))
        localStorage.setItem(
          LOCALSTORE.communicationIdentifier.threadId,
          res?.data?.threadId
        );

        localStorage.setItem(
          LOCALSTORE.communicationIdentifier.token,
          res?.data?.myAccessToken
        );

        persistDispatch(set_azure_communication_data(res?.data))
        persistDispatch(set_chat_token_credential_data(new AzureCommunicationTokenCredential(res?.data?.myAccessToken)))
        dispatch(set_chat_data(res?.data));
        dispatch(set_Show_Chat(true));
        setisLoading(false);
        setchatDisable(false)
        const data: any = null;
        // localStorage.setItem("indexData", data);
        navigate(`/consultant/chat`, { state: { currentSpId: JSON.parse(currentSpData).id, currentUserId: params?.id } });
      })
      .catch((err: any) => {
        const error = err.response.data.message;
        toast.error(error, {
          theme: "colored",
          autoClose: 3000,
        });
        console.log("err");
        setisLoading(false);
        setchatDisable(false)
      });
  };
  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const redirectInbox = (data: any) => {
    const { dispatch } = props;
    const obj = {
      value: data.username,
      label: data.username,
      id: data.id,
    };
    dispatch(set_Inbox_Data(obj));
    navigate(`/consultant/sendMail`);
  };

  const onGotoHome = () => {
    navigate(`/consultant/home`);
  };

  const sendGiftUser = (data: any) => {
    createOpenChatThread(data?.id);
  };

  const createOpenChatThread = (id: any) => {
    setisLoading(true)
    setchatDisable(true)
    const { dispatch } = props;
    dispatch(openChatThread(id))
      .then((res: any) => {
        setChatData(res?.data);
        setGiftShow(true);
        setisLoading(false)
        setchatDisable(false)
      })
      .catch((err: any) => {
        setisLoading(false)
        setchatDisable(false)
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const giftClose = () => {
    setGiftShow(false);
  };

  const onSubmitGift = (data: any) => {
    setisLoading(true);
    const { dispatch } = props;
    const body = {
      threadId: chatData.threadId,
      chatAccessToken: chatData.myAccessToken,
      message: "gift",
      type: "gift",
      price: data,
    };
    dispatch(requestGift(body))
      .then((res: any) => {
        toast.success("Gift send Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });
        setGiftShow(false);
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

  const onSubmitBlockUser = () => {
    setBlockConformationModal(false)
    const { dispatch } = props;
    const userIndex = localStorage.getItem("userIndex")

    if (userIndex) {
      const currentProfileId = JSON.parse(userIndex).id

      if (currentProfileId) {
        dispatch(addBlockUser(currentProfileId, user_details?.id)).then((res: any) => {
          if (res.data.isSuccess) {
            navigate(-1)
          }
        }).catch((err: any) => {
          toast.error(err.data.message, {
            theme: "colored",
            autoClose: 5000,
          })
        })
      }
    }
  }

  return (
    <>
      {isLoading && <RctPageLoader />}
      <div className="bg-[#F8F3FD] min-h-screen">
        <Header navbar={navbar} onClick={navbarClick} />

        <div
          className={`mx-auto ${navbar ? "hidden" : "block"
            } md:block w-11/12 2xl:w-[1284px] mt-8 2xl:mt-12 bg-[#ffffffb5] rounded-lg pt-6 pb-8 px-6`}
        >
          <div className="w-full md:grid md:grid-cols-2">
            <div className="text-4xl text-primary text-center md:text-start">
              {user_details?.username}
            </div>
            <div className="hidden md:block ml-auto">
              <div className="flex flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                <button
                  className={`bg-primary mx-auto rounded-full xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:bg-white hover:text-primary hover:border-primary px-6 py-1 text-center border-2 border-solid border-primary ${chatDisable && "opacity-25"}`}
                  onClick={() => sendGiftUser(user_details)}
                  disabled={chatDisable}
                >
                  Request Gift
                </button>
                <span className="ml-2.5">
                  <button
                    className={`bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white px-12 py-1 text-center border-2 border-solid border-primary hover:border-transparent rounded-full ${chatDisable && "opacity-25"}`}
                    onClick={() => onGotoChat(user_details)}
                    disabled={chatDisable}
                  >
                    Chat
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="md:flex justify-between gap-4 mt-2 md:mt-0">
            {user_details?.profileImageUrl === null ||
              user_details?.profileImageUrl === "" ? (
              <img
                className="rounded-2xl w-[280px] h-[280px] mx-auto md:mx-0 md:shrink-0"
                src={defultUser}
                alt="product"
              />
            ) : (
              <img
                className="rounded-2xl w-[388px] h-[388px] mx-auto md:mx-0 md:shrink-0"
                src={user_details?.profileImageUrl}
                alt="product"
              />
            )}
            <div className="block md:hidden ml-auto">
              <div className="flex mt-4 flex-wrap md:justify-between w-full">
                <button
                  className={`bg-primary mx-auto rounded-full xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-full h-[50px]  border-2 border-solid border-primary ${chatDisable && "opacity-25"}`}
                  onClick={() => sendGiftUser(user_details)}
                  disabled={chatDisable}
                >
                  Request Gift
                </button>
                <button
                  className={`bg-white mx-auto mt-4 md:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-full h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full ${chatDisable && "opacity-25"}`}
                  onClick={() => onGotoChat(user_details)}
                  disabled={chatDisable}
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
          <div className="w-full 2xl:w-[769px] mt-3 md:grid content-between">
            <div>
              <p className="text-[#6E6E6E]">About</p>
              <p className="font-['Montserrat'] text-[#444444]">
                {user_details?.description}
              </p>
            </div>
            <div className="w-full md:w-[270px] h-[100px] bg-white mt-3">
              <div className="w-full md:w-[270px] flex items-center h-[100px] shadow-lg bg-white p-4">
                <div>
                  <img src={dollarSign} alt="design" />
                </div>
                <div className="ml-4">
                  <p className="font-['Montserrat'] font-bold text-[#545454]">
                    Total Earnings
                  </p>
                  <p className="font-['Montserrat'] font-bold text-2xl  text-primary">
                    ${user_details?.totalEarnings?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              className={`bg-primary mx-auto rounded-full xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-white text-2xl hover:text-white w-[150px] h-[50px]  border-2 border-solid border-primary ${chatDisable && "opacity-25"}`}
              onClick={() => setBlockConformationModal(true)}
            >
              Block User
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {giftShow && (
        <SendGift
          close={giftClose}
          chatUser={chatData}
          onSubmitGift={onSubmitGift}
          lable="Request Gift"
        />
      )}

      {blockConformationModal && (
        <UserBlockConformationModal
          setBlockConformationModal={setBlockConformationModal}
          onSubmitBlockUser={onSubmitBlockUser}
        />
      )}
    </>
  );
};

export default connect()(ViewProfile);

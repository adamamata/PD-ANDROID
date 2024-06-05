import React, { useEffect, useState } from "react";
import { getNewChatData, openChatThread } from "../../../services/homeService";
import { connect } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { set_chat_data, set_Show_Chat } from "../../../reducer/auth";
import defultUserRound from "../../../assets/images/defaultRound.svg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const NewChat = (props: any) => {
  const navigate = useNavigate();
  const [getList, setGetList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newChatDidisable, setNewChatDidisable] = useState(false);

  useEffect(() => {
    getNewListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNewListData = () => {
    const { dispatch } = props;
    setIsLoading(true);
    dispatch(getNewChatData())
      .then((res: any) => {
        setGetList(res?.data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
      });
  };

  const ongoChat = (id: any) => {
    const { dispatch } = props;
    setNewChatDidisable(true);
    setIsLoading(true);
    dispatch(openChatThread(id))
      .then((res: any) => {
        dispatch(set_chat_data(res?.data));
        dispatch(set_Show_Chat(true));
        props.close();
        props.getChatListData();
        navigate("/consultant/chat");
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        {isLoading && <RctPageLoader />}
        <div className="relative font-['Montserrat'] w-11/12  mx-auto bg-white rounded px-8 py-6 h-[calc(100vh_-_170px)] overflow-y-auto">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={props.close}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
            New Chat
          </div>

          <div className="text-sm font-medium text-[#C4C4C4]">
            Select someone to chat with:
          </div>

          <div className="text-[18px] font-semibold text-primary">My Users</div>
          {getList.length === 0 ? (
            <div className="flex justify-center	mt-[30px] font-bold">
              No Users found.
            </div>
          ) : (
            getList?.map((data: any) => (
              <div className="flex flex-wrap items-center md:flex-nowrap mt-4 cursor-pointer">
                {data?.profileImageUrl !== "" ||
                  data?.profileImageUrl !== null ? (
                  <img
                    src={data?.profileImageUrl}
                    className="w-[74PX] h-[74px] rounded-full "
                    alt=""
                  />
                ) : (
                  <img
                    src={defultUserRound}
                    className="w-[74px] h-[74px] my-auto shadow-2xl  rounded-full"
                    alt=""
                  />
                )}

                <div className="ml-2 w-[64%] md:w-[64%] font-['Montserrat']">
                  <p className="font-semibold text-[16px] text-primary ">
                    {data?.username}
                  </p>
                  <p
                    className="overflow-hidden w-full text-primary"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {data?.description}
                  </p>
                </div>

                <div className="my-auto md:ml-auto">
                  <button
                    className="bg-white md:ml-2 text-black text-2xl py-1 px-10 2xl:px-10 border-4 border-solid border-boderDark border-[#686868] rounded-full"
                    onClick={() => ongoChat(data?.id)}
                    disabled={newChatDidisable}
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default connect()(NewChat);

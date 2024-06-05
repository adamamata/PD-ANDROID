import React, { useEffect, useState } from "react";
import Header from "../commons/header";
import {
  getAllinbox,
  getUnreadIndex,
  getOneUnreadIndex,
  openInboxMessage,
} from "../../../services/homeService";
import { connect, useSelector } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { useNavigate } from "react-router-dom";
import {
  set_Inbox_Data,
  set_Inbox_Count,
  auth_details,
} from "../../../reducer/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../component/footer";
import searchChat from "../../../assets/images/searchChat.svg";
import moment from "moment";
import Addmassges from "../consultant/addmassges";
import InboxsContant from "./inboxcontant";
import { debounce } from 'lodash'

const UserInbox: React.FC<any> = (props: any) => {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = useSelector(auth_details);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [showInbox, setShowInbox] = useState(false);
  const [contact, setContact] = useState<any>();
  const [sendmassgess, setSendmassgess] = useState<any>(false);
  const [searchText, setSearchText] = useState(null)

  useEffect(() => {
    getwholeListdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const getwholeListdata = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getAllinbox('', searchText))
      .then((res: any) => {
        setList(res.data.data);
        setSendmassgess(false)
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("err");
      });
  };

  const sendMailData = () => {
    const { dispatch } = props;
    dispatch(set_Inbox_Data(null));
    navigate("/user/sendMail");
  };

  const onClickunRead = (res: any) => {
    if (res?.readOn === null) {
      const { dispatch } = props;
      dispatch(getOneUnreadIndex(res?.id))
        .then((data: any) => {
          getwholeListdata();
          getunreadInbox();
          navigate(`/user/sendMail/${res?.id}`);
        })
        .catch((err: any) => {
          const massage = err.response.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
        });
    } else {
      navigate(`/user/sendMail/${res?.id}`);
    }
  };

  const getunreadInbox = () => {
    const { dispatch } = props;
    dispatch(getUnreadIndex())
      .then((res: any) => {
        dispatch(set_Inbox_Count(res?.data?.data));
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const onGoToINboxContact = (data: any) => {
    const { dispatch } = props;
    dispatch(openInboxMessage(data.id))
      .then((res: any) => {
        setContact(res.data);
        setShowInbox(true)
        setSendmassgess(false)

        const updatedList = list.map((listItem: any) => {
          if (listItem?.id === data?.id) {
            listItem.unread = 0
            return listItem
          } else {
            return listItem
          }
        })

        setList(updatedList)
      })
      .catch((err: any) => {
        console.log("dsgksdh", err);
      });
  };

  const onHandleSearch = (e: any) => {
    setSearchText(e.target.value)
  }

  const debouncedOnChange = debounce(onHandleSearch, 1000);

  return (
    <>

      <div className="bg-[#F8F3FD] min-h-screen">
        {loading && <RctPageLoader />}
        <Header />
        <div
          className={`my-8 lg:mt-0 md:px-4 xl:px-6 w-11/12 mx-auto sm:mx-0 sm:w-full justify-between`}
        >
          <div className="rounded-2xl lg:flex bg-white w-full">
            <div className={`${showInbox || sendmassgess ? "hidden lg:block" : "block"}`}>
              <div className="flex">
                <div
                  className={`h-[calc(100vh_-_140px)] w-full lg:w-[375px] border-primary lg:border-r`}
                >
                  <div className="flex items-center mb-2 p-2 border-b">
                    <img src={searchChat} className="mr-2" alt="search" />
                    <input
                      placeholder="Search"
                      type="text"
                      className="w-full outline-none placeholder-[#8E8E8E] text-sm xl:text-lg text-primary leading-none"
                      onChange={debouncedOnChange}
                    />
                  </div>
                  <div className="h-[calc(100vh_-_226px)] xl:h-[calc(100vh_-_233px)] overflow-y-auto smallScroll">
                    {list.length !== 0 ? (
                      list.map((data: any, index: any) => (
                        <div
                          className={`hover:bg-primary hover:bg-opacity-[21%] w-full flex h-[60px] justify-between p-2 mb-3 items-center rounded`}
                          key={index}
                        >
                          <div
                            className="w-full flex items-center cursor-pointer"
                            onClick={() => onGoToINboxContact(data)}
                          >
                            <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px]">
                              {/* <img
                                src={data.participantImageUrl}
                                className="w-full h-full rounded-full"
                                alt=""
                              /> */}
                            </div>
                            <div className="ml-2 text-[#041058] w-full">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium text-[18px] text-black">
                                  {data?.senderName}
                                </p>
                                <p className="text-[18px] text-[#9F9F9F] font-semibold text-end">
                                  {moment(data?.created).calendar(null, {
                                    sameDay: 'h:mm A',
                                    lastDay: '[Yesterday]',
                                    lastWeek(m: any, now: any) {
                                      if (moment(data?.createdOn).year() < m?.year()) {
                                        return moment(data?.createdOn).format('DD/MM/yyyy HH:mm');
                                      } else {
                                        return moment(data?.createdOn).format('DD/MM HH:mm');
                                      }
                                    },
                                    sameElse(m: any) {
                                      if (moment(data?.createdOn).year() < m?.year()) {
                                        return moment(data?.createdOn).format('DD/MM/yyyy HH:mm');
                                      } else {
                                        return moment(data?.createdOn).format('DD/MM HH:mm');
                                      }
                                    }
                                  })}
                                </p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <p
                                  className="overflow-hidden font-medium text-xs text-[#575757]"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: "1",
                                    WebkitBoxOrient: "vertical",
                                    maxWidth: "49ch",
                                  }}
                                >
                                  {data?.subject}
                                </p>
                              </div>
                            </div>

                            <div className="ml-2">
                              {data?.unread !== 0 ? (
                                <div className="w-[8px] h-[8px] rounded-full bg-[#E85626]"></div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pl-2">No User found. </div>
                    )}
                  </div>
                  <div>
                    {" "}
                    <button
                      className={`bg-[#673AB7] font-['Montserrat'] mx-auto text-white font-semibold py-2 px-8 rounded-bl-2xl w-[100%]`}
                      onClick={() => setSendmassgess(true)}
                    >
                      New Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {sendmassgess ? (
              <Addmassges getwholeListdata={getwholeListdata} setSendmassgess={setSendmassgess} />
            ) : (
              <div className={`${showInbox ? "block" : "hidden lg:block"} w-full`}>
                <InboxsContant
                  contact={contact}
                  dispatch={props.dispatch}
                  getwholeListdata={getwholeListdata}
                  showInbox={showInbox}
                  setShowInbox={setShowInbox}
                />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default connect()(UserInbox);

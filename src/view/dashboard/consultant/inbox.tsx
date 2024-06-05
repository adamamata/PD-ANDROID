import React, { useEffect, useState } from "react";
import Header from "../commons/header";
import searchChat from "../../../assets/images/searchChat.svg";
import Footer from "../../../component/footer";
import {
  getAllinbox,
  getOneUnreadIndex,
  getUnreadIndex,
  getInboxIndexLists,
  openInboxMessage,
} from "../../../services/homeService";
import { connect, useSelector } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { useNavigate } from "react-router-dom";
import { set_Inbox_Data, set_Inbox_Count, auth_details } from "../../../reducer/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import InboxsContant from "./inboxcontant";
import AddMassges from "./addmassges";
import ChatStatusInbox from "../../../component/chat/chatStatusInbox";
import { selectCustomStyles } from "../../../component/chat/chatList";
import Select, { components } from "react-select";
import downArrow from "../../../assets/images/downArrow.svg";
import { debounce } from "lodash";

const SPInbox: React.FC<any> = (props: any) => {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showInbox, setShowInbox] = useState(false);
  const [contact, setContact] = useState<any>();
  const [sendmassgess, setSendmassgess] = useState<any>(false);
  const [indexsList, setIndexList] = useState<any>();
  const [Inbox, setInbox] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [options, setOption] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [selectedProfile, setSelectedProfile] = useState<any>()
  const [searchText, setSearchText] = useState(null)

  const profile = useSelector(auth_details);

  useEffect(() => {
    getIndexData();
  }, [])

  useEffect(() => {
    getwholeListdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    if (indexsList?.length) {
      const optionArr = [] as any[];
      indexsList.map((option: any) => {
        optionArr.push({
          label: `${option.username} (${option.unread})`,
          value: option.id,
          key: option.id,
          image: option.profileImageUrl,
        });
      });
      setOption(optionArr);
    }
  }, [indexsList]);

  const getwholeListdata = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getAllinbox(selectedProfile?.id ?? '', searchText))
      .then((res: any) => {
        setSendmassgess(false)
        setLoading(false);
        setList(res?.data?.data)
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("err");
      });
  };

  const sendMailData = () => {
    const { dispatch } = props;
    dispatch(set_Inbox_Data(null));
    navigate("/consultant/sendMail");
  };

  const onClickunRead = (res: any) => {
    if (res?.readOn === null) {
      const { dispatch } = props;
      dispatch(getOneUnreadIndex(res?.id))
        .then((data: any) => {
          getwholeListdata();
          getunreadInbox();
          navigate(`/consultant/sendMail/${res?.id}`);
        })
        .catch((err: any) => {
          const massage = err.response.data.message;
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
        });
    } else {
      navigate(`/consultant/sendMail/${res?.id}`);
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

  const onGoToINboxContact = (data: any) => {
    const { dispatch } = props;
    dispatch(openInboxMessage(data.id))
      .then((res: any) => {
        setContact(res.data);
        setShowInbox(true)
        setSendmassgess(false)
        setSelectedUser(data)
        
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

  const allContactdata = (data: any) => {
    onGoToINboxContact(data)
  }

  const getIndexData = () => {
    const { dispatch } = props;
    dispatch(getInboxIndexLists())
      .then((res: any) => {
        setIndexList(res.data);
      })
      .catch((Err: any) => {
        console.log("dfscghv", Err);
      });
  };

  const showInboxsUser = (data: any) => {
    setInbox(data);
    setShowInbox(true);
    // setInboxDatas1(Inbox);
  };

  useEffect(() => {
    if (options) {
      setLoading!(true)
      // const localstoreData: any = localStorage.getItem("userIndex");
      // const data = JSON.parse(localstoreData)
      if (indexsList || options?.length) {
        onChangesOption(indexsList[0] ?? options[0])
      } else {
        setLoading!(false)
      }
    }
  }, [options])


  const onChangesOption = (selectedData: any) => {
    setContact(null)
    setSelectedUser({})
    const { dispatch } = props;
    setLoading(true);
    dispatch(getAllinbox(selectedData?.value ?? selectedData?.id))
      .then((res: any) => {
        setSelectedOption(options.find((option: any) => option.value === selectedData?.id || option.value === selectedData?.value));
        setSelectedProfile(indexsList.find((option: any) => option.id === selectedData?.id || option.id === selectedData?.value))
        setList(res.data.data);
        setLoading!(false);
      })
      .catch((err: any) => {
        setLoading!(false);
        toast.error("Something went Wrong!...");
        console.log("fdjsgfds", err);
      });
  };

  const CustomDropdownIndicator = (props: any) => {
    const {
      selectProps: { menuIsOpen },
    } = props;
    return (
      <components.DropdownIndicator {...props}>
        <img
          src={downArrow}
          className={`${menuIsOpen ? "rotate-180" : ""}`}
          alt="arrow"
        />
      </components.DropdownIndicator>
    );
  };

  const IconOption = (props: any) => (
    <components.Option {...props}>
      <div className="flex">
        <img
          src={props.data.image}
          className="rounded-full h-[30px] w-[30px] mr-4"
          alt="profile"
        />
        {props.data.label}
      </div>
    </components.Option>
  );

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
          className={`my-2 lg:my-8 lg:mt-0 md:px-4 xl:px-6 w-11/12 mx-auto sm:mx-0 sm:w-full justify-between`}
        >
          <div className="rounded-2xl lg:flex bg-white w-full">
            <div className={`${showInbox || sendmassgess ? "hidden lg:block" : "block"}`}>
              <div className="flex">
                <div className="p-2 w-full lg:w-auto h-[calc(100vh_-_140px)] md:min-w-[250px] lg:max-w-[250px] border-primary lg:border-r">
                  <div className="w-full hidden lg:block">
                    <ChatStatusInbox
                      profile={profile}
                      indexsList={indexsList}
                      showInboxsUser={showInboxsUser}
                      onInboxOptionChange={onChangesOption}
                      inbox={true}
                      selectedProfile={selectedProfile}
                    />
                  </div>

                  <div className="block lg:hidden p-2 md:p-4">
                    <div>
                      <p className="font-bold text-xs">inboxes</p>
                      <Select
                        onChange={onChangesOption}
                        options={options}
                        value={selectedOption}
                        styles={selectCustomStyles}
                        className="w-11/12 bg-transparent text-xs text-black mt-2"
                        classNamePrefix="react-select"
                        components={{
                          IndicatorSeparator: () => null,
                          DropdownIndicator: CustomDropdownIndicator,
                          Option: IconOption,
                        }}
                        placeholder="Select an inbox to begin"
                        // onInputChange={onInputChange}
                        // isMulti
                        isSearchable={false}
                      />
                    </div>

                    <div
                      className={`p-2 h-[calc(100dvh_-_140px)] smallScroll w-full lg:w-[375px] border-primary lg:border-r`}
                    >
                      <div className="flex items-center mb-2 p-2 border-b">
                        <img
                          src={searchChat}
                          className="mr-2"
                          alt="search"
                        // onClick={onSearchList}
                        />
                        <input
                          placeholder="Search"
                          type="text"
                          className="w-full outline-none placeholder-[#8E8E8E] text-sm xl:text-lg text-primary leading-none"
                          // onKeyPress={(e: any) => {
                          //   onSearch(e);
                          // }}
                          onChange={debouncedOnChange}
                        />
                      </div>

                      <div className="h-[calc(100dvh_-_360px)] overflow-y-auto my-4 smallScroll">
                        {list.length !== 0 && indexsList && indexsList?.length ? (
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
                                  <img
                                    src={data.senderImageUrl}
                                    className="w-full h-full rounded-full"
                                    alt=""
                                  />
                                </div>
                                <div className="ml-2 text-[#041058] w-full">
                                  <div className="flex justify-between mb-1">
                                    <p className="font-medium text-[18px] text-black">
                                      {data?.senderName}
                                    </p>
                                    <p className="text-[18px] text-[#9F9F9F] font-semibold">
                                      {moment(data?.created).calendar(null, {
                                        sameDay: 'h:mm A',
                                        lastDay: '[Yesterday]',
                                        lastWeek(m: any, now: any) {
                                          if (moment(data?.created).year() < m?.year()) {
                                            return moment(data?.created).format('DD/MM/yyyy HH:mm'); 
                                          } else {
                                            return moment(data?.created).format('DD/MM HH:mm');
                                          }
                                        },
                                        sameElse(m: any) {
                                          if (moment(data?.created).year() < m?.year()) {
                                            return moment(data?.created).format('DD/MM/yyyy HH:mm');
                                          } else {
                                            return moment(data?.created).format('DD/MM HH:mm');
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
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="pl-2">No User found. </div>
                        )}

                      </div>

                      <button
                        className={`bg-[#673AB7] font-['Montserrat'] rounded-lg mx-auto text-white font-semibold py-2 px-8 w-[100%]`}
                        onClick={() => setSendmassgess(true)}
                      >
                        New Message
                      </button>
                    </div>

                  </div>
                </div>

                <div
                  className={`hidden lg:block h-[calc(100vh_-_140px)] smallScroll w-full lg:w-[375px] border-primary lg:border-r`}
                >
                  <div className="flex items-center mb-2 p-2 border-b">
                    <img src={searchChat} className="mr-2" alt="search" />
                    <input
                      placeholder="Search"
                      type="text"
                      onChange={debouncedOnChange}
                      className="w-full outline-none placeholder-[#8E8E8E] text-sm xl:text-lg text-primary leading-none"
                    />
                  </div>
                  <div className="h-[calc(100vh_-_226px)] smallScroll xl:h-[calc(100vh_-_233px)] overflow-y-auto">
                    {list.length !== 0 ? (
                      list.map((data: any, index: any) => (
                        <div
                          className={`hover:bg-primary hover:bg-opacity-[21%] w-full flex h-[60px] justify-between p-2 mb-3 items-center rounded 
                          ${selectedUser?.id === data.id ? "bg-[#37085B] bg-opacity-[21%]" : ""}
                          `}
                          key={index}
                        >
                          <div
                            className=" w-full flex items-center cursor-pointer"
                            onClick={() => onGoToINboxContact(data)}
                          >
                            <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px]">
                              <img
                                src={data.senderImageUrl}
                                className="w-full h-full rounded-full"
                                alt=""
                              />
                            </div>
                            <div className="ml-2 text-[#041058] w-full">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium text-[18px] text-black">
                                  {data?.senderName}
                                </p>
                                <p className="text-[18px] text-[#9F9F9F] font-semibold">
                                  {moment(data?.created).calendar(null, {
                                    sameDay: 'h:mm A',
                                    lastDay: '[Yesterday]',
                                    lastWeek(m: any, now: any) {
                                      if (moment(data?.created).year() < m?.year()) {
                                        return moment(data?.created).format('DD/MM/yyyy HH:mm');
                                      } else {
                                        return moment(data?.created).format('DD/MM HH:mm');
                                      }
                                    },
                                    sameElse(m: any) {
                                      if (moment(data?.created).year() < m?.year()) {
                                        return moment(data?.created).format('DD/MM/yyyy HH:mm');
                                      } else {
                                        return moment(data?.created).format('DD/MM HH:mm');
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
                  {selectedOption &&
                    <div>
                      {" "}
                      <button
                        className={`bg-[#673AB7] font-['Montserrat'] mx-auto text-white font-semibold py-2 px-8 w-[100%]`}
                        onClick={() => setSendmassgess(true)}
                      >
                        New Message
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
            {sendmassgess && selectedOption ? (
              <AddMassges getwholeListdata={getwholeListdata} setSendmassgess={setSendmassgess} selectedProfile={selectedOption} />
            ) : (
              <div className={`${showInbox ? "block" : "hidden lg:block"} w-full`}>
                <InboxsContant
                  allContactdata={allContactdata}
                  contact={contact}
                  dispatch={props.dispatch}
                  getwholeListdata={getwholeListdata}
                  showInbox={showInbox}
                  setShowInbox={setShowInbox}
                  selectedOption={selectedOption}
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

export default connect()(SPInbox);

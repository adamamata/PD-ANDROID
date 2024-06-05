import React, { useEffect, useState } from "react";
import searchChat from "../../assets/images/searchChat.svg";
import downArrow from "../../assets/images/downArrow.svg";
import { connect } from "react-redux";
import RctPageLoader from "../RctPageLoader";
import Header from "../../view/dashboard/commons/header";
import NewChat from "../../view/dashboard/user/newChat";
import Footer from "../footer";
import ChatScreen from "./chatScreen";
import ChatStatusInbox from "./chatStatusInbox";
import moment from "moment";
import Select, { components } from "react-select";
import { indexSwitchUser } from "../../services/homeService";
import { toast } from "react-toastify";
import { LOCALSTORE } from "../../constant/default";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { CircularProgress } from "@mui/material";
import { updateNewMessageToChatList } from "../../functions/utilities";
import { debounce } from "lodash";

interface ChatProps {
  showChat: boolean;
  openChat: boolean;
  profile: any;
  searchData: any;
  changeCHateList: (value: any) => void;
  DisableRequest: boolean;
  requestUser: (value: any) => void;
  error: any;
  chatThreads: any;
  chatUser: any;
  changeChatList: (value: any) => void;
  newChatShow: boolean;
  newChatClose: () => void;
  getChatListData: (value?: string) => void;
  isLoading: boolean;
  chatType: string;
  dispatch: any;
  indexsList: any;
  bakctogetChat: any;
  setIndexThread: any;
  setIsLoading?: (value: boolean) => void;
  noMoreData?: any;
  getMoreChatThreads?: any;
  cardLoading?: any;
  onInboxChanged?: (value: any) => void;
  setPage?: (value: any) => void;
}

export const selectCustomStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "1px",
    border: "2px solid #673AB7",
    background: "#e6d6f8",
    fontColor: "black",
    minHeight: "auto",
    color: "black !important",
    fontSize: "16px !important",
    fontWeight: "500 !important",
    padding: "5px !important",
  }),

  indicators: (base: any, state: any) => ({
    ...base,
    background: "white !important",
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "black !important",
    fontSize: "16px !important",
    fontWeight: "500 !important",
  }),

  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: `${state.isSelected ? "#673AB7 !important" : "#e6d6f8 !important"
      }`,
    color: `${state.isSelected ? "white !important" : "black !important"}`,
    fontWeight: `${state.isSelected ? "700 !important" : "600 !important"}`,
    fontSize: "16px !important",
  }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: "#e6d6f8",
    color: "black",
  }),

  menuList: (base: any) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
    backgroundColor: "#e6d6f8",
    border: "2px solid #673AB7",
    color: "black",
  }),

  singleValue: (base: any) => ({
    ...base,
    color: "black !important",
    fontWeight: 700,
    fontSize: "16px !important",
  }),
};

const ChatList: React.FC<any> = ({
  showChat,
  openChat,
  profile,
  searchData,
  changeCHateList,
  DisableRequest,
  requestUser,
  error,
  chatThreads,
  chatUser,
  changeChatList,
  newChatShow,
  newChatClose,
  getChatListData,
  isLoading,
  chatType,
  indexsList,
  dispatch,
  setIndexThread,
  setIsLoading,
  bakctogetChat,
  noMoreData,
  getMoreChatThreads,
  cardLoading,
  onInboxChanged,
  setPage
}: ChatProps) => {
  const [Inbox, setInbox] = useState<any>([]);
  const [options, setOption] = useState<any>([]);
  const [showInbox, setShowInbox] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<any>();
  const InboxDatas: any = localStorage.getItem("indexData");
  const [InboxDatas1, setInboxDatas1] = useState<any>([]);
  const [selectedProfile, setSelectedProfile] = useState();
  const [intialLoaded, setIntialLoaded] = useState(false);
  const [searchText, setSearchText] = useState('')
  const threadId = localStorage.getItem(LOCALSTORE.communicationIdentifier.threadId);
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onBeforeUnload = (ev: any) => {
      navigate(location.pathname, { state: {}, replace: true });
      localStorage.setItem(
        LOCALSTORE.communicationIdentifier.threadId, "")
    }

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    setInboxDatas1(JSON.parse(InboxDatas));
    if (JSON.parse(InboxDatas) !== null) {
      setInbox(JSON.parse(InboxDatas))
    }
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

  const getAllChat = (data: any) => {
    bakctogetChat(data);
  };

  const showInboxsUser = (data: any) => {
    setInbox(data);
    setShowInbox(true);
    setInboxDatas1(Inbox);
  };

  const onChangeInboxUser = (selectedData: any) => {
    indexSwitchUser(location?.state?.currentSpId ?? selectedData?.id ?? selectedData?.value, searchText)
      .then((res: any) => {
        showInboxsUser(res.data);
        localStorage.setItem("indexData", JSON.stringify(res.data));
        setSelectedOption(options.find((option: any) => option.value === res?.data[0]?.myUserId));
        setSelectedProfile(indexsList.find((option: any) => option.id === res?.data[0]?.myUserId))
        setInbox(res.data);
        setIsLoading!(false);
        setIntialLoaded(true);

        if (onInboxChanged)
          onInboxChanged({ selectedData, callBack: updateUnreadMessage });
      })
      .catch((err: any) => {
        setIsLoading!(false);
        console.log("fdjsgfds", err);
      });
  }

  useEffect(() => {
    if (chatType === "consultant") {
      if ((options || indexsList?.length) && !intialLoaded) {
        setIsLoading!(true)
        if (indexsList?.length || options?.length) {
          onChangeInboxUser(indexsList[0] ?? options[0])
        } else {
          setIsLoading!(false)
        }
      }
    } else {
      getChatListData(searchText)
    }
  }, [options, indexsList, searchText])

  const resetUnreadMessage = (data: any) => {
    const updatedInboxList = Inbox.map((obj: any) => {
      if (obj.participantId === data.participantId) {
        return { ...obj, unread: 0 };
      }

      return obj;
    });
    setInbox(updatedInboxList)
  }

  const updateUnreadMessage = (data: any) => {
    setInbox((ct: any) => {
      const updatedChatThreads = updateNewMessageToChatList(
        data,
        ct,
        data.threadId
      );

      localStorage.setItem("indexData", JSON.stringify(updatedChatThreads));
      return updatedChatThreads;
    });
  }

  const changeChatListData = (data: any) => {
    changeChatList(data);
    setIndexThread(data, chatThreads);
    const InboxDatasData: any = localStorage.getItem("indexData");
    const InboxDatasTemp: any = JSON.parse(InboxDatasData);
    const index = InboxDatasTemp?.findIndex((res: any) => res.id === data.id);
    const newObj: any = InboxDatasTemp?.find((res: any) => res.id === data.id);
    InboxDatasTemp?.splice(index, 1);
    InboxDatasTemp?.splice(0, 0, newObj);
    setInboxDatas1(InboxDatasTemp);
    localStorage.setItem("indexData", JSON.stringify(InboxDatasTemp));
    if (chatType === "consultant") {
      resetUnreadMessage(data)
    }
  };

  const onChangesOption = (selectedOption: any) => {
    setIsLoading!(true);
    if (chatType === "consultant") {
      onChangeInboxUser(selectedOption)
    } else {
      indexSwitchUser(selectedOption?.value)
        .then((res: any) => {
          setSelectedOption(selectedOption);
          setInbox(res.data);
          setIsLoading!(false);
        })
        .catch((err: any) => {
          setIsLoading!(false);
          toast.error("Something went Wrong!...");
          console.log("fdjsgfds", err);
        });
    }
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

  const handleSearch = (e: any) => {
    if (setPage) {
      setPage(1)
    }
    
    setSearchText!(e.target.value)
  }

  useEffect(() => {
    if (intialLoaded) {
      onChangeInboxUser(selectedProfile)
    }
  }, [searchText])

  const debouncedOnChange = debounce(handleSearch, 1000);

  return (
    <div className="bg-[#F8F3FD] min-h-screen">
      {isLoading && <RctPageLoader />}
      <Header chatType={chatType} />
      <div
        className={`my-2 lg:my-8 lg:mt-0 md:px-4 xl:px-6 w-11/12 mx-auto sm:mx-0 sm:w-full justify-between`}
      >
        <div className="rounded-2xl lg:flex bg-white w-full">
          <div className={`${showChat ? "hidden lg:block" : "block"}`}>
            <div className="flex">
              {chatType === "consultant" && (
                <>
                  <div className="p-2 w-full lg:w-auto h-[calc(100vh_-_140px)] md:min-w-[200px] lg:max-w-[250px] border-primary lg:border-r">
                    <div className="w-full hidden lg:block">
                      <ChatStatusInbox
                        profile={profile}
                        indexsList={indexsList}
                        showInboxsUser={onChangeInboxUser}
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
                        className={`p-2 h-[calc(100dvh_-_140px)] w-full lg:w-[375px] border-primary lg:border-r`}
                      >
                        <div className="flex items-center mb-2 p-2 border-b">
                          <img
                            src={searchChat}
                            className="mr-2"
                            alt="search"
                          />
                          <input
                            placeholder="Search"
                            type="text"
                            className="w-full outline-none placeholder-[#8E8E8E] text-sm xl:text-lg text-primary leading-none"
                            onChange={(e) => debouncedOnChange(e)}
                          />
                        </div>

                        <div className="h-[calc(100dvh_-_276px)] overflow-y-auto mt-4 smallScroll">
                          {Inbox.length !== 0 && indexsList && indexsList?.length ? (
                            Inbox.map((data: any, index: any) => {
                              return (
                                <div
                                  className={`hover:bg-primary hover:bg-opacity-[21%] w-full flex h-[60px] justify-between p-2 mb-3 items-center ${data?.unread !== 0
                                    ? "bg-[#37085B36]"
                                    : data?.participantUserName ===
                                      chatUser?.participantUserName &&
                                      showChat
                                      ? "bg-white"
                                      : ""
                                    } rounded`}
                                  key={index}
                                >
                                  <div
                                    className="lg:max-w-[320px] w-full flex items-center cursor-pointer"
                                    onClick={() => changeChatListData(data)}
                                  >
                                    <div className="w-[40px] h-[40px] min-w-[40px] relative min-h-[40px]">
                                      <img
                                        src={data?.participantImageUrl}
                                        className="w-full h-full rounded-full"
                                        alt=""
                                      />

                                    </div>
                                    <div className="ml-2 text-[#041058] w-full">
                                      <div className="flex justify-between mb-1">
                                        <p className="font-medium text-[18px] text-black">
                                          {data?.participantUserName}
                                        </p>

                                        {data?.lastMessage?.created ?
                                          <p className="text-[18px] text-[#9F9F9F] font-semibold text-end">
                                            {moment(data?.lastMessage?.created).calendar(null, {
                                              sameDay: 'h:mm A',
                                              lastDay: '[Yesterday]',
                                              lastWeek(m: any, now: any) {
                                                if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                                  return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                                } else {
                                                  return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                                }
                                              },
                                              sameElse(m: any) {
                                                if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                                  return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                                } else {
                                                  return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                                }
                                              }
                                            })}
                                          </p> : null
                                        }

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
                                          {data?.lastMessage?.message}
                                        </p>
                                      </div>
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
                              )
                            })
                          ) : (
                            <div className="pl-2">No User found. </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {chatType !== "user" ? (
                <div
                  className={`hidden lg:block p-2 h-[calc(100dvh_-_140px)] w-full lg:w-[375px] lg:border-primary ${showInbox ? "lg:border-r" : ""
                    } ${InboxDatas1 !== null ? "lg:border-r" : ""}`}
                >
                  {showInbox ? (
                    <div className="h-[calc(100dvh_-_230px)] overflow-y-auto">
                      {Inbox.length !== 0 && indexsList && indexsList?.length ? (
                        Inbox.map((data: any, index: any) => {
                          return (
                            <div
                              className={`hover:bg-primary hover:bg-opacity-[21%] w-full flex h-[60px] justify-between p-2 mb-3 items-center rounded 
                              ${threadId === data?.threadId
                                  ? "bg-[#37085B] bg-opacity-[21%]"
                                  : ""
                                }
                              `}
                              key={index}
                            >
                              <div
                                className="lg:max-w-[320px] w-full flex items-center relative cursor-pointer"
                                onClick={() => changeChatListData(data)}
                              >
                                <div className="w-[40px] h-[40px] min-w-[40px] relative min-h-[40px]">
                                  <img
                                    src={data?.participantImageUrl}
                                    className="w-full h-full rounded-full"
                                    alt=""
                                  />
                                </div>
                                <div className="ml-2 text-[#041058] w-full">
                                  <div className="flex justify-between mb-1">
                                    <p className="font-medium text-[18px] text-black">
                                      {data?.participantDisplayName}
                                    </p>
                                    {data?.lastMessage?.created ?
                                      <p className="text-[18px] text-[#9F9F9F] font-semibold text-end">
                                        {moment(data?.lastMessage?.created).calendar(null, {
                                          sameDay: 'h:mm A',
                                          lastDay: '[Yesterday]',
                                          lastWeek(m: any, now: any) {
                                            if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                              return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                            } else {
                                              return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                            }
                                          },
                                          sameElse(m: any) {
                                            if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                              return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                            } else {
                                              return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                            }
                                          }
                                        })}
                                      </p>
                                      : null
                                    }
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
                                      {data?.lastMessage?.message}
                                    </p>
                                  </div>
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
                          )
                        }
                        )
                      ) : (
                        <div className="pl-2">No User found. </div>
                      )}
                    </div>
                  ) : InboxDatas1 !== null ? (
                    <div className="h-[calc(100dvh_-_230px)] overflow-y-auto">
                      {InboxDatas1 && InboxDatas1.length !== 0 ? (
                        InboxDatas1 &&
                        InboxDatas1.map((data: any, index: any) => (
                          <div
                            className={`hover:bg-primary hover:bg-opacity-[21%] w-full flex h-[60px] justify-between p-2 mb-3 items-center rounded`}
                            key={index}
                          >
                            <div
                              className="lg:max-w-[320px] w-full flex items-center cursor-pointer"
                              onClick={() => changeChatListData(data)}
                            >
                              <div className="w-[40px] h-[40px] min-w-[40px] relative min-h-[40px]">
                                <img
                                  src={data?.participantImageUrl}
                                  className="w-full h-full rounded-full"
                                  alt=""
                                />

                                {/* <p
                                  className={`absolute ${data?.participantStatus === "Available"
                                      ? "bg-[#20B514]"
                                      : data?.participantStatus === "Busy" ||
                                        data?.participantStatus === "DoNotDisturb"
                                        ? "bg-[#E99312]"
                                        : "bg-[#EBEBEB]"
                                    } bottom-[0] h-[10px] right-1 rounded-full w-[10px]`}
                                /> */}
                              </div>
                              <div className="ml-2 text-[#041058] w-full">
                                <div className="flex justify-between mb-1">
                                  <p className="font-medium text-[18px] text-black">
                                    {data?.participantDisplayName}
                                  </p>
                                  {data?.lastMessage?.created ?
                                    <p className="text-[18px] text-[#9F9F9F] font-semibold text-end">
                                      {moment(data?.lastMessage?.created).calendar(null, {
                                        sameDay: 'h:mm A',
                                        lastDay: '[Yesterday]',
                                        lastWeek(m: any, now: any) {
                                          if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                            return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                          } else {
                                            return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                          }
                                        },
                                        sameElse(m: any) {
                                          if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                            return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                          } else {
                                            return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                          }
                                        }
                                      })}
                                    </p> : null
                                  }
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
                                    {data?.lastMessage?.message}
                                  </p>
                                </div>
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
                        ))
                      ) : (
                        <div className="pl-2">No User found. </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div
                  className={`p-2 h-[calc(100dvh_-_140px)] w-full lg:w-[375px] border-primary lg:border-r smallScroll`}
                >
                  <div className="flex items-center mb-2 p-2 border-b">
                    <img
                      src={searchChat}
                      className="mr-2"
                      alt="search"
                    />
                    <input
                      placeholder="Search"
                      type="text"
                      className="w-full outline-none placeholder-[#8E8E8E] text-sm xl:text-lg text-primary leading-none"
                      onChange={(e) => debouncedOnChange(e)}
                    />
                  </div>

                  <div className="h-[calc(100dvh_-_230px)] overflow-y-auto smallScroll">
                    <InfiniteScroll
                      pageStart={1}
                      initialLoad={false}
                      hasMore={!noMoreData}
                      loadMore={() => { !noMoreData && getMoreChatThreads(searchText) }}
                      useWindow={false}
                      loader={
                        <>
                          {cardLoading ?
                            <div className="w-full flex justify-center">
                              <CircularProgress style={{ color: "#37085B" }} thickness={7} />
                            </div>
                            : null
                          }
                        </>
                      }
                    >
                      {chatThreads.length !== 0 ? (
                        chatThreads.map((data: any, index: any) => (
                          <div
                            className={`hover:bg-primary hover:bg-opacity-[21%] w-full flex h-[60px] justify-between p-2 mb-3 items-center ${data?.participantUserName ===
                              chatUser?.participantUserName && showChat
                              ? "bg-primary bg-opacity-[21%]"
                              : ""
                              } rounded `}
                            key={index}
                          >
                            <div
                              className="lg:max-w-[320px] w-full flex items-center cursor-pointer"
                              onClick={() => changeChatListData(data)}
                            >
                              <div className="w-[40px] h-[40px] min-w-[40px] relative min-h-[40px]">
                                <img
                                  src={data?.participantImageUrl}
                                  className="w-full h-full rounded-full"
                                  alt=""
                                />

                                <p
                                  className={`absolute ${data?.participantStatus === "Available"
                                    ? "bg-[#20B514]"
                                    : data?.participantStatus === "Busy" ||
                                      data?.participantStatus === "DoNotDisturb"
                                      ? "bg-[#E99312]"
                                      : "bg-[#EBEBEB]"
                                    } bottom-[0] h-[10px] right-1 rounded-full w-[10px]`}
                                />
                              </div>
                              <div className="ml-2 text-[#041058] w-full">
                                <div className="flex justify-between mb-1">
                                  <p className="font-medium text-[18px] text-black">
                                    {data?.participantUserName}
                                  </p>

                                  {data?.lastMessage?.created ?
                                    <p className="text-[18px] text-[#9F9F9F] font-semibold text-end">
                                      {moment(data?.lastMessage?.created).calendar(null, {
                                        sameDay: 'h:mm A',
                                        lastDay: '[Yesterday]',
                                        lastWeek(m: any, now: any) {
                                          if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                            return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                          } else {
                                            return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                          }
                                        },
                                        sameElse(m: any) {
                                          if (moment(data?.lastMessage?.created).year() < m?.year()) {
                                            return moment(data?.lastMessage?.created).format('DD/MM/yyyy HH:mm');
                                          } else {
                                            return moment(data?.lastMessage?.created).format('DD/MM HH:mm');
                                          }
                                        }
                                      })}
                                    </p>
                                    : null
                                  }
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
                                    {data?.lastMessage?.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>

                              {data?.unread !== 0 ? (
                                <div className="w-[6px] h-[6px] rounded-full bg-[#E85626]"></div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="pl-2">No User found. </div>
                      )}
                    </InfiniteScroll>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ChatScreen
            chatUser={chatUser}
            chatThreads={chatThreads}
            showChat={showChat}
            chatType={chatType}
            getAllChat={getAllChat}
          />
          {newChatShow && (
            <>
              <NewChat close={newChatClose} getChatListData={getChatListData} />
              <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default connect()(ChatList);

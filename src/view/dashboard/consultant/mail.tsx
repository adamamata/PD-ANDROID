import React, { useState, useEffect } from "react";
import Header from "../../../component/header";
import {
  getAllinbox,
  attachedFile,
  searchInbox,
  messageSend,
  getOneUnreadIndex,
  getUnreadIndex,
  openInboxMessage,
} from "../../../services/homeService";
import { connect } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth_details, set_Inbox_Count } from "../../../reducer/auth";
import moment from "moment";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";

const tempFile: any = [];
const uploadFileData: any = [];

const SPMail: React.FC<any> = (props: any) => {
  const navigate = useNavigate();
  const params = useParams();
  const data = useSelector(auth_details);
  const [mail, setMail] = useState(false);
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<any>([]);
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const [uploadFileRes, setUploadFileRes] = useState<any>([]);
  const [options, setOption] = useState<any>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<any>([]);
  const [senderError, setSenderError] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);
  const [replyData, setReplyData] = useState<any>();
  const [id, setId] = useState<any>("");
  const [sendDisable, setSendDisable] = useState<any>(false);
  const [navbar, setNavbar] = useState<boolean>(false);
  const [searchText, setSearchText] = useState(null)

  useEffect(() => {
    getwholeListdata();
    if (params.id) {
      inboxData("");
      setId(params.id);
    }
    if (data.inboxData) {
      setSelectedOption([data.inboxData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const inboxData = (id: any) => {
    setLoading(true);
    const { dispatch } = props;
    let inboxId: any;
    if (id === "") {
      inboxId = params.id;
    } else {
      inboxId = id;
    }
    dispatch(openInboxMessage(inboxId))
      .then((res: any) => {
        setReplyData(res?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const getwholeListdata = () => {
    const { dispatch } = props;
    setLoading(true);
    dispatch(getAllinbox('', searchText))
      .then((res: any) => {
        setLoading(false);
        setList(res.data.data);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("err");
      });
  };

  const onChange = (e: any) => {
    setLoading(true);
    let formData = new FormData();
    const { dispatch } = props;
    formData.append("thumbnailEn", e.target.files[0]);
    dispatch(attachedFile(formData))
      .then((res: any) => {
        if (res.data.isSuccess) {
          uploadFileData.push(res.data.data);
          tempFile.push(e.target.files[0]);
          setUploadFile(tempFile);
          setUploadFileRes(uploadFileData);
          setLoading(false);
          toast.success("Image upload Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        }
      })
      .catch((err: any) => {
        setLoading(false);
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
      });
  };

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleRemoveFile = (postImage: string) => {
    const removePostImage = uploadFile.filter(
      (image: any) => image !== postImage
    );
    setUploadFile(removePostImage);
  };

  const onChangesOption = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    if (selectedOption.length !== 0) {
      setSenderError(false);
    } else {
      setSenderError(true);
    }
  };

  const onInputChange = (e: any) => {
    if (e) {
      const { dispatch } = props;
      dispatch(searchInbox(e))
        .then((res: any) => {
          if (res.data) {
            const temp: any = [];
            const obj = {
              value: res.data.username,
              label: res.data.username,
              id: res.data.id,
            };
            temp.push(obj);
            setOption(temp);
          }
        })
        .catch((err: any) => {
          console.log("err");
        });
    }
  };

  const onSumitData = () => {
    if (params.id) {
      setSendDisable(true);
      setLoading(true);
      const { dispatch } = props;
      const body = {
        receiverIds: [replyData?.senderId],
        receiverNames: [replyData?.senderName],
        subject: replyData?.subject,
        content: message,
        attached: uploadFileRes,
        replyTo: replyData?.id,
      };
      dispatch(messageSend(body))
        .then((res: any) => {
          inboxData("");
          setReply(false);
          setLoading(false);
          setSendDisable(false);
          toast.success("Message Reply Send Successfull!", {
            theme: "colored",
            autoClose: 5000,
          });
        })
        .catch((err: any) => {
          setLoading(false);
          const massage = err.response.data.message;
          setSendDisable(false);
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
        });
    } else {
      if (selectedOption.length !== 0) {
        const { dispatch } = props;
        const resId: any = [];
        setSendDisable(true);
        const resName: any = [];
        selectedOption.map((item: any) => resId.push(item.id));
        selectedOption.map((item: any) => resName.push(item.value));
        const body = {
          receiverIds: resId,
          receiverNames: resName,
          subject: subject,
          content: message,
          attached: uploadFileRes,
          replyTo: null,
        };
        dispatch(messageSend(body))
          .then((res: any) => {
            setSenderError(false);
            if (res.status === 201) {
              navigate("/consultant/inbox");
              setSendDisable(false);
              toast.success("Message Send Successfull!", {
                theme: "colored",
                autoClose: 5000,
              });
            }
          })
          .catch((err: any) => {
            const massage = err.response.data.message;
            setSendDisable(false);
            toast.error(massage, {
              theme: "colored",
              autoClose: 5000,
            });
          });
      } else {
        setSenderError(true);
      }
    }
  };

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "1px",
      background: "transparent",
      minHeight: "auto",

      // Overwrittes the different states of border
      borderColor: state.isFocused ? null : null,
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? null : null,
      },
    }),

    indicators: (base: any, state: any) => ({
      ...base,
      background: "white !important",
    }),
  };

  const onClickunRead = (res: any) => {
    setId(res?.id);
    if (res?.readOn === null) {
      const { dispatch } = props;
      dispatch(getOneUnreadIndex(res?.id))
        .then((res: any) => {
          getwholeListdata();
          getunreadInbox();
          inboxData(res?.id);
        })
        .catch((err: any) => {
          console.log("err", err);
        });
    } else {
      inboxData(res?.id);
    }
  };

  const getunreadInbox = () => {
    const { dispatch } = props;
    dispatch(getUnreadIndex())
      .then((res: any) => {
        dispatch(set_Inbox_Count(res?.data?.data));
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const gotoIndex = () => {
    navigate("/consultant/inbox");
  };

  const navbarClick = () => {
    setNavbar(!navbar);
  };

  const download = (data: any) => {
    var element = document.createElement("a");
    var file = new Blob([data], { type: "image" });
    element.href = URL.createObjectURL(file);
    element.download = "image.jpg";
    element.click();
  };

  const onHandleSearch = (e: any) => {
    setSearchText(e.target.value)
  }

  const debouncedOnChange = debounce(onHandleSearch, 1000);

  return (
    <>
      <div className="bg-[#E5E5E5] min-h-screen	">
        {loading && <RctPageLoader />}
        <Header
          navbar={navbar}
          onClick={navbarClick}
          bgClass={`${navbar
            ? "bg-[#F8F3FD]-to-r from-[#f4b98f57] to-[#5a6ee257] md:bg-[image:url('./assets/images/headerBg.svg')]"
            : 'bg-[image:url("./assets/images/headerBg.svg")]'
            }`}
        />

        <div className="flex px-4 xl:px-10 w-11/12 mx-auto sm:mx-0 sm:w-full py-4 justify-between">
          <div
            className={`w-full md:w-[37%] xl:w-[30%] ${mail || id ? "hidden" : "block"
              } md:block`}
          >
            <div className="relative w-full flex items-center">
              <input
                placeholder="Search username"
                type="text"
                onChange={debouncedOnChange}
                className="w-full placeholder-current rounded-3xl bg-[#FFFFFF] text-sm xl:text-lg text-primary leading-none px-3 py-1 border border-solid border-primary focus:outline-none focus:bg-white"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3" />
            </div>
            <div className="mt-2 bg-[#ffffffb5]  bg-white rounded-2xl h-[calc(100vh_-_170px)]">
              <div className="flex px-4 pt-4 justify-between items-center pb-1 border-b border-[#EBEBEB]">
                <p className="text-xl ml-2 text-black font-[Montserrat]">
                  Inbox {data?.inboxCount === 0 ? "" : `(${data?.inboxCount})`}
                </p>
              </div>

              <div className="h-[calc(100vh_-_245px)] overflow-y-auto no-scrollbar">
                {list.length === 0 ? (
                  <div className="text-xl ml-4 text-black font-[Montserrat] mt-5">
                    No Inbox Found
                  </div>
                ) : (
                  list.map((res: any) => (
                    <div
                      className={`w-full border-b border-[#EBEBEB] flex py-4 justify-between px-4 items-center cursor-pointer ${res?.readOn === null ? "bg-[#036ef540]" : "bg-[#FFFFFF]"
                        }`}
                      onClick={() => onClickunRead(res)}
                    >
                      <div className="ml-2 text-[#041058] w-[73%]">
                        <div className="flex items-center">
                          <p className="text-xl ">{res?.senderName}</p>
                          {res?.readOn === null ? (
                            <div className="w-[8px] h-[8px] ml-4 rounded-full bg-[#E85626]"></div>
                          ) : (
                            ""
                          )}
                          <div className="w-[8px] h-[8px] ml-4"></div>
                        </div>
                        <p
                          className="overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {res?.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* testing design subject */}
          {id ? (
            <div className="w-full md:block h-[calc(100vh_-_128px)] overflow-y-auto no-scrollbar font-[Montserrat] px-2 md:px-6 py-4 md:w-[61.7%] xl:w-[68.7%] h-fit rounded-2xl">
              <div className="bg-[#ffffffb5] mb-4 font-[Montserrat] px-2 md:px-6 py-4 h-fit rounded-2xl">
                <div
                  className="flex justify-end text-xl font-bold text-black cursor-pointer"
                  onClick={gotoIndex}
                >
                  <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                </div>

                <div className="flex justify-between mt-2">
                  <div className="text-xl">{replyData?.subject}</div>
                  <button
                    className="text-primary text-sm font-[500]"
                    onClick={() => {
                      setReply(true);
                    }}
                  >
                    Reply
                  </button>
                </div>

                <div className="flex justify-between text-sm">
                  <div>{replyData?.senderName}</div>
                  <div>
                    {moment(replyData?.readOn).calendar(null, {
                      sameDay: 'h:mm A',
                      lastDay: '[Yesterday]',
                      lastWeek(m: any, now: any) {
                        if (moment(replyData?.readOn).year() < m?.year()) {
                          return moment(replyData?.readOn).format('DD/MM/yyyy HH:mm');
                        } else {
                          return moment(replyData?.readOn).format('DD/MM HH:mm');
                        }
                      },
                      sameElse(m: any) {
                        if (moment(replyData?.readOn).year() < m?.year()) {
                          return moment(replyData?.readOn).format('DD/MM/yyyy HH:mm');
                        } else {
                          return moment(replyData?.readOn).format('DD/MM HH:mm');
                        }
                      }
                    })}
                  </div>
                </div>

                <div className="text-xs mt-2">
                  To: {replyData?.receiverName}
                </div>

                <div className="text-sm mt-4">
                  <p className="leading-8 break-all">{replyData?.content}</p>
                </div>

                <div>
                  {replyData?.attached.map((res: any) => (
                    <p
                      className="text-sm mt-2 break-all cursor-pointer underline"
                      onClick={() => download(res)}
                    >
                      {res}
                    </p>
                  ))}
                </div>
              </div>
              {reply && (
                <div className="bg-[#ffffffb5] font-[Montserrat] mb-4 px-2 md:px-6 py-4 h-fit rounded-2xl">
                  <div className="flex flex-row-reverse md:flex-row justify-between pb-2">
                    {/* <img
                 src={close}
                 alt=""
                 className={`${mail ? "block" : "hidden"} md:hidden`}
                 onClick={() => setMail(false)}
               /> */}
                    <div className="text-black">
                      <p className="md:text-xl leading-none">
                        Reply: {replyData?.subject}
                      </p>
                    </div>
                    <div
                      className="flex justify-end text-xl font-bold text-black cursor-pointer"
                      onClick={() => {
                        setReply(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs mt-2">
                      To: {replyData?.senderName}
                    </div>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        className="hidden"
                        ref={hiddenFileInput}
                        multiple
                        onChange={(e) => {
                          onChange(e);
                        }}
                      />
                      <button
                        className="bg-primary px-4 py-2 mt-4 text-white text-sm rounded"
                        onClick={handleClick}
                      >
                        Include Attachments
                      </button>
                    </label>

                    <div className="mt-2 flex-wrap gap-4">
                      {uploadFile.map((file: any) => (
                        <div className="flex items-center mt-2">
                          <div>{file?.name}</div>
                          <FontAwesomeIcon onClick={() => handleRemoveFile(file)} icon={faXmark} className={`ml-2 text-primary text-xl cursor-pointer`} />
                        </div>
                      ))}
                    </div>

                    <textarea
                      placeholder="Enter your message here"
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent text-sm mt-4 resize-none rounded-md min-h-[calc(100vh_-_341px)] p-2 md:min-h-[calc(100vh_-_400px)] xl:min-h-[calc(100vh_-_395px)] border border-gray-300 focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      className="bg-primary mx-auto text-xl text-white font-semibold py-2 px-8 rounded"
                      onClick={onSumitData}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
              {replyData?.related.map((item: any) => (
                <div className="bg-[#ffffffb5] mb-4 font-[Montserrat] px-2 md:px-6 py-4 h-fit rounded-2xl">
                  {/* <div className="flex justify-end text-xl font-bold text-black cursor-pointer">
                    <img src={close} alt="" />
                  </div> */}

                  <div className="flex justify-between mt-2">
                    <div className="text-xl">{item?.subject}</div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>{item?.senderName}</div>
                    {/* <div>
                      {moment(item?.readOn).calendar(null, {
                        sameDay: 'h:mm A',
                        lastDay: '[Yesterday]',
                        lastWeek(m: any, now: any) {
                        if (moment(item?.readOn).year() < m?.year()) {
                          return moment(item?.readOn).format('DD/MM/yyyy HH:mm');
                        } else {
                          return moment(item?.readOn).format('DD/MM HH:mm');
                        }
                      },
                      sameElse(m: any) {
                        if (moment(item?.readOn).year() < m?.year()) {
                          return moment(item?.readOn).format('DD/MM/yyyy HH:mm');
                        } else {
                          return moment(item?.readOn).format('DD/MM HH:mm');
                        }
                      }'
                      })}
                    </div> */}

                  </div>

                  <div className="text-xs mt-2">To: {item?.receiverName}</div>

                  <div className="text-sm mt-4">
                    <p className="leading-8 break-all">{item?.content}</p>
                  </div>
                  <div>
                    {item?.attached.map((res: any) => (
                      <p
                        className="text-sm mt-2 break-all cursor-pointer underline"
                        onClick={() => download(res)}
                      >
                        {res}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`bg-white ${mail ? "block" : "hidden"
                }  bg-[#ffffffb5] w-full md:block font-[Montserrat] px-2 md:px-6 py-4 md:w-[61.7%] xl:w-[68.7%]  rounded-2xl `}
            >
              <div className="flex flex-row-reverse md:flex-row justify-between pb-2">
                <FontAwesomeIcon onClick={() => setMail(false)} icon={faXmark} className={`${mail ? "block" : "hidden"
                  } lg:hidden text-primary text-3xl`} />
                <div className="text-black">
                  <p className="md:text-xl leading-none">New Message</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end">
                  <span className="pr-10 text-xs leading-none">To:</span>
                  <Select
                    onChange={onChangesOption}
                    options={options}
                    value={selectedOption}
                    styles={customStyles}
                    className="w-11/12 bg-transparent text-xs rounded-[1px]"
                    classNamePrefix="react-select"
                    onInputChange={onInputChange}
                    isMulti
                  />
                </div>
                {senderError && (
                  <div className="pl-16 text-xs font-medium leading-none text-[red]">
                    Enter Name
                  </div>
                )}
                <div className="flex justify-between mt-2 items-end">
                  <span className="pr-2 text-xs leading-none">Subject:</span>
                  <input
                    type="text"
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subjects"
                    className="w-11/12 bg-transparent border border-[#D9D9D9] text-xs py-2 px-3 rounded-[1px] focus:outline-none"
                  />
                </div>

                <label className="custom-file-upload">
                  <input
                    type="file"
                    className="hidden"
                    ref={hiddenFileInput}
                    multiple
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                  <button
                    className="bg-primary px-4 py-2 mt-4 text-white text-sm rounded"
                    onClick={handleClick}
                  >
                    Include Attachments
                  </button>
                </label>

                <div className="mt-2 flex-wrap gap-4">
                  {uploadFile.map((file: any) => (
                    <div className="flex mt-2">
                      <div>{file?.name}</div>
                      <FontAwesomeIcon onClick={() => handleRemoveFile(file)} icon={faXmark} className={`ml-2 text-primary text-xl cursor-pointer`} />
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Enter your message here"
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent text-sm mt-4 resize-none rounded-md min-h-[calc(100vh_-_341px)] p-2 md:min-h-[calc(100vh_-_400px)] xl:min-h-[calc(100vh_-_395px)] border border-gray-300 focus:border-primary focus:outline-none"
                ></textarea>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  className={`bg-primary mx-auto text-xl text-white font-semibold py-2 px-8 rounded ${sendDisable && "opacity-25"
                    }`}
                  disabled={sendDisable}
                  onClick={onSumitData}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default connect()(SPMail);

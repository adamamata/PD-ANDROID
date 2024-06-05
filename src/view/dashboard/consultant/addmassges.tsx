import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { searchInbox, attachedFile, messageSend } from "../../../services/homeService";
import RctPageLoader from "../../../component/RctPageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { debounce } from 'lodash'

interface Cprops {
  getwholeListdata: any
  selectedProfile?: any;
}

const uploadFileData: any = [];
const tempFile: any = [];

const AddMassges: React.FC<any> = (props: Cprops | any) => {
  const { getwholeListdata, setSendmassgess, selectedProfile } = props
  const [selectedOption, setSelectedOption] = useState<any>([]);
  const [senderError, setSenderError] = useState<boolean>(false);
  const [options, setOption] = useState<any>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<any>([]);
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const [uploadFileRes, setUploadFileRes] = useState<any>([]);


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

  const onSumitData = () => {
    setLoading(true);
    if (selectedOption.length !== 0) {
      const { dispatch } = props;
      const resId: any = [];
      // setSendDisable(true);
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
      dispatch(messageSend(body, selectedProfile?.value ?? selectedProfile?.id))
        .then((res: any) => {
          setSenderError(false);
          setLoading(false);
          getwholeListdata()
          if (res.status === 201) {
            toast.success("Message Send Successfull!", {
              theme: "colored",
              autoClose: 5000,
            });
          }
        })
        .catch((err: any) => {
          const massage = err.response.data.message;
          setLoading(false);
          toast.error(massage, {
            theme: "colored",
            autoClose: 5000,
          });
        });
    } else {
      setSenderError(true);
    }
  };

  const onChangesOption = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    if (selectedOption.length !== 0) {
      setSenderError(false);
    } else {
      setSenderError(true);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const onInputChange = (e: any) => {
    if (e) {
      const { dispatch } = props;
      dispatch(searchInbox(e))
        .then((res: any) => {
          const temp: any = [];
          if (res.data.data.length) {
            res.data.data.map((user: any) => {
              const obj = {
                value: user.username,
                label: user.username,
                id: user.id,
              };
              temp.push(obj);
            })

            setOption(temp);
          }
        })
        .catch((err: any) => {
          console.log("err");
        });
    }
  };

  const handleRemoveFile = (postImage: string) => {
    const removePostImage = uploadFile.filter(
      (image: any) => image !== postImage
    );
    setUploadFile(removePostImage);
  };

  const debouncedOnChange = debounce(onInputChange, 1000);

  return (
    <>
      {loading && <RctPageLoader />}

      <div className="flex px-2 md:px-6 justify-end pt-2 lg:hidden">
        <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} onClick={() => setSendmassgess(false)} />
      </div>

      <div
        className={`mx-auto
           "bg-white
         w-full 
        lg:block px-2 md:px-6 py-4 xxl:w-[68.7%] rounded-2xl lg:h-[calc(100vh_-_140px)]`}
      >
        {" "}
        <div className="flex justify-between items-end">
          <span className="pr-10 text-xs leading-none">To:</span>
          <Select
            onChange={onChangesOption}
            options={options}
            value={selectedOption}
            styles={customStyles}
            className="w-11/12 bg-transparent text-xs rounded-[1px]"
            classNamePrefix="react-select"
            onInputChange={debouncedOnChange}
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
        <textarea
          placeholder="Enter your message here"
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent text-sm mt-4 resize-none rounded-md min-h-[calc(100vh_-_341px)] p-2 md:min-h-[calc(100vh_-_400px)] xl:min-h-[calc(80vh_-_395px)] border border-gray-300 focus:border-primary focus:outline-none"
        ></textarea>
        <div className="flex">
          <label className="custom-file-upload cursor-pointer  flex">
            <input
              type="file"
              className="hidden"
              ref={hiddenFileInput}
              multiple
              onChange={(e) => {
                onChange(e);
              }}
            />
            {/* <img src={pin} /> */}

            <div className="text-[#474747] ml-2">Include Attachments</div>
          </label>
        </div>{" "}
        <div className="mt-2 flex-wrap gap-4">
          {uploadFile.map((file: any) => (
            <div className="flex mt-2">
              <div>{file?.name}</div>
              <FontAwesomeIcon onClick={() => handleRemoveFile(file)} icon={faXmark} className={`bg-white rounded-full w-[20px] p-1 cursor-pointer text-primary text-3xl`} />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className={`bg-primary text-xl text-white font-semibold py-2 px-8 rounded`}
            onClick={onSumitData}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default connect()(AddMassges);

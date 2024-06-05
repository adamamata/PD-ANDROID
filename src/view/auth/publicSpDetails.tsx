import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import twoWayVideo from "../../assets/images/twoWayVideo.svg";
import "react-toastify/dist/ReactToastify.css";
import HeaderHome from "../dashboard/commons/headerHome";
import Footer from "../../component/footer";
import { getUserByUserName } from "../../services/homeService";
import { toast } from "react-toastify";
import RctPageLoader from "../../component/RctPageLoader";
import Over18Modal from "../dashboard/user/over18Modal";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from '@fortawesome/fontawesome-free-regular';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faMessage, faPhone, faTty, faVideo } from "@fortawesome/free-solid-svg-icons";

const PublicViewProfile: React.FC<any> = (props: any) => {
  const navigate = useNavigate()
  const [spDetails, setSpDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [over18Modal, setOver18Modal] = useState<boolean>(false);
  const [htmlContentVisible, setHtmlContentVisible] = useState<boolean>(false);
  const params = useParams();
  const isOver18 = sessionStorage.getItem("isOver18")

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserData(isOver18 && JSON.parse(isOver18) ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = (isOver18: boolean) => {
    setIsLoading(true);
    const { dispatch } = props;
    dispatch(getUserByUserName(params?.uniqueUsername, isOver18))
      .then((res: any) => {
        setIsLoading(false);
        setSpDetails(res?.data);
      })
      .catch((err: any) => {
        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setIsLoading(false);
      });
  };

  const submitUserDOB = (date: any) => {
    const formattedDate = moment(date).format("yyyy-MM-DD")

    const diff = moment().diff(formattedDate, 'years');

    console.log("diff", diff)

    if (diff < 18) {
      toast.info("You must be over 18")
    } else {
      sessionStorage.setItem("isOver18", JSON.stringify(true));
      getUserData(true)
    }
  }

  const onClickSeeMore = () => {
    if (isOver18 && JSON.parse(isOver18)) {
      setHtmlContentVisible(true)
    } else {
      setHtmlContentVisible(true)
      setOver18Modal(true)
    }
  }

  return (
    <>
      {isLoading && <RctPageLoader />}

      <div className="bg-[#F8F3FD] min-h-screen pb-6">
        <HeaderHome />

        {spDetails ?
          <div
            className={`md:block mx-auto w-11/12 2xl:w-[1284px] 2xl:mt-12 bg-[#ffffffb5] rounded-lg py-6 px-4 md:px-10`}
          >
            <div className="w-full md:grid md:grid-cols-2">
              <div className="text-4xl text-primary text-center md:text-start">
                {spDetails?.username}
              </div>
              <div className="hidden md:block ml-auto">
                <div className="flex items-center flex-wrap md:justify-between w-min md:w-auto mx-auto md:mx-0">
                  <button
                    className={`bg-white mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-primary text-2xl hover:bg-primary hover:text-white w-[150px] h-[50px] rounded-full border-2 border-solid border-primary "
                          }`}
                    onClick={() => navigate("/user/learn-more")}
                  >
                    Send Gift
                  </button>

                  <span className="ml-2.5">
                    <button
                      className="bg-primary mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-white hover:text-primary text-white text-2xl  w-[150px] h-[50px] rounded-full border-2 border-solid border-primary px-8"
                      onClick={() => navigate("/user/learn-more")}
                    >
                      Chat
                    </button>
                  </span>

                  <span className="hidden md:block">
                    <FontAwesomeIcon icon={regularHeart as IconProp} className="ml-2 text-3xl text-primary" onClick={(e) =>
                      navigate("/user/learn-more")
                    } />
                  </span>
                </div>
              </div>
            </div>

            <div className="md:flex justify-between gap-4 mt-2 md:mt-0">
              <div className="relative w-fit md:h-[388px] overflow-hidden rounded-2xl">
                <img
                  className="rounded-2xl w-[388px] md:min-h-[388px] md:shrink-0 relative"
                  src={spDetails?.profileImageUrl}
                  alt="product"
                />

                <div className="absolute cursor-pointer right-3 top-3 md:hidden">
                  <FontAwesomeIcon icon={regularHeart as IconProp} className="text-3xl text-white" onClick={(e) =>
                    navigate("/user/learn-more")
                  } />
                </div>
              </div>
              <div className="block md:hidden ml-auto">
                <div className="flex mt-4 flex-wrap md:justify-between w-full">
                  <button
                    className="bg-primary  mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-white text-2xl hover:text-white w-full h-[50px] border-2 border-solid border-primary px-8 rounded-full"
                    onClick={() => navigate("/user/learn-more")}
                  >
                    Chats
                  </button>
                </div>

                <div className="flex mt-4 flex-wrap md:justify-between w-full">
                  <button
                    className="bg-white mx-auto mt-4 sm:mt-0 sm:mx-0 hover:bg-primary text-primary text-2xl hover:text-white w-full h-[50px] border-2 border-solid border-primary px-8 hover:border-transparent rounded-full"
                    onClick={() => navigate("/user/learn-more")}
                  >
                    Send Gift
                  </button>
                </div>
              </div>
              <div className="w-full md:w-7/12 2xl:w-[769px] grid content-between">
                <div className="">
                  <div className="text-[#6E6E6E]">About</div>
                  <div className="font-['Montserrat'] text-[#444444]">
                    {spDetails?.description}
                  </div>
                </div>
                <div className="text-[#6E6E6E] text-base">Menu</div>
                <div className="grid grid-cols-2 gap-6 xl:grid-cols-4 w-fit mx-auto">
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faMessage} className="text-primary text-4xl text-center w-full" />

                    <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                      Chat
                    </div>

                    <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                      ${spDetails?.communication?.shortMessageUnitPrice}
                    </div>
                  </div>
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                  <FontAwesomeIcon icon={faTty} className="text-primary text-4xl text-center w-full" />
                  <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                    Phone
                  </div>

                  <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                    ${spDetails?.communication?.phoneCallUnitPrice}
                  </div>
                </div>
                  {spDetails?.enableAudioCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                      <FontAwesomeIcon icon={faPhone} className="text-primary text-4xl text-center w-full" />
                      <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                        Audio
                      </div>

                      <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                        ${spDetails?.communication?.audioCallUnitPrice}
                      </div>
                    </div>
                  }

                  {spDetails?.enableOneWayVideoCall &&
                   <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faVideo} className="text-primary text-4xl text-center w-full" />
                      <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                        1 Way
                      </div>

                      <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                        ${spDetails?.communication?.videoCallOneWayUnitPrice}
                      </div>
                    </div>
                  }

                  {spDetails?.enableTwoWayVideoCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                      <img
                        src={twoWayVideo}
                        className="mx-auto w-[40px] h-[40px]"
                        alt="image1"
                      />
                      <div className="text-center w-full font-['Montserrat'] pt-3 font-bold text-[16px] text-[#3E3E3E]">
                        2 Way
                      </div>

                      <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                        ${spDetails?.communication?.videoCallTwoWayUnitPrice}
                      </div>
                    </div>
                  }

                </div>
              </div>
            </div>

            {!htmlContentVisible ?
              <div className="flex mt-8 w-full justify-center">
                <button
                  className={`bg-white mx-auto xl:mx-[0px] xl:ml-2 mt-4 sm:mt-0 sm:mx-0 text-primary text-2xl hover:bg-primary hover:text-white w-[150px] h-[50px] rounded-full border-2 border-solid border-primary`}
                  onClick={() => onClickSeeMore()}
                >
                  See More
                </button>
              </div> : null
            }

            {spDetails?.profileInfo && htmlContentVisible &&
              <div dangerouslySetInnerHTML={{ __html: spDetails?.profileInfo }} className="mt-4 ck ck-content break-words ck-editor__editable ck-rounded-corners ck-blurred overflow-auto px-[0.6em] border border-[#37085B] ckPreview" />
            }

          </div>
          :
          null
        }

      </div>
      <Footer />

      {over18Modal && (
        <Over18Modal onClose={() => setOver18Modal(false)} submitUserDOB={submitUserDOB} />
      )}
    </>
  );
};

export default connect()(PublicViewProfile);

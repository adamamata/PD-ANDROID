import React from 'react'
import twoWayVideo from "../../../assets/images/twoWayVideo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPhone, faTty, faVideo, faXmark } from '@fortawesome/free-solid-svg-icons';


const ProfilePreviewModal = ({ updatedProfileDetails, setPreviewModal, onSubmit, uploadedImage, hideSaveButton }: any) => {
  const onSaveProfileClick = () => {
    onSubmit(updatedProfileDetails)
    setPreviewModal(false)
  }

  console.log("updatedProfileDetails", updatedProfileDetails)
  return (
    <>
      <div
        style={{ backdropFilter: 'blur(6.5px)' }}
        className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="bg-white rounded-[25px] overflow-x-hidden overflow-y-auto h-[calc(100vh_-_60px)] no-scrollbar w-[90%] py-4">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer px-6 pt-4"
            onClick={() => setPreviewModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className='px-6 mt-4'>

            <div className="w-full md:grid md:grid-cols-2">
              <div className="text-4xl text-primary text-center md:text-start">
                {updatedProfileDetails?.username}
              </div>
           </div>

            <div className="md:flex justify-between gap-4 mt-2 md:mt-0">
              <div className="relative min-w-fit max-h-[232px] max-w-[232px]" style={{ aspectRatio: "1" }}>
                <img
                  className="rounded-2xl w-full h-full   md:shrink-0 relative"
                  src={uploadedImage}
                  alt="user"
                />
              </div>
              <div className="w-full grid content-between mt-4 md:mt-0 md:ml-4">
                <div className="">
                  <div className="text-[#6E6E6E] font-bold text-lg">About</div>
                  <div className="font-['Montserrat'] text-[#444444]">
                    { updatedProfileDetails?.profileDescription || updatedProfileDetails?.description }
                  </div>
                </div>

                <div className="text-[#6E6E6E] font-bold text-lg mt-4">Menu</div>

                 <div className="grid grid-cols-2 mx-auto md:mx-0 md:grid-cols-5 gap-6 xl:grid-cols-5 w-fit">
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faMessage} className="text-primary text-4xl text-center w-full" />

                    <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                      Chat
                    </div>

                    <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                      ${updatedProfileDetails?.communication?.shortMessageUnitPrice}
                    </div>
                  </div>
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                  <FontAwesomeIcon icon={faTty} className="text-primary text-4xl text-center w-full" />
                  <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                    Phone
                  </div>

                  <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                    ${updatedProfileDetails?.communication?.phoneCallUnitPrice}
                  </div>
                </div>
                  {updatedProfileDetails?.enableAudioCall &&
                  <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                      <FontAwesomeIcon icon={faPhone} className="text-primary text-4xl text-center w-full" />
                      <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                        Audio
                      </div>

                      <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                        ${updatedProfileDetails?.communication?.audioCallUnitPrice}
                      </div>
                    </div>
                  }

                  {updatedProfileDetails?.enableOneWayVideoCall &&
                   <div className="w-[120px] h-[160px] p-5 bg-white mt-0 ">
                    <FontAwesomeIcon icon={faVideo} className="text-primary text-4xl text-center w-full" />
                      <div className="text-center w-full font-['Montserrat'] pt-4 font-bold text-[16px] text-[#3E3E3E]">
                        1 Way
                      </div>

                      <div className="text-center w-full mt-2 text-[#37085B] font-bold text-[16px] ">
                        ${updatedProfileDetails?.communication?.videoCallOneWayUnitPrice}
                      </div>
                    </div>
                  }

                  {updatedProfileDetails?.enableTwoWayVideoCall &&
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
                        ${updatedProfileDetails?.communication?.videoCallTwoWayUnitPrice}
                      </div>
                    </div>
                  }

                </div>
              </div>
            </div>

            {updatedProfileDetails?.profileInfo &&
              <div dangerouslySetInnerHTML={{ __html: updatedProfileDetails?.profileInfo }} className="mt-4 ck ck-content break-words ck-editor__editable ck-rounded-corners ck-blurred overflow-auto px-[0.6em] border border-[#37085B] ckPreview" />
            }

            {!hideSaveButton ?
              <div className="text-center my-6">
                <button className={`border border-[#37085B] text-[#37085B] px-14 py-2 rounded-lg font-medium`} onClick={() => onSaveProfileClick()}>
                  Save Profile
                </button>
              </div>
              : null}
          </div>

        </div>

      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>

  )
}

export default ProfilePreviewModal

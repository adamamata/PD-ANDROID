import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


const UrlShareModal = ({ onClose, profileUrl }: any) => {
  
  const urlCopyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl)
    onClose()
  }

  return (
    <div>
      <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl py-8">
        <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6 ">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={() => onClose()}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className='mt-6'>
            <div className="text-primary text-center text-2xl font-bold 2xl:mt-1">
              Your Sharable URL
            </div>

            <p className='mx-auto  text-primary text-center mt-6 font-medium text-lg'>
              {profileUrl}
            </p>

            <div className="md:flex flex-wrap justify-center mt-6">

              <div className='flex justify-center'>
                <button
                  className="bg-primary mt-4  hover:bg-[white] text-[white] text-base hover:text-primary py-2 border-2 border-solid border-primary px-4 rounded-full font-['Montserrat']"
                onClick={() => urlCopyToClipBoard()}
                >
                  Copy To Clipboard
                </button>
              </div>

            </div>

          </div>


        </div>
      </div>

      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </div>
  )
}

export default UrlShareModal

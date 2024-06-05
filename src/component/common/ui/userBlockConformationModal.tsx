import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const UserBlockConformationModal = ({ setBlockConformationModal, onSubmitBlockUser }: any) => {
  return (
    <>
      <div className=" fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-2xl bg-white rounded px-10 py-6">
          <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            onClick={() => setBlockConformationModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
          </div>

          <div className='mt-4 md:max-w-[90%] mx-auto'>
            <p className='text-center text-3xl font-bold text-primary'>You are about to block this user. </p>

            <p className='md:max-w-[80%] mx-auto mt-4 text-primary text-xl text-center'>You will both no longer be able to see each other on your Home, Chat, or Inbox pages. You will no longer be able to communicate with each other on this platform.</p>
          </div>

          <div className="max-w-lg mx-auto mt-6">
            <button
              className="w-full mt-4 mr-6 bg-primary hover:bg-white text-white   font-semibold hover:text-primary py-2 border-2 border-solid border-primary px-4 rounded-full font-['Montserrat']"
            onClick={() => onSubmitBlockUser()}
            >
              Yes, I understand and would like to block this user.
            </button>
            <button
              className="w-full bg-tranparent mt-4 hover:bg-primary text-primary font-semibold hover:text-white py-2 border-2 border-solid border-primary px-4 hover:border-transparent rounded-full font-['Montserrat']"
              onClick={() => setBlockConformationModal(false)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default UserBlockConformationModal
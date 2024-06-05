import React from 'react'
import { useNavigate } from 'react-router-dom';

const VerificationMailSentModal = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className=" fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
        <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6">
          {/* <div
            className="flex justify-end text-xl font-bold text-black cursor-pointer"
            // onClick={() => setConformationModal(false)}
          >
            <img src={close} alt="" />
          </div> */}

          <div className="text-primary text-center text-3xl font-bold 2xl:mt-4">
            Verify Your Email
          </div>

          <div className='mt-4 max-w-[90%] flex justify-center font-medium mx-auto'>
            <p className='text-center'>We have sent a verification mail to your registered email address. Please click the link to verify your email. </p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-primary mt-4 text-[white] text-base py-2 border-2 border-solid border-primary px-4 rounded-full font-['Montserrat']"
              onClick={() => navigate("/login")}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default VerificationMailSentModal

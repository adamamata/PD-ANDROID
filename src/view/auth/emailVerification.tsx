import React, { useEffect, useState } from 'react'
import phoneDarlingsLogo from "../../assets/images/phoneDarlingsLogo.svg";
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { verifyEmail } from '../../services/homeService';
import { toast } from 'react-toastify';
import VerifiedEmailSuccessModal from './verifiedEmailSuccessModal';

const EmailVerification = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const { token, email } = useParams()

  useEffect(() => {
    if (token && email) {
      const { dispatch } = props;

      const body = {
        verifyToken: token,
        email: email
      }

      dispatch(verifyEmail(body)).then(() => {
        setIsLoading(false)
        setVerificationSuccess(true)
      }).catch(() => {
        setIsLoading(false)
        toast.error("Something went wrong...!!!")
      })
    }

  }, [token, email])

  return (
    <div className="bg-[#F8F3FD] min-h-screen px-6">
      <div className="w-full mb-6 py-8 h-[80px] rounded-b-full rounded-t-full">
        <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
          <img
            src={phoneDarlingsLogo}
            alt="logo"
            className="mx-auto w-[183px] h-[26px]"
          />
        </div>
      </div>

      <div className='text-center bg-[#FFFFFF] mt-8 h-[calc(100vh_-_140px)] rounded-lg '>
        {isLoading && (
          <>
            <div className="absolute top-2/4 left-2/4 z-10 ">
              <CircularProgress style={{ color: "#37085B" }} thickness={7} />
            </div>
          </>
        )
        }

        <div className='p-6'>
          <p className='font-medium text-xl text-center max-w-auto md:max-w-[50%] lg:max-w-[35%] mx-auto'>Thank you for registering with Phone Darlings, we're verifying your email</p>
        </div>
      </div>

      {verificationSuccess && <VerifiedEmailSuccessModal /> }

    </div>
  )
}

export default connect()(EmailVerification);

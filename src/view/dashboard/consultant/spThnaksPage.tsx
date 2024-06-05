import React, { useEffect, useState } from 'react'
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import RctPageLoader from '../../../component/RctPageLoader';
import { CircularProgress } from '@mui/material';
import { setLanguage } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';


const SpThankYouPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      navigate("/consultant/home")
    }, 3000)
  })

  return (

    <div className="bg-[#36007a] min-h-screen px-6">
      <div className="w-full mb-6 py-8 h-[80px] rounded-b-full rounded-t-full">
        <div className="flex bg-[#FFFFFF] justify-center font-bold text-gray-800 py-5 rounded-full">
          <img
            src={phoneDarlingsLogo}
            alt="logo"
            className="mx-auto w-[183px] h-[26px]"
          />
        </div>
      </div>

      <div className='text-center bg-[#2b0062] mt-8 h-[calc(100vh_-_140px)] rounded-lg '>
        {isLoading && (
          <>
            <div className="absolute top-2/4 left-2/4 z-10 ">
              <CircularProgress style={{ color: "#FFFFFF" }} thickness={7} />
            </div>
          </>
        )
        }
        <div className='p-6'>

          <p className='font-medium text-xl text-center max-w-auto md:max-w-[50%] lg:max-w-[35%] mx-auto text-[#FFFFFF]'>Thank you for registering with Phone Darlings, we're getting everything ready for you.</p>
        </div>
      </div>

    </div>
  )
}

export default SpThankYouPage
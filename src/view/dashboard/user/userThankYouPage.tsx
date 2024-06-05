import React, { useEffect, useState } from 'react'
import phoneDarlingsLogo from "../../../assets/images/phoneDarlingsLogo.svg";
import { CircularProgress } from '@mui/material';
import { setLanguage } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const ThankYouPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      navigate("/user/home")
    }, 3000)
  })

  return (
    <>
      <Helmet>
        <script type="application/javascript" src="https://a.exoclick.com/tag_gen.js" data-goal="4ec357ce221e2474805b179a27e926eb" ></script>
      </Helmet>
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

            <p className='font-medium text-xl text-center max-w-auto md:max-w-[50%] lg:max-w-[35%] mx-auto'>Thank you for registering with Phone Darlings, we're getting everything ready for you.</p>
          </div>
        </div>

      </div>
    </>

  )
}

export default ThankYouPage
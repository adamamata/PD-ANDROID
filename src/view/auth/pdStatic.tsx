import React from 'react'
import HeaderHome from '../dashboard/commons/headerHome'
import landingPage1 from "../../assets/images/landingPage1.svg"
import landingPage2 from "../../assets/images/landingPage2.svg"
import { useNavigate } from 'react-router-dom'

const PdLanding = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#F8F3FD] min-h-screen">
      <HeaderHome />

      <div className='w-full flex flex-wrap gap-4 justify-center basis-1/2 items-center p-4 max-h-[calc(100dvh_-_110px)]' onClick={() => navigate("/login")}>
        <img src={landingPage1} alt="landingPage1" className='md:max-h-[calc(100dvh_-_150px)]' />
        <img src={landingPage2} alt='landingPage2' className='md:max-h-[calc(100dvh_-_150px)]' />
      </div>
      
    </div>
  )
}

export default PdLanding

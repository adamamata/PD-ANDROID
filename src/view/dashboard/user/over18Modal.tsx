import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import calenderIcon from "../../../assets/images/calenderIcon.svg"
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Over18Modal = ({ onClose, submitUserDOB }: any) => {
  const [birthDate, setBirthData] = useState<any>(null);

  const dob = new Date();
  const year = dob.getFullYear();
  const month = dob.getMonth();
  const day = dob.getDate();

  useEffect(() => {
    setBirthData(new Date(year - 18, month, day))
  }, [year])


  const handleSubmit = () => {
    onClose()
    submitUserDOB(moment(birthDate).format("yyyy-MM-DD"))
  }

  return (
    <>
      <div className="fixed flex items-center z-50 w-full top-0 outline-none focus:outline-none rounded-2xl">
        <div className='relative w-full flex flex-wrap md:flex-nowrap items-center bg-[#2F1A52] px-4 lg:px-10 py-4 justify-between'>
          <div className='text-white md:max-w-[50%] lg:max-w-[60%]'>
            This website is designed for ADULTS only and may include photos and materials that some viewers may find offensive. Please enter your birthday to continue.
          </div>

          <div className='mx-auto md:mx-0 md:flex md:ml-6'>
            <DatePicker
              showIcon={true}
              dateFormat="yyyy-MM-dd"
              wrapperClassName='w-full font-medium text-primary rounded-lg md:rounded-none md:rounded-s-lg overflow-hidden md:w-[40%]'
              selected={birthDate}
              onChange={(date) => setBirthData(date)}
              icon={
                <img className="pr-4" src={calenderIcon} />
              }
              minDate={new Date(year - 70, month, day)}
              maxDate={new Date(year - 18, month, day)}
            />

            <div className='mt-3 cursor-pointer justify-center md:mt-0 text-xs md:text-base rounded-lg md:rounded-none md:rounded-e-lg flex items-center text-white font-medium h-[35px] px-4 py-2'
              style={{
                background: "linear-gradient(92deg, #673AB7 0%, #762180 145.42%), linear-gradient(180deg, #37085B 0%, #9C64E2 100%)"
              }}
              onClick={() => handleSubmit()}
            >
              I AM OVER THE AGE OF 18
            </div>
          </div>

          <div className="cursor-pointer absolute right-[12px] top-[10px]" onClick={() => onClose()}>
            <FontAwesomeIcon icon={faXmark} className={`text-white text-3xl`} />
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>

  )
}

export default Over18Modal

import React, { useEffect, useState } from 'react'
import downArrow from "../../../assets/images/downArrow.svg";
import { useNavigate } from 'react-router-dom';

const SelectDropDown: React.FC<any> = ({
  onClickSelect, options, selectedValue
}) => {
  const [dropDown, setDropdown] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex">
      <div
        className="relative flex"
        onClick={() => setDropdown(!dropDown)}
      >
        <div className='flex border bg-white border-primary rounded-[40px] p-4'>
          <div className="text-primary font-[Montserrat] cursor-pointer text-sm font-semibold">
            {selectedValue}
          </div>

          <button className="text-primary ml-12">
            <img src={downArrow} />
          </button>
        </div>

        <div
          className={`absolute z-10 w-full sm:right-0 top-14 mt-2 bg-white shadow-x border border-primary rounded-[19px] border-b-0 text-md text-primary font-semibold font-[Montserrat] ${dropDown ? "block" : "hidden"}`}
        >
          {options && options.map((option: any, index: any) => {
            return (
              <>
                {option.name !== "create new" &&
                  <div
                    className={`text-center py-2 text-sm cursor-pointer border-b border-b-primary last:rounded-b-[19px] first:rounded-[19px] first:rounded-b-none rounded-b-none hover:bg-[#37085B33]`}
                    onClick={() => onClickSelect(option, option.name)}
                    key={option.id}
                  >
                    {option.name}
                  </div>
                }

                {option.name === "create new" &&
                   <div
                   className="text-center py-2 text-sm cursor-pointer border-b border-b-primary rounded-[19px] rounded-t-none hover:bg-[#37085B33] font-[Montserrat]"
                   onClick={() => navigate('/consultant/profile/manage')}
                 >
                   Create New Profile
                 </div>
                }
              </>
            )
          })}



        </div>
      </div>
    </div>
  )
}

export default SelectDropDown;

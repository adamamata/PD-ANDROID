import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const PreviewConformationModal = ({ setConformationModal, setPreviewModal, onSubmit, updatedProfileDetails }: any) => {
  
  const onClickPreview = () => {
    setConformationModal(false)
    setPreviewModal(true)
  }

  const onClickSaveAndPublish = () => {
    onSubmit(updatedProfileDetails)
    setConformationModal(false)
  }

  return (
    <>
    <div className=" fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl">
      <div className="relative font-['Montserrat'] w-11/12 md:w-auto mx-auto max-w-3xl bg-white rounded px-10 py-6">
        <div
          className="flex justify-end text-xl font-bold text-black cursor-pointer"
          onClick={() => setConformationModal(false)}
        >
          <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
        </div>

        <div className='mt-4 max-w-[90%] flex justify-center'>
          <p className='text-center'>Are You want To See The Preview Of Your Profile Details? </p>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-primary mt-4 mr-6 hover:bg-[white] text-[white] text-base hover:text-primary py-2 border-2 border-solid border-primary px-4 rounded-full font-['Montserrat']"
            onClick={() => onClickPreview()}
          >
            Preview
          </button>
          <button
            className="bg-tranparent mt-4 hover:bg-primary text-primary text-base hover:text-white py-2 border-2 border-solid border-primary px-4 hover:border-transparent rounded-full font-['Montserrat']"
            onClick={() => onClickSaveAndPublish()}
          >
            save & Publish
          </button>
        </div>
      </div>
    </div>
    <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default PreviewConformationModal

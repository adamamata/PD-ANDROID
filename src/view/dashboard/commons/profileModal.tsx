import React from 'react'
import { connect } from 'react-redux'
import SpProfileForm from '../../../component/common/ui/SpProfileForm'

const ProfileModal: React.FC<any> = ({ setShowModal ,user_details ,getSPProfileData, selectedProfile }: any) => {
	return (
		<>
			{/* <div
				style={{ backdropFilter: 'blur(6.5px)' }}
				className="bg-[#2B6672] bg-opacity-[25%] justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none"
			>
				<div className="rounded-[25px] overflow-x-hidden overflow-y-auto h-[calc(100vh_-_60px)] no-scrollbar max-w-[90%] md:max-w-[60%]"> */}
					<SpProfileForm type="modal" closeModal={setShowModal} user_details={user_details} getSPProfileData={getSPProfileData} selectedProfile={selectedProfile} />
				{/* </div>
			</div> */}
		</>
	)
}

export default connect()(ProfileModal)
import { CircularProgress } from '@mui/material'
import React from 'react'

const ModalLoader = () => {
  return (
    <div>
      <div className="absolute top-2/4 left-2/4 z-10">
        <CircularProgress style={{ color: "#37085B" }} thickness={7} />
      </div>
      <div className="absolute opacity-50 h-screen w-full "></div>
    </div>
  )
}

export default ModalLoader

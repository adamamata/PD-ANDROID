import React, { useLayoutEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const RctPageLoader = () => {

  useLayoutEffect(() => {
    document.body.style.overflow='hidden'

    return () => {document.body.style.overflow='auto'}
  }, [])

  return (
    <div>
      <div className="fixed top-2/4 left-2/4 z-50">
        <CircularProgress style={{ color: "#37085B" }} thickness={7} />
      </div>
      {/* <div className="fixed opacity-50 h-screen w-full z-40 bg-black" ></div> */}
    </div>
  )
};

export default RctPageLoader;

import React from "react";
import { Navigate } from "react-router-dom";
import { GetToken ,getRole } from "../constant/default";
import { useSelector } from "react-redux";
import { auth_details } from "../reducer/auth";


export const PrivateRoute = ({ children ,props }) => {
  const userDetail = useSelector(auth_details);

  let role
  if(getRole() === "User"){
    role = "user"
  }else if(getRole() === "ServiceProvider") {
    role = "consultant"
  }
  if (GetToken() && userDetail?.login?.isSuccess) {
     if(getRole() === props?.role){
       return <>{children}</>;
     }else{
      return <Navigate to={`/${role}/home`} />;
     }
  }
   else {
    return <Navigate to={`/`} />;
  }
};

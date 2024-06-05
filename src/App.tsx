import React, {useEffect} from "react";
import "./App.css";
import Routes from "./router/index"
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset_home_scroll_position, reset_sp_home_scroll_position } from "./reducer/homePageSlice";

function App() {
  const location = useLocation()
  const persistDispatch = useDispatch();

  useEffect(() => {
    if(location?.pathname !== "/user/home" && !location?.pathname?.includes("/user/profileDetails")) {
      persistDispatch(reset_home_scroll_position())
    }

    if(location?.pathname !== "/consultant/home" && !location?.pathname?.includes("/consultant/viewClientProfile")) {
      persistDispatch(reset_sp_home_scroll_position())
    }

    
  },[location?.pathname])

  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;

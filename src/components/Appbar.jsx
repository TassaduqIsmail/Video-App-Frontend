import React from "react";
import { auth } from "../service/config";
import { handleSignOut } from "../service/config";
import { useNavigate } from "react-router-dom";

function Appbar() {
  const navigate = useNavigate()
  const handleloogout = async () => {
    localStorage.removeItem("uid");
    try {
      // handleSignOut();
      await localStorage.clear();
      await localStorage.removeItem("uid");

      console.log("Logout successful");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };
  const handleSkip = () => {
    navigate("/Shareprofile");
  };
  return (
    <div className="flex justify-between p-5">
      <img src="smalllogo.png" onClick={()=>{
        handleSkip()
      }}/>

      <div className="flex gap-2">
        <a href="search">
          <img src="searchicon.png" alt="" className="mr-2" />
        </a>
        <a
          onClick={() => {
            handleloogout();
          }}
          href="/"
        >
          <img src="logouticon.png" alt="" />
        </a>
      </div>
    </div>
  );
}

export default Appbar;

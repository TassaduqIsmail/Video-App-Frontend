import React, { useEffect, useState } from "react";
import { getProfileData } from "../Api/saveProfileData";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Startname() {
  const [inputText, setInputText] = useState("");
  const [currentProfile, seturrentProfile] = useState([]);
  const navigate = useNavigate();
  console.log("curreny pre ", currentProfile);
  const [edited, setEdited] = useState(false);
  const handleTextChange = (text) => {
    // Limit the input to thirty letters
    if (text?.length <= 30) {
      setInputText(text);
      setEdited(true);
    }
  };

  useEffect(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/");
    }
  }, []);
  // useEffect(() => {
  //   const fetchProfileData = async () => {
  //     try {
  //       const data = await getProfileData();
  //       seturrentProfile(data);
  //     } catch (error) {
  //       console.error('Error fetching profile data:', error);
  //     }
  //   };
  //   fetchProfileData();
  // }, [])
  // useEffect(() => {
  //   if (currentProfile?.name && !edited) {
  //     setInputText(currentProfile?.name);
  //   }
  // }, [currentProfile, edited]);
  console.log(inputText);
  const handleNext = async () => {
    if (inputText == "") {
      toast.error("Please fill name or skip");
    } else {
      navigate("/starterusername", { state: { inputText } });
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };
  const handleSkip = () => {
    navigate("/starterusername", { state: { inputText } || "" });
  };
  const letterCount = inputText?.length;
  const [name, setname] = useState("");
  return (
      <div style={{ width: "400px", height: "100%" }}>
        <center>
        <img
          style={{ cursor: "pointer" }}
          src="whitelogo.png"
          className=" mt-40"
          alt=""
        />

        <p className="text-white text-2xl mt-20 font-bold">Enter your name</p>

        <div className="p-5">
          <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-sm float-start">
            Name
          </p>
          <input
            type="text"
            onKeyPress={handleKeyPress}
            onChange={(e) => handleTextChange(e.target.value)}
            value={inputText}
            className="text-white border-none h-6 outline-none w-full bg-[#110e0f]"
            style={{ borderBottom: "1px solid white" }} // Add this style
          />
          <p className="text-[#A1A3A7] text-xs font-thin float-start">
            {letterCount}/30
          </p>
        </div>

        <div className="p-5 mt-10">
          <img src="slide2.png" />

          <div  style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <a
            style={{cursor:"pointer"}}
              onClick={handleSkip}
              type="button"
              className="mt-20  mb-5 text-white font-thin py-2  rounded-full"
            >
              Skip
            </a>

            <a
              onClick={handleNext}
              type="button"
              className="mt-20 bg-[#3640c2]  mb-5 text-white font-bold p-4  rounded-full"
            >
              <img style={{cursor:"pointer"}}src="whiteplayicon.png" />
            </a>
          </div>
        </div>
      </center>
      <ToastContainer/>
    </div>
  );
}

export default Startname;

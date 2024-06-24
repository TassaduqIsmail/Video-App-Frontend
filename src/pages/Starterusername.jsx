import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Starterusername() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location?.state?.inputText);

  // const { inputText } = route.params;
  // console.log(inputText);
  const [userName, setUserName] = useState("");
  const [edited, setEdited] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  const handleTextChange = (text) => {
    setUserName(text);
    setEdited(true);
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
  //   if (currentProfile?.username && !edited) {
  //     setUserName(currentProfile?.username);
  //   }
  // }, [currentProfile, edited]);
  const handleNext = () => {
    if (userName == "") {
      toast.error("Please fill username or skip");
    } else if (!usernameRegex.test(userName)) {
      toast.error("Invalid username!");
    } else {
      navigate("/uploadprofilepicture", {
        state: { data: location?.state?.inputText, userName },
      });
    }
  };
  const handleSkip = () => {
    navigate("/uploadprofilepicture", {
      state:
        { data: location?.state?.inputText || "", userName: userName } || "",
    });
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };
  return (
    <div style={{ width: "400px", height: "100%" }}>
      <center>
        <img      style={{ cursor: "pointer" }} src="whitelogo.png" className=" mt-40" alt="" />

        <p className="text-white text-2xl mt-20 font-bold">
          Enter your username
        </p>

        <div className="p-5">
          <p  className="text-[#A1A3A7] mb-2 font-thin mt-2 text-sm float-start">
            Username
          </p>
          <input
            type="text"
            onChange={(e) => handleTextChange(e.target.value)}
            value={`${userName}`}
            onKeyPress={ handleKeyPress}
            className="text-white border-none h-6 outline-none w-full bg-[#110e0f]"
            style={{ borderBottom: "1px solid white" }} // Add this style
          />
        </div>

        <p className="text-[#A1A3A7] text-xs font-thin  m-1 ">
          Usernames can contain only letters, numbers, underscores, and periods.
          Changing you username will also change your profile link.
        </p>
        <div className="p-5">
          <img src="slide3.png" />

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <a
              style={{cursor:"pointer"}}
              onClick={() => {
                handleSkip();
              }}
              type="button"
              className="mt-20  mb-5 text-white font-thin py-2  rounded-full"
            >
              Skip
            </a>

            <a
            style={{cursor:"pointer"}}
              onClick={() => {
                handleNext();
              }}
              type="button"
              className="mt-20 bg-[#3640c2]  mb-5 text-white font-bold p-4  rounded-full"
            >
              <img src="whiteplayicon.png" />
            </a>
          </div>
        </div>
      </center>
      <ToastContainer />
    </div>
  );
}

export default Starterusername;

import React, { useEffect, useState } from "react";
import {
  getProfileData,
  saveProfileData,
  updateUserName,
} from "../Api/saveProfileData";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Changeusername() {
  const navigate =useNavigate()
  // const { username } = route.params
  const location = useLocation();
  console.log(location?.state?.username);
  const [userName, setUserName] = useState(location?.state?.username);
  const [currentProfileUid, setcurrentProfileUid] = useState("");
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  const handlUserNameChange = (newText) => {
    setUserName(newText);
  };
  const goBack = () => {
    window.history.back();
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData();
        setcurrentProfileUid(data?._id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [currentProfileUid]);

  const saveChanges = async () => {
    try {
      if (userName === "") {
        toast.error("Username is required");
      } else if (!usernameRegex.test(userName)) {
        toast.error("Invalid username!");
      } else {
        if (currentProfileUid === "" || currentProfileUid === undefined) {
          // If profile ID doesn't exist, save the username
          const username = userName;
          await saveProfileData(username);
          console.log("Profile data saved successfully.");
        } else {
          // If profile ID exists, update the username
          const username = userName;
         const check = await updateUserName(username, currentProfileUid)
         console.log();
         if(check==='saved!') {
            
          toast("Username Saved!")
          setTimeout(() => {
            
            navigate('/editprofile')
          }, 2000);
          
       }    else if(check==='exist!') {
            
        toast.error("Username already exist!")

     }
    
       console.log('jashdfashfasf',check);
          // toast("Username updated successfully.");
        }
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

//   const goBack = () => {
//     window.history.back(); // This will navigate back to the previous page in the browser history
// };

  return (
    <div style={{width:"350px"}} className="h-screen p-2" >
      <div className="flex justify-between m-2">
        <img style={{cursor:"pointer"}}  onClick={goBack} src="backicon.png" alt="" />
        <div className="flex items-center">
          <p className="text-white text-sm font-thin">Username</p>
        </div>
        <button className="text-[#00FF00]" onClick={saveChanges}>
          Save
        </button>
      </div>

      <div className="p-5 ">
        <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-sm ">Username</p>
        <input
          type="text"
          value={userName}
          onChange={(e) => handlUserNameChange(e.target.value)}
          className="text-white border-b h-6 border-[#A1A3A7] outline-none p-2 w-full bg-[#110e0f]"
        />
{/* 
        <p className="text-[#FF0000] mb-2 font-thin mt-2 text-xs flex ">
          <img src="erroricon.png" alt="" /> This username isn’t available.
          Enter a new one.
        </p> */}

        <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-xs ">
          Usernames can contain only letters, numbers, underscores, and periods.
          Changing your username will also change your profile link.
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Changeusername;

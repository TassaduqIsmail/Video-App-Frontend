import React, { useEffect, useState } from "react";
import {
  getProfileData,
  saveProfileData,
  updateName,
} from "../Api/saveProfileData";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Changename({name}) {
  const navigate =useNavigate()
  const location = useLocation();

  // console.log('name',location);

  const [inputText, setInputText] = useState(location?.state?.name);
  const [currentProfileUid, setcurrentProfileUid] = useState("");
  const [textLeng, setTextLeng] = useState("");

  // console.log(inputText);
  const handleTextChange = (text) => {
    if (text.length <= 30) {
      setTextLeng(text.length);
      setInputText(text);
    }
  };
  // const letterCount = inputText.length;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData();
        console.log(data);
        setcurrentProfileUid(data?._id);
        console.log(data?._id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [currentProfileUid]);

  const saveChanges = async () => {
    console.log("current id", currentProfileUid);
    if (inputText === "") {
      toast.error("Name is required");
    } else {
      try {
        const name = inputText;

        if (currentProfileUid === "" || currentProfileUid === undefined) {
          await saveProfileData(name); // Pass inputText value to saveProfileData
          toast("Profile data saved successfully.");
        } else {
          const check =  await updateName(name, currentProfileUid)
          if(check==='saved') {
            
            toast("Name Saved!")
            setTimeout(() => {
              
              navigate('/editprofile')
            }, 2000);
         }
         console.log('jashdfashfasf',check);
          // toast("Name updated successfully.");
        }
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
  };

  const goBack = () => {
    window.history.back(); // This will navigate back to the previous page in the browser history
};
// const { inputText } = route.params;
  console.log(inputText);
  const [userName, setUserName] = useState('');
  const [currentProfile, seturrentProfile] = useState([]);
  const [edited, setEdited] = useState(false);
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  // const handleTextChange = text => {
  //   setUserName(text);
  //   setEdited(true)
  // };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData();
        seturrentProfile(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, [])
  useEffect(() => {
    if (currentProfile?.username && !edited) {
      setUserName(currentProfile?.username);
    }
  }, [currentProfile, edited]);
 
  // console.log("hejek", currentProfileUid);
  return (
    <div style={{width:"350px"}} className="h-screen p-2" >
      <div className="flex justify-between m-2">
        <img style={{cursor:"pointer"}} onClick={goBack} src="backicon.png" alt="" />
        <div className="flex items-center">
          <p className="text-white text-sm font-thin">Name</p>
        </div>
        <button style={{cursor:"pointer"}}  className="text-[#00FF00]" onClick={saveChanges}>
          Save
        </button>
      </div>

      <div className="p-5 ">
        <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-sm ">Name</p>
        <input
          type="text"
          value={inputText}
          onChange={(e) => handleTextChange(e.target.value)}
          className="text-white border-b h-6 border-[#A1A3A7] outline-none p-2 w-full bg-[#110e0f]"
        />
        <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-xs ">{textLeng}/30</p>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Changename;

// import React, { useEffect, useState } from "react";
// import {
//   getProfileData,
//   saveProfileData,
//   updateName,
// } from "../Api/saveProfileData";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Changename({ name }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [inputText, setInputText] = useState(location?.state?.name);
//   const [currentProfileUid, setcurrentProfileUid] = useState("");
//   const [textLeng, setTextLeng] = useState("");

//   const handleTextChange = (text) => {
//     if (text.length <= 30) {
//       setTextLeng(text.length);
//       setInputText(text);
//     }
//   };

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const data = await getProfileData();
//         setcurrentProfileUid(data?._id);
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };

//     fetchProfileData();
//   }, [currentProfileUid]);

//   const saveChanges = async () => {
//     if (inputText === "") {
//       toast.error("Name is required");
//     } else {
//       try {
//         const name = inputText;

//         if (currentProfileUid === "" || currentProfileUid === undefined) {
//           await saveProfileData(name);
//           toast("Profile data saved successfully.");
//         } else {
//           const check = await updateName(name, currentProfileUid);
//           if (check === "saved") {
//             toast("Name Saved!");
//             setTimeout(() => {
//               navigate("/editprofile");
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         console.error("Error saving changes:", error);
//       }
//     }
//   };

//   const goBack = () => {
//     window.history.back();
//   };

//   return (
//     <div style={{ width: "100%", maxWidth: "400px", margin: "auto", height: "100vh" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
//         <img
//           style={{ cursor: "pointer" }}
//           onClick={goBack}
//           src="backicon.png"
//           alt=""
//           className="back-icon"
//         />
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <p style={{ color: "white", fontSize: "14px", fontWeight: 300 }}>Name</p>
//         </div>
//         <button
//           style={{ cursor: "pointer", color: "#00ff00" }}
//           onClick={saveChanges}
//           className="save-button"
//         >
//           Save
//         </button>
//       </div>

//       <div style={{ padding: "5px" }}>
//         <p style={{ color: "#a1a3a7", marginBottom: "5px", fontWeight: 300, fontSize: "14px" }}>
//           Name
//         </p>
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => handleTextChange(e.target.value)}
//           style={{
//             color: "white",
//             borderBottom: "1px solid #a1a3a7",
//             outline: "none",
//             padding: "10px",
//             width: "100%",
//             backgroundColor: "#110e0f",
//           }}
//         />
//         <p style={{ color: "#a1a3a7", marginTop: "5px", fontWeight: 300, fontSize: "12px" }}>
//           {textLeng}/30
//         </p>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default Changename;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../Api/apis";
import { ToastContainer, toast } from "react-toastify";

function Uploadprofilepicture() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("sadjhas", location?.state?.data);
  // const { inputText, userName } = route.params;
  // console.log(inputText, userName);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAssets, setImageAssets] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  // const [selectedImage, setSelectedImage] = useState(null);

  useEffect(()=>{
    let uid = localStorage.getItem("uid")
    if(!uid ){
     navigate("/")
    }
   },[])
  const handleNext = async () => {
    if (!selectedImage) {
      toast.error("Please select Pic or skip");
    } else {
      navigate("/statersetyourrate", {
        state: {
          data: location?.state?.data,
          userName: location?.state?.userName,
          selectedImage: base64Image,
        },
      });
    }
  };
  const handleSkip = () => {
    navigate("/statersetyourrate", {
      state: {
        data: location?.state?.data || "",
        userName: location?.state?.userName || "",
        selectedImage: base64Image || "",
      },
    });
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        setSelectedImage(reader.result);
        setBase64Image(base64Data);
        // handleUpload(base64Data, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ width: "400px", height: "100%" }}>
      {/* <img src="backicon.png" alt="" /> */}
      <center>
        <img  style={{ cursor: "pointer" }} src="whitelogo.png" className=" mt-20" alt="" />

        <p className="text-white text-2xl mt-20 font-bold">
          Upload profile picture
        </p>
        <div className="p-5 mt-11">
          <div className="relative rounded-full h-28 w-28">
            <label htmlFor="fileInput" className="cursor-pointer">
              <img
                className="opacity-20 mt-5 rounded-full"
                src={
                  selectedImage ||
                  "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                }
                alt=""
              />
              <img
                src="cameraicon.png"
                className="absolute inset-0 m-auto"
                alt=""
              />
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
          <div >
          <img className="mt-11" src="slide5.png" />

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
        </div>
      </center>
      <ToastContainer/>
    </div>
  );
}

export default Uploadprofilepicture;

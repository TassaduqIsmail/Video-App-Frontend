import React, { useEffect, useState } from "react";
import {
  getProfileData,
  saveProfileData,
  updatePrice,
} from "../Api/saveProfileData";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Setprice() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let uid = localStorage.getItem("uid")
    if(!uid ){
     navigate("/")
    }
   },[])
  // console.log('name',location);

  // const [inputText, setInputText] = useState();

  const [newPrice, setPrice] = useState(location?.state?.price);
  const [currentProfileUid, setcurrentProfileUid] = useState("");

  // console.log(price);
  // const handlePriceChange = (text) => {
  //   setPrice(e);
  // };

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
  }, [currentProfileUid])



  


  const saveChanges = async () => {
    try {
      if (newPrice === "") {
        toast("price is required");
      } else if (currentProfileUid === "" || currentProfileUid === undefined) {
        const price = newPrice;
        saveProfileData(price);
        console.log("chll raha hn ");
      } else if (currentProfileUid !== "" || currentProfileUid !== undefined) {
        console.log(currentProfileUid);
        const price = newPrice;
       const check = await updatePrice(price, currentProfileUid)
        if(check=== 'saved') {
            
          toast("New Price Saved")
          setTimeout(() => {
            
            navigate('/editprofile')
          }, 2000);
         
       }
       console.log('check',check);
      }
    } catch (error) {
      console.error(" error:", error);
    }
  };
  const goBack = () => {
    window.history.back();
  };
  return (
    <div style={{width:"350px"}} className="h-screen p-2" >
      <div className="flex justify-between m-2">
        <img  style={{cursor:"pointer"}}  onClick={goBack} src="backicon.png" alt="" />
        <div className="flex items-center">
          <p className="text-white text-sm font-thin">Set your price</p>
        </div>
        <p  style={{cursor:"pointer"}}  onClick={saveChanges} className="text-[#00FF00]">
          Save
        </p>
      </div>

      <div className="p-5 ">
        <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-sm ">Price</p>
        <div className="flex justify-between items-center ">
          <div className="flex gap-2 items-center">
            <p className="text-white mb-2 font-thin mt-2 text-sm  ">€</p>
            <input
              type="text"
              onChange={(e)=>setPrice(e.target.value)}
              value={newPrice}
              className="text-white border-none h-6 outline-none p-2 w-full bg-[#110e0f]"
            />
          </div>
          <p className="text-[#A1A3A7] mb-2 font-thin mt-2 text-sm  ">/month</p>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Setprice;

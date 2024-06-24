import React, { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API } from "../Api/apis";
import { toast } from "react-toastify";

function Notsignup() {
  const location = useLocation();
  const getUserID = location?.pathname?.split("/")[2];
  const [usrData,setUsrData] = useState()
  const [assetsData,setAssetsData] = useState()
  
  const [subCount,setSubCount] = useState()

  useEffect(() => {
    console.log("getUserID", getUserID, location?.pathname);
    checkProfileAndStatus(getUserID)
    getAssets()
  }, [getUserID]);

  const getAssets = async () => {
    const uid = getUserID;
    // console.log(uid);
    await axios
      .get(`${API.IMAGE_VIDEO.GET_ASSETS}`)
      .then((response) => {
        //  console.log('assets data', response);
        setAssetsData(response.data)
        console.log("sssssss",response.data)
        const filteredData = response?.data?.filter(
          (item) => item?.uid === uid
        );
        // setLoading(false);
        // console.log("assets", filteredData);
        if (filteredData) {
          const images = filteredData.filter(
            (item) => item?.pic_format == "jpg" || item?.pic_format == "png"
          );
          const videos = filteredData.filter(
            (item) => item?.pic_format == "mp4"
          );
          console.log("videos", images);
          const picData = images.map((item) => {
            return {
              format: item?.pic_format,
              pubId: item?.pic_public_id,
              pic_url: item?.pic_url,
              id: item?.uid,
              likes: item?.likes,
              ratings: item?.ratings,
            };
          });
          // console.log('img', picData);
          const videoData = videos.map((item) => {
            return {
              format: item?.pic_format,
              pubId: item?.pic_public_id,
              pic_url: item?.pic_url,
              id: item?._id,
              duration: item?.duration,
              likes: item?.likes,
              ratings: item?.ratings,
            };
          });
        //   setCurrentImages(picData);
        //   setCurrentVideo(videoData);
        }
      })
      .catch((error) => {
        console.error("Axios POST request error:", error);
      });
  };

  useEffect(()=>{
    console.log("usrData",usrData)
    fetchSubTotal()
  },[usrData])

  const fetchSubTotal = async (item) => {
    try {
      // const uid = await localStorage.getItem("uid");
      const response = await axios.get(API.PAYMENT.GET_SUB_STATUS);
      const subData = response?.data?.data;
      setSubCount(subData)
      console.log("Subscribers", subData);
      const countSub = subData.filter((item) => item?.subStatus == "subscribe");
    //   setSubTotal(countSub);
      console.log("countSub", countSub, location?.state?.userData?.uid);
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkProfileAndStatus = async (uid) => {
    // const uid = localStorage.getItem("uid");
    console.log(uid);
    try {
        const uri = `${API.USER.GET_USERS_BY_ID}/${uid}`
        
      await axios.get(uri)
        .then(async (response) => {
          console.log(response?.data,uri);

        //   if (
        //     response?.data?.data?.status == "activate" &&
        //     response?.data?.data?.isDeleated === false
        //   ) {
            toast("sign in successfully");
            await axios
              .get(API.PROFILE.GET_ALL_PROFILE)
              .then((response) => {
                console.log(response.data);
                
                // console.log('uid', uid);
                const profileData = response?.data?.data?.filter(
                  (item) => item?.uid == getUserID
                );
                setUsrData(response?.data?.data)
                if (
                  profileData[0]?.name ||
                  profileData[0]?.pic_url ||
                  profileData[0]?.price ||
                  profileData[0]?.username
                ) {
                    
                } else {
                }
                // console.log('profile', profileData);
              })
              .catch((error) => {
                console.error("Axios POST request error:", error);
              });
        //   } else if (
        //     response?.data?.data?.status == "deactivate" ||
        //     response?.data?.data?.isDeleated === true
        //   ) {
        //     // toast.error("admin deactivate your account");
        //     toast.error("Your  Account deactivate or bedeleated");
        //   }
        });
    } catch (error) {}
  };

  return (
    <div style={{ width: "100%" }} className="p-2 h-screen ">
      <div
        className="flex gap-2 m-2"
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <img src="backicon.png" alt="" />
        <p className="text-white text-sm font-thin">Login to subscribe</p>
        <p></p>
      </div>

      <center>
        <div className="border border-[#4753ea] rounded-lg p-2 m-5">
          <div className="rounded-full h-20 w-20">
            <img
              src={ usrData?.find(i => i?._id == getUserID)?.pic_url ||"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
              className="mt-5 rounded-full"
              alt=""
            />
          </div>

          <p className="text-white font-thin  text-lg">{usrData?.find(i => i?._id == getUserID)?.name}</p>
          <p className="text-[#a1a3a7] font-thin text-xs ">@{usrData?.find(i => i?._id == getUserID)?.username}</p>

          <div className="flex justify-center gap-10 mt-5">
            <div>
              <p className="text-white">{assetsData?.find(i => i?.uid == getUserID)?.likes || 0}</p>
              <p className="text-[#a1a3a7] font-extralight">Likes</p>
            </div>

            <div>
              <p className="text-white font-bold">{subCount?.filter(i => i?.subStatus === "subscribe")?.length}</p>
              <p className="text-[#a1a3a7] font-extralight ">Subscribers</p>
            </div>

            <div>
              <p className="text-white font-bold">{assetsData?.find(i => i?.uid == getUserID)?.ratings || 0} </p>
              <p className="text-[#a1a3a7] font-extralight">Rating</p>
            </div>
          </div>
        </div>
      </center>

      <div className="flex gap-3 justify-center mb-5">
        <img src="facebook.png" alt="" />
        <img src="google.png" alt="" />
      </div>

      <div className="flex justify-center items-center mb-5">
        <hr className="bg-[#727574] w-1/3 h-0.5" />
        <p className="text-[#727574] mx-2 font-bold">OR</p>
        <hr className="bg-[#727574] w-1/3 h-0.5" />
      </div>

      <form className="p-3">
        <div className="flex flex-col gap-3 mb-3">
          <label className="text-white">Your email</label>
          <input
            type="text"
            className="border-b h-6 border-white p-2 bg-[#110e0f]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-white">Password</label>
          <input
            type="text"
            className="h-6  border-b border-white p-2 bg-[#110e0f]"
          />
        </div>

        <center>
          <button
            type="submit"
            className="mt-20 mb-2 text-white font-bold py-2 px-32 rounded-full"
            style={{
              backgroundImage: "linear-gradient(to bottom, #3640c2, black)",
            }}
          >
            Login
          </button>
          <br />

          <a className="text-white text-xs mb-2" href="#">
            Don’t have an account?{" "}
            <span className="text-white font-bold">Sign up</span>
          </a>
        </center>
      </form>
    </div>
  );
}

export default Notsignup;

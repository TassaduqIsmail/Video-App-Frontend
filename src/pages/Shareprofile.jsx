import React, { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import axios from "axios";
import { API } from "../Api/apis";
import { useNavigate, useNavigation } from "react-router-dom";
import CheckOutPage from "./CheckOutPage";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import "../App.css";

function Shareprofile() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [isOver18, setIsOver18] = useState(false);
  const [Terms, setTerms] = useState(false);
  const [Policy, setPolicy] = useState(false);
  const [Del, setDel] = useState(false);

  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };
  // const [isModalVisible1, setModalVisible1] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({});
  const [currentUid, setCurrentUid] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [currentVideo, setCurrentVideo] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0.0);
  const [averageRating, setAverageRating] = useState(0.0);
  let [loading, setLoading] = useState(true);
  const [moreOpt, setMoreOpt] = useState(false);

  const [button, Setbutton] = useState({
    pic: true,
    video: false,
  });
  console.log("first", moreOpt);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isloading, setisloading] = useState(false);
  const handleNextPress = () => {
    setActiveIndex((prevIndex) => Math.min(prevIndex + 1, 1));
  };
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
  const handlePrevPress = () => {
    setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const [isModalVisible3, setModalVisible3] = useState(false);
  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };
  // const handleDeletAccount = async (id) => {
  //   const uid = localStorage.getItem("uid");
  //   try {
  //     const status = {
  //       isDeleated: true,
  //     };
  //     const response = await axios.put(
  //       `${API.USER.Deleat_User}/${uid}`,
  //       status
  //     );
  //   } catch (error) {}
  // };
  // //   };
  useEffect(() => {
    setIsOver18(true);
  }, []);

  const fetchSubTotal = async (item) => {
    try {
      const uid = await localStorage.getItem("uid");
      const response = await axios.get(API.PAYMENT.GET_SUB_STATUS);
      const subData = response.data.data;
      console.log(subData);
      const countSub = subData.filter(
        (item) => item.subStatus === "subscribe" && item.creatorId === uid
      );
      setSubTotal(countSub);
    } catch (error) {
      console.log(error.message);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const modal = localStorage.getItem("yes");
    if (!modal) {
      setIsOver18(true);
    } else setIsOver18(false);
  }, []);
  useEffect(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/");
    }
  }, []);
  const handleSkip = () => {
    navigate("/Shareprofile");
  };
  useEffect(() => {
    getProfileData();
    fetchSubTotal();
  }, []);
  useEffect(() => {
    const getAssets = async () => {
      const uid = localStorage.getItem("uid");
      // console.log(uid);
      await axios
        .get(`${API.IMAGE_VIDEO.GET_ASSETS}`)
        .then((response) => {
          //  console.log('assets data', response);
          const filteredData = response?.data?.filter(
            (item) => item?.uid === uid
          );
          setLoading(false);
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
            setCurrentImages(picData);
            setCurrentVideo(videoData);
          }
        })
        .catch((error) => {
          console.error("Axios POST request error:", error);
        });
    };
    getAssets();
  }, [currentImages, currentVideo]);

  const getProfileData = async () => {
    const profileUid = localStorage.getItem("profileUid");
    const uid = localStorage.getItem("uid");
    // console.log("profileuid", profileUid);
    // console.log('uid', uid);

    await axios
      .get(`${API.PROFILE.GET_ALL_PROFILE}`)
      .then((response) => {
        const filteredData = response?.data?.data?.filter(
          (item) => item.uid === uid
        );
        //   console.log(filteredData);

        setCurrentProfile({
          name: filteredData[0]?.name,
          username: filteredData[0]?.username,
          price: filteredData[0]?.price,
          pic_url: filteredData[0]?.pic_url,
          id: filteredData[0]?._id,
        });
        // }
      })
      .catch((error) => {
        console.error("Axios POST request error:", error);
      });
  };

  useEffect(() => {
    let totalImageLikes = 0;
    let totalImageRating = 0;
    let ratingLength = 0;

    currentImages?.forEach((image) => {
      console.log("current image data", image);
      if (typeof image?.likes === "number" && !isNaN(image.likes)) {
        totalImageLikes += image.likes;
      }
      ratingLength = image?.ratings?.length || 0;
      if (ratingLength > 0) {
        totalImageRating +=
          image?.ratings.reduce((acc, curr) => acc + curr.rate, 0) /
          ratingLength;
      }
    });

    console.log("totalImageLikes", totalImageLikes);

    const averageImageRating =
      ratingLength === 0 ? 0 : totalImageRating / ratingLength;
    console.log("averageImageRating", averageImageRating);

    let totalVideoLikes = 0;
    let totalVideoRating = 0;
    let ratingVideoLength = 0;

    currentVideo.forEach((video) => {
      console.log("current video data", video);
      // Check if likes exist and are valid numbers
      if (typeof video?.likes === "number" && !isNaN(video.likes)) {
        totalVideoLikes += video.likes;
      }

      ratingVideoLength = video?.ratings?.length || 0;

      if (ratingVideoLength > 0) {
        totalVideoRating +=
          video?.ratings.reduce((acc, curr) => acc + curr?.rate, 0) /
          ratingVideoLength;
      }
    });

    console.log("totalVideoLikes", totalVideoLikes);

    // Calculate average rating for videos
    const averageVideoRating =
      ratingVideoLength === 0 ? 0 : totalVideoRating / ratingVideoLength;
    console.log("averageVideoRating", averageVideoRating);

    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
      }
      return num.toString();
    };

    const totalLikes = totalImageLikes + totalVideoLikes;
    // const formattedSubscribe = formatNumber(toltalSubcribe);
    const formattedLikes = formatNumber(totalLikes);

    const avgRating = (averageImageRating + averageVideoRating) / 2;

    setAverageRating(avgRating);
    setTotalLikes(formattedLikes);
    // setToltalSubcribe(formattedSubscribe);
    // getSubscriberData();
  }, [currentImages, currentVideo]);

  const shareProfile = (data) => {
    console.log("data", data);

    if (navigator.share) {
      navigator
        .share({
          title: `${currentProfile?.name}'s Profile`,
          text: `Check out ${currentProfile?.name}'s profile on our website!`,
          url: `${window.location.href}/${currentProfile.id}`, //"https://vinedo-frontend.vercel.app/shareprofile",
        })
        // .then(() => toast("Profile shared successfully"))
        .catch((error) => console.error("Error sharing profile:", error));
    } else {
      // Fallback if Web Share API is not supported
      toast.error("Profile sharing is not supported on this browser.");
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      console.log("reader", reader);
      reader.onload = () => {
        const base64Data = reader.result;
        if (file.type.startsWith("video/")) {
          const video = document.createElement("video");
          video.onloadedmetadata = () => {
            const duration = video.duration;
            handleUpload(base64Data, file.type, duration);
            console.log("dddd", duration);
          };
          video.src = URL.createObjectURL(file);
        } else {
          handleUpload(base64Data, file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // console.log(selectedFile);
  const handleUpload = async (base64Data, fileType, duration) => {
    const formData = {};
    const uid = await localStorage.getItem("uid");
    try {
      const filetype = fileType?.split("/");
      if (filetype[0] === "image" || filetype[0] === "video") {
        formData["duration"] = duration !== null ? duration : null;
        formData["base64"] = base64Data;
        formData["type"] = filetype[0] === "image" ? "image" : "video/mp4";
        formData["username"] = currentProfile?.username;
        formData["uid"] = uid;
      }

      console.log("form", filetype);
      console.log("form", formData);

      setisloading(true);
      await axios
        .post(`${API.IMAGE_VIDEO.UPLOAD_ASSETS}`, formData, {
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        })
        .then(function (response) {
          console.log("res", response.data);
          setisloading(false);
          if (response?.data?.succes == true) {
            toast("Success");
            setModalVisible(false);
          }
        });
      setLoading(false).catch(function (error) {
        console.log("err", error);
        setisloading(false);
      });
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipboard = async (username) => {
    try {
      const text = `vinedo.com/@${username}`;
      await navigator.clipboard.writeText(text);
      setLinkModal(true);
      setTimeout(() => {
        setLinkModal(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy:", error);
    }
  };

  const handleDeletAccount = async (id) => {
    const uid = localStorage.getItem("uid");
    try {
      const status = {
        isDeleated: true,
      };
      const response = await axios
        .put(`${API.USER.Deleat_User}/${uid}`, status)
        .then(() => {
          toast.success("account deleat successfully");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        });
    } catch (error) {}
  };

  useEffect(() => {
    // Check if the document.referrer is empty
    const directEntry = document.referrer === "";
    // window.location.pathname

    // Access the current URL
    const currentUrl = window.location.href;

    console.log("Direct Entry:", directEntry);
    console.log("Current URL:", currentUrl, window.location.pathname);

    // Optionally, perform actions based on directEntry
    if (directEntry) {
      // Actions to do on direct entry
      console.log("User entered directly or through a bookmark!");
    }
  }, []);

  return (
    <div
      // onClick={()=>{
      //   setMoreOpt(false)
      // }}
      style={{ width: "100%" }}
      // className="p-2"
    >
      <div className="flex justify-between p-5">
        <img
          src="smalllogo.png"
          onClick={() => {
            handleSkip();
          }}
        />

        <div className="flex gap-2">
          <a href="search">
            <img src="searchicon.png" alt="" className="mr-2" />
          </a>
          <a
            onClick={() => {
              setMoreOpt(!moreOpt);
            }}
          >
            <img src="Vector.png" alt="" style={{ cursor: "pointer" }} />
          </a>
        </div>
      </div>

      <center
        onClick={() => {
          setMoreOpt(false);
        }}
      >
        <br />

        <div
          onClick={() => navigate("/Editprofile")}
          className="rounded-full h-28 w-28"
        >
          <img
            src={
              currentProfile?.pic_url ||
              "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
            }
            className="mt-5 rounded-full"
            style={{ height: "100%", width: "100%", cursor: "pointer" }}
            alt="Profile Pic"
          />
        </div>

        <p className="text-white font-thin text-lg">
          {currentProfile?.name || "Name"}
        </p>
        <p
          style={{ cursor: "pointer" }}
          onClick={() => copyToClipboard(currentProfile?.username)}
          className="text-[#a1a3a7] font-thin text-xs "
        >
          @{currentProfile?.username || "Username"}
        </p>

        <div className="flex justify-center gap-10 mt-10">
          <div>
            <p className="text-white">{totalLikes}</p>
            <p className="text-[#a1a3a7] font-extralight">Likes</p>
          </div>

          <div>
            <p className="text-white font-bold">{subTotal?.length}</p>
            <p className="text-[#a1a3a7] font-extralight ">Subscribers</p>
          </div>

          <div>
            <p className="text-white font-bold">{averageRating}</p>
            <p className="text-[#a1a3a7] font-extralight">Rating</p>
          </div>
        </div>
      </center>

      <div
        onClick={() => {
          setMoreOpt(false);
        }}
        className="flex justify-center gap-8 mt-8"
      >
        <button
          onClick={() => navigate("/editprofile")}
          type="button"
          className="text-white border border-[#4753ea] text-sm font-thin py-1 px-4 rounded-full "
        >
          Edit profile
        </button>
        <button
          onClick={() => shareProfile(currentProfile)}
          type="button"
          className="text-white border border-[#4753ea] text-sm font-thin py-1 px-4 rounded-full"
        >
          Share profile
        </button>
      </div>

      <div
        onClick={() => {
          setMoreOpt(false);
        }}
        className="flex  justify-center gap-10 mt-8"
      >
        <button
          type="button"
          onClick={() => Setbutton({ pic: true, video: false })}
          className={
            button.pic
              ? "text-white border-b  border-b-white text-sm font-thin py-1 px-4 "
              : "text-white  text-sm font-thin py-1 px-4 "
          }
        >
          <img src="gridicon.png" alt="" className="pb-3" />
        </button>

        <button
          type="button"
          onClick={() => Setbutton({ pic: false, video: true })}
          className={
            button.video
              ? "text-white border-b  border-b-white text-sm font-thin py-1 px-4 "
              : "text-white  text-sm font-thin py-1 px-4 "
          }
        >
          <img src="reelsicon.png" alt="" className="pb-3" />
        </button>
      </div>

      <div
        onClick={() => {
          setMoreOpt(false);
        }}
        style={{
          display: "flex",
          // gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "400px",
          // gap: "0.5rem",
          marginTop: 10,
        }}
      >
        {loading ? ( // Conditionally render loader if loading is true
          <ClipLoader color={"#fff"} loading={true} size={30} />
        ) : (
          button.pic &&
          currentImages?.map((item, index) => (
            <div
              onClick={() => navigate("/Showpic", { state: { item } })}
              key={index}
            >
              <img
                src={item?.pic_url}
                style={{ height: "130px", width: "130px" }}
                alt=""
              />
            </div>
          ))
        )}
      </div>
      <div
        onClick={() => {
          setMoreOpt(false);
        }}
        style={{
          display: "flex",
          // gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "400px",
          // gap: "0.5rem",
          marginTop: 10,
        }}
      >
        {button.video &&
          currentVideo?.map((item, index) => (
            <div
              onClick={() => navigate("/ShowVideo", { state: { item: item } })}
              key={index}
              style={{ position: "relative", display: "inline-block" }} // Add position relative and display inline-block to the container
            >
              {/* Video */}
              <video
                onPause={true}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from reaching the div
                  navigate("/ShowVideo", { state: { item } });
                }}
                style={{ height: "130px", width: "130px" , objectFit: "cover" }}
              >
                <source src={item?.pic_url} type="video/mp4" />
              </video>
              {/* Image positioned absolutely within the video */}
              <img
                style={{
                  position: "absolute",
                  top: 46,
                  left: 30,

                  width: "40%", // Make the image cover the entire video
                  height: "40%",
                  borderRadius: 20,
                  color: "transparent", // Make the image cover the entire video
                }}
                src="/play.png" // Assuming your image is named "play.png" and located in the public folder
                alt="Offline Image"
              />
            </div>
          ))}
      </div>

      <div
        onClick={() => {
          setMoreOpt(false);
        }}
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={() => setModalVisible(true)}
          class="bg-[#110e0f] hover:bg-blue-600 border border-[#4753ea] text-white font-bold py-4 px-4 rounded-full "
        >
          <img src="plusicon.png" alt="" />
        </button>
      </div>
      {isModalVisible && (
        <div>
          <div
            id="drawer-bottom-example"
            className="fixed rounded-t-lg bottom-0  p-4 transition-transform bg-[#110e0f] border-t border-[#4753EA]  dark:bg-gray-800 transform-none"
            tabIndex="-1"
            aria-labelledby="drawer-bottom-label"
            style={{ width: "400px" }}
          >
            <div className="flex justify-center mb-2 border-b border-[#59585b]">
              <label
                htmlFor="fileInput"
                className="text-white text-sm p-2 cursor-pointer"
              >
                {isloading ? "Uploading to server..." : "Select from Gallery"}
              </label>
              {isloading ? null : (
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              )}
            </div>
            <div
              onClick={() => setModalVisible(false)}
              className="flex justify-center mb-2"
            >
              <p
                style={{ cursor: "pointer" }}
                className="text-white text-sm text-[#59585b]"
              >
                Cancel
              </p>
            </div>
          </div>
        </div>
      )}
      {linkModal && (
        <div
          style={{
            position: "fixed",
            top: "9%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className=" alignself-center top-5 bg-[#110e0f]  border-[#4753EA]  dark:bg-gray-800 float-left"
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 2,
              paddingHorizontal: "5%",
              // borderRadius: 10,
              borderColor: "#4753EA",
              width: "90vw",
            }}
          >
            <div className="flex justify-center border-b border-[#59585b]">
              <a htmlFor="fileInput" className="text-white p-2">
                Link Copied
              </a>
            </div>
          </div>
        </div>
      )}
      {isOver18 && (
        <div
          id="drawer-bottom-example"
          className="fixed rounded-t-lg top-0  p-2 transition-transform  bg-[#000000] h-screen "
          tabIndex="-1"
          // aria-labelledby="drawer-bottom-label"
          style={{
            width: "400px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            opacity: 0.8,
          }}
        >
          <div
            id="drawer-bottom-example"
            className="privacy-policy fixed rounded-lg p-2 transition-transform bg-[#000] border border-[#4753EA]"
            tabIndex="-1"
            aria-labelledby="drawer-bottom-label"
            style={{
              width: "300px", // Adjust the width according to your requirement
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#FFF",
            }}
          >
            <p style={{ marginBottom: 20, marginTop: 20 }}>
              Are you 18 or older?
            </p>
            <p>You must be 18 years old or older </p>
            <p>in order to access our website.</p>
            <p>Please verify your age.</p>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 20,
                fontSize: 15,
              }}
            >
              <div
                className="flex"
                onClick={() => {
                  localStorage.setItem("yes", isOver18);
                  setIsOver18(false);
                }}
              >
                <label
                  htmlFor="fileInput"
                  className="text-white  cursor-pointer  border-[#4753EA] "
                  style={{
                    width: "130px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: 20,
                    borderWidth: 2,
                  }}
                >
                  I am over 18+
                </label>
              </div>
              <div
                className="flex"
                onClick={() => {
                  handleloogout();
                }}
              >
                <label
                  htmlFor="fileInput"
                  className="text-white  cursor-pointer  border-[#4753EA] "
                  style={{
                    width: "130px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: 20,
                    borderWidth: 2,
                  }}
                >
                  Exit
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {Del && (
        <div
          id="drawer-bottom-example"
          className="fixed rounded-t-lg top-0  p-2 transition-transform  bg-[#000000] h-screen "
          tabIndex="-1"
          // aria-labelledby="drawer-bottom-label"
          style={{
            width: "400px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            opacity: 0.8,
          }}
        >
          <div
            id="drawer-bottom-example"
            className="privacy-policy fixed rounded-lg p-2 transition-transform bg-[#000] border border-[#4753EA]"
            tabIndex="-1"
            aria-labelledby="drawer-bottom-label"
            style={{
              width: "300px", // Adjust the width according to your requirement
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#FFF",
            }}
          >
            <p style={{ marginBottom: 20, marginTop: 20 }}>
              Do you want to delete your accout
            </p>

            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                width: "80%",
                marginTop: 20,
                fontSize: 15,
              }}
            >
              <div
                className="flex"
                onClick={() => {
                  handleDeletAccount();
                }}
              >
                <label
                  htmlFor="fileInput"
                  className="text-white  cursor-pointer  border-[#4753EA] "
                  style={{
                    width: "50px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: 20,
                    borderWidth: 2,
                  }}
                >
                  Yes
                </label>
              </div>
              <div
                className="flex"
                onClick={() => {
                  setDel(false);
                }}
              >
                <label
                  htmlFor="fileInput"
                  className="text-white  cursor-pointer  border-[#4753EA] "
                  style={{
                    width: "50px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: 20,
                    borderWidth: 2,
                  }}
                >
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {moreOpt === true && (
        <div>
          <div
            id="drawer-bottom-example"
            className="fixed rounded-t-lg bottom-0  p-2 transition-transform bg-[#110e0f] border-t border-[#4753EA]  dark:bg-gray-800 transform-none"
            tabIndex="-1"
            aria-labelledby="drawer-bottom-label"
            style={{ width: "400px" }}
          >
            <div
              onClick={() => navigate("/Creatorstool")}
              style={{ alignItems: "center" }}
              className="flex  mb-2 border-b border-[#59585b]"
            >
              <img
                src="Tool.png"
                alt=""
                style={{ cursor: "pointer", height: 20, width: 20 }}
              />
              <label
                htmlFor="fileInput"
                className="text-white text-sm p-2 cursor-pointer"
              >
                Creator’s tools
              </label>
            </div>
            <div
              style={{ alignItems: "center" }}
              onClick={() => {
                handleloogout();
              }}
              className="flex  mb-2 border-b border-[#59585b]"
            >
              <img
                src="logouticon.png"
                alt=""
                style={{ cursor: "pointer", height: 20, width: 20 }}
              />
              <label
                htmlFor="fileInput"
                className="text-white text-sm p-2 cursor-pointer"
              >
                Log out
              </label>
            </div>
            <div style={{ alignItems: "center" }} className="flex">
              <img
                src="bin.png"
                alt=""
                style={{ cursor: "pointer", height: 20, width: 20 }}
              />
              <label
                onClick={() => {
                  // handleDeletAccount()
                  setDel(true);
                  setMoreOpt(false);
                }}
                htmlFor="fileInput"
                className="text-white text-sm p-2 cursor-pointer"
              >
                Delete your account
              </label>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                className="flex"
                onClick={() => {
                  setTerms(true);
                }}
              >
                <label
                  htmlFor="fileInput"
                  className="text-[#797C7B]  cursor-pointer"
                  style={{ fontSize: 10 }}
                >
                  Terms of Services
                </label>
              </div>
              <div
                className="flex"
                onClick={() => {
                  setPolicy(true);
                }}
              >
                <label
                  htmlFor="fileInput"
                  className="text-[#797C7B]  cursor-pointer"
                  style={{ fontSize: 10 }}
                >
                  Privacy Policy
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {Terms === true && (
        <div
          id="drawer-bottom-example"
          className="fixed rounded-t-lg top-0  p-2 transition-transform  bg-[#000000] h-screen "
          tabIndex="-1"
          // aria-labelledby="drawer-bottom-label"
          style={{
            width: "400px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            opacity: 0.8,
          }}
        >
          <div
            id="drawer-bottom-example"
            className="privacy-policy  fixed rounded-lg   p-2 transition-transform bg-[#000] border border-[#4753EA]  "
            tabIndex="-1"
            aria-labelledby="drawer-bottom-label"
            style={{
              width: "300px", // Adjust the width according to your requirement
              display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              overflowX: "auto",
              height: "70%",
              WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS devices
              scrollbarWidth: "none", // Hide scrollbar for Firefox
              msOverflowStyle: "none", // Hide scrollbar for IE and Edge
              flexDirection: "column",
            }}
          >
            <div
              style={{
                // position:"absolute",top: 5,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <p></p>
              <img
                onClick={() => {
                  setTerms(false);
                }}
                src="Clo.png"
                alt=""
                style={{
                  cursor: "pointer",
                  height: 20,
                  width: 20,

                  // position: "absolute",
                  // top: 5,
                  // right: 5,
                }}
              />
            </div>
            <div
              // id="drawer-bottom-example"
              // className="privacy-policy  fixed rounded-lg   p-2 transition-transform bg-[#000] border border-[#4753EA]  "
              // tabIndex="-1"
              // aria-labelledby="drawer-bottom-label"
              style={{
                // Adjust the width according to your requirement
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflowX: "auto",
                // height: "70%",
                WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS devices
                scrollbarWidth: "none", // Hide scrollbar for Firefox
                msOverflowStyle: "none", // Hide scrollbar for IE and Edge
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
                className="flex  mb-2 p-2 "
              >
                <p style={{ color: "#FFF" }}>Terms of Service </p>
                <p style={{ color: "#FFF", fontSize: 12, marginTop: 10 }}>
                  These Terms of Service ("Terms") govern your use of Vinedo
                  ("the App"), including all related services and content
                  provided by Vinedo ("the Company"). By accessing or using the
                  App, you agree to be bound by these Terms. If you do not agree
                  to these Terms, you may not use the App.
                </p>
                {/* <p style={{color:"#FFF",marginTop:10,marginBottom:10}} >Terms of Service</p> */}
                <div style={{ color: "#FFF" }}>
                  <h2>1. Use of the App</h2>
                  <ul>
                    <li>
                      <h3>1.1. Eligibility:</h3>
                      <p style={{ fontSize: "12px" }}>
                        You must be at least 18 years old to use the App. By
                        using the App, you represent and warrant that you are of
                        legal age to form a binding contract with the Company
                        and meet all eligibility requirements.
                      </p>
                    </li>
                    <li>
                      <h3>1.2. User Account:</h3>
                      <p style={{ fontSize: "12px" }}>
                        You may be required to create an account to access
                        certain features of the App. You are solely responsible
                        for maintaining the confidentiality of your account
                        credentials and for all activities that occur under your
                        account. You agree to notify the Company immediately of
                        any unauthorized use of your account or any other breach
                        of security.
                      </p>
                    </li>
                    <li>
                      <h3>1.3. Prohibited Conduct:</h3>
                      <p style={{ fontSize: "12px" }}>
                        You agree not to engage in any prohibited conduct while
                        using the App, including but not limited to:
                      </p>
                      <ul>
                        <li>
                          Violating any applicable laws, regulations, or
                          third-party rights.
                        </li>
                        <li>
                          Using the App for any unlawful or fraudulent purpose.
                        </li>
                        <li>
                          Interfering with or disrupting the operation of the
                          App or its servers.
                        </li>
                      </ul>
                    </li>
                  </ul>

                  <h2>2. Content and Intellectual Property</h2>
                  <ul>
                    <li>
                      <h3>2.1. Ownership:</h3>
                      <p style={{ fontSize: "12px" }}>
                        The App and all content, features, and functionality are
                        owned by the Company or its licensors and are protected
                        by copyright, trademark, and other intellectual property
                        laws. You may not reproduce, modify, distribute, or
                        create derivative works based on the App without the
                        Company's prior written consent.
                      </p>
                    </li>
                    <li>
                      <h3>2.2. User Content:</h3>
                      <p style={{ fontSize: "12px" }}>
                        You may have the opportunity to submit, post, or upload
                        content to the App ("User Content"). By submitting User
                        Content, you grant the Company a non-exclusive,
                        royalty-free, perpetual, irrevocable, and fully
                        sublicensable right to use, reproduce, modify, adapt,
                        publish, translate, distribute, and display such User
                        Content throughout the world in any media.
                      </p>
                    </li>
                    <li>
                      <h3>2.3. Third-Party Content:</h3>
                      <p style={{ fontSize: "12px" }}>
                        The App may contain links to third-party websites or
                        services that are not owned or controlled by the
                        Company. The Company has no control over, and assumes no
                        responsibility for, the content, privacy policies, or
                        practices of any third-party websites or services.
                      </p>
                    </li>
                  </ul>

                  <h2>3. Financial Transactions</h2>
                  <ul>
                    <li>
                      <h3>3.1. Payment Terms:</h3>
                      <p style={{ fontSize: "12px" }}>
                        Certain features of the App may require payment of fees.
                        By using these features, you agree to pay all applicable
                        fees as described in the App. All fees are
                        non-refundable unless otherwise specified.
                      </p>
                    </li>
                    <li>
                      <h3>3.2. Authorization:</h3>
                      <p style={{ fontSize: "12px" }}>
                        By providing payment information to the App, you
                        authorize the Company to charge your chosen payment
                        method for all applicable fees. You represent and
                        warrant that you are authorized to use the payment
                        method provided and that all payment information is
                        accurate and up to date.
                      </p>
                    </li>
                    <li>
                      <h3>3.3. Disputes:</h3>
                      <p style={{ fontSize: "12px" }}>
                        If you have any disputes regarding billing or payment,
                        you agree to contact the Company promptly to attempt to
                        resolve the issue. Failure to notify the Company of any
                        billing disputes within 2 days of the disputed
                        transaction will constitute your acceptance of such
                        charges.
                      </p>
                    </li>
                  </ul>

                  <h2>4. Disclaimer of Warranties</h2>
                  <ul>
                    <li>
                      <h3>4.1. No Warranty:</h3>
                      <p style={{ fontSize: "12px" }}>
                        The app is provided "as is" and "as available" without
                        warranty of any kind, express or implied. To the fullest
                        extent permitted by applicable law, the Company
                        disclaims all warranties, express or implied, including
                        but not limited to implied warranties of
                        merchantability, fitness for a particular purpose, and
                        non-infringement of proprietary rights.
                      </p>
                    </li>
                  </ul>

                  <h2>5. Limitation of Liability</h2>
                  <ul>
                    <li>
                      <h3>5.1. Exclusion of Damages:</h3>
                      <p style={{ fontSize: "12px" }}>
                        In no event will the Company or its affiliates,
                        officers, employees, agents, partners, or licensors be
                        liable for any indirect, incidental, special,
                        consequential, or punitive damages arising out of or in
                        connection with your use of the app, including but not
                        limited to damages for loss of profits, goodwill, use,
                        data, or other intangible losses, even if the Company
                        has been advised of the possibility of such damages.
                      </p>
                    </li>
                  </ul>

                  <h2>6. Indemnification</h2>
                  <ul>
                    <li>
                      <h3>6.1. Indemnity:</h3>
                      <p style={{ fontSize: "12px" }}>
                        You agree to indemnify, defend, and hold harmless the
                        Company and its affiliates, officers, employees, agents,
                        partners, and licensors from and against any and all
                        claims, liabilities, damages, losses, costs, expenses,
                        or fees (including reasonable attorneys' fees) arising
                        out of or in connection with your use of the App, your
                        violation of these Terms, or your violation of any
                        rights of a third party.
                      </p>
                    </li>
                  </ul>

                  <h2>7. Governing Law and Dispute Resolution</h2>
                  <ul>
                    <li>
                      <h3>7.1. Governing Law:</h3>
                      <p style={{ fontSize: "12px" }}>
                        These Terms are governed by and construed in accordance
                        with the laws of Croatia, without regard to its conflict
                        of law principles.
                      </p>
                    </li>
                    <li>
                      <h3>7.2. Dispute Resolution:</h3>
                      <p style={{ fontSize: "12px" }}>
                        Any dispute arising out of or in connection with these
                        Terms or the App shall be resolved exclusively by
                        binding arbitration conducted in accordance with the
                        rules of the Croatian Arbitration Association of
                        Croatian Arbitration Association. The arbitration shall
                        take place in Croatia, and the language of the
                        arbitration shall be Croatian.
                      </p>
                    </li>
                    <li>
                      <h3>7.3. Enforceability of Arbitration Award:</h3>
                      <p style={{ fontSize: "12px" }}>
                        The arbitrator's award shall be final and binding, and
                        judgment on the arbitration award may be entered in any
                        court of competent jurisdiction. The prevailing party
                        shall be entitled to recover its reasonable attorneys'
                        fees and costs incurred in connection with the
                        arbitration.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {Policy === true && (
        <div
          id="drawer-bottom-example"
          className="fixed rounded-t-lg top-0  p-2 transition-transform  bg-[#000000] h-screen "
          tabIndex="-1"
          // aria-labelledby="drawer-bottom-label"
          style={{
            width: "400px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            opacity: 0.8,
          }}
        >
          <div
            id="drawer-bottom-example"
            className="privacy-policy  fixed rounded-lg   p-2 transition-transform bg-[#000] border border-[#4753EA]  "
            tabIndex="-1"
            aria-labelledby="drawer-bottom-label"
            style={{
              width: "300px", // Adjust the width according to your requirement
              display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              overflowX: "auto",
              height: "70%",
              WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS devices
              scrollbarWidth: "none", // Hide scrollbar for Firefox
              msOverflowStyle: "none", // Hide scrollbar for IE and Edge
              flexDirection: "column",
            }}
          >
            <div
              style={{
                // position:"absolute",top: 5,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <p></p>
              <img
                onClick={() => {
                  setPolicy(false);
                }}
                src="Clo.png"
                alt=""
                style={{
                  cursor: "pointer",
                  height: 20,
                  width: 20,

                  // position: "absolute",
                  // top: 5,
                  // right: 5,
                }}
              />
            </div>
            <div
              // id="drawer-bottom-example"
              // className="privacy-policy  fixed rounded-lg   p-2 transition-transform bg-[#000] border border-[#4753EA]  "
              // tabIndex="-1"
              // aria-labelledby="drawer-bottom-label"
              style={{
                // Adjust the width according to your requirement
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflowX: "auto",
                // height: "70%",
                WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS devices
                scrollbarWidth: "none", // Hide scrollbar for Firefox
                msOverflowStyle: "none", // Hide scrollbar for IE and Edge
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
                className="flex  mb-2 p-2 "
              >
                <p style={{ color: "#FFF" }}>Privacy Policy </p>

                {/* <p style={{color:"#FFF",marginTop:10,marginBottom:10}} >Terms of Service</p> */}
                <div style={{ color: "#FFF" }}>
                  <h2>Last Updated: 03/27/2024</h2>
                  <p style={{ fontSize: "12px" }}>
                    Welcome to Vinedo! This privacy policy explains how we
                    collect and protect your personal information when you use
                    our services.
                  </p>
                  <ul>
                    <li>
                      <h3>1. Information Collected</h3>
                      <p style={{ fontSize: "12px" }}>
                        We collect certain personal information from you when
                        you use our web app, including: Information you provide
                        when you sign up for an account, such as your name and
                        email address. Information collected automatically, such
                        as your IP address, browser type, and device
                        information.
                      </p>
                    </li>
                    <li>
                      <h3>2. Use of Information</h3>
                      <p style={{ fontSize: "12px" }}>
                        We use the information we collect for the following
                        purposes: To communicate with you about your account,
                        transactions, and updates to our services. To analyze
                        usage trends and improve the functionality and user
                        experience of our web app.
                      </p>
                    </li>
                    <li>
                      <h3>3. Third-Party Services</h3>
                      <p style={{ fontSize: "12px" }}>
                        We may use third-party payment processors to process
                        payments and subscriptions on our behalf. However, we do
                        not store or retain your bank account details on our
                        servers.
                      </p>
                    </li>
                    <li>
                      <h3>4. Data Security</h3>
                      <p style={{ fontSize: "12px" }}>
                        We take reasonable measures to protect your personal
                        information from unauthorized access, disclosure,
                        alteration, or destruction.
                      </p>
                    </li>
                    <li>
                      <h3>6. Changes to the Privacy Policy</h3>
                      <p style={{ fontSize: "12px" }}>
                        We may update this privacy policy from time to time to
                        reflect changes in our practices or legal requirements.
                        We will notify you of any material changes by posting
                        the updated policy on our website.
                      </p>
                    </li>
                    <li>
                      <h3>7. Contact Us</h3>
                      <p style={{ fontSize: "12px" }}>
                        If you have any questions, concerns, or requests
                        regarding your privacy or our privacy practices, please
                        contact us at business@vinedoco.com.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Shareprofile;

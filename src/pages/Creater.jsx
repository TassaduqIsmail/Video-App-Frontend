import React, { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import { API } from "../Api/apis";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
// import ReactStars from "react-rating-stars-component";
import ClipLoader from "react-spinners/ClipLoader";

// Modal.setAppElement("#root");
function Creater() {
  const [button, Setbutton] = useState({
    pic: true,
    video: false,
  });
  const location = useLocation();
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  const currentdata = location?.state?.userData;
  localStorage.setItem(
    "currentdata",
    JSON.stringify(location?.state?.userData)
  );
  console.log("daat", currentdata);
  const [userName, setUserName] = useState(location?.state?.userData);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentVideo, setCurrentVideo] = useState([]);
  const [subStaus, setSubStatus] = useState("");
  const [isBool, setBool] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0.0);
  const [averageRating, setAverageRating] = useState(0.0);
  const [billid, setBillId] = useState(0.0);
  const [subTotal, setSubTotal] = useState([]);

  useEffect(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/");
    }
  }, [subStaus]);
  useEffect(() => {
    setTimeout(() => {
      setBool(true);
    }, 2500);
  }, []);
  console.log(subStaus);
  const fetchSubTotal = async (item) => {
    try {
      const uid = await localStorage.getItem("uid");

      const response = await axios.get(API.PAYMENT.GET_SUB_STATUS);
      const subData = response?.data?.data;
      console.log("Subscribers", subData);

      const countSub = subData.filter(
        (item) =>
          item?.creatorId === currentdata?.uid && item?.subStatus == "subscribe"
      );
      //  console.log("sahdasjhdashasjh", countSub); // <-- Corrected this line from console.log(item);

      setSubTotal(countSub);
      // console.log("countSub", countSub, location?.state?.userData?.uid);
    } catch (error) {
      // console.log(error.message);
    }
  };
  // console.log("swdksefhfhsfhheruiuheuitheruiherifyeryfgery", subTotal);
  useEffect(() => {
    let totalImageLikes = 0;
    let totalImageRating = 0;
    let ratingLength = 0;

    currentImages?.forEach((image) => {
      // console.log("current image data", image);
      if (typeof image?.likes === "number" && !isNaN(image.likes)) {
        totalImageLikes += image.likes;
      }
      ratingLength = image?.rating?.length || 0;
      if (ratingLength > 0) {
        totalImageRating +=
          image?.rating.reduce((acc, curr) => acc + curr.rate, 0) /
          ratingLength;
      }
    });

    // console.log("totalImageLikessadsasda", totalImageRating);

    const averageImageRating =
      ratingLength === 0 ? 0 : totalImageRating / ratingLength;
    // console.log("averageImageRating", averageImageRating);

    let totalVideoLikes = 0;
    let totalVideoRating = 0;
    let ratingVideoLength = 0;

    currentVideo.forEach((video) => {
      // console.log("current video data", video);
      // Check if likes exist and are valid numbers
      if (typeof video?.likes === "number" && !isNaN(video.likes)) {
        totalVideoLikes += video.likes;
      }

      ratingVideoLength = video?.rating?.length || 0;

      if (ratingVideoLength > 0) {
        totalVideoRating +=
          video?.rating.reduce((acc, curr) => acc + curr?.rate, 0) /
          ratingVideoLength;
      }
    });

    // console.log("totalVideoLikes", totalVideoLikes);

    // Calculate average rating for videos
    const averageVideoRating =
      ratingVideoLength === 0 ? 0 : totalVideoRating / ratingVideoLength;
    // console.log("averageVideoRating", averageVideoRating);

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
    fetchSubTotal();
    const billId = localStorage.getItem("billid");
    // setToltalSubcribe(formattedSubscribe);
    // getSubscriberData();
  }, [currentImages, currentVideo]);

  useEffect(() => {
    const getAssets = async () => {
      await axios
        .get(`${API.IMAGE_VIDEO.GET_ASSETS}`)
        .then((response) => {
          // console.log('assets data', response.data);

          const filteredData = response?.data?.filter(
            (item) => item?.uid === location?.state?.userData?.uid
          );
          //  console.log('assets', filteredData);
          if (filteredData) {
            const images = filteredData.filter(
              (item) => item?.pic_format == "jpg" || item?.pic_format == "png"
            );
            //  console.log('img', images);
            const videos = filteredData.filter(
              (item) => item?.pic_format == "mp4"
            );
            // console.log("images", videos);
            const picData = images.map((item) => {
              return {
                format: item?.pic_format,
                pubId: item?.pic_public_id,
                pic_url: item?.pic_url,
                id: item?._id,
                likes: item.likes,
                rating: item?.ratings,
                view: item?.views,
                likedBy: item?.likedBy,
              };
            });
            const videoData = videos.map((item) => {
              return {
                format: item?.pic_format,
                pubId: item?.pic_public_id,
                pic_url: item?.pic_url,
                id: item?._id,
                likes: item.likes,
                rating: item?.ratings,
                view: item?.views,
                likedBy: item?.likedBy,
              };
            });
            setCurrentImages(picData);
            setCurrentVideo(videoData);
          }
        })
        .catch((error) => {
          console.error("Axios POST  request error:", error);
        });
    };

    getAssets();
  }, [subStaus]);

  useEffect(() => {
    const getSubscriberData = async () => {
      try {
        const uid = await localStorage.getItem("uid");
        const cid = await localStorage.getItem("pid");
        // console.log("cicccccccc", cid);
        // console.log("user", uid);
        setLoading(false);
        await axios
          .get(`${API.PAYMENT.GET_SUB_STATUS}`)
          .then((response) => {
            const subData = response?.data?.data;
            console.log("sub data", subData);
            const subFilter = subData?.filter(
              (item) =>
                item?.subcriberId === uid &&
                item?.subStatus == "subscribe" &&
                item?.creatorId === cid
            );

            setLoading(false);

            console.log("subfilter", subFilter?.length);
            setBillId(subFilter[0]?._id || "");
            setSubStatus(subFilter[0]?.subStatus || "");

            // setBool(subFilter?.length > 0 ? true : false);
          })
          .catch((error) => {
            console.error("Axios POST sub requet error:", error);
          });
      } catch (error) {
        console.error(" sub request error:", error);
      }
    };

    getSubscriberData();
  }, [subStaus]);

  const unsubscribe = async () => {
    try {
      const status = {
        paymentStatus: "payment remove",
        subStatus: "unsubscribe",
      };
      const response = await axios.put(
        `${API.PAYMENT.UPDATE_SUB_STATUS}/${billid}`,
        status
      );
      // console.log("|asjdhsjdhjk", response.data);
      if (response.data.succes) {
        toast.show("Successfull unSubscribe");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const shareProfile = (data) => {
    // Logic to share the profile, could be via email, social media, etc.
    // Example: You can use the Web Share API to share content
    // console.log("data", data);
    if (navigator.share) {
      navigator
        .share({
          title: `${currentdata?.name}'s Profile`,
          text: `Check out ${currentdata?.name}'s profile on our website!`,
          url: `${window.location.href}/${currentdata?._id}`,
        })
        .then(() => console.log("Profile shared successfully"))
        .catch((error) => console.error("Error sharing profile:", error));
    } else {
      // Fallback if Web Share API is not supported
      toast("Profile sharing is not supported on this browser.");
    }
  };

  // console.log(totalLikes);
  const [isModalVisible3, setisModalVisible3] = useState(false);

  // const MyModal = ({ isModalVisible3, subStaus, location, totalLikes, subTotal, averageRating, unsubscribe, navigate, currentdata }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const calculateModalSize = () => {
    const width = Math.min(window.innerWidth * 0.9, 390); // Modal width is 90% of viewport width or maximum of 390px
    const height = Math.min(window.innerHeight * 0.9, 500); // Modal height is 90% of viewport height or maximum of 500px
    return { width: `${width}px`, height: `${height}px` };
  };
  return (
    <div
      style={{ width: "100%" }}
      //  className="p-2"
    >
      <Appbar />
      <Modal
        isOpen={isModalVisible3}
        onRequestClose={() => setisModalVisible3(false)}
        style={{
          content: {
            ...calculateModalSize(),
            // height: "600px",
            // width: "fit-content",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#110E0F",
            borderWidth: 2,
            borderColor: "#4753EA",
            borderRadius: 10,
            padding: "20px 10px 20px 10px",

            overflow: "hidden ", // Enable scrolling if content exceeds modal height
          },
        }}
      >
        <div className="" style={{ width: "80%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={
                    location?.state?.userData?.pic_url ||
                    "https://i.pinimg.com/280x280_RS/77/0f/b7/770fb75f5e81e4c2dbe8934f246aeeab.jpg"
                  }
                  style={{
                    height: "20vw" /* 20% of the viewport width */,
                    width: "20vw" /* 20% of the viewport width */,
                    maxWidth: "200px" /* Limit maximum width to 200px */,
                    maxHeight: "200px" /* Limit maximum height to 200px */,
                    borderRadius: "50%" /* Make the image round */,
                  }}
                  alt="User Image"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <p className="text-white font-thin  text-lg">
                  {location?.state?.userData?.name}
                </p>
                <p className="text-[#a1a3a7] font-thin text-xs ">
                  {location?.state?.userData?.username}
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "white" }}>
                {totalLikes === "NaN" ? 0 : totalLikes}
              </p>
              <p style={{ color: "white" }}>Likes</p>
            </div>
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "white" }}>{subTotal?.length || 0}</p>
              <p style={{ color: "white" }}>Subscribers</p>
            </div>
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "white" }}>{averageRating?.toFixed(2) || 0}</p>
              <p style={{ color: "white" }}>Rating</p>
            </div>
          </div>
          <div className="subscription-options">
            <p>By subscribing you get:</p>
            <div
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: "flex",
              }}
            >
              {subStaus && (
                <img
                  src="red.png"
                  style={{ height: 10, width: 10 }}
                  alt="Checkmark Icon"
                />
              )}
              <p style={{ color: "#FFF", marginLeft: 8 }}>See user's posts</p>
            </div>
            <div
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: "flex",
              }}
            >
              {subStaus && (
                <img
                  src="red.png"
                  style={{ height: 10, width: 10 }}
                  alt="Checkmark Icon"
                />
              )}
              <p style={{ color: "#FFF", marginLeft: 8 }}>See user's content</p>
            </div>
            <div
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: "flex",
              }}
            >
              {subStaus && (
                <img
                  src="red.png"
                  style={{ height: 10, width: 10 }}
                  alt="Checkmark Icon"
                />
              )}
              <p style={{ color: "#FFF", marginLeft: 8 }}>
                Participate in user's activity
              </p>
            </div>
          </div>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: "5%",
              width: "100%",
              marginTop: 15,
            }}
          >
            {subStaus !== "subscribe" ? (
              <button
                style={{
                  color: "green",
                  borderWidth: 2,
                  padding: "5px 20px 5px 20px",
                  // paddingVertical: 5,
                  alignItems: "center",
                  borderRadius: 30,
                  borderWidth: 3,
                  // marginLeft:10,
                  borderColor: "green",
                }}
                onClick={() => {
                  navigate("/checkPayment", {
                    state: { currentdata: currentdata },
                  });
                  window.location.reload();
                }}
              >
                subscribe
              </button>
            ) : (
              <button
                style={{
                  color: "red",
                  borderWidth: 2,
                  padding: "5px 20px 5px 20px",
                  // paddingVertical: 5,
                  alignItems: "center",
                  borderRadius: 30,
                  borderWidth: 3,
                  // marginLeft:10,
                  borderColor: "red",
                }}
                onClick={() => {
                  unsubscribe();
                  window.location.reload();
                }}
              >
                Unsubscribe
              </button>
            )}
            <button
              onClick={() => setisModalVisible3(false)}
              style={{
                padding: 10,
                padding: "5px 20px 5px 20px",
                alignItems: "center",
                borderRadius: 30,
                borderWidth: 3,
                borderColor: "#4753EA",
                color: "white",
                fontSize: 17,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <center>
        <br />

        <div className="rounded-full h-28 w-28">
          <img
            src={
              location?.state?.userData?.pic_url ||
              "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
            }
            className="mt-5 rounded-full"
            style={{ height: "100%", width: "100%" }}
            alt=""
          />
        </div>

        <p className="text-white font-thin  text-lg">
          {location?.state?.userData?.name}
        </p>
        <p className="text-[#a1a3a7] font-thin text-xs ">
          {location?.state?.userData?.username}
        </p>

        <div className="flex justify-center gap-10 mt-10">
          <div>
            <p className="text-white">
              {totalLikes === "NaN" ? 0 : totalLikes}
            </p>
            <p className="text-[#a1a3a7] font-extralight">Likes</p>
          </div>

          <div>
            <p className="text-white font-bold">{subTotal?.length || 0}</p>
            <p className="text-[#a1a3a7] font-extralight ">Subscribers</p>
          </div>

          <div>
            <p className="text-white font-bold">
              {averageRating ? averageRating.toFixed(2) : 0}
            </p>
            <p className="text-[#a1a3a7] font-extralight">Rating</p>
          </div>
        </div>
      </center>

      <div className="flex  justify-center gap-10 mt-8">
        <button
          onClick={() => {
            setisModalVisible3(true);
            // console.log("subStaus", subStaus);
          }}
          type="button"
          className="text-white border border-[#4753ea] text-sm font-thin py-1 p-4 rounded-full"
        >
          {subStaus === "subscribe" ? "Unsubscribe" : "Subscribe"}
        </button>

        <a
          onClick={shareProfile}
          type="button"
          style={{ cursor: "pointer" }}
          className="text-white border border-[#4753ea] text-sm font-thin py-1 p-4 rounded-full"
        >
          Share profile
        </a>
      </div>

      <div className="flex  justify-center gap-10 mt-8">
        <button
          type="button"
          onClick={() => Setbutton({ pic: true, video: false })}
          className={
            button.pic
              ? "text-white border-b  border-b-white text-sm font-thin py-1 p-4 "
              : "text-white  text-sm font-thin py-1 p-4 "
          }
        >
          <img src="gridicon.png" alt="" className="pb-3" />
        </button>

        <button
          type="button"
          onClick={() => Setbutton({ pic: false, video: true })}
          className={
            button.video
              ? "text-white border-b  border-b-white text-sm font-thin py-1 p-4 "
              : "text-white  text-sm font-thin py-1 p-4 "
          }
        >
          <img src="reelsicon.png" alt="" className="pb-3" />
        </button>
      </div>

      {isBool &&
        (subStaus !== "subscribe" ? (
          <div
            style={{
              borderWidth: "2px",
              borderColor: "#4753EA",
              padding: "10px",
              width: "95%",
              margin: "10px",
              marginTop: "10px",
              alignSelf: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.875 0.875H9.125C9.32391 0.875 9.51468 0.954018 9.65533 1.09467C9.79598 1.23532 9.875 1.42609 9.875 1.625V8.375C9.875 8.57391 9.79598 8.76468 9.65533 8.90533C9.51468 9.04598 9.32391 9.125 9.125 9.125H0.875C0.676087 9.125 0.485322 9.04598 0.34467 8.90533C0.204018 8.76468 0.125 8.57391 0.125 8.375V1.625C0.125 1.42609 0.204018 1.23532 0.34467 1.09467C0.485322 0.954018 0.676087 0.875 0.875 0.875ZM0.875 1.625V6.44141L2.09703 5.21984C2.16668 5.15018 2.24936 5.09492 2.34037 5.05722C2.43138 5.01952 2.52892 5.00011 2.62742 5.00011C2.72593 5.00011 2.82347 5.01952 2.91447 5.05722C3.00548 5.09492 3.08817 5.15018 3.15781 5.21984L4.09531 6.15734L6.15781 4.09484C6.29845 3.9543 6.48914 3.87535 6.68797 3.87535C6.8868 3.87535 7.07749 3.9543 7.21812 4.09484L9.125 6.00172V1.625H0.875ZM9.125 7.0625L6.6875 4.625L2.9375 8.375H9.125V7.0625ZM0.875 8.375H1.87672L3.56422 6.6875L2.62672 5.75L0.875 7.50219V8.375ZM4.25 3.6875C4.25 3.57625 4.21701 3.46749 4.1552 3.37499C4.09339 3.28249 4.00554 3.21039 3.90276 3.16782C3.79998 3.12524 3.68688 3.1141 3.57776 3.13581C3.46865 3.15751 3.36842 3.21109 3.28975 3.28975C3.21109 3.36842 3.15751 3.46865 3.13581 3.57776C3.1141 3.68688 3.12524 3.79998 3.16782 3.90276C3.21039 4.00554 3.28249 4.09339 3.37499 4.1552C3.46749 4.21701 3.57625 4.25 3.6875 4.25C3.83668 4.25 3.97976 4.19074 4.08525 4.08525C4.19074 3.97976 4.25 3.83668 4.25 3.6875Z"
                      fill="#A1A3A7"
                    />
                  </svg>
                  <span style={{ color: "#FFF", marginLeft: "3px" }}>
                    {currentImages.length ? currentImages.length : 0}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "10%",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5625 0.25C1.1481 0.25 0.750671 0.41462 0.457646 0.707646C0.16462 1.00067 0 1.3981 0 1.8125V6.1875C0 6.6019 0.16462 6.99933 0.457646 7.29235C0.750671 7.58538 1.1481 7.75 1.5625 7.75H5.9375C6.3519 7.75 6.74933 7.58538 7.04235 7.29235C7.33538 6.99933 7.5 6.6019 7.5 6.1875V5.578L8.99025 6.742C9.40075 7.0625 10 6.77 10 6.2495V1.7505C10 1.23 9.40075 0.9375 8.99025 1.258L7.5 2.422V1.8125C7.5 1.3981 7.33538 1.00067 7.04235 0.707646C6.74933 0.41462 6.3519 0.25 5.9375 0.25H1.5625ZM7.5 3.215L9.375 1.7505V6.2495L7.5 4.785V3.215ZM6.875 1.8125V6.1875C6.875 6.31061 6.85075 6.43252 6.80364 6.54627C6.75652 6.66001 6.68747 6.76336 6.60041 6.85041C6.51336 6.93747 6.41001 7.00652 6.29627 7.05364C6.18252 7.10075 6.06061 7.125 5.9375 7.125H1.5625C1.31386 7.125 1.0754 7.02623 0.899587 6.85041C0.723772 6.6746 0.625 6.43614 0.625 6.1875V1.8125C0.625 1.56386 0.723772 1.3254 0.899587 1.14959C1.0754 0.973772 1.31386 0.875 1.5625 0.875H5.9375C6.06061 0.875 6.18252 0.899249 6.29627 0.946363C6.41001 0.993477 6.51336 1.06253 6.60041 1.14959C6.68747 1.23664 6.75652 1.33999 6.80364 1.45373C6.85075 1.56748 6.875 1.68939 6.875 1.8125Z"
                      fill="#A1A3A7"
                    />
                  </svg>
                  <span style={{ color: "#FFF", marginLeft: "3px" }}>
                    {currentVideo.length ? currentVideo.length : 0}
                  </span>
                </div>
              </div>
              <div>
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 8 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.3075 9.5C1.08417 9.5 0.893667 9.42133 0.736 9.264C0.578667 9.10667 0.5 8.91617 0.5 8.6925V4.3075C0.5 4.08417 0.578667 3.89367 0.736 3.736C0.893333 3.57867 1.08383 3.5 1.3075 3.5H2V2.5C2 1.943 2.194 1.47033 2.582 1.082C2.97 0.693667 3.44267 0.499667 4 0.5C4.557 0.5 5.02967 0.694 5.418 1.082C5.80633 1.47 6.00033 1.94267 6 2.5V3.5H6.6925C6.91583 3.5 7.10633 3.57867 7.264 3.736C7.42133 3.89333 7.5 4.08383 7.5 4.3075V8.6925C7.5 8.91583 7.42133 9.10633 7.264 9.264C7.10667 9.42133 6.91617 9.5 6.6925 9.5H1.3075ZM1.3075 9H6.6925C6.78217 9 6.85583 8.97117 6.9135 8.9135C6.97117 8.85583 7 8.78217 7 8.6925V4.3075C7 4.21783 6.97117 4.14417 6.9135 4.0865C6.85583 4.02883 6.78217 4 6.6925 4H1.3075C1.21783 4 1.14417 4.02883 1.0865 4.0865C1.02883 4.14417 1 4.21783 1 4.3075V8.6925C1 8.78217 1.02883 8.85583 1.0865 8.9135C1.14417 8.97117 1.21783 9 1.3075 9ZM4 7.25C4.211 7.25 4.38867 7.17767 4.533 7.033C4.67767 6.88867 4.75 6.711 4.75 6.5C4.75 6.289 4.67767 6.11133 4.533 5.967C4.38867 5.82233 4.211 5.75 4 5.75C3.789 5.75 3.61133 5.82233 3.467 5.967C3.32233 6.11133 3.25 6.289 3.25 6.5C3.25 6.711 3.32233 6.88867 3.467 7.033C3.61133 7.17767 3.789 7.25 4 7.25ZM2.5 3.5H5.5V2.5C5.5 2.08333 5.35417 1.72917 5.0625 1.4375C4.77083 1.14583 4.41667 1 4 1C3.58333 1 3.22917 1.14583 2.9375 1.4375C2.64583 1.72917 2.5 2.08333 2.5 2.5V3.5Z"
                    fill="#A1A3A7"
                  />
                </svg>
              </div>
            </div>
            <div
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                alignSelf: "center",
                display: "flex",
              }}
            >
              <button
                onClick={() => setisModalVisible3(true)}
                style={{
                  backgroundColor: "#4753EA",
                  padding: "10px",
                  borderRadius: "30px",
                  marginTop: "5%",
                }}
              >
                <span style={{ color: "#FFF", fontSize: "16px" }}>
                  Subscribe to see creator's posts
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              {button.pic &&
                currentImages?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate("/Createrpic", {
                        state: {
                          item,
                          data: location?.state?.userData?.pic_url,
                        },
                      })
                    }
                    key={index}
                  >
                    <img
                      src={item?.pic_url}
                      style={{ height: "130px", width: "130px" }}
                      alt=""
                    />
                  </div>
                ))}
            </div>
            <div
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
                  // console.log("items", item),
                  <div
                    onClick={() =>
                      navigate("/ShowVideo", { state: { item: item } })
                    }
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <video
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from reaching the div
                        navigate("/creatotVideo", {
                          state: {
                            item,
                            data: location?.state?.userData?.pic_url,
                          },
                        });
                      }}
                      style={{
                        height: "130px",
                        width: "130px",
                        objectFit: "cover",
                      }}
                    >
                      <source src={item?.pic_url} type="video/mp4" />
                    </video>

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
            {/* <div
      style={{
        display: "flex",
        // gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        // gap: "0.5rem",
        marginTop: 10,
      }}
    >
      {button.pic &&
        currentImages?.map((item, index) => (
          <div
            onClick={() => navigate("/Createrpic", { state: { item } })}
            key={index}
            style={{}}
          >
            <img
              src={item?.pic_url}
              style={{ height: "130px", width: "120px" }}
              alt=""
            />
          </div>
        ))}
    </div>
    
    <div
      style={{
        display: "flex",
        // gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        // gap: "0.5rem",
        marginTop: 10,
      }}
    >
      {button.video &&
        currentVideo?.map((item, index) => (
          <div key={index} style={{}}>
            <video
              style={{
                height: "130px",
                width: "120px",
              }}
              controls
            >
              <source src={item?.pic_url} type="video/mp4" />
            </video>
          </div>
        ))}
    </div> */}
          </div>
        ))}

      <ToastContainer />
    </div>
  );
}

export default Creater;

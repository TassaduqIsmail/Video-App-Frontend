import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// import { Rating } from "react-native-ratings";
import ReactStars from "react-rating-stars-component";
import {
  updateLikes,
  updateRating,
  updateViews,
} from "../components/savingPicsAndVideosData";
import Modal from "react-modal";
const Createrpic = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [like, setlike] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/");
    }
  }, []);

  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [checkRating, setCheckRating] = useState(false);
  const [likes, setlikes] = useState(location.state?.item?.likes || 0);
  const [RatedByCurrentUser, setRatedByCurrentUser] = useState(false);
  const [impression, setImpression] = useState(location.state?.item?.view || 0);
  const [viewed, setViewed] = useState(false);
  const [tap, setTap] = useState(false);

  console.log("location.state?.item?.pic_iddsdsdsdsdf", location.state?.data);
  const handleLikes = async () => {
    setlike(!like);
    console.log("likes", likes);
    if (!like) {
      setlikes(likes + 1);
      // handleRate()
    } else {
      setlikes(likes - 1);
      // handleRate()
    }
    console.log("location.state?.item?.pic_id", location.state?.item);
    await updateLikes(location.state?.item?.id, !like);
  };

  useEffect(() => {
    updateRating(location.state?.item?.id, rating);
  }, [rating]);

  //   console.log("Showpic",location.state)

  useEffect(() => {
    if (!viewed) {
      updateViews(location.state?.item?.id);
      setViewed(true);
      setImpression(impression + 1);
    }
  }, []);
  const goBack = () => {
    window.history.back();
  };

  const fetchlikes = async () => {
    try {
      const uid = await localStorage.getItem("uid");

      if (location.state?.item?.likedBy.includes(uid)) {
        setlike(true);
      } else {
        setlike(false);
      }

      const currentUserRating = location.state?.item?.rating.find(
        (rating) => rating.uid === uid
      );

      console.log("rating", currentUserRating);
      if (currentUserRating) {
        setRatedByCurrentUser(true);
        setRating1(currentUserRating?.rate);
      } else {
        setRatedByCurrentUser(false);
        setRating1(0);
      }
    } catch (error) {
      console.log("likedby fetch error");
    }
  };

  useEffect(() => {
    fetchlikes();
  }, []);

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };
  const calculateModalSize = () => {
    const width = Math.min(window.innerWidth * 0.9, 390); // Modal width is 90% of viewport width or maximum of 390px
    const height = Math.min(window.innerHeight * 0.9, 500); // Modal height is 90% of viewport height or maximum of 500px
    return { width: `${width}px`, height: `${height}px` };
  };

  return (
    <div style={{ width: "400px", height: "100%" }}>
      <div
        onClick={() => setTap(!tap)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", 
        }}
      >
        <img
          src={
            location?.state?.item?.pic_url ||
            "https://static.vecteezy.com/system/resources/thumbnails/025/284/015/small_2x/close-up-growing-beautiful-forest-in-glass-ball-and-flying-butterflies-in-nature-outdoors-spring-season-concept-generative-ai-photo.jpg"
          }
          alt="background"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100vh",
          }}
        />
      </div>
      {tap && (
        <>
          <div
            style={{
              backgroundColor: "#000000",
              opacity: 0.6,
              padding: "10px",
              width: "400px",
              position: "absolute",
              top: 0,
            }}
          >
            <div onClick={goBack}>
              <img src="backicon.png" alt="" />
            </div>
          </div>

          {/* ======================RATING MODAL========================= */}

          <Modal
            isOpen={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
            style={{
              content: {
                //  height: "232px",
                width: "400px",
                border: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                left: "50%",
                bottom: 0,
                // top: "568px",
                transform: "translate(-50%, 0%)",
                backgroundColor: "#110E0F",
                borderWidth: 2,
                borderColor: "#4753EA",
                borderRadius: "10px, 10px, 0px, 0px",
                // padding: "20px 10px 20px 10px",
                inset: "568px 40px 40px 50%",
                overflow: "hidden ", // Enable scrolling if content exceeds modal height
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
              },
            }}
          >
            <div className="" style={{ width: "80%" }}>
              <div
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  // width: "100%",
                  // display: "flex",
                  // justifyContent: "space-between",
                  // flexDirection: "row",
                  // alignItems:'flex-end'
                }}
              >
                <p></p>
                <img
                  onClick={() => {
                    setModalVisible(false);
                  }}
                  src="Clo.png"
                  alt=""
                  style={{
                    cursor: "pointer",
                    height: 20,
                    width: 20,
                  }}
                />
              </div>
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
                      marginBottom: 20,
                    }}
                   >
                    <img
                      src={
                        location.state?.data ||
                        "https://i.pinimg.com/280x280_RS/77/0f/b7/770fb75f5e81e4c2dbe8934f246aeeab.jpg"
                      }
                      style={{
                        height: "13vw" /* 20% of the viewport width */,
                        width: "13vw" /* 20% of the viewport width */,
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
                      Rate your experience!
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "black",
                  alignContent: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={40}
                  isHalf={true}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />
              </div>
            </div>
          </Modal>

          <div
            style={{
              backgroundColor: "#000000",
              opacity: 0.6,
              padding: "10px",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              width: "400px",
              display: "flex",
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            <div
              onClick={() => handleLikes()}
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={
                  like == true
                    ? "https://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png"
                    : "https://www.symbols.com/images/symbol/1809_heart-symbol.png"
                }
                style={{ height: 30 }}
                alt=""
              />
              <p style={{ color: "#FFF", marginLeft: 10 }}>{likes}</p>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={"whiteplayicon.png"} style={{ height: 30 }} alt="" />
              <p style={{ color: "#FFF", marginLeft: 10 }}>{impression}</p>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                onClick={() => {
                  setModalVisible(true);
                }}
                src={
                  RatedByCurrentUser
                    ? "https://static.vecteezy.com/system/resources/thumbnails/020/716/716/small/3d-minimal-star-service-rating-star-award-3d-illustration-free-png.png"
                    : "star.png"
                }
                style={{ height: 30 }}
                alt=""
              />
              <p style={{ color: "#FFF", marginLeft: 10 }}>
                {rating > 0 ? rating : rating1}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Createrpic;

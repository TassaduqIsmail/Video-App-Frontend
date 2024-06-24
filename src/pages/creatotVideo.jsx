
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updateLikes,
  updateRating,
  updateViews,
} from "../components/savingPicsAndVideosData";
import ReactStars from "react-rating-stars-component";
// import { Rating } from "react-native-ratings";

const CreatorVideo = () => {
    const [isModalVisible, setModalVisible] = useState(false);
  const [like, setlike] = useState(false);

  const location = useLocation();
  const navigate= useNavigate()
  useEffect(()=>{
    let uid = localStorage.getItem("uid")
    if(!uid ){
     navigate("/")
    }
   },[])

  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [checkRating, setCheckRating] = useState(false);
  const [likes, setlikes] = useState(location.state?.item?.likes || 0);
  const [RatedByCurrentUser, setRatedByCurrentUser] = useState(false);
  const [impression, setImpression] = useState(location.state?.item?.view || 0);
  const [viewed, setViewed] = useState(false);

  console.log("location.state?.item?.pic_id", location.state?.item);
  const handlelikes = async () => {
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


  return (
    <div style={{ width: "400px", height: "100%" }}>
      <video
        alt="background"
        className="h-screen "
        style={{ width: "400px", height: "850px" }}
        controls
      >
        <source src={location?.state?.item?.pic_url} type="video/mp4" />
      </video>

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
          <img style={{ cursor: "pointer" }} src="backicon.png" alt="" />
        </div>
      </div>
      {isModalVisible === true ? (
        <div
          style={{
            position: "absolute",
            top: "30%",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",

            width: "400px",
          }}
        >
          <div style={{ justifyContent: "space-between" }}>
            <div style={{ height: "30px" }}></div>
            <div
              style={{
                backgroundColor: "#110E0F",
                padding: "20px",
                borderRadius: "30px",

                width: "300px",
                height: "40%",
                borderColor: "#4753EA",
                borderWidth: 1,
              }}
            >
              <div style={{ alignSelf: "flex-end" }}>
                <h2
                  style={{ color: "#fff", float: "right",cursor:"pointer" }}
                  onClick={() => {
                    setModalVisible(false);
                  }}
                >
                  X
                </h2>
              </div>
              {/* <img
      src={require('../../../asset/Images/PNG/Modal.png')}
      alt="modal"
      style={{ alignSelf: 'center' }}
    />   */}
              <span
                style={{
                  color: "#FFF",
                  fontFamily: "Poppins-Regular",
                  fontSize: "20px",
                  alignSelf: "center",
                  marginVertical: "5%",
                }}
              >
                Rate your experience!
              </span>
              <div
                style={{
                  alignItems: "center",
                  marginHorizontal: "5%",
                  justifyContent: "center",
                }}
              >
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
            </div>
          </div>
        </div>
      ) : null}

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
          onClick={() => handlelikes()}
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            color: likes === true ? "red" : "transperent",
          }}
        >
          <img
            src={
              likes == true
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
    </div>
  );
};

export default CreatorVideo;

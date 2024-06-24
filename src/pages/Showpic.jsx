import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// import { Rating } from "react-native-ratings";

const Showpic = () => {
  const location = useLocation();
  console.log("items",location.state?.item?.likes);
  const [isModalVisible, setModalVisible] = useState(false);
  const [like, setLike] = useState(false);
  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [checkRating, setCheckRating] = useState(false);
  const [likes, setlikes] = useState(location.state?.item?.likes || 0);
  const [RatedByCurrentUser, setRatedByCurrentUser] = useState(false);
  const [impression, setImpression] = useState(location.state?.item?.view || 0);
  const [viewed, setViewed] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const navigate= useNavigate()
  useEffect(()=>{
    let uid = localStorage.getItem("uid")
    if(!uid ){
     navigate("/")
    }
   },[])

  console.log("Showpic", location.state);
  //   const renderBar = ({ item, index }) => {
  //     return (
  //       <div onClick={() => {
  //         index === 2 ? toggleModal()
  //           : index === 0 ? setLike(!like) :
  //             null;
  //       }}
  //         style={{
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           flexDirection: 'row',
  //         }}>
  //         {/* <img
  //           src={index === 0 && like === true ? require('../../../asset/Images/Icons/Liked.png') : item.img}
  //           style={{ tintColor: index === 0 && like === true ? "red" : '#FFF', height: '35px', width: '23%' }}
  //           alt="icon"
  //         /> */}
  //         <span style={{ color: '#FFF', paddingLeft: '2%' }}>{item.title}</span>
  //       </div>
  //     );
  //   };
  const goBack = () => {
    window.history.back();
  };

  const fetchlikes = async () => {
    try {
      const uid = await localStorage.getItem("uid");

      if (location.state?.item?.likedBy.includes(uid)) {
        setlikes(true);
      } else {
        setlikes(false);
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

  return (
    <div style={{ width: "400px", height: "100%" }}>
      <img
        src={
          location?.state?.item?.pic_url ||
          "https://static.vecteezy.com/system/resources/thumbnails/025/284/015/small_2x/close-up-growing-beautiful-forest-in-glass-ball-and-flying-butterflies-in-nature-outdoors-spring-season-concept-generative-ai-photo.jpg"
        }
        alt="background"
        // className="h-screen "
      
        style={{width:"400px",  height:"850px"}}
        
      />

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
      <div
        style={{
          backgroundColor: "#000000",
          opacity: 0.6,
          padding: "10px",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          // bottom: 0,
          width:"400px",
          display: "flex",
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        <div
          
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          
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
          <p style={{ color: "#FFF", marginLeft: 10 }}>{likes || 0}</p>
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
          src={
            RatedByCurrentUser
              ? "https://static.vecteezy.com/system/resources/thumbnails/020/716/716/small/3d-minimal-star-service-rating-star-award-3d-illustration-free-png.png"
              : "star.png"
          }
           style={{ height: 30 }} alt="" />
          <p style={{ color: "#FFF", marginLeft: 10 }}>{rating1}</p>
        </div>
      </div>
    </div>
  );
};

export default Showpic;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../Api/apis";
import axios from "axios";

function Statersetyourrate() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("sadjhas", location?.state?.data);
  const [sliderValue, setSliderValue] = useState(0);
  const [Value, setValue] = useState(0);
  console.log("slider", sliderValue.toFixed(2));

  const data = {
    name: location?.state?.data,
    username: location?.state?.userName,
    image: location?.state?.selectedImage,
  };
  console.log(data);
  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  useEffect(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/");
    }
  }, []);

  const handleTextChange = (event) => {
    const { value } = event.target;
    setSliderValue(parseFloat(value));
  };
  const handleFinished = async () => {
    const check = sliderValue ? sliderValue.toFixed(2).toString() : Value;
    const uid = await localStorage.getItem("uid");
    const profileData = {
      uid: uid,
      name: data.name,
      username: data.username,
      price: sliderValue ? sliderValue.toFixed(2).toString() : Value,
      profilePic: data.image,
    };
    console.log("data", profileData);
    if (data == "" && check == "") {
      console.log("nhi hn kuch ");
      // dispatch(setPage(true));
      await location.setItem("profile", JSON.stringify(true));
      // dispatch(fetchProfile());
    } else if (data !== "" || check !== "") {
      console.log("to chl raha hn finish ");
      // dispatch(setIsIntro(true))
      // dispatch(setCheckPage(false))
      try {
        await axios({
          method: "post",
          url: API.PROFILE.SET_PROFILE,
          data: JSON.stringify({ profileData }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => {
            console.log("ahahh", response);
            if (response.data.succes == true) {
              console.log("res", response.data.succes);
              localStorage.setItem("profileUid", response.data.profileId);
              // const check = await updateIsIntroStatus({ isIntro: false })
              // console.log('update status cehck', check);
              // navigation.navigate('Home');
              await localStorage.setItem(
                "profile",
                JSON.stringify(profileData[0]?._id)
              );
              navigate("/shareprofile");
            }
          })
          .catch(function (error) {
            console.log("err", error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

 

  // c
  return (
    <div style={{ width: "400px", height: "100%" }}>
      <center>
        <img src="whitelogo.png" className=" mt-40" alt="" />

        <p className="text-white text-2xl mt-20 font-bold">Set your rate</p>

        <div
          style={{
            flexDirection: "row",
            alignItems: "center",
            display: "flex",
            justifyContent: "space-around",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <span style={styles.sliderValueText}>0 €</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            // value={sliderValue ? sliderValue : ""}
            style={{
              width: "80%",
              height: "5px",
              cursor: "pointer",
              // appearance: 'none',
              // backgroundColor: '#d3d3d3',
              borderRadius: "10px",
              outline: "none",
              // margin: '0 10px',
            }}
          />
          <span style={styles.sliderValueText}>100€</span>
        </div>

        <div
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 2,
            paddingHorizontal: "5%",
            // borderRadius: 10,
            borderColor: "#4753EA",
            width: "40%",
          }}
        >
          <span style={styles.sliderValueText}>€</span>
          <input
            // type="tel"
            maxLength={3}
            style={{
              width: "40px",
              height: "30px",
              padding: "5px",
              // border: "none",
              // borderRadius: "10px",
              outline: "none",
              marginRight: "5px",
              backgroundColor: "black",
              color: "#FFF",
            }}
            value={sliderValue ? sliderValue : ""}
            onChange={handleTextChange}
          />
          <span style={styles.sliderValueText}>/month</span>
        </div>
        <div className="p-5 mt-20">
          <a
            onClick={() => {
              handleFinished();
            }}
            type="submit"
            className="mt-20 h-14 mb-5 text-white font-bold py-2 px-32 rounded-full"
            style={{
              cursor: "pointer",
              backgroundImage: "linear-gradient(to bottom, #3640c2, black)",
            }}
          >
            Finish
          </a>
        </div>
      </center>
    </div>
  );
}
const styles = {
  sliderValueText: {
    fontFamily: "Poppins-Regular",
    color: "#FFF",
    fontSize: 16,
  },
};

export default Statersetyourrate;

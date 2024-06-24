import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  auth, fbProvider, provider } from "../service/config";
import { getAuth, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { API } from "../Api/apis";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";

function Signuppage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the document.referrer is empty
    const directEntry = document.referrer === "";

    // Access the current URL
    const currentUrl = window.location.href;

    console.log("Direct Entry:", directEntry);
    console.log("Current URL:", currentUrl);

    // Optionally, perform actions based on directEntry
    if (directEntry) {
      // Actions to do on direct entry
      console.log("User entered directly or through a bookmark!");
    }
  }, []);
 
  const handleClick = () => {
  
    auth
      .signOut()
      .then(() => {
        console.log("Access revoked successfully");
      })
      .catch((error) => {
        console.error("Error revoking access:", error);
      });
      // auth.app.options.
    provider.setCustomParameters({ prompt: "select_account" });

    provider.addScope("email");
    signInWithPopup(auth, provider)
      .then((data) => {
        // This block will be executed if the user completes the sign-in process successfully.
        console.log(".........", data);
        localStorage.setItem("email", data.user.providerData[0].email);

        const userData = {
          providerName: "google",
          providerUId: data.user?.uid,
          email: data.user.providerData[0].email,
          name: data.user.displayName,
          status: "activate",
        };
        saveCredidentials(userData);
      })
      .catch((error) => {
        // This block will be executed if there's an error during the sign-in process.
        if (error.code === 'auth/popup-closed-by-user') {
          // Handle the case where the user closes the popup without completing sign-in.
          toast.error('User closed the sign-in popup.');
          // You can display a message to the user or handle it as appropriate for your application.
        } else {
          // Handle other sign-in errors.
          toast.error('Sign-in error:', error.message);
          // You can display an error message to the user or handle it as appropriate for your application.
        }
      });
  };

  async function checkCredidentials(userData) {
    try {
      const loginData = {
        email: userData?.email.toLowerCase(),
        password: " ",
        providerUId: userData?.providerUId,
      };
      console.log("loginData", loginData);

      const response = await axios.post(API.USER.LOGIN, loginData);
      console.log("checkCredidentials", response);
      if (response.data?.succes) {
        await localStorage.setItem("uid", response.data.uid);
        await checkProfileAndStatus(response.data.uid);
      }
    } catch (error) {
      // console.error('Error in checkCredidentials:', error);
      return null;
    }
  }

  async function saveCredidentials(userData) {
    try {
      console.log("userData", userData);
      const response = await axios.post(API.USER.SIGNUP, userData);
      // console.log("response", response);
      if (response.data.message === "User registered successfully") {
        toast.success("Register in successfully");
        await localStorage.setItem("uid", response.data.uid);

        checkProfileAndStatus(response.data.uid);
        return "register user";
      } else {
        console.log("first", response.data.message);

        return await checkCredidentials(userData);
      }
    } catch (error) {
      console.error("Error in saveCredidentials:", error);
      return null;
    }
  }

  const checkProfileAndStatus = async (uid) => {
    // const uid = localStorage.getItem("uid");
    console.log(uid);
    await axios
      .get(`${API.USER.GET_USERS_BY_ID}/${uid}`)
      .then(async (response) => {
        // console.log(response.data);
        console.log("uid", uid);
        console.log("profile", response.data.data.status);
        if (response?.data?.data?.status == "activate") {
          toast.success("sign in successfully");
          await axios
            .get(API.PROFILE.GET_ALL_PROFILE)
            .then((response) => {
              console.log(response.data);
              // console.log('uid', uid);
              const profileData = response?.data?.data?.filter(
                (item) => item?.uid === uid
              );
              if (
                profileData[0]?.name ||
                profileData[0]?.pic_url ||
                profileData[0]?.price ||
                profileData[0]?.username
              ) {
                setTimeout(() => {
                  navigate("/shareprofile");
                }, 2000);
              } else {
                navigate("/getstart");
              }
              // console.log('profile', profileData);
            })
            .catch((error) => {
              console.error("Axios POST request error:", error);
            });
        } else if (response?.data?.data?.status == "deactivate") {
          toast.error("admin deactivate your account");
        }
      });
  };
  const data = localStorage.getItem("email");
  console.log("hello", data);
  const handleClickFB = async () => {
    try {
      //authenticate the user by calling a popup
      const result = await signInWithPopup(auth, provider);
      console.log("facebook data", result?.user);
      //fetch the user data
      // setUser(result.user); // Stores user data in the 'user' state
      // setIsLogin(true); // Sets the 'isLogin' state to true, indicating the user is logged in
    } catch (e) {
      //handle the error when login fails
      console.log(`login error ${e}`);
      // setIsLogin(false); // Sets 'isLogin' to false on login failure
    }
    // signInWithPopup(auth, fbProvider)
    //   .then((data) => {
    //     // This block will be executed if the user completes the sign-in process successfully.
    //     console.log(".........", data);

    //     const userData = {
    //       providerName: "google",
    //       providerUId: data.user?.uid,
    //       email: data?.user.email,
    //       name: data.user.displayName,
    //       status: "activate",
    //     };
    //     saveCredidentials(userData);
    //     localStorage.setItem("email", data.user.email);
    //     toast.success("Sign in Successfully")
    //   })
    //   .catch((error) => {
    //     // This block will be executed if there's an error during the sign-in process.
    //     if (error.code === 'auth/popup-closed-by-user') {
    //       // Handle the case where the user closes the popup without completing sign-in.
    //      toast.error('User closed the sign-in popup.');
    //       // You can display a message to the user or handle it as appropriate for your application.
    //     } else {
    //       // Handle other sign-in errors.
    //       console.log('Sign-in error:', error.message);
    //       // You can display an error message to the user or handle it as appropriate for your application.
    //     }
    //   });
  };

  return (
    <div className="p-10  h-screen" style={{ width: "400px" }}>
      <h1 className="text-5xl font-thin text-white mb-5 mt-5 ml-5">
        Unleash <br />
        Desire & <br />
        Forge Instant Connections.
      </h1>

      <p className="text-white mb-5 font-thin text-sm ml-5">
        Unlock instant, passionate interactions effortlessly.
      </p>

      <div className="flex gap-3 justify-center mb-5">
        <img
          style={{ cursor: "pointer" }}
          src="facebook.png"
          alt=""
          onClick={() => handleClickFB()}
        />
        <img
         style={{cursor:"pointer"}}
          src="google.png"
          alt=""
          onClick={() => {
            handleClick();
          }}
        />
        {/* <GoogleOAuthProvider  clientId="718087326638-faidou9emp1p9dametvfssotfr2ag4iq.apps.googleusercontent.com" >
        <GoogleLogin

          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
        </GoogleOAuthProvider> */}
        ;{/* <img src="apple.png" alt="" /> */}
      </div>

      <div className="flex justify-center items-center mb-5">
        <hr className="bg-[#727574] w-1/3 h-0.5" />
        <p className="text-white mx-2 font-bold">OR</p>
        <hr className="bg-[#727574] w-1/3 h-0.5" />
      </div>

      <center>
        <a
          href="register"
          type="submit"
          className="mt-10 mb-4 text-white font-bold py-2 px-24 rounded-full"
          style={{
            backgroundImage: "linear-gradient(to bottom, #3640C2, #222222 )",
          }}
        >
          Sign&nbsp;up&nbsp;with&nbsp;email
        </a>

        <br />
        <a className="text-white text-xs" href="login">
          Existing account? <span className="text-white font-bold">Log in</span>
        </a>
      </center>
      <ToastContainer />
    </div>
  );
}

export default Signuppage;

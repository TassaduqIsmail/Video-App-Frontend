import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { API } from "./Api/apis";
// import { auth, provider } from "./service/config";
import { initializeApp } from "firebase/app";
import { GoogleLogin } from "@react-oauth/google";
const Check = () => {


//   const firebaseConfig = {
//     apiKey: "AIzaSyCudL3PVhIdRJacn5mOJOBDc9bmNBeIfrw",
//     authDomain: "vinedo-14654.firebaseapp.com",
//     projectId: "vinedo-14654",
//     storageBucket: "vinedo-14654.appspot.com",
//     messagingSenderId: "1009807012250",
//     appId: "1:1009807012250:web:c71d49d1ddf33b776c0a23",
//   };

  
//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
//   const provider = new GoogleAuthProvider();

// const googleSignIn  = () => {

//   signInWithPopup(auth, provider)
//       .then((result) => {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         const credential = GoogleAuthProvider.credentialFromResult(result);
//         const token = credential.accessToken;
//         // The signed-in user info.
//         const user = result.user;
//         console.log(user);
//         // IdP data available using getAdditionalUserInfo(result)
//         // ...
//       })
//       .catch((error) => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // The email of the user's account used.
//         const email = error.customData.email;
//         // The AuthCredential type that was used.
//         const credential = GoogleAuthProvider.credentialFromError(error);
//         console.log(error);
//         // ...
//       });
//   };







//   const handleClick = () => {

//     signOut(auth).then(() => {
//       console.log('logout');
//       // Sign-out successful.
//     }).catch((error) => {
//       // An error happened.
//     });
    

//     googleSignIn()

//     // signInWithRedirect(auth, provider)
//     //   .then((result) => {
//     //     // This block will be executed if the user completes the sign-in process successfully.
//     //     const { user } = result;
//     //     console.log(".........", user);
//     //     localStorage.setItem("email", user.email);

//     //     const userData = {
//     //       providerName: "google",
//     //       providerUId: user?.uid,
//     //       email: user?.email,
//     //       name: user.displayName,
//     //       status: "activate",
//     //     };
//     //     // saveCredidentials(userData);
//     //   })
//     //   .catch((error) => {
//     //     if (error.code === "auth/popup-closed-by-user") {
//     //       toast.error("User closed the sign-in popup.");
//     //     } else {
//     //       toast.error("Sign-in error:", error.message);
//     //     }
//     //   });
//   };

//   async function checkCredidentials(userData) {
//     try {
//       const loginData = {
//         email: userData?.email.toLowerCase(),
//         password: " ",
//         providerUId: userData?.providerUId,
//       };
//       console.log("loginData", loginData);

//       const response = await axios.post(API.USER.LOGIN, loginData);
//       console.log("checkCredidentials", response);
//       if (response.data?.succes) {
//         await localStorage.setItem("uid", response.data.uid);
//         await checkProfileAndStatus(response.data.uid);
//       }
//     } catch (error) {
//       // console.error('Error in checkCredidentials:', error);
//       return null;
//     }
//   }

//   async function saveCredidentials(userData) {
//     try {
//       console.log("userData", userData);
//       const response = await axios.post(API.USER.SIGNUP, userData);
//       // console.log("response", response);
//       if (response.data.message === "User registered successfully") {
//         toast.success("Register in successfully");
//         await localStorage.setItem("uid", response.data.uid);

//         checkProfileAndStatus(response.data.uid);
//         return "register user";
//       } else {
//         console.log("first", response.data.message);

//         return await checkCredidentials(userData);
//       }
//     } catch (error) {
//       console.error("Error in saveCredidentials:", error);
//       return null;
//     }
//   }

//   const checkProfileAndStatus = async (uid) => {
//     // const uid = localStorage.getItem("uid");
//     console.log(uid);
//     await axios
//       .get(`${API.USER.GET_USERS_BY_ID}/${uid}`)
//       .then(async (response) => {
//         // console.log(response.data);
//         console.log("uid", uid);
//         console.log("profile", response.data.data.status);
//         if (response?.data?.data?.status == "activate") {
//           toast.success("sign in successfully");
//           await axios
//             .get(API.PROFILE.GET_ALL_PROFILE)
//             .then((response) => {
//               console.log(response.data);
//               // console.log('uid', uid);
//               const profileData = response?.data?.data?.filter(
//                 (item) => item?.uid === uid
//               );
//               if (
//                 profileData[0]?.name ||
//                 profileData[0]?.pic_url ||
//                 profileData[0]?.price ||
//                 profileData[0]?.username
//               ) {
//                 setTimeout(() => {
//                   // navigate("/shareprofile");
//                 }, 2000);
//               } else {
//                 // navigate("/getstart");
//               }
//               // console.log('profile', profileData);
//             })
//             .catch((error) => {
//               console.error("Axios POST request error:", error);
//             });
//         } else if (response?.data?.data?.status == "deactivate") {
//           toast.error("admin deactivate your account");
//         }
//       });
//   };

  return (
    <>
     
        <div className="flex gap-3 justify-center mb-5">
          {/* <img
            style={{ cursor: "pointer" }}
            src="facebook.png"
            alt=""
            // onClick={() => handleClickFB()}
          />
          <img
            style={{ cursor: "pointer" }}
            src="google.png"
            alt=""
            onClick={googleSignIn}
          />
          {/* <img src="apple.png" alt="" /> */}
        

   {/* <button onClick={handleClick}  style={{color:'white'}}>logut</button> */}
        {/* <ToastContainer /> */} 

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </>
  );
};

export default Check;

import React, { useEffect, useState } from "react";
import { API } from "../Api/apis";
import axios from "axios";
import { auth, provider, fbProvider } from "../service/config";
import { Field, Form, Formik } from "formik";
import { AsyncStorage } from "AsyncStorage";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
function SIgnup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [googleDetailObj, setGoogleDetailObj] = useState("");

  const navigate = useNavigate();
  const handlEmailChange = (newText) => {
    setEmail(newText);
  };
  const handlePasswordChange = (newText) => {
    setPass(newText);
  };
  const handleClickFB = async () => {
    try {
      //authenticate the user by calling a popup
      const result = await signInWithPopup(auth, provider);
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
    //     localStorage.setItem("email", data.user.email);

    //     const userData = {
    //       providerName: "google",
    //       providerUId: data.user?.uid,
    //       email: data?.user.email,
    //       name: data.user.displayName,
    //       status: "activate",
    //     };
    //     saveCredidentials(userData);
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
    //       toast.error('Sign-in error:', error.message);
    //       // You can display an error message to the user or handle it as appropriate for your application.
    //     }
    //   });
  };

  const handleClick = () => {
    // auth.currentUser.delete()
    // .then(() => {
    //   console.log('Access revoked successfully');
    // })
    // .catch((error) => {
    //   console.error('Error revoking access:', error);
    // });
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
        if (error.code === "auth/popup-closed-by-user") {
          // Handle the case where the user closes the popup without completing sign-in.
          toast.error("User closed the sign-in popup.");
          // You can display a message to the user or handle it as appropriate for your application.
        } else {
          // Handle other sign-in errors.
          toast.error("Sign-in error:", error.message);
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
      console.log("response", response);
      if ("User registered successfully" === response.data.message) {
        toast.succes("Register in successfully");
        await localStorage.setItem("uid", response.data.uid);

        checkProfileAndStatus(response.data.uid);
        return "register user";
      } else {
        return await checkCredidentials(userData);
      }
    } catch (error) {
      console.error("Error in saveCredidentials:", error);
      return null;
    }
  }

  const userLogin = async (email, password) => {
    console.log("Email:", email);
    console.log("Password:", password);
    if (!email || !password) {
      toast.error("Please fill in all fields");
    } else {
      const userData = {
        email: email,
        password: password,
      };
      console.log("UserData:", userData);
      try {
        const response = await axios.post(API.USER.LOGIN, userData);
        console.log("responce", response);
        console.log("ajajs", response?.data?.uid);
        localStorage.setItem("uid", response.data.uid);
        if (response.data.error === "User does not exist") {
          toast.error("User does not exist");
        } else if (response.data.error === "Invalid password") {
          console.log("jjsj", response.data.error);
          toast.error("Invalid password");
        } else if (response.data.success == "success") {
          setTimeout(() => {
            navigate("/getstart");
          }, 2000);
        }
        checkProfileAndStatus(response?.data?.uid);
      } catch (error) {
        console.error("Axios POST request error:", error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      userLogin();
    }
  };
  const checkProfileAndStatus = async (uid) => {
    // const uid = localStorage.getItem("uid");
    console.log(uid);
    try {
      await axios
        .get(`${API.USER.GET_USERS_BY_ID}/${uid}`)
        .then(async (response) => {
         console.log(response.data);
          console.log("uid", uid);
          console.log("profile", response.data.data.status);
          console.log("deleate", response.data.data.isDeleated);
          if (response?.data?.data?.status == "activate" && response?.data?.data?.isDeleated === false) {
            toast("sign in successfully");
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
                  
                  setTimeout(() => {
                    navigate("/getstart");
                  }, 2000);
                }
                // console.log('profile', profileData);
              })
              .catch((error) => {
                console.error("Axios POST request error:", error);
              });
          } else if (response?.data?.data?.status == "deactivate" ||response?.data?.data?.isDeleated === true ) {
            // toast.error("admin deactivate your account");
            toast.error("Your  Account deactivate or bedeleated");
          }
        });
    } catch (error) {}
  };
  const goBack = () => {
    window.history.back(); // This will navigate back to the previous page in the browser history
  };
  return (
    // <div className="p-8 h-screen "  style={{width:"400px"}}>
    //   <img   style={{cursor:"pointer"}}onClick={goBack} src="backicon.png" alt="" />
    //   <center style={{marginTop:40}} >
    //     <h1 className="text-2xl text-[#4753EA] mb-5 font-bold">
    //       Log in to Vinedo
    //     </h1>
    //     <p className="text-white mb-5 font-thin text-sm ">
    //       Start experiencing freedom today by signing up for our app!
    //     </p>
    //   </center>
    //   <div className="flex gap-3 justify-center mb-5">
    //     <img   style={{cursor:"pointer"}}src="facebook.png" alt=""  onClick={() => {
    //         handleClickFB();
    //       }} />
    //     <img
    //      style={{cursor:"pointer"}}
    //       src="google.png"
    //       alt=""
    //       onClick={() => {
    //         handleClick();
    //       }}
    //     />
    //     {/* <img src="apple.png" alt="" /> */}
    //   </div>
    //   <div className="flex justify-center items-center mb-5">
    //     <hr className="bg-[#727574] w-1/3 h-0.5" />
    //     <p className="text-[#727574] mx-2 font-bold">OR</p>
    //     <hr className="bg-[#727574] w-1/3 h-0.5" />
    //   </div>
    //   <Formik
    //     initialValues={{ email: "", password: "" }}
    //     onSubmit={async (values) => {
    //       console.log("Submitted values:", values);
    //       await userLogin(values.email, values.password);
    //     }}
    //   >
    //     <Form>
    //       <div className="flex flex-col gap-3 ">
    //         <label className="text-white">Your email</label>
    //         <Field
    //           type="email"
    //           name="email"
    //           className="h-6  border-b border-white outline-none p-2 bg-[#110E0F]"
    //           style={{ color: "#fff" }}
    //         />
    //       </div>
    //       <div className="flex flex-col gap-3">
    //         <label className="text-white">Password</label>
    //         <Field
    //           type="password"
    //           name="password"
    //           className="h-6  border-b border-white outline-none p-2 bg-[#110E0F]"
    //           style={{ color: "#fff" }}
    //           onKeyPress={(event) => handleKeyPress(event)}
    //         />
    //       </div>
    //       <center style={{marginTop:'60%'}} >
    //         <button
    //           type="submit"
    //           className="mt-20 mb-5 text-white font-bold py-2 px-32 rounded-full"
    //           style={{
    //             backgroundImage: "linear-gradient(to bottom, #3640C2, black)", cursor:"pointer",
    //           }}
    //         >
    //           Login
    //         </button>
    //         <br />
    //         <a  className="text-[#3D4A7A]" href="/Forgetpas">
    //           Forgot Password?
    //         </a>
    //       </center>
    //     </Form>
    //   </Formik>
    //   <ToastContainer />
    // </div>

    <div
      className="p-8 min-h-screen md:w-400 mx-auto"
      style={{ maxWidth: "400px" }}
    >
      <img
        style={{ cursor: "pointer" }}
        onClick={goBack}
        src="backicon.png"
        alt=""
      />
      <div className="text-center mt-8">
        <h1 className="text-2xl text-[#4753EA] mb-5 font-bold">
          Log in to Vinedo
        </h1>
        <p className="text-white mb-5 font-thin text-sm">
          Start experiencing freedom today by signing up for our app!
        </p>
      </div>
      <div className="flex justify-center gap-3 mb-5">
        <img
          style={{ cursor: "pointer" }}
          src="facebook.png"
          alt=""
          onClick={handleClickFB}
        />
        <img
          style={{ cursor: "pointer" }}
          src="google.png"
          alt=""
          onClick={handleClick}
        />
      </div>
      <div className="flex justify-center items-center mb-5">
        <hr className="bg-[#727574] w-1/3 md:w-1/4 h-0.5" />
        <p className="text-[#727574] mx-2 font-bold">OR</p>
        <hr className="bg-[#727574] w-1/3 md:w-1/4 h-0.5" />
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          console.log("Submitted values:", values);
          await userLogin(values.email, values.password);
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mx-4">
            <label className="text-white">Your email</label>
            <Field
              type="email"
              name="email"
              className="h-10 w-full border-b border-white p-2 outline-none bg-[#110E0F] text-white"
              style={{ color: "#fff", backgroundColor: "#000" }}
              autoComplete="off"
            />
            <label className="text-white">Password</label>
            <Field
              type="password"
              name="password"
              className="h-10 w-full border-b border-white outline-none p-2 bg-[#110E0F] text-white"
              style={{ color: "#fff" }}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <div className="text-center mt-20">
              <button
                type="submit"
                className="text-white font-bold py-2 px-20 rounded-full bg-gradient-to-b from-[#3640C2] to-black cursor-pointer w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #3640C2, #222222 )",
                }}
              >
                Login
              </button>
              <br />
              <a className="text-[#3D4A7A]" href="/Forgetpas">
                Forgot Password?
              </a>
            </div>
          </form>
        )}
      </Formik>
      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
        <ToastContainer />
      </div>
    </div>
  );
}
export default SIgnup;

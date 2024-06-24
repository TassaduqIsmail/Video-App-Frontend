import React, { useEffect, useState } from "react";
import { API } from "../Api/apis";
import axios from "axios";
import { auth, provider, fbProvider } from "../service/config";
import { Field, Form, Formik } from "formik";
import { AsyncStorage } from "AsyncStorage";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
function Forgetpas() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [googleDetailObj, setGoogleDetailObj] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function checkEmail(email) {
    if (!email) {
      toast("email is required");
    } else {
      console.log("to chl rah ahn ");
      try {
        const response = await axios.post(API.USER.Email_VERIFY, {
          email: email,
        });
        console.log("checkCredidentials", response.data);
        if (response.data?.succes) {
          // navigation to login page
          toast.success("Email Verified")
          setTimeout(() => {
            navigate("/Changep", { state: { email: email } });
            
          }, 2000);
        } else setError(response?.data?.error);
      } catch (error) {
        console.error("Error in checkCredidentials:", error);
      }
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      checkEmail();
    }
  };

  const goBack = () => {
    window.history.back(); // This will navigate back to the previous page in the browser history
  };
  console.log(email);

  return (
    <div
      className="p-3 md:p-8 min-h-screen md:w-400 mx-auto "
      style={{ width: "370px" }}
    >
      <img
        style={{ cursor: "pointer" }}
        onClick={goBack}
        src="backicon.png"
        alt=""
      />
      <center>
        <h1 className="text-2xl text-[#4753EA] mb-5 font-bold">Enter Email</h1>
        <p className="text-white mb-5 font-thin text-sm ">
          Enter email to change password
        </p>
      </center>

      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          console.log("Submitted values:", values);
          await checkEmail(values.email);
        }}
      >
        <Form>
          <div className="flex flex-col gap-3 ">
            <label className="text-white">Your email</label>
            <Field
              type="email"
              name="email"
              className="h-10 w-full border-b border-white p-2 outline-none bg-[#110E0F] text-white"
              style={{ color: "#fff", backgroundColor: "#000" }}
              onKeyPress={(event) => handleKeyPress(event)}
              autoComplete="off" // Disable suggestions
            />

            {/* <Field
              type="email"
              name="email"
              className="h-6 border-b border-white p-2 outline-none bg-[#110e0f] text-white"
              onKeyPress={(event) => handleKeyPress(event)}
              autoComplete="off"
            /> */}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <center>
            <button
              type="submit"
              className="mt-20 mb-5 text-white font-bold py-2 px-32 rounded-full"
              style={{
                backgroundImage: "linear-gradient(to bottom, #3640C2, #222222 )",
                height:"50px"
              }}
            >
              Verify
            </button>
            <br />
          </center>
        </Form>
      </Formik>
      <ToastContainer />
    </div>

    //   <div className="p-3 md:p-8 min-h-screen md:w-400 mx-auto "  style={{ width: "400px" }}>
    //   <img className="cursor-pointer" onClick={goBack} src="backicon.png" alt="" />
    //   <div className="text-center mt-8">
    //     <h1 className="text-2xl text-[#4753EA] mb-5 font-bold">Enter Email</h1>
    //     <p className="text-white mb-5 font-thin text-sm">
    //       Enter email to change password
    //     </p>
    //   </div>

    //   <form className="max-w-xs mx-auto" onSubmit={() => false}>
    //     <div className="flex flex-col gap-3 mx-4">
    //       <label className="text-white">Your email</label>
    //       <input type="email" name="email" className="h-10 w-full border-b border-white p-2 bg-[#110E0F] text-white outline-none"  onChange={(e)=>setEmail(e.target.value)} value={email}onKeyPress={handleKeyPress} />
    //     </div>

    //     {/* Error message */}
    //     {/* <div className="text-center">
    //       <p className="text-red-500">{error}</p>
    //     </div> */}

    //     <div className="text-center mt-8">
    //       <button  onClick={()=>{checkEmail()}} type="submit" className="text-white font-bold py-2 px-20 rounded-full bg-gradient-to-b from-[#3640C2] to-black cursor-pointer w-full">
    //         Verify
    //       </button>
    //       <br />
    //     </div>
    //   </form>
    //   <div className="fixed bottom-5 left-0 right-0 flex justify-center">
    //     <ToastContainer />
    //   </div>
    // </div>
  );
}
export default Forgetpas;

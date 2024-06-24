import React, { useEffect, useState } from "react";
import { API } from "../Api/apis";
import axios from "axios";
import { auth, provider, fbProvider } from "../service/config";
import { Field, Form, Formik } from "formik";
import { AsyncStorage } from "AsyncStorage";
import { signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
function SIgnup() {
  const [newpass, setnewpass] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  async function savePassword(pass, newpass) {
    if (!newpass || !pass) {
      setError("filed required");
    } else if (newpass !== pass) {
      setError("password dont match");
    } else {
      try {
        const response = await axios.post(API.USER.UPDATE_PASS, {
          password: newpass,
          email: location?.state?.email,
        });
        console.log("checkCredidentials", response);
        if (response.data?.succes) {
          // navigation to login page
          toast.success("Password Change Successfully")
          setTimeout(() => {
            navigate("/login");
            
          }, 2000);
        }
      } catch (error) {
        console.error("Error in checkCredidentials:", error);
      }
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      savePassword();
    }
  };

  const goBack = () => {
    window.history.back(); // This will navigate back to the previous page in the browser history
  };
  return (
    <div
      className="p-3 md:p-8 min-h-screen md:w-400 mx-auto "
      style={{ width: "370px" }}
    >
      <img
        style={{
          cursor: "pointer",
        }}
        onClick={goBack}
        src="backicon.png"
        alt=""
      />
      <center>
        <h1 className="text-2xl text-[#4753EA] mb-5 font-bold">
          Reset Password
        </h1>
      </center>

      <Formik
        initialValues={{ pass: "", newpass: "" }}
        onSubmit={async (values) => {
          console.log("Submitted values:", values);
          await savePassword(values.pass, values.newpass);
        }}
      >
        <Form>
          <div className="flex flex-col gap-3">
            <label className="text-white">New Password</label>
            <Field
              type="password"
              name="pass"
              className="h-6  border-b border-white outline-none p-2 bg-[#110E0F]"
              style={{ color: "#fff" }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-white">Confirm Password</label>
            <Field
              type="password"
              name="newpass"
              className="h-6  border-b border-white outline-none p-2 bg-[#110E0F]"
              style={{ color: "#fff" }}
              onKeyPress={(event) => handleKeyPress(event)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <center>
            <button
              type="submit"
              className="mt-20 mb-5 text-white font-bold py-2 px-32 rounded-full"
              style={{
                backgroundImage: "linear-gradient(to bottom, #3640C2, #222222 )",
                flexDirection: "row",
              }}
            >
              Reset
            </button>
            <br />
          </center>
        </Form>
      </Formik>
      <ToastContainer/>
    </div>
  );
}
export default SIgnup;

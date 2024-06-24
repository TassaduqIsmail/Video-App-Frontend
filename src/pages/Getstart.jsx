import React from "react";
// import { AiOutlineClose } from "react-icons/ai";
function Getstart() {
  return (
    <div style={{ width: "400px", height: "100%" }}>
      {/* <AiOutlineClose className='m-2'  color='white'/> */}
      <center>
        <img src="whitelogo.png" className=" mt-40" alt="" />

        <p className="text-white text-2xl mt-20 font-bold">
          Set Up Your Profile
        </p>

        <p className="text-white text-sm mt-10 m-5 ">
          Personalize your experience by creating a profile. Share your
          interests, add a photo, and let others get to know the real you.
        </p>
        <div className="p-5 mt-10">
          <img className="mt-10" src="slide1.png" />

          <a
            href="startname"
            type="submit"
            className="mt-20 h-14 mb-5 text-white font-bold py-2 px-32 rounded-full"
            style={{
              cursor: "pointer",
              backgroundImage: "linear-gradient(to bottom, #3640c2, black)",
            }}
          >
            Get&nbsp;started
          </a>
        </div>
      </center>
    </div>
  );
}

export default Getstart;

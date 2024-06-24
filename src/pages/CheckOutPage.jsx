import React, { useState, useEffect } from "react";
import { Elements, StripeProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { API } from "../Api/apis";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51OOfT2I0AsDkQn5UTsR1GybyxGSAa8NJu0Kaq1DjaNOQaoqts1Ey9TfjAw2aczpwKnh5GTmZxgG7XM4xY6P86WiD00DZ5Yursj"
);

function CheckOutPage({ data }) {
  const [clientSecret, setClientSecret] = useState("");
  const [billId, setBillId] = useState(null);
  const [options, setOptions] = useState("");
  const location = useLocation();

  console.log("stripe data hn bhai ", data);
  // const item = location?.state?.items;
  console.log("clientSecret", clientSecret);
  useEffect(() => {
    // Fetch the client secret from your server when the component mounts
    const fetchClientSecret = async () => {
      const uid = await localStorage.getItem("uid")
      const pid = await localStorage.getItem("pid")
      const response = await axios.post(API.PAYMENT.SUBSCRIPTION, {
        creatorId: pid,
        subcriberId: uid,
        price: data?.price,
      });

      console.log("stripe data ", response.data?.clientSecret);
      if (response?.data?.success) {
        setClientSecret(response?.data?.clientSecret);
        setOptions({
          clientSecret: response?.data?.clientSecret,
        });
        setBillId(response?.data?.billId);
        localStorage.setItem("billid", billId);
      } else {
        console.log("Failed to fetch client secret");
      }
    };

    if (!clientSecret) fetchClientSecret();
  }, []);

  return (
    <>
      <div>
        <center>
   
        <div
          style={{
            borderWidth: "2px",
            borderColor: "#4753EA",
            padding: "10px",
            width: "45%",
            margin: "10px",
            marginTop: "30px",
            alignSelf: "center",
            flexDirection:"row",
            display:"flex",
            justifyContent:"space-evenly",
          

            
          }}
        >
         
          <img
            src={
              data?.pic_url ||
              "https://i.pinimg.com/280x280_RS/77/0f/b7/770fb75f5e81e4c2dbe8934f246aeeab.jpg"
            }
            style={{
              height: "6vw" /* 20% of the viewport width */,
              width: "6vw" /* 20% of the viewport width */,
              maxWidth: "200px" /* Limit maximum width to 200px */,
              maxHeight: "200px" /* Limit maximum height to 200px */,
              borderRadius: "50%" /* Make the image round */,
            }}
            alt="User Image"
          />
          <div>
          <p style={{color:"#fff"}}>{data?.name}</p>
          </div>
          
        </div>
        <h4 className="text-center font-bold uppercase text-gray-500	my-5">
          you are subscribing this user
        </h4>
        </center>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm billId={billId} />
          </Elements>
        ) : (
          console.log(" stripe nhi chl raha hn ")
        )}
      </div>
    </>
  );
}

export default CheckOutPage;

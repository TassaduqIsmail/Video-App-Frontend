import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../Api/apis";

const CheckoutForm = ({ billId }) => {
  console.log("bill id ", billId);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const currentItem = item;
    // console.log(id);

    //   return
    elements.submit();

    if (!stripe || !elements) {
      return;
    }

    try {
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "https://vinedo-frontend.vercel.app/search",
        },
        redirect: "if_required",
      });
      console.log("asdsa", result);

      // Confirm the PaymentIntent with the client_secret and also payment init
      if (result.error) {
        const status = {
          paymentStatus: "payment fail",
          subStatus: "unsubscribe",
        };
        const response = await axios.put(
          `${API.PAYMENT.UPDATE_SUB_STATUS}/${billId}`,
          status
        );
        console.log(response.data);

        if (response.data.succes) {
          alert("payment fail");
        }
        setError(result.error.message);
      } else {
        // Payment successful, handle success scenario
        console.log("payment sucess", result);
        const status = {
          paymentStatus: "payment success",
          subStatus: "subscribe",
        };
        const response = await axios.put(
          `${API.PAYMENT.UPDATE_SUB_STATUS}/${billId}`,
          status
        );
        console.log(response.data);
        if (response?.data?.succes) {
          toast.success("Payment successful");
          setTimeout(() => {
            navigate("/search");
          }, 1000);
        }

        // }
      }
    } catch (err) {
      setError(err.message || "An error occurred during payment processing.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Left side - Checkout form */}

        {/* Right side - Payment method */}
        <div style={{ backgroundColor: "#fff" }} className="w-100 p-8">
          {/* <div className="max-w-md mx-auto bg-white rounded-md shadow p-6"> */}
          <h2
            style={{ backgroundColor: "#fff", top: 10 }}
            className="text-2xl font-bold mb-4"
          >
            Payment Method
          </h2>
          <div className="flex items-center mb-4">
            <form style={{ backgroundColor: "#fff" }} onSubmit={handleSubmit}>
              {/* <p>4242 4242 4242 4242</p> */}
              <PaymentElement />
              {error && <div style={{ color: "red" }}>{error}</div>}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-6"
                disabled={!stripe}
              >
                Proceed to Payment
              </button>
              <ToastContainer />
            </form>
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;

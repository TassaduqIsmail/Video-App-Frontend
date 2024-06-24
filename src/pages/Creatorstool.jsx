import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { API } from "../Api/apis";
import axios from "axios";

function Creatorstool() {
  const [fullName, setFullName] = useState("");
  const [IBAN, setIBAN] = useState("");
  const [bankName, setbankName] = useState("");
  const [BankAddress, setBankAddress] = useState("");
  console.log(bankName);
  const [Modalvisible, setModalvisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [price, setPrice] = useState(0);
  const goBack = () => {
    window.history.back(); // This will navigate back to the previous page in the browser history
  };

  const userWithdrawl = async () => {
    if (!fullName || !IBAN || !bankName || !BankAddress) {
      toast.error("Please fill in all fields");
    } else if (IBAN.length > 10) {
      toast.error("Please enter a valid IBAN Number");
    } else {
      const uid = await localStorage.getItem("uid");

      const bankDetails = {
        subcriberId: uid,
        fullName: fullName,
        accountNo: IBAN,
        bankName: bankName,
        BankAddress: BankAddress,
      };

      await axios
        .post(API.ACCOUNT.WITHDRAW_REQUEST, bankDetails)
        .then(async (response) => {
          console.log(response.data);
          if (response.data.success) {
            // setModalVisible(false)
            toast("request to admin successfully");
          }
        })
        .catch((error) => {
          console.error("Axios POST request error:", error);
        });
    }
  };

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        const uid = await localStorage.getItem("uid");
        console.log(uid);
        const response = await axios.get(API.PAYMENT.GET_SUB_STATUS);
        const subscriptions = response?.data?.data;
        const countSub = subscriptions?.filter(
          (item) => item?.subStatus == "subscribe" && item?.subcriberId === uid
        );
        let totalprice = 0;
        console.log("sdgsdf", countSub);
        countSub.forEach((price) => {
          totalprice += Number(price?.price);
        });
        setPrice(totalprice);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    getSubscriptions();
  }, []);
    const handleTextChange = text => {
    // Limit the input to thirty letters
    if (text.length <= 30) {
      setInputText(text);
    }
  };

  return (
    <div
      style={{ width: "370px", alignItems: "center" }}
      className="h-screen p-2"
    >
      <div className="flex justify-between m-2">
        <img
        style={{cursor:"pointer"}} 
          onClick={() => {
            goBack();
          }}
          src="backicon.png"
          alt=""
        />
        <div className="flex items-center">
          <p className="text-white text-sm font-thin">Creator’s tool</p>
        </div>
        <p></p>
      </div>

      <div className="p-5 ">
        <center
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="border border-[#4753ea] rounded-lg p-5 m-10"
            style={{ width: "400px" }}
          >
            <p className="text-[#a1a3a7] font-thin text-xl mb-4">Balance</p>

            <p
              className="text-white   text-lg mb-4"
              style={{ borderBottomWidth: 2, borderColor: "#59585b" }}
            >
              € {price ? price : "00,0"}
            </p>

            {/* <div className='w-full h-0.5 bg-[#59585b] mb-4'></div> */}

            <button
              type="button"
              onClick={() => {
                setModalvisible(true);
              }}
              className="text-[#00FF00] border border-[#4753ea] text-xs px-10 font-thin py-1 p-4 rounded-full "
            >
              WITHDRAW
            </button>
          </div>

          {Modalvisible === true && (
            <div
              style={{
                backgroundColor: "#000",
                padding: 20,
                borderRadius: 10,
                elevation: 5,
                // height: "30%",
                justifyContent: "space-between",
                width: "250px",
                borderWidth: 2,
                borderColor: "#4753EA",
                position: "absolute",
                marginTop: "20%",
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#fff",
                }}
              >
                Enter Bank Account Details
              </p>
              <input
                style={{
                  height: 30,
                  borderColor: "#FFF",
                  borderWidth: 2,
                  marginBottom: 10,
                  width:'200px',
                  padding: 10,
                  borderRadius: 10,
                  color: "#000",
                  backgroundColor: "#FFF",
                }}
                placeholder="Beneficiary Name"
                placeholderTextColor={"#8e8e8e"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                style={{
                  height: 30,
                  borderColor: "#FFF",
                  borderWidth: 2,
                  marginBottom: 10,
                  width:'200px',
                  padding: 10,
                  borderRadius: 10,
                  color: "#000",
                  backgroundColor: "#FFF",
                }}
                placeholder="Account Number or IBAN "
                placeholderTextColor={"#8e8e8e"}
                value={IBAN}
                onChange={(e) => setIBAN(e.target.value)}
              />
              <input
                style={{
                  height: 30,
                  borderColor: "#FFF",
                  borderWidth: 2,
                  marginBottom: 10,
                  width:'200px',
                  padding: 10,
                  borderRadius: 10,
                  color: "#000",
                  backgroundColor: "#FFF",
                }}
                placeholder="Bank Name"
                placeholderTextColor={"#8e8e8e"}
                value={bankName}
                onChange={(e) => setbankName(e.target.value)}
              />
              <input
                style={{
                  height: 30,
                  borderColor: "#FFF",
                  borderWidth: 2,
                  marginBottom: 10,
                  width:'200px',
                  padding: 10,
                  borderRadius: 10,
                  color: "#000",
                  backgroundColor: "#FFF",
                }}
                placeholder="Bank Address"
                placeholderTextColor={"#8e8e8e"}
                value={BankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={userWithdrawl}
                  style={{
                    backgroundColor: "green",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <span style={{ color: "#FFF", fontWeight: "600" }}>SUBMIT</span>
                </button>
                <button
                  onClick={() => {
                    setModalvisible(false);
                  }}
                  style={{
                    backgroundColor: "red",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <p style={{ color: "#FFF", fontWeight: "600" }}>CANCEL</p>
                </button>
              </div>
            </div>
          )}
        </center>
        <ToastContainer/>
      </div>
    </div>
  );
}

export default Creatorstool;

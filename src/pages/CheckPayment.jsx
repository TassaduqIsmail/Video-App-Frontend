import { useLocation } from "react-router-dom";
import CheckOutPage from "./CheckOutPage";
import { useEffect, useState } from "react";

function CheckPayment() {
  const location = useLocation();
 
  const [subdata,setSubData]= useState({})

  
  useEffect(()=>{
    const uid =localStorage.getItem("uid")
    const data1 =  localStorage.getItem("currentdata")
    const data = JSON.parse(data1);
    console.log("data1",data);
    // const creatordata = { ,uid:uid}
    // console.log('payment data',creatordata);
  
  setSubData(data)
},[])

 console.log("datajjjjj",subdata);

  return (
    <>
      {subdata && <CheckOutPage data={subdata} />}
    </>
  );
}

export default CheckPayment;

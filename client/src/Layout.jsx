import React, { useContext, useEffect } from "react";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { message } from 'antd'
import { UserContext } from "./UserContext";

export const Layout = () => {

  useEffect(()=>{
    if(localStorage.getItem('token')){
      getdata();
    }
    else{
      console.log("You are not logined")
    }
  }, [])


  const {setUser} = useContext(UserContext)

  const getdata = async () => {
    const post = await axios
      .post(
        "/profile",
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((res) => {
        if (res.data.key === true) {
          message.success(res.data.successMessage);
          const data = res.data.Name
          setUser(data)
        } else {
          message.error("Sorry! Something went wrong");
        }
      }).catch((error)=>{
        console.log(error)
      })
  };
  return (
    <>
      <div className="py-4 px-8 flex flex-col min-h-screen ">
        <Header />
        <Outlet />
      </div>
    </>
  );
};

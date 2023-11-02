import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Places } from "./Places";
import { AccountNav } from "./AccountNav";

export const Accont = () => {

  let {subpage} = useParams();

  const user  = useContext(UserContext);

  const navigate = useNavigate();



  if (!user) {
    return <Navigate to={"/login"} />;
  }
  if(subpage === undefined){
    subpage = 'profile';
  }

  console.log(user.user)



  const logout = ()=>{
    let token = localStorage.getItem('token')
    if(token){
      if (confirm("Press a button!") == true) {
        localStorage.removeItem('token');
        navigate('/')
        window.location.reload(true)

      } else {
        console.log("logout Failed")
      }
 
    }

  }
  return (
    <>
      <div>
        <AccountNav/>
        List of added places


        {subpage === 'profile' && (
          <div className="text-center max-w-lg mx-auto">
            logged in as {user.user}<br/>
            <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
          </div>
        )}
        {subpage === "places" && (
          <Places/>
        )}
      </div>
    </>
  );
};
 
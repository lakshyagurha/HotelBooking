import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const {user, setUser} = useContext(UserContext)
  const [pata, setPata] = useState('')

  async function loginHandler(ev){
    ev.preventDefault()
    try{
      


      const create = await axios.post('/login', {email, password}).then((res)=>{
        console.log(res.data.Name)
        const pata = res.data.Name



        localStorage.setItem("token", res.data.token)

      })
      setUser(pata)
    
      alert("login Successfull")

      setRedirect(true)
    } catch(ev) {
      alert("login Failed")
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <>
      <div className="mt-4 grow flex items-center justify-around ">
        <div className="mb-64">
          <h1 className="text-4xl text-center mb-4">Login</h1>
          <form className="max-w-md mx-auto" onSubmit={loginHandler}>
            <input type="email" placeholder="youremail.com" value={email} onChange={ev => setEmail(ev.target.value)} />
            <input type="password" placeholder="passworld" value={password} onChange={ev => setPassword(ev.target.value)} />
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
              Don`t have an account yet?
              <Link className="underline text-black" to={'/register'}> Register Now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

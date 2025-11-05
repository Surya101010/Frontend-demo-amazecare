import { useRef } from "react"
import CrossIcon from "../Icons/CrossIcon"
import Input from "../components/Input"
import axios from "axios";
import { BACKEND_URL } from "../Config";
import Button from "../components/Button";
import { useNavigate } from "react-router";

export default function Login(){
   const usernameref= useRef(null);
    const passwordref=useRef(null);
    const navigate= useNavigate();
    async function signin(){
      const username = usernameref.current.value;
      const password = passwordref.current.value;
      try {
          const response =await axios.post(`${BACKEND_URL}`+"authenticate",{
          username,password
        })
        if (response.status===200) {
          const jwt=response.data;
          localStorage.setItem("token",jwt)
          navigate("/dashboard")
      }
      } catch (error) {
          if (error.response && error.response.status === 500) {
        alert(" User not available (Server error 500)");
        } else if (error.response && error.response.status === 401) {
          alert(" Invalid credentials");
          } else {
          alert(" Unexpected error occurred");
        }
        console.error("Login error:", error);
      }
  }
  return(
    <div className="h-screen w-screen fixed">
      <h1 className="font-extrabold text-blue-400 text-5xl w-screen flex justify-center p-4 m-4">AmazeCare</h1>
      <div className="flex w-screen h-screen justify-center items-center bg-slate-200 pb-64">
              <span className=" p-4 m-4 bg-orange-200   border rounded-md mb-8" >
                {/* <div className="flex justify-end ">
                  <div className="cursor-pointer">
                    <CrossIcon />
                  </div>
                </div> */}
                <Input placeholder={"enter the username"} type={"text"} reference={usernameref} />
                <Input placeholder={"enter the password"} type={"password"} reference={passwordref}/>
                  {/* <div className="flex justify-center items-center border rounded-xl bg-white cursor-pointer w-200px   "> */}
                    {/* <button type="submit" onClick={signin} >submit</button> */}
                    <Button type={"submit"} onclick={signin} text={"submit"} />
                  {/* </div> */}
                </span>
      </div>
    </div>
  )
}
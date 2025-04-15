import Form from "../components/Form";
import "./Login.css";
import login from "/login.jpg"
import Input from "../components/Input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { actions } from "../store/UserSlice";
const Register=()=>{
    const [Creds,setCreds]=useState<{email:string,userName:string,password:string}>({email:"",userName:"",password:""});
    const [otp,setOtp]=useState<{is:boolean,otp:string}>({is:false,otp:""});
    const [error,setError]=useState<{is:boolean,msg:string}>({is:false,msg:""});
    const nav=useNavigate();
    const dis=useDispatch();
    useEffect(()=>{
        if(otp.is){
            const aaguRaPuxa=(e:BeforeUnloadEvent)=>{
                e.preventDefault();
                e.returnValue=""
            };
            window.addEventListener("beforeunload",aaguRaPuxa);
            return ()=>{
                window.removeEventListener("beforeunload",aaguRaPuxa);
            }
        }
    },[otp.is])
    const Ihandler=(e:React.ChangeEvent<HTMLInputElement>):void=>{
        const {name,value}=e.target;
        setCreds((prev)=>({
            ...prev,
            [name]:value,
        }));
    }
    const api=import.meta.env.VITE_API_URL;
    return (
        <>
            <div className="w-screen h-screen flex overflow-hidden">
                <div className="creds w-[40%] h-screen bg-gradient-to-r from-green-300 to-orange-200 flex flex-col justify-center items-center ">
                    {otp.is===false?<Form submitHandler={(e:React.FormEvent<HTMLFormElement>)=>{
                        e.preventDefault();
                        if(Creds.email.length<5||Creds.password.length<4||Creds.userName.length<3){
                            return ;
                        }
                        axios.post(`${api}/user/register`,{username:Creds.userName,email:Creds.email,password:Creds.password})
                        .then((res)=>{
                            if(res.data.success){
                                setOtp({is:true,otp:""});
                            }
                            else{
                                setError({is:true,msg:res.data});
                            }
                        })
                        .catch(e=>{
                            console.log(e);
                            const err = e.response?.data;
                            if (typeof err === "object" && err.msg) {
                                setError({ is: true, msg: err.msg });
                              } else {
                                setError({ is: true, msg: "Something went wrong" });
                              }
                        })
                    }}>
                        <h1 className="font-bold hover:text-gray-500  text-xl">Register</h1>
                        {<Input handler={Ihandler} value={Creds.email} type="email" name="email" placeHolder="Enter your Email"></Input>}
                        {<Input handler={Ihandler} value={Creds.userName} type="text" name="userName" placeHolder="Enter your Username"></Input>}
                        {<Input handler={Ihandler} value={Creds.password} type="password" name="password" placeHolder="Enter your password"></Input>}
                        <button className="text-white bg-blue-400 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white">Register</button>
                        {error.is&&<p className="text-red-500 text-xs">{error.msg}</p>}
                        <p className="absolute bottom-0 text-xs text-gray-600 font-bold p-2">Already a user? <Link to={"/login"}><span className="text-black underline hover:cursor-pointer">Login</span></Link></p>
                    </Form>:
                    <Form submitHandler={(e:React.FormEvent<HTMLFormElement>)=>{
                        e.preventDefault();
                        console.log(otp)
                        axios.post(`${api}/user/verifyOtp`,{email:Creds.email,otp:otp.otp})
                        .then((res)=>{
                            if(res.data.success&&res.data.user){
                                const token=res.data.token;
                                localStorage.setItem("token",token);
                                dis(actions.setUser(res.data.user));
                                nav("/home")
                            }
                            else{
                                setOtp((pre)=>({...pre,otp:""}));
                            }
                        })
                        .catch(e=>{
                            setOtp((pre)=>({...pre,otp:""}));
                            console.log(e);
                        })
                    }}>
                        <h1 className="font-bold hover:text-gray-500  text-xl">Register</h1>
                        {<Input handler={(e:React.ChangeEvent<HTMLInputElement>)=>{
                            console.log(e.target.value)
                            setOtp((prev)=>({
                                ...prev,
                                otp:e.target.value,
                            }))
                        }} type="text" value={otp.otp} name="otp" placeHolder="Enter OTP"></Input>}
                        <button className="text-white bg-blue-400 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white">Submit</button>
                    </Form>
        }

                </div>
                <div className="cover w-[60%] h-full bg-[#FFF8EA]">
                    <img src={login} className="h-full w-full object-cover object-right"></img>
                </div>
            </div>
        </>
    )
}
export default Register
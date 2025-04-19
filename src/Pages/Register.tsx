import Form from "../components/Form";
import "./Login.css";
import login from "/login.jpg"
import Input from "../components/Input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { actions } from "../store/UserSlice";

const Loader=()=>{
    return (
        <div className="loader32"></div>
    )
}

const Register = () => {
    const [Creds, setCreds] = useState<{email:string,userName:string,password:string}>({email:"",userName:"",password:""});
    const [otp, setOtp] = useState<{is:boolean,otp:string}>({is:false,otp:""});
    const [error, setError] = useState<{is:boolean,msg:string}>({is:false,msg:""});
    const nav = useNavigate();
    const dis = useDispatch();
    
    useEffect(() => {
        if(otp.is) {
            const aaguRaPuxa = (e:BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = "";
            };
            window.addEventListener("beforeunload", aaguRaPuxa);
            return () => {
                window.removeEventListener("beforeunload", aaguRaPuxa);
            }
        }
    }, [otp.is])
    
    const Ihandler = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const {name, value} = e.target;
        setCreds((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const [fetch,setFetch]=useState(false);
    const api = import.meta.env.VITE_API_URL;
    
    return (
        <>
            <div className="w-screen h-screen flex flex-col-reverse md:flex-row overflow-auto md:overflow-hidden">
                <div className="creds w-full md:w-[40%] min-h-[60vh] md:h-screen bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-300 flex flex-col justify-center items-center p-4 md:p-0">
                    <h1 className="font-bold hover:text-gray-500 text-xl text-center md:text-left ">Create Your Account</h1>
                    {otp.is === false ? 
                        <Form submitHandler={(e:React.FormEvent<HTMLFormElement>) => {
                            setFetch(true)
                            e.preventDefault();
                            if(Creds.email.length < 5 || Creds.password.length < 4 || Creds.userName.length < 3) {
                                setFetch(false);
                                return;
                            }
                            axios.post(`${api}/user/register`, {username:Creds.userName, email:Creds.email, password:Creds.password})
                            .then((res) => {
                                if(res.data.success) {
                                    setOtp({is:true, otp:""});
                                    setFetch(false);
                                }
                                else {
                                    setError({is:true, msg:res.data});
                                    setFetch(false);
                                }
                            })
                            .catch(e => {
                                console.log(e);
                                setFetch(false);
                                const err = e.response?.data;
                                if (typeof err === "object" && err.msg) {
                                    setError({ is: true, msg: err.msg });
                                } else {
                                    setError({ is: true, msg: "Something went wrong" });
                                }
                            })
                        }}>
                            <Input handler={Ihandler} value={Creds.email} type="email" name="email" placeHolder="Enter your Email"></Input>
                            <Input handler={Ihandler} value={Creds.userName} type="text" name="userName" placeHolder="Enter your Username"></Input>
                            <Input handler={Ihandler} value={Creds.password} type="password" name="password" placeHolder="Enter your password"></Input>
                            <button className="text-white bg-blue-500 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-600 hover:text-white w-[75%]">Register</button>
                            {error.is && <p className="text-red-500 text-xs p-2">{error.msg}</p>}
                            <p className="md:absolute bottom-0 text-xs text-black font-bold p-2 mt-6 md:mt-0 text-center">Already a user? <Link to={"/login"}><span className="text-black underline hover:cursor-pointer hover:text-blue-100">Login</span></Link></p>
                            {fetch&&<div className="absolute flex justify-center items-center rounded w-full h-full glassy-metallic">
                                <Loader></Loader>
                            </div>}
                        </Form>
                        :
                        <Form submitHandler={(e:React.FormEvent<HTMLFormElement>) => {
                            setFetch(true);
                            e.preventDefault();
                            console.log(otp)
                            axios.post(`${api}/user/verifyOtp`, {email:Creds.email, otp:otp.otp})
                            .then((res) => {
                                if(res.data.success && res.data.user) {
                                    const token = res.data.token;
                                    localStorage.setItem("token", token);
                                    dis(actions.setUser(res.data.user));
                                    setFetch(false);
                                    nav("/home")
                                }
                                else {
                                    setFetch(false);
                                    setOtp((pre) => ({...pre, otp:""}));
                                }
                            })
                            .catch(e => {
                                setFetch(false);
                                setOtp((pre) => ({...pre, otp:""}));
                                console.log(e);
                            })
                        }}>
                            {fetch&&<div className="absolute z-100 flex justify-center items-center rounded w-full h-full glassy-metallic">
                                <Loader></Loader>
                            </div>}
                            <h1 className="font-bold hover:text-gray-500 text-xl text-center md:text-left mb-4">Verify Your Email</h1>
                            <p className="text-white text-sm mb-4">We've sent a verification code to {Creds.email}</p>
                            <Input 
                                handler={(e:React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value)
                                    setOtp((prev) => ({
                                        ...prev,
                                        otp: e.target.value,
                                    }))
                                }} 
                                type="text" 
                                value={otp.otp} 
                                name="otp" 
                                placeHolder="Enter OTP">
                            </Input>
                            <button className="text-white bg-blue-500 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-600 hover:text-white w-[50%]">Submit</button>
                        </Form>
                    }
                </div>
                
                <div className="cover w-full md:w-[60%] h-[40vh] md:h-full bg-[#FFF8EA] relative">
                    <img src={login} className="h-full w-full object-cover object-right" alt="Register image"></img>
                    <div className="absolute top-6 left-6 text-white">
                        <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">BookSwap</h1>
                        <p className="text-sm md:text-base drop-shadow-md">Join our community of book lovers</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
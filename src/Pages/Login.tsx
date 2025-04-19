import Form from "../components/Form";
import "./Login.css";
import login from "/login1.jpg"
import Input from "../components/Input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import axios from "axios";
import { actions } from "../store/UserSlice";

const Login = () => {
    const api = import.meta.env.VITE_API_URL;
    const [error, setError] = useState<{is:boolean,msg:string}>({is:false,msg:""});
    const dis = useDispatch();
    const nav = useNavigate();
    
    type user = {
        _id: string,
        email: string,
        username: string,
        wishlist: string[],
        swappedBooks: string[],
        books: string[],
        "__v": number
    }
    
    type response = {
        success: boolean,
        token?: string,
        msg?: string,
        user?: user
    }
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            axios.get(`${api}/user/ValidateToken`, {headers: {"Authorization": `PSPK ${token}`}})
            .then((res) => {
                if(res.data.success === true) {
                    dis(actions.setUser(res.data.user));
                    nav("/home");
                }
                else localStorage.removeItem("token");
            })
            .catch(e => {
                console.log(e);
                localStorage.removeItem("token");
            });
        }
    }, [])
    
    const [Creds, setCreds] = useState<{userName:string,password:string}>({userName:"",password:""});
    
    const Ihandler = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const {name, value} = e.target;
        setCreds((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    
    return (
        <>
            <div className="w-screen login h-screen flex flex-col md:flex-row overflow-auto md:overflow-hidden">
                <div className="cover w-full md:w-[60%] h-[40vh] md:h-full bg-[#FFF8EA] relative">
                    <img src={login} className="h-full w-full object-cover" alt="Login image"></img>
                    <div className="absolute top-6 left-6 text-white">
                        <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">BookSwap</h1>
                        <p className="text-sm md:text-base drop-shadow-md">Exchange stories, expand horizons</p>
                    </div>
                </div>
                
                <div className="creds w-full md:w-[40%] min-h-[60vh] md:h-screen bg-gradient-to-r from-blue-300 via-white to-blue-300 flex flex-col justify-center items-center p-2 md:p-0">
                    <Form submitHandler={(e:React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        axios.post<response>(`${api}/user/login`, {username: Creds.userName, password: Creds.password})
                        .then((res) => {
                            if(res.data.success === true && res.data.token) {
                                dis(actions.setUser(res.data.user));
                                setCreds({ userName: "", password: "" });
                                setError({ is: false, msg: "" });
                                localStorage.setItem("token", res.data.token);
                                nav("/home");
                            }
                            else {
                                setError({is: true, msg: "Some thing went wrong."});
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            setError({is: true, msg: e.response.data.msg});
                        })
                    }}>
                        <h1 className="font-bold hover:text-gray-500 mb-3 text-xl text-center md:text-left">Login</h1>
                        <Input handler={Ihandler} value={Creds.userName} type="text" name="userName" placeHolder="Enter your Username"></Input>
                        <Input handler={Ihandler} value={Creds.password} type="password" name="password" placeHolder="Enter your password"></Input>
                        <button className="text-white bg-blue-400 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white w-[75%]">Login</button>
                        {error.is && <p className="text-xs text-red-500 font-bold p-2">{error.msg}</p>}
                        <p className="md:absolute bottom-0 text-xs text-gray-600 font-bold p-2 mt-6 md:mt-0 text-center">New to BookSwap? <Link to={"/register"}><span className="text-black underline hover:cursor-pointer">Register</span></Link></p>
                    </Form> 
                </div>
            </div>
        </>
    )
}

export default Login
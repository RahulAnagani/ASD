import axios from "axios";
import {  ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actions } from "../store/UserSlice";
import SocketContextProvider from "./Socket";
interface User {
    _id: string;
    email: string;
    username: string;
    wishlist: string[];
    swappedBooks: string[];
    books: string[];
    __v: number;
  }
  type response={
    success:boolean,
    token?:string,
    msg?:string,
    user?:User
}
const AAth:React.FC<{children:ReactNode}>=({children})=>{
    const api=import.meta.env.VITE_API_URL;
    const nav=useNavigate();
    const dis=useDispatch();
    const [userId,setUserId]=useState<string>("");
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            nav("/login");
        }
        else{
            axios.get<response>(`${api}/user/ValidateToken`,{headers:{
                "Authorization":`pspk ${token}`
            }}).then((res)=>{
                if(res.data.success===true){
                    if(res.data.user)
                    setUserId(res.data.user._id);
                    dis(actions.setUser(res.data.user));
                }
                else{
                    localStorage.removeItem("token");
                    nav("/login");
                }
            })
            .catch(e=>{
                console.log(e);
                localStorage.removeItem("token");
                nav("/login");
            })
        }
    },[])
    return (
        <>  
            <SocketContextProvider userId={userId}>
            {children}
            </SocketContextProvider>
        </>
    )
}
export default AAth;
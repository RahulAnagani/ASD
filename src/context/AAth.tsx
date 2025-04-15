import axios from "axios";
import {  ReactNode, useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actions } from "../store/UserSlice";
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
            {children}
        </>
    )
}
export default AAth;
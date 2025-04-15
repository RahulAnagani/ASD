import { IoBook } from "react-icons/io5";
import "./book.css"
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import axios from "axios";

type props={
    title:string,
    author:string,
    rating?:number,
    cover:string,
    badge:string,
    genHanlder?:(abc:string)=>void,
}

const Book:React.FC<props>=({title,author,rating,cover,genHanlder})=>{
    const getGenre=(title:string)=>{
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`)
        .then((res)=>{
            if(res.data.items&&res.data.items.length>1){
                if(res.data.items[0]){
                    setGenre(res.data.items[0].volumeInfo.categories[0]);
                    if(res.data.items[0].volumeInfo.categories[0])
                    if(genHanlder)
                    genHanlder(String(res.data.items[0].volumeInfo.categories[0]));
                }
            }
        })
        .catch(e=>{
            if(genHanlder)
                genHanlder("");
            console.log(e);
        })
    }
    const [genre,setGenre]=useState<string>("");
    const [isOpen,setIsOpen]=useState(false);
    useEffect(()=>{
        getGenre(title);
    },[title]);
    const [loading,setLoading]=useState<boolean>(true);

return (<>
        <div onClick={()=>setIsOpen(prev=>!prev)} className=" cursor-pointer flex transition-transform duration-300 hover:scale-105 bg-gray-400 w-50 h-60 text-black rounded ">
            <div className={`${isOpen ? "w-[30%]" : "w-[70%]"} relative left overflow-hidden rounded h-full dark:bg-gray-300 flex p-2 justify-center items-center`}>
                {loading&&<Spinner></Spinner>}
                {
                    cover&&(cover)?.startsWith("O")?
                    <img className="rounded object-cover h-[75%]" src={`https://covers.openlibrary.org/b/olid/${cover}-M.jpg`} onLoad={()=>setLoading(false)}></img>:
                    <img className="rounded object-cover h-[75%]" src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`} onLoad={()=>setLoading(false)}></img>
                }
            </div>
            <div className={`${isOpen ? "w-[70%]" : "w-[30%]"} duration-200 overflow-x-hidden p-3 right flex flex-col justify-center items-start gap-3  bg-gradient-to-br from-red-400 via-white to-orange-400  dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900`}>
                <IoBook className={`${isOpen ? "hidden" : ""}`}/>
                <h1 className={`text-xs font-bold text-gray-900 ${isOpen ? "hidden" : ""}`}>Details</h1>
                <h1 className={`hyphens-auto font-bold ${isOpen ? "block" : "hidden"}`}>{title}</h1>
                <p className={`text-sm text-gray-600 ${isOpen ? "block" : "hidden"}`}>{author}</p>
                <span className={`bg-red-500 rounded font-bold text-sm p-2 text-white ${isOpen ? "block" : "hidden"}`}>{genre}</span>
                <div className={`justify-center items-center ${isOpen ? "flex" : "hidden"}`}>
                    {rating}
                    {Array(rating).fill(0).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                    ))}
                </div>
            </div>
        </div>
    </>)
}
export default Book;

import { useSelector } from "react-redux";
import Book from "../components/Book";
import Genre from "../components/Genre";
import NavBar from "../components/NavBar";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { RootState } from "../store";
import { useRef, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideBar from "../components/SideBar";
import { motion } from "framer-motion";
import FloatingBar from "../components/FloatingBar";
import FloatAdd from "../components/FloatAdd";

interface User {
  _id: string;
  email: string;
  username: string;
  wishlist: string[];
  swappedBooks: string[];
  books: string[];
  __v: number;
}
interface Book{
  title:string,
  author:string,
  cover:string,
}
const DashBoard = () => {
  const handleSuccess = () => {
    toast.success('Book is Added!');
  };
  const handleError = () => {
    toast.error('Book is Added!');
  };
  const [sideBar,setSideBar]=useState<boolean>(false);
  const user=useSelector((state:RootState)=>(state.user)) as User;
  const trending=[
    {
        "title": "Control Your Mind and Master Your Feelings",
        "cover": "12009823",
        "author": "Eric Robertson"
    },
    {
        "title": "The 48 Laws of Power",
        "cover": "OL24274306M",
        "author": "Robert Greene"
    },
    {
        "title": "Atomic Habits",
        "cover": "OL36647151M",
        "author": "James Clear"
    },
    {
        "title": "Rich Dad Poor Dad Book",
        "cover": "OL47304048M",
        "author": "Robert T. Kiyosaki"
    },
    {
        "title": "I Don't Love You Anymore",
        "cover": "OL52209936M",
        "author": "Rithvik Singh"
    },
    {
        "title": "The Psychology of Money",
        "cover": "OL29412746M",
        "author": "Morgan Housel"
    },
    {
        "title": "The Eye of the World (The Wheel of Time Book 1)",
        "cover": "OL8890304M",
        "author": "Robert Jordan"
    },
    {
        "title": "Harry Potter and the Philosopher's Stone",
        "cover": "OL22856696M",
        "author": "J. K. Rowling"
    },
    {
        "title": "Read People Like a Book",
        "cover": "11983442",
        "author": "Patrick King"
    },
    {
        "title": "Twisted Love",
        "cover": "12940491",
        "author": "Ana Huang"
    }
]
  const genres = [
    {
      value: "Fantasy",
      bg: "bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-800 text-white shadow-lg dark:from-purple-700 dark:via-indigo-800 dark:to-purple-900",
    },
    {
      value: "Sci-Fi",
      bg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700 text-white shadow-lg dark:from-cyan-600 dark:via-blue-800 dark:to-indigo-900",
    },
    {
      value: "Romance",
      bg: "bg-gradient-to-br from-pink-300 via-pink-500 to-red-500 text-white shadow-lg dark:from-pink-600 dark:via-rose-700 dark:to-red-800",
    },
    {
      value: "Thriller",
      bg: "bg-gradient-to-br from-red-400 via-red-600 to-black text-white shadow-lg dark:from-red-700 dark:via-red-900 dark:to-black",
    },
    {
      value: "Mystery",
      bg: "bg-gradient-to-br from-gray-600 via-gray-800 to-black text-white shadow-lg dark:from-gray-800 dark:via-gray-900 dark:to-black",
    },
    {
      value: "Non-fiction",
      bg: "bg-gradient-to-br from-green-400 via-emerald-600 to-teal-700 text-white shadow-lg dark:from-green-700 dark:via-emerald-800 dark:to-teal-900",
    },
  ];
  const sideRef=useRef(null);
  const leftTab=useRef(null);
  useGSAP(()=>{
    if(sideBar){

      gsap.to(sideRef.current,{
        right:0,
        width:"25%"
      })
      gsap.to(leftTab.current,{
        width:"75%"
      })
    }
    else{
      gsap.to(sideRef.current,{
        right:"-10%",
        width:0
      })
      gsap.to(leftTab.current,{
        width:"100%"
      })
    }
  },[sideBar])
  const [floater,SetFloater]=useState(false);
  return (
    <div className="w-screen h-screen relative bg-white dark-mode overflow-x-hidden">
      <ToastContainer />
      {floater&&<FloatAdd handle={
        ()=>{SetFloater(false)
        }
      } handleSucces={()=>handleSuccess()} handlerError={()=>handleError()}></FloatAdd>}
      <div className="h-[15%]  p-4 w-full flex justify-center items-center">
        <NavBar handler={()=>{setSideBar(!sideBar)}} />
      </div>
      <div className="h-[85%] w-full flex gap-4 p-5 relative overflow-hidden">
        <div ref={leftTab} className={`w-full h-full relative flex flex-col overflow-hidden`}>
            <FloatingBar handler={()=>{SetFloater(true)}}></FloatingBar>
          <h1 className="text-3xl font-bold">Welcome back, {user.username} !</h1>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="w-full p-2">
              <h1 className="flex gap-2 items-center text-xl font-bold">
                Top Genres <FaMoneyBillTrendUp />
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
  {genres.map((e, i) => (
    <motion.div
      key={e.value}
      initial={{ rotate: -10, opacity: 0, x: -20, y: -20, scale: 0.8 }}
      animate={{ rotate: 0, opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ rotate: 45, opacity: 0, x: 20, y: 20, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: i * 0.1, 
      }}
    >
      <Genre value={e.value} bg={e.bg} />
    </motion.div>
  ))}
</div>

            </div>

            <div className="w-full mt-6 p-2">
              <h1 className="text-xl font-bold  flex items-center gap-2">
                Trending Books <img className="w-10 dark:invert" src="trend.svg" alt="trend" />
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-4">
                {trending.map((e,i)=>{
                  return (
                    <>
                      <Book key={i} title={e.title} cover={e.cover} author={e.author} badge=""></Book>
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div ref={sideRef} className={`w-[25%] right-[-100%] absolute flex flex-col sm:grid-cols-1 gap-2 justify-center items-center  overflow-y-auto`}>
                  <SideBar></SideBar>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

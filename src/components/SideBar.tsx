import { RiHome2Line } from "react-icons/ri";
import { LuMessageSquareDot } from "react-icons/lu";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { MdOutlineTravelExplore } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { PiBooks } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import RappaRappa from "./RappaRappa";
const SideBar=()=>{
    const nav=useNavigate();
    return (
        <div className="w-full h-full p-2 dark-mode">
            <button  className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div  className="w-[100%] p-5 h-full flex items-center justify-start">
                    <h1>{localStorage.getItem("theme")}</h1><RappaRappa></RappaRappa>    
                </div>
            </button>
            <button onClick={()=>nav("/")} className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <RiHome2Line />
                </div>
                <div  className="w-[80%] h-full flex items-center justify-start">
                    Dashboard
                </div>
            </button>
            <button onClick={()=>nav("/chat")} className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <LuMessageSquareDot />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    Inbox
                </div>
            </button>
            <button onClick={()=>nav("/explore")} className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <MdOutlineTravelExplore ></MdOutlineTravelExplore>
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    Explore
                </div>
            </button>
            <button className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <FaPersonWalkingDashedLineArrowRight />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    Nearby
                </div>
            </button>
            <button  className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <BiSolidCategory />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    Genres
                </div>
            </button>
            <button onClick={()=>nav("/requests")} className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <BiMessageRoundedAdd />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    Request
                </div>
            </button>
            <button className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <CgProfile />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    My Profile
                </div>
            </button>
            <button className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <PiBooks />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    My Books
                </div>
            </button>
            <button className="bg-gray-100  dark:bg-gray-950 flex items-center justify-start   cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-900 rounded  w-full p-2 font-semibold">
                <div className="w-[20%] h-full flex justify-center p-2 items-center">
                <IoIosLogOut />
                </div>
                <div className="w-[80%] h-full flex items-center justify-start">
                    Logout
                </div>
            </button>
            {/* <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">Inbox</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">Explore</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">NearBy</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">Requests</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">Genres</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">Profile</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">My Books</button>
                  <button className="bg-gray-100  dark:bg-black  dark:hover:bg-gray-900 cursor-pointer hover:bg-gray-200 rounded  w-full p-2 font-bold">Logout</button> */}
        </div>
    )
}
export default SideBar;
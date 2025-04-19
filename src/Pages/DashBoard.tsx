import { useSelector } from "react-redux";
import Book from "../components/Book";
import Genre from "../components/Genre";
import NavBar from "../components/NavBar";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { RootState } from "../store";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
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

interface TrendingBook {
  title: string;
  author: string;
  cover: string;
  okey:string
}

interface OpenLibraryWork {
  title: string;
  author_name?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  key:string;
}

interface OpenLibraryResponse {
  works: OpenLibraryWork[];
}

const DashBoard = () => {
  const handleSuccess = () => {
    toast.success('Book is Added!');
  };
  const handleError = () => {
    toast.error('Book is Added!');
  };
  const [sideBar, setSideBar] = useState<boolean>(false);
  const user = useSelector((state: RootState) => (state.user)) as User;
  const [trendingBooks, setTrendingBooks] = useState<TrendingBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get<OpenLibraryResponse>("https://openlibrary.org/trending/daily.json?");
        
        const books = response.data.works.slice(0, 10).map(work => ({
          title: work.title,
          author: work.author_name?.[0] || "Unknown Author",
          cover: work.cover_edition_key || String(work.cover_i || ""),
          okey:work.key
        }));
        setTrendingBooks(books);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch trending books:", err);
        setError("Failed to load trending books. Please try again later.");
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

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
  
  const sideRef = useRef(null);
  const leftTab = useRef(null);
  useGSAP(() => {
    if (sideBar) {
      gsap.to(sideRef.current, {
        right: 0,
        width: window.innerWidth >= 768 ? "25%" : "100%",
        duration: 0.3
      })
      gsap.to(leftTab.current, {
        width: window.innerWidth >= 768 ? "75%" : "0%",
        duration: 0.3
      })
    }
    else {
      gsap.to(sideRef.current, {
        right: "-10%",
        width: 0,
        duration: 0.3
      })
      gsap.to(leftTab.current, {
        width: "100%",
        duration: 0.3
      })
    }
  }, [sideBar])
  
  const [floater, setFloater] = useState(false);
  
  return (
    <div className="w-screen h-screen relative bg-white dark-mode overflow-x-hidden">
      <ToastContainer />
      {floater && <FloatAdd handle={
        () => { setFloater(false) }
      } handleSucces={() => handleSuccess()} handlerError={() => handleError()}></FloatAdd>}
      <div className="h-[15%] p-4 w-full flex justify-center items-center">
        <NavBar handler={() => { setSideBar(!sideBar) }} />
      </div>
      <div className="h-[85%] w-full flex gap-4 p-5 relative overflow-hidden">
        <div ref={leftTab} className={`w-full h-full relative flex flex-col overflow-hidden`}>
          <FloatingBar handler={() => { setFloater(true) }}></FloatingBar>
          <h1 className="text-3xl font-bold">Welcome back, {user.username} !</h1>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="w-full p-2">
              <h1 className="flex gap-2 items-center text-xl font-bold">
                Top Genres <FaMoneyBillTrendUp />
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
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
              <h1 className="text-xl font-bold flex items-center gap-2">
                Trending Books <img className="w-10 dark:invert" src="trend.svg" alt="trend" />
              </h1>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-center place-items-center justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-4">
                  {trendingBooks.map((book, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Book 
                        title={book.title} 
                        cover={book.cover} 
                        author={book.author} 
                        badge=""
                        okeyPath={`/book/${book.okey.split("/")[2]}`}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref={sideRef} className={`w-[25%] md:w-full siders right-[-100%] absolute flex flex-col sm:grid-cols-1 gap-2 justify-center items-center overflow-y-auto`}>
          <SideBar></SideBar>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
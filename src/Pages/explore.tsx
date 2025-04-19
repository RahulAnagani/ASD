import BookCard from "../components/BookCard";
import NavBar from "../components/NavBar";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideBar from "../components/SideBar";
import axios from "axios";
import FloatingBar from "../components/FloatingBar";
import FloatAdd from "../components/FloatAdd";



interface Book {
  title: string;
  author: string;
  cover: string;
  Okey: string;
}

const Explore = () => {
  const handleSuccess = () => {
    toast.success('Book is Added!');
  };
  const handleError = () => {
    toast.error('Book is Added!');
  };

  const [sideBar, setSideBar] = useState<boolean>(false);
  const Booksapi = import.meta.env.VITE_API_URL;
  const sideRef = useRef(null);
  const leftTab = useRef(null);

  useGSAP(() => {
    if (sideBar) {
      gsap.to(sideRef.current, {
        right: 0,
        width:window.innerWidth >= 768 ? "25%" : "100%",
      });
      gsap.to(leftTab.current, {
        width: window.innerWidth >= 768 ? "75%" : "0%",
      });
    } else {
      gsap.to(sideRef.current, {
        right: "-10%",
        width: 0,
      });
      gsap.to(leftTab.current, {
        width: "100%",
      });
    }
  }, [sideBar]);

  const [floater, SetFloater] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios.get(`${Booksapi}/book/getBooks`).then((res) => {
      if (res.data) {
        if (res.data.success) {
          const power = res.data.data.map((e: any) => {
            return {
              cover: e.imageUrl,
              title: e.title,
              author: e.author,
              Okey: e.key,
            };
          });
          setBooks(power);
        }
      }
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <div className="w-screen h-screen relative bg-white dark-mode overflow-x-hidden">
      <ToastContainer></ToastContainer>
      {floater && (
        <FloatAdd
          handle={() => { SetFloater(false); }}
          handleSucces={handleSuccess}
          handlerError={handleError}
        ></FloatAdd>
      )}
      <div className="h-[15%] p-4 w-full flex justify-center items-center">
        <NavBar handler={() => { setSideBar(!sideBar); }} />
      </div>

      <div className="h-[85%] w-full flex gap-4 p-5 relative overflow-hidden">
        <div ref={leftTab} className="w-full h-full relative flex flex-col overflow-hidden">
          <FloatingBar handler={() => { SetFloater(true); }} />
          <h1 className="text-3xl font-bold">Discover New Reads Today!</h1>
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="w-full mt-6 p-2">
              <div className="grid grid-cols-1 justify-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-4">
                {books.map((e, i) => (
                  <BookCard
                    key={i}
                    Okey={e.Okey}
                    title={e.title}
                    author={e.author}
                    cover={e.cover}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={sideRef} className="w-[25%] right-[-100%] absolute flex flex-col sm:grid-cols-1 gap-2 justify-center items-center overflow-y-auto">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default Explore;

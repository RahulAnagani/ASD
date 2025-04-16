import { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import Request from "../components/RequestItem";
import { FaPaperPlane } from "react-icons/fa";
import { CiInboxIn } from "react-icons/ci";
import SideBar from "../components/SideBar";
import { gsap } from "gsap";

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  imageUrl?: string;
  condition?: string;
  isAvailable?: boolean;
  owner?: string;
  location?: {
    ltd: number;
    lng: number;
  };
  key?: string;
};

type User = {
  _id: string;
  username: string;
};

type Req = {
  _id: string;
  fromUser: User;
  toUser: string | User;
  fromBook?: Book;
  toBook: Book;
  status: string;
  type: string;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  req: Req[];
  message?: string;
};

const Requests = () => {
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [requests, setRequests] = useState<Req[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const serverApi = import.meta.env.VITE_API_URL;
        const endpoint = `${serverApi}/request/${tab}`;
        const response = await axios.get<ApiResponse>(endpoint, {
          headers: { Authorization: `abcd ${token}` },
        });

        if (response.data.success) {
          setRequests(response.data.req);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch requests"
          );
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "An error occurred with the request"
          );
        } else {
          setError(
            err instanceof Error ? err.message : "An error occurred"
          );
        }
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [tab]);

  useEffect(() => {
    // Initialize sidebar position
    if (sidebarRef.current) {
      gsap.set(sidebarRef.current, { x: "100%" });
    }
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
    }
  }, []);

  useEffect(() => {
    // Animate sidebar when sidebarOpen changes
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        duration: 0.5,
        x: sidebarOpen ? "0%" : "100%",
        ease: "power3.inOut"
      });
    }

    // Animate overlay
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        duration: 0.5,
        autoAlpha: sidebarOpen ? 0.5 : 0,
        display: sidebarOpen ? "block" : "none",
        ease: "power3.inOut"
      });
    }
  }, [sidebarOpen]);

  const handleTabChange = (newTab: "sent" | "received") => {
    setTab(newTab);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen w-screen dark-mode relative overflow-x-hidden">
      {/* Overlay for when sidebar is open */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black z-10"
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <div className="h-[15%] p-4 w-full">
        <NavBar handler={toggleSidebar} />
      </div>
      
      <div className="w-full p-4">
        <h1 className="font-bold text-2xl">Requests</h1>
        <div className="w-full">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => handleTabChange("sent")}
              className={`dark:bg-gray-800 p-4 rounded ${
                tab === "sent"
                  ? "bg-black text-white shadow-md shadow-gray-700"
                  : "bg-gray-300"
              }`}
            >
              <FaPaperPlane className="focus:invert" />
            </button>
            <button
              onClick={() => handleTabChange("received")}
              className={`dark:bg-gray-800 p-4 rounded ${
                tab === "received"
                  ? "bg-black text-white shadow-md shadow-gray-700"
                  : "bg-gray-300"
              }`}
            >
              <CiInboxIn />
            </button>
          </div>
        </div>
        
        <div className="w-full min-h-[50dvh] flex flex-col gap-3 p-1">
          <h1 className="font-bold mt-3">{tab.toUpperCase()}</h1>
          <div
            className={`flex justify-center rounded items-center p-1 transition-all duration-300 h-[10dvh]`}
          >
            <div className="w-[10%] flex justify-start items-center">
              <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">
                Profile
              </h1>
            </div>

            <div className="w-[20%] flex justify-start items-center">
              <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">
                Username
              </h1>
            </div>

            <div className="w-[20%] flex relative justify-start items-center">
              <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">
                Book Title
              </h1>
            </div>

            <div className="w-[20%] flex flex-col justify-start items-center">
              <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">
                Request Type
              </h1>
            </div>

            <div className="w-[10%] flex justify-start items-center">
              <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">
                Status
              </h1>
            </div>

            <div className="w-[20%] flex justify-around items-center">
              <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">
                Time of Request
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading requests...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40 text-red-500">
              <p>{error}</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>No {tab} requests found</p>
            </div>
          ) : (
            requests.map((req) => (
              <Request
                key={req._id}
                username={
                  tab === "sent"
                    ? (req.toUser as User)?.username || (req.toUser as string)
                    : req.fromUser.username
                }
                status={req.status}
                fromBook={req.fromBook || { title: "", author: "", genre: "" }}
                toBook={req.toBook}
                time={req.createdAt}
                type={tab}
                requestType={req.type.toLowerCase() as "swap" | "buy"}
              />
            ))
          )}
        </div>
      </div>

      <div 
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-4 z-20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Menu</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        <SideBar />
      </div>
    </div>
  );
};

export default Requests;
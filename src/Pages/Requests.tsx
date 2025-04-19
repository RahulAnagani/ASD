import { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import Request from "../components/RequestItem";
import { FaPaperPlane } from "react-icons/fa";
import { CiInboxIn } from "react-icons/ci";
import SideBar from "../components/SideBar";
import { gsap } from "gsap";
import Spinnit from "../components/Spinnit";

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
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
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
    if (mainContentRef.current) {
      gsap.to(mainContentRef.current, {
        duration: 0.3,
        width: sidebarOpen ? window.innerWidth >= 768 ? "75%" : "0%": "100%",
        ease: "power2.out"
      });
    }

    if (sidebarRef.current) {
      if (sidebarOpen) {
        gsap.to(sidebarRef.current, {
          duration: 0.3,
          width:window.innerWidth >= 768 ? "25%" : "100%",
          opacity: 1,
          display: "block",
          ease: "power2.out"
        });
      } else {
        gsap.to(sidebarRef.current, {
          duration: 0.2,
          width: "0%",
          opacity: 0,
          onComplete: () => {
            if (sidebarRef.current) {
              sidebarRef.current.style.display = "none";
            }
          },
          ease: "power2.in"
        });
      }
    }
  }, [sidebarOpen]);

  const handleTabChange = (newTab: "sent" | "received") => {
    setTab(newTab);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [fetching,setFetching]=useState(false);
  return (
    <div className="min-h-screen relative w-screen dark-mode flex flex-col overflow-hidden">
      {fetching&&<Spinnit></Spinnit>}
      <div className="w-full">
        <div className="h-[15%] p-4">
          <NavBar handler={toggleSidebar} />
        </div>
      </div>
      
      <div 
        ref={contentAreaRef}
        className="flex flex-1 w-full overflow-hidden"
      >
        <div 
          ref={mainContentRef}
          className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
          style={{ width: sidebarOpen ? "75%" : "100%" }}
        >
          <div className="p-4">
            <h1 className="font-bold text-2xl mb-4">Requests</h1>
            
            <div className="flex gap-2 p-2 mb-4 border-b dark:border-gray-700">
              <button
                onClick={() => handleTabChange("sent")}
                className={`flex cursor-pointer items-center gap-2 py-2 px-4 rounded-t transition-all ${
                  tab === "sent"
                    ? "bg-black text-white dark:bg-gray-700 shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <FaPaperPlane size={16} /> 
                <span>Sent</span>
              </button>
              <button
                onClick={() => handleTabChange("received")}
                className={`flex cursor-pointer items-center gap-2 py-2 px-4 rounded-t transition-all ${
                  tab === "received"
                    ? "bg-black text-white dark:bg-gray-700 shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <CiInboxIn size={18} /> 
                <span>Received</span>
              </button>
            </div>
            
            <div className="w-full min-h-[50dvh] flex flex-col gap-3">
              <div
                className="flex justify-between rounded items-center p-1 transition-all duration-300 h-[10dvh] bg-gray-100 dark:bg-gray-800"
              >
                <div className="w-[10%] flex justify-start items-center">
                  <h1 className="font-bold text-sm chins  text-gray-500 dark:text-gray-400">
                    Profile
                  </h1>
                </div>

                <div className="w-[20%] flex justify-start items-center">
                  <h1 className="font-bold text-sm chins text-gray-500 dark:text-gray-400">
                    Username
                  </h1>
                </div>

                <div className="w-[20%] thiry relative justify-start items-center">
                  <h1 className="font-bold chins text-sm text-gray-500 dark:text-gray-400">
                    Book Title
                  </h1>
                </div>

                <div className="w-[20%]  flex flex-col justify-start items-center">
                  <h1 className="font-bold chins text-sm text-gray-500 dark:text-gray-400">
                    Request Type
                  </h1>
                </div>

                <div className="w-[10%] jsp flex justify-start items-center">
                  <h1 className="font-bold text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </h1>
                </div>

                <div className="w-[20%] jsp flex justify-around items-center">
                  <h1 className="font-bold text-sm text-gray-500 dark:text-gray-400">
                    Time of Request
                  </h1>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-40 text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p>{error}</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-40 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No {tab} requests found</p>
                  {tab === "sent" ? (
                    <p className="text-sm text-gray-400">Your outgoing requests will appear here</p>
                  ) : (
                    <p className="text-sm text-gray-400">Incoming requests from other users will appear here</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.map((req) => (
                    <Request
                      handler={(val:boolean)=>{setFetching(val)}}
                      key={req._id}
                      id={req._id}
                      username={
                        tab === "sent"
                          ? (req.toUser as User)?.username || (req.toUser as string)
                          : req.fromUser.username
                      }
                      status={req.status as "received" | "pending" | "accepted" | "declined" | "canceled"}
                      fromBook={req.fromBook || { title: "", author: "", genre: "" }}
                      toBook={req.toBook}
                      time={req.createdAt}
                      type={tab}
                      requestType={req.type.toLowerCase() as "swap" | "buy"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div 
          ref={sidebarRef}
          className="h-full overflow-y-auto shadow-md"
          style={{ width: sidebarOpen ? "25%" : "0%", display: sidebarOpen ? "block" : "none" }}
        >
          <div className="p-4">
            <SideBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
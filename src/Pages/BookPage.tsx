import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Loader1 from "../components/Loader1";
import AVBox from "../components/AVBox";
import BookRequestHandler from "../components/MakeRequest";

const markdownToFormattedText = (markdown: string | undefined): string => {
  if (!markdown) {
    return "";
  }

  let plainText = markdown
    .replace(/#{1,6}\s+/g, (match) => match.replace(/#/g, ""))
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, (match) => match.replace(/\[|\]/g, ""))
    .replace(/^- \s+/g, "- ")
    .replace(/\n/g, "<br />");

  return plainText;
};

interface MarkdownRendererProps {
  markdownContent: string | undefined;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent }) => {
  const formattedText = markdownToFormattedText(markdownContent);

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

interface TabProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ title, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg dark:shadow-blue-500/50"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {title}
    </button>
  );
};

const Explore = () => {
  const { title } = useParams<{ title: string }>();
  const [sideBar, setSideBar] = useState<boolean>(false);
  const sideRef = useRef(null);
  const leftTab = useRef(null);
  const [tit, setTitle] = useState("");
  const [authorKey, setAuthorKey] = useState("");
  const [cover, setCover] = useState("");
  const [coverIds, setCoverIds] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [links, setLinks] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("description");

  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  useGSAP(() => {
    if (sideBar) {
      gsap.to(sideRef.current, {
        right: 0,
        width: "25%",
        ease: "power2.out",
        duration: 0.5
      });
      gsap.to(leftTab.current, {
        width: "73%", 
        ease: "power2.out",
        duration: 0.5
      });
    } else {
      gsap.to(sideRef.current, {
        right: "-10%",
        width: 0,
        ease: "power2.out",
        duration: 0.3
      });
      gsap.to(leftTab.current, {
        width: "100%",
        ease: "power2.out",
        duration: 0.5
      });
    }
  }, [sideBar]);

  useEffect(() => {
    setTitle("");
    setCover("");
    setAuthorKey("");
    setAuthor("");
    setDescription("");
    setLinks([]);
    setCoverIds([]);
  
    axios.get(`https://openlibrary.org/works/${title}.json`)
      .then((res) => {
        if (res.data) {
          setTitle(res.data.title);
          
          if (res.data.covers && res.data.covers.length > 0) {
            setCover(res.data.covers[0] || "");
            setCoverIds(res.data.covers.slice(0, 5) || []);
          }
          
          if (res.data.authors) {
            setAuthorKey(res.data.authors[0].author.key);
          }
  
          if (res.data.description) {
            setDescription(
              typeof res.data.description === "string"
                ? res.data.description
                : res.data.description.value
            );
          }
  
          if (res.data.links) {
            setLinks(res.data.links);
          }
        }
      })
      .catch((E) => {
        console.log(E);
      });
  }, [title]);
  
  useEffect(() => {
    if (authorKey.startsWith("/")) {
      axios.get(`https://openlibrary.org${authorKey}.json`)
        .then((res) => {
          if (res.data) {
            setAuthor(res.data.personal_name);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [authorKey]);

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const getCoverImageUrl = (coverId: string) => {
    return typeof coverId === 'string' && coverId.startsWith("O")
      ? `https://covers.openlibrary.org/b/olid/${coverId}-L.jpg`
      : `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  };

  const [load, setLoad] = useState(true);
  
  type availabilit = {
    owner: {
      username: string
    },
    location: {
      coords: {
        ltd: number,
        lng: number,
      }
      locationName: string
    },
    bookId: string
  }
  type SwapRequest = {
    _id: string,
    fromUser: {
        _id: string,
        username: string
    },
    toUser: string,
    fromBook: {
        location: {
            ltd: number,
            lng: number
        },
        _id: string,
        owner: string,
        title: string,
        author: string,
        genre: string,
        condition: string,
        isAvailable: boolean,
        imageUrl: string,
        key: string,
        __v: number
    },
    toBook: {
        location: {
            ltd: number,
            lng: number
        },
        _id: string,
        owner: string,
        title: string,
        author: string,
        genre: string,
        condition: string,
        isAvailable: boolean,
        imageUrl: string,
        key: string,
        __v: number
    },
    status: string,
    type: string,
    createdAt: string,
    __v: number
}
  
  const [availability, setAvailability] = useState<availabilit[]>([]);
  const [fetchAvailability, setFetchAvailability] = useState(false);
  const [avaPage, setAvaPage] = useState(false);
  const serverApi = import.meta.env.VITE_API_URL;
  const [existing,setExisting]=useState<SwapRequest[]>([]);
  useEffect(() => {
    if (avaPage) {
      const okey = title;
      const token = localStorage.getItem("token");
      if (!okey || !token) {
        setFetchAvailability(false);
        return;
      } else {
        setAvailability([]);
        setFetchAvailability(true);
        axios.get(`${serverApi}/book/availability`, {
          params: {
            okey: okey
          },
          headers: {
            "Authorization": `pspk ${token}`
          }
        }).then((res) => {
          setAvailability(res.data.availability);
          setExisting(res.data.existingRequests);
          setFetchAvailability(false);
        })
        .catch(e => {
          console.log(e);
          setAvaPage(false);
        });
      }
    }
  }, [avaPage, title, serverApi]);

  const [reqPage, setreqPage] = useState(false);
  const [bookId, setbookId] = useState("");
  const [username, setUsername] = useState("");
  
  const handler = (id: string, username: string) => {
    setbookId(id);
    setUsername(username);
    setAvaPage(false);
    setAvailability([]);
    setreqPage(true);
  };
  
  const closeHandler = () => {
    setreqPage(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col relative bg-white dark:bg-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {avaPage && (
        <div className="fixed flex items-center justify-center glassy-metallic w-full h-full z-50">
          {fetchAvailability && <Loader1 />}
          {!fetchAvailability && (
            <div className="flex justify-center items-center w-full h-full">
              <AVBox onClose={() => { setAvaPage(false) }} handler={handler} existingRequests={existing} availability={availability} bookName={tit} />
            </div>
          )}
        </div>
      )}
      {reqPage && (
        <div className="fixed flex items-center justify-center glassy-metallic w-full h-full z-50">
          <BookRequestHandler onRequestComplete={closeHandler} tobook={{
            title: tit,
            okey: title as string,
            cover: cover,
            id: bookId,
            username: username
          }} />
        </div>
      )}
      
      <div className="h-[15%] p-4 w-full flex justify-center items-center">
        <NavBar handler={() => setSideBar(!sideBar)} />
      </div>

      <div className="flex-grow w-full flex gap-4 overflow-auto p-5 relative">
        <div 
          ref={leftTab} 
          className="w-full h-full relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="w-full h-full flex flex-col p-6">
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <div className="flex flex-col items-center md:w-1/3">
                {cover ? (
                  <>
                    <div className="rounded-lg overflow-hidden shadow-xl dark:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                      <img 
                        className="object-cover h-[300px] w-full" 
                        src={getCoverImageUrl(cover)}
                        onLoad={() => setLoad(false)}
                        alt="Book cover" 
                      />
                    </div>
                    {!load && (
                      <button 
                        onClick={() => { setAvaPage(true) }}  
                        className="mt-4 cursor-pointer rounded-lg text-white font-bold p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg dark:shadow-blue-500/50 w-full"
                      >
                        Check Availability
                      </button>
                    )}
                    {load && <Loader />}
                  </>
                ) : (
                  load && <Loader />
                )}
              </div>
              
              <div className="flex flex-col flex-grow md:w-2/3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{tit}</h1>
                <h2 className="text-xl text-gray-500 dark:text-gray-300">by {author}</h2>
                
                <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6 overflow-x-auto">
                  <Tab 
                    title="Description" 
                    active={activeTab === "description"} 
                    onClick={() => setActiveTab("description")} 
                  />
                  <Tab 
                    title="Links" 
                    active={activeTab === "links"} 
                    onClick={() => setActiveTab("links")} 
                  />
                  <Tab 
                    title="Covers" 
                    active={activeTab === "covers"} 
                    onClick={() => setActiveTab("covers")} 
                  />
                </div>
                
                <div className="mt-4 overflow-y-auto flex-grow">
                  {activeTab === "description" && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 backdrop-blur-sm">
                      <div 
                        className={`${!isDescriptionExpanded ? 'line-clamp-3' : ''} text-gray-700 dark:text-gray-200`}
                        style={{ display: 'webkit-box', WebkitBoxOrient: 'vertical' }}
                      >
                        <MarkdownRenderer markdownContent={description} />
                      </div>
                      <button 
                        className="mt-2 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" 
                        onClick={toggleDescription}
                      >
                        {isDescriptionExpanded ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                  
                  {activeTab === "links" && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {links.length > 0 ? (
                        links.map((link, index) => (
                          <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-xl shadow-lg dark:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center text-center"
                          >
                            <h4 className="font-semibold text-lg">{link.title}</h4>
                            <p className="text-sm mt-2">Click to visit</p>
                          </a>
                        ))
                      ) : (
                        <p className="col-span-2 text-center text-gray-600 dark:text-gray-300">No links available for this book.</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "covers" && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {coverIds.length > 0 ? (
                          coverIds.map((coverId, index) => (
                            <div 
                              key={index} 
                              className="rounded-lg overflow-hidden shadow-lg dark:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300"
                            >
                              <img 
                                src={getCoverImageUrl(coverId)} 
                                alt={`${tit} cover ${index + 1}`} 
                                className="w-full h-60 object-cover"
                              />
                            </div>
                          ))
                        ) : (
                          <p className="col-span-3 text-center text-gray-600 dark:text-gray-300">No additional covers available for this book.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={sideRef}
          className="w-[25%] right-[-100%] absolute flex flex-col sm:grid-cols-1 gap-2 justify-center items-center overflow-y-auto bg-white dark:bg-gray-800 shadow-xl dark:shadow-blue-500/20 rounded-l-lg transition-all duration-300"
        >
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default Explore;
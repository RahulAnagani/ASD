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

  const Explore = () => {
    const { title } = useParams<{ title: string }>();
    const [sideBar, setSideBar] = useState<boolean>(false);
    const sideRef = useRef(null);
    const leftTab = useRef(null);
    const [tit, setTitle] = useState("");
    const [authorKey, setAuthorKey] = useState("");
    const [cover, setCover] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [links, setLinks] = useState<any[]>([]);


    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

    useGSAP(() => {
      if (sideBar) {
        gsap.to(sideRef.current, {
          right: 0,
          width: "25%",
        });
        gsap.to(leftTab.current, {
          width: "75%",
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

    useEffect(() => {
      setTitle("");
      setCover("");
      setAuthorKey("");
      setAuthor("");
      setDescription("");
      setLinks([]);
    
      axios.get(`https://openlibrary.org/works/${title}.json`)
        .then((res) => {
          if (res.data) {
            setTitle(res.data.title);
            setCover(res.data.covers?.[0] || ""); // Fallback if cover missing
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
    const [load,setLoad]=useState(true);
    type availabilit={
      owner:{
        username:string
      },
      location:{
        coords:{
          ltd:number,
          lng:number,
        }
        locationName:string
      },
      bookId:string
    }
    const [availability,setAvailability]=useState<availabilit[]>([]);
    const [fetchAvailability,setFetchAvailability]=useState(false);
    const [avaPage,setAvaPage]=useState(false);
    const serverApi=import.meta.env.VITE_API_URL;
    useEffect(()=>{
      if(avaPage){
        const okey=title;
        const token=localStorage.getItem("token");
        if(!okey||!token){
          setFetchAvailability(false);
          return ;
        }
        else{
          setAvailability([]);
          setFetchAvailability(true);
          axios.get(`${serverApi}/book/availability`,{
            params:{
              okey:okey
            },
            headers:{
              "Authorization":`pspk ${token}`
            }
          }).then((res)=>{
            setAvailability(res.data.availability);
            setFetchAvailability(false);
          })
          .catch(e=>
            {
              console.log(e);
              setAvaPage(false);
            }
          )
        }
      }
      },[avaPage]);

    const [reqPage,setreqPage]=useState(false);
    const [bookId,setbookId]=useState("");
    const [username,setUsername]=useState("")
    const handler=(id:string,username:string)=>{
      setbookId(id);
      setUsername(username)
      setAvaPage(false);
      setAvailability([]);
      setreqPage(true);
    }
    const closeHandler=()=>{
      setreqPage(false);
    }
    return (
      <div className={`w-screen h-screen flex flex-col relative  bg-white dark-mode overflow-x-hidden `}>
        {avaPage&&<div className="fixed flex items-center justify-center glassy-metallic w-full h-full z-100 ">
            {fetchAvailability&&<Loader1></Loader1>}
            {!fetchAvailability&&
              <div className="flex justify-center items-center w-full h-full">
                 <AVBox handler={handler} availability={availability} bookName={tit}></AVBox>
              </div>
            }
        </div>
        }
        {reqPage && 
  <div className="fixed flex items-center justify-center glassy-metallic w-full h-full z-100">
    <BookRequestHandler  onRequestComplete={closeHandler} tobook={{
      title:tit,
      okey:title as string,
      cover:cover,
      id:bookId,
      username:username
    }}></BookRequestHandler>
  </div>
}
        <div className="h-[15%] p-4 w-full flex justify-center items-center">
          <NavBar handler={() => setSideBar(!sideBar)} />
        </div>

        <div className="flex-grow w-full flex gap-4 p-5 relative">
          <div ref={leftTab} className="w-full dark-mode h-full relative flex flex-col bg-white">
            <div className="w-full h-full flex flex-col p-4">
              <div className="flex flex-col gap-5 justify-center items-center mb-4">
                {cover ? (
                  <>
                  <img className="rounded object-cover h-[300px]" src={getCoverImageUrl(cover)}
                  onLoad={()=>setLoad(false)}
                  alt="Book cover" />
                  {!load&&<button onClick={()=>{
                    setAvaPage(true)
                    }}  className="cursor-pointer container008 rounded text-white font-bold p-3">Check Availability</button>}
                  {load&&<Loader></Loader>}
                  </>

                ) : (
                  load&&<Loader></Loader>
                )}
              </div>
              <h1 className="text-3xl font-bold text-center">{tit}</h1>
              <h2 className="text-xl text-center text-gray-500">{author}</h2>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <div 
                  className={`text-sm ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}
                  style={{ display: 'webkit-box', WebkitBoxOrient: 'vertical' }}>
                  <MarkdownRenderer markdownContent={description} />
                </div>
                <button 
                  className="text-blue-500 mt-2" 
                  onClick={toggleDescription}>
                  {isDescriptionExpanded ? "Show Less" : "Show More"}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
                {links.slice(0, 4).map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center text-center"
                  >
                    <h4 className="font-semibold text-lg">{link.title}</h4>
                    <p className="text-sm mt-2">Click to visit</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={sideRef}
            className="w-[25%] right-[-100%] absolute flex flex-col sm:grid-cols-1 gap-2 justify-center items-center overflow-y-auto"
          >
            <SideBar />
          </div>
        </div>
      </div>
    );
  };

  export default Explore;

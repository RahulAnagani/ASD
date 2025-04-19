    import { useEffect, useRef, useState } from "react";
    import { CgDanger } from "react-icons/cg";
    import SearchBar from "./SearchBar";
    import Suggestion from "./Suggestion";
    import axios, { CancelTokenSource } from "axios";
    import { ImCross } from "react-icons/im";
import Book from "./Book";
import { IoChevronBackSharp } from "react-icons/io5";
import BookCondition from "./BookCondition";
import Availability from "./Availability";
import Location from "./Location";
import SwipeToConfirm from "./Slider";

const FloatAdd:React.FC<{handle:()=>void,handleSucces:()=>void,handlerError:()=>void}>=({handle,handleSucces,handlerError})=>{
    type suggestion={
        title:string,
        author:string,
        cover:string,
        coverId:string,
        Okey:string
        }
        type Location={
            description:string,
            place_id:string,
        }
        type condition="new"|"fair"|"poor"|"good";
        const [cond,setCond]=useState<condition>("new");
        const [av,setav]=useState<boolean>(true);
        const searchRef=useRef<HTMLDivElement>(null);
        const [suggestions,setSuggestions]=useState<suggestion[]>([]);
        const [location,setLocation]=useState<Location>({description:"",place_id:""});
        const [success,setSuccess]=useState(3);
        useEffect(()=>{
            if(success==1){
                handleSucces();
                handle();
            }
            else if(success==2){
                handlerError();
                handle();
            }
        },[success]);
        const [locationQuery,setLocationQuery]=useState("");
        const [locationPredictions,setLocationPredictions]=useState<Location[]>([]);
        const [step,setStep]=useState<number>(1);
        let cancelToken: any;
        const [query, setQuery] = useState('');
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                    setSuggestions([]);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
                };
            }, []);
            const token=localStorage.getItem("token");
            useEffect(()=>{
                if (query.trim().length < 3) {
                    setSuggestions([]);
                    return;
                }
                const delayDebounce = setTimeout(() => {
                    if (cancelToken) cancelToken.cancel(); // cancel previous request
                    cancelToken = axios.CancelToken.source();
                    axios
                    .get("https://openlibrary.org/search.json", {
                        params: { q: query, limit: 5 },
                        cancelToken: cancelToken.token,
                    })
                    .then((res) => {
                        if (res.data.num_found > 0) {
                            const newSuggestions = res.data.docs.map((doc: any) => ({
                                title: doc.title,
                                author: doc.author_name?.[0] ?? "Unknown",
                                cover:doc.cover_edition_key,
                                coverId:doc.cover_i,
                                Okey:doc.key
                        }));
                        setSuggestions(newSuggestions);
                    } else {
                        setSuggestions([]);
                    }
                })
                .catch((err) => {
                    if (!axios.isCancel(err)) {
                        console.error("Search error:", err);
                    }
                });
            }, 300);
            return () => clearTimeout(delayDebounce);
        },[query]);
        const serverApi=import.meta.env.VITE_API_URL;
        const cancelTokenRef = useRef<CancelTokenSource | null>(null);
        useEffect(()=>{
            const token=localStorage.getItem("token");
            if (locationQuery.trim().length < 4||!token) {
                setLocationPredictions([]);
                return;
            }
            const delayDebounce = setTimeout(() => {
                if (cancelTokenRef.current) cancelTokenRef.current.cancel(); 
                cancelTokenRef.current = axios.CancelToken.source();
                axios
                .get(`${serverApi}/maps/locations`,{headers:{
                    "Authorization":`rp ${token}`
                },params:{
                    "location":locationQuery
                },cancelToken:cancelTokenRef.current.token})
                .then((res) => {
                    if(res.data){
                        if(res.data.success){
                            setLocationPredictions(res.data.data);
                        }
                        else{
                            setLocationPredictions([]);
                        }
                    }
                    else setLocationPredictions([]);
                })
                .catch((err) => {
                    if (!axios.isCancel(err)) {
                        console.error("Search error:", err);
                    }
                });
            }, 300);
            return () => clearTimeout(delayDebounce);
        },[locationQuery]);
        
        const suggestionHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
            setQuery(e.target.value);
        }
        const [selectedBook,setSelectedBook]=useState<suggestion>({title:"",author:"",cover:"",coverId:"",Okey:""});
        const [genre,setGenre]=useState("");
        const [tempFlag,setFlag]=useState(false);
        const genHanlder=(abc:string)=>{
            setGenre(abc);
            if(abc.length===0)
                setFlag(true);
            else setFlag(false);
        }
        const handler=(obj:suggestion)=>{
            setSelectedBook(obj);
            // console.log(obj);
            setStep(2);
        }
        return (
            <div className="w-full h-full z-100 absolute flex justify-center items-center glassy-metallic  flex-col">
                <form onSubmit={(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();

}} className="bg-white dark:bg-gray-700 dark:border-gray-600 border relative border-gray-300 p-0 puf w-[75%] flex  items-center justify-start gap-0 h-[75%] rounded" >
                    <>
                    <div className="w-[50%] lefter h-full">
                        <img src="/BookSwap-React/login1.jpg" className="w-full rounded h-full rounded-r-none object-cover"></img>
                    </div>
                    <ImCross onClick={handle} className="absolute z-100 right-1 invert top-1 m-4 cursor-pointer hover:fill-red-500 hover:invert-0"/>
                    <div className="w-[50%] righter h-full flex flex-col gap-5 relative py-5 rounded  bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed]  items-center">
                    {step>1&&<IoChevronBackSharp onClick={()=>{
                        if(step>1){
                            setStep(step-1);
                        }
                    }} className="absolute left-1 top-1 invert m-4 cursor-pointer hover:fill-red-500"/>}

                        <h1 className="font-bold text-2xl text-white ">Add a Book</h1>
                        {step===1&&<div className="w-full flex justify-center items-center">
                        <div ref={searchRef} className="w-[100%] flex flex-col p-0 relative justify-center items-center ">
                        <SearchBar value={query} handler={suggestionHandler}></SearchBar>
                        <div className="absolute w-[75%] fuf h-auto rounded rounded-t-0 dark:bg-gray-900 bg-gray-300 z-100 top-[90%]">
                            {
                                suggestions.map((e)=>{
                                    return <Suggestion handler={handler} Okey={e.Okey}  key={e.coverId} title={e.title} author={e.author} coverId={e.coverId} cover={e.cover}></Suggestion>
                                })
                            }
                        </div>
                    </div>
                    </div>}
                    {step===2&&<>
                            <Book okeyPath={selectedBook.Okey} genHanlder={genHanlder} title={selectedBook.title} cover={selectedBook.cover??String(selectedBook.coverId)} author={selectedBook.author} badge=""></Book>
                            <div className="w-[50%] mt-3 flex flex-col gap-2 items-center justify-around">
                                {
                                    tempFlag&&<>
                                        <input value={genre} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setGenre(e.target.value)} required className="border-gray-300 font-bold placeholder:font-semibold bg-gray-200 p-1 placeholder:text-sm rounded focus:outline-0 border" placeholder="Enter the genre of the book"></input>
                                    </>
                                }
                            <button onClick={()=>{if(genre.length>=3)setStep(3)}} className="m-0 cursor-pointer bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 rounded p-2 px-4 font-bold text-white shadow-lg hover:from-green-500 hover:to-lime-600 transition-all duration-300">
                                Add book
                            </button>
                            </div>
                    </>}
                    {
                        step===3&&
                        <div className="w-full flex  items-center gap-10 flex-col justify-center p-2 ">
                        <BookCondition initial={cond} onConditionChange={(cnd:condition)=>{setCond(cnd)}}></BookCondition>
                        <Availability initial={av} onChange={(val)=>{setav(val)}}></Availability>
                        <button onClick={()=>{
                             setStep(4);
                        }} className="m-0 bg-gradient-to-r from-green-400 cursor-pointer via-emerald-500 to-lime-500 rounded p-2 px-4 font-bold text-white shadow-lg hover:from-green-500 hover:to-lime-600 transition-all duration-300">
                        Add book
                        </button>

                        </div>
                    }
                    {
                        (step===4)&&(av?
                            (
                                <>
                                    <div className="w-full h-full flex overflow-hidden items-center justify-start flex-col">
                                        <div className="w-full m-2">
                                        <h1 className="font-bold text-white text-lg w-full px-5">Setup Book Location</h1>
                                        </div>
                                        {location.description.length===0?<div className="w-full flex-col flex relative items-center justify-center">
                                            <div className="w-full flex justify-center items-end">
                                        <SearchBar value={locationQuery} handler={(e:React.ChangeEvent<HTMLInputElement>)=>{
                                            setLocationQuery(e.target.value);
                                        }}></SearchBar>
                                        </div>
                                        <div className="w-[75%] fuf top-[100%] h-80 overflow-y-auto ">
                                            {
                                                locationPredictions.map((e,i)=>{
                                                    return (
                                                        <>
                                                            <Location key={i} description={e.description} place_id={e.place_id} handler={(pid,loc)=>{
                                                                const newLoc:Location={
                                                                    place_id:pid,
                                                                    description:loc
                                                                }
                                                                setLocation(newLoc);
                                                            }}></Location>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                        </div>:
                                        <>
                                            <div className="w-[75%] fuf p-5 flex glassy-metallic mt-10 flex-col items-center justify-center">
                                                <div className="w-full flex items-center justify-center">
                                                <h1 className="text-white font-semibold text-lg">Selected Location: </h1>
                                                </div>
                                                <div className="w-full flex items-center justify-center p-3">
                                                <h1 className="w-full text-gray-900 font-bold">{location.description}</h1>
                                                </div>
                                                <div className="w-full flex flex-col items-center justify-center gap-3">
                                                <button
                                                onClick={()=>{
                                                    setStep(5);
                                                }}
                                                className="bg-gradient-to-br from-blue-800 via-emerald-500 to-pink-600 hover:bg-gradient-to-br hover:to-blue-800 hover:via-emerald-500 hover:from-pink-600 p-2 cursor-pointer text-white rounded font-bold">Confirm-{">"}</button>    
                                                <button
                                                onClick={()=>{
                                                    setLocation({description:"",place_id:""});
                                                }
                                                }
                                                className="flex items-center justify-center text-sm hover:underline text-white cursor-pointer hover:text-red-500"><CgDanger />Choose another location</button>
                                                </div>
                                            </div>
                                        </>
                                        }
                                    </div>
                                </>
                            ):(
                                <div className="w-full h-full flex flex-col justify-center items-center">
                                    <h1 className="text-green-500 font-bold">Slide to confirm</h1>
                                    <SwipeToConfirm onComplete={()=>{
                                        axios.post(`${serverApi}/book/addBook`,{
                                            title:selectedBook.title,
                                            author:selectedBook.author,
                                            genre:genre,
                                            condition:cond,
                                            isAvailable:av,
                                            key:selectedBook.Okey,
                                            location:"Not available",
                                            imageUrl:selectedBook.cover?selectedBook.cover:selectedBook.coverId,
                                        },{
                                            headers:{
                                                Authorization:`jsp ${token}`
                                            }
                                        })
                                        .then((res)=>{
                                            if(res.data.success)
                                            setSuccess(1);
                                        })
                                        .catch(e=>{
                                            console.log(e);
                                            setSuccess(2);
                                        })
                                    }}></SwipeToConfirm>
                                </div>
                            )
                        )
                    }
                    {
                        step===5&&
                        <div className="w-full h-full flex flex-col justify-center items-center">
                                    <h1 className="text-green-500 font-bold">Slide to confirm</h1>
                                    <SwipeToConfirm onComplete={()=>{
                                        axios.post(`${serverApi}/book/addBook`,{
                                            title:selectedBook.title,
                                            author:selectedBook.author,
                                            genre:genre,
                                            condition:cond,
                                            isAvailable:av,
                                            location:location.place_id,
                                            imageUrl:selectedBook.cover?selectedBook.cover:selectedBook.coverId,
                                            key:selectedBook.Okey
                                        },{
                                            headers:{
                                                Authorization:`jsp ${token}`
                                            }
                                        })
                                        .then((res)=>{
                                            if(res.data.success)
                                            setSuccess(1);
                                        })
                                        .catch(e=>{
                                            console.log(e);
                                            setSuccess(2);
                                        })
                                    }}></SwipeToConfirm>
                                </div>
                    }

                    </div>
                    </>
                </form>
            </div>
        )
    }
    export default FloatAdd;    
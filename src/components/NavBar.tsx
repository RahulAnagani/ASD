import SearchBar from "./SearchBar";
import ThemeToggle from "./Toggle";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Suggestion from "./Suggestion";
import { Link, useNavigate } from "react-router-dom";
const NavBar: React.FC<{ handler: () => void }> = ({ handler }) => {
    let cancelToken: any;
    const [query, setQuery] = useState('');
    type suggestion = {
        title: string,
        author: string,
        cover: string,
        coverId: string,
        Okey:string
    }

    const [suggestions, setSuggestions] = useState<suggestion[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const nav=useNavigate();
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

    useEffect(() => {
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
                            cover: doc.cover_edition_key,
                            coverId: doc.cover_i,
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
    }, [query]);

    const suggestionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }
    const extractId = (str: string): string => {
        const parts = str.split('/');
        return parts[parts.length - 1]; 
      };
    return (
        <div className="w-full dark:bg-gray-900 dark:border-0 top-0 border border-gray-300 h-full rounded p-2">
            <ul className="w-full h-full flex">
                <div className="w-[20%] flex justify-start items-center">
                    <Link to={"/home"}>
                        <img className="h-13 w-13 hover:cursor-pointer dark:invert" src="/ASD/book-svgrepo-com.svg" alt="Logo" />
                    </Link>
                </div>
                <div ref={searchRef} className="w-[50%] flex flex-col relative justify-center items-center ">
                    <SearchBar value={query} handler={suggestionHandler}></SearchBar>
                    <div className="absolute w-[75%] h-auto rounded rounded-t-0 dark:bg-gray-900 bg-gray-300 z-100 top-[90%]">
                        {suggestions.map((e) => {
                            return <Suggestion handler={(obj:suggestion) => {
                                setSuggestions([]);
                                setQuery("");
                                nav(`/book/${extractId(obj.Okey)}`);
                            }
                            } key={e.coverId} Okey={e.Okey} title={e.title} author={e.author} coverId={e.coverId} cover={e.cover}></Suggestion>
                        })}
                    </div>
                </div>
                <div className="w-[30%] flex justify-around items-center ">
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <h1 className="text-xs font-semibold hover:underline dark:text-white text-gray-900">Near By</h1>
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <h1 onClick={()=>nav("/explore")} className="text-xs font-semibold hover:underline dark:text-white text-gray-900">Explore</h1>
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <h1 className="text-xs font-semibold hover:underline dark:text-white text-gray-900">
                            <Link to={"/requests"}>Requests</Link>
                        </h1>
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <ThemeToggle />
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <div onClick={handler} className="profile rounded-full flex-col bg-gray-300 p-1 flex justify-center items-center">
                            <img className="h-8 w-8 hover:cursor-pointer" src="./person.svg" alt="Profile" />
                        </div>
                    </div>
                </div>
            </ul>
        </div>
    )
}
export default NavBar;

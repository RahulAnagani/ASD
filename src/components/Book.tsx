import { IoBook } from "react-icons/io5";
import { ExternalLink } from "lucide-react";
import "./book.css"
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import axios from "axios";
import { Link } from "react-router-dom";

type props = {
    title: string,
    author: string,
    cover: string,
    badge: string,
    okeyPath: string,
    genHanlder?: (abc: string) => void,
}

const Book: React.FC<props> = ({ title, author, cover, genHanlder, okeyPath }) => {
    const getGenre = (title: string) => {
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`)
            .then((res) => {
                if (res.data.items && res.data.items.length > 1) {
                    if (res.data.items[0]) {
                        setGenre(res.data.items[0].volumeInfo.categories?.[0] || "Fiction");
                        if (res.data.items[0].volumeInfo.categories?.[0])
                            if (genHanlder)
                                genHanlder(String(res.data.items[0].volumeInfo.categories[0]));
                    }
                }
            })
            .catch(e => {
                if (genHanlder)
                    genHanlder("");
                setGenre("Fiction"); // Default genre if API fails
                console.log(e);
            })
    }
    
    const [genre, setGenre] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        getGenre(title);
    }, [title]);

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const displayTitle = isOpen ? truncateText(title, 40) : title;
    const displayAuthor = truncateText(author, 30);

    return (
        <div 
            onClick={() => setIsOpen(prev => !prev)} 
            className="cursor-pointer flex transition-transform duration-300 hover:scale-105 bg-gray-400 w-50 h-60 text-black rounded shadow-md"
        >
            <div className={`${isOpen ? "w-[30%]" : "w-[70%]"} relative left overflow-hidden rounded-l h-full dark:bg-gray-300 flex p-2 justify-center items-center`}>
                {loading && <Spinner />}
                {
                    cover && (cover)?.startsWith("O") ?
                        <img 
                            className="rounded object-cover h-[85%] shadow-sm" 
                            src={`https://covers.openlibrary.org/b/olid/${cover}-M.jpg`} 
                            onLoad={() => setLoading(false)} 
                            alt={title}
                        /> :
                        <img 
                            className="rounded object-cover h-[85%] shadow-sm" 
                            src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`} 
                            onLoad={() => setLoading(false)} 
                            alt={title}
                        />
                }
            </div>
            <div className={`${isOpen ? "w-[70%]" : "w-[30%]"} duration-200 p-3 right flex flex-col justify-between h-full rounded-r overflow-hidden bg-gradient-to-br from-red-400 via-white to-orange-400 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900`}>
                {!isOpen ? (
                    <div className="flex flex-col items-start h-full justify-center">
                        <IoBook className="text-gray-800 dark:text-gray-200 text-xl mb-1" />
                        <h1 className="text-xs font-bold text-gray-900 dark:text-gray-200">Details</h1>
                    </div>
                ) : (
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h1 className="hyphens-auto font-bold text-base text-gray-900 dark:text-gray-100">{displayTitle}</h1>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-2">by {displayAuthor}</p>
                            {genre && (
                                <span className="bg-red-500 rounded text-xs font-medium px-2 py-1 text-white inline-block">{genre}</span>
                            )}
                        </div>
                        
                        <Link 
                            to={okeyPath} 
                            className="mt-auto text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors font-medium flex items-center text-sm group"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            Exchange this book
                            <ExternalLink size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Book;
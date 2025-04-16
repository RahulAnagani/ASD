import { useState } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

type Props = {
  cover: string;
  title: string;
  author: string;
  Okey: string;
};

const BookCard: React.FC<Props> = ({ cover, title, author,Okey }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleImageError = () => {
    setImgError(true);
    setLoading(false);
  };
  const nav=useNavigate();
  const extractId = (str: string): string => {
    const parts = str.split('/');
    return parts[parts.length - 1]; 
  };
  return (
    <div onClick={()=>{
        nav(`/book/${extractId(Okey)}`);
    }} className="group relative flex flex-col rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[35dvh] w-[15dvw] min-w-[180px] max-w-[220px] overflow-hidden">
      <div className="h-[75%] w-full flex items-center justify-center bg-gray-100 container007 relative overflow-hidden">
        {loading && <Spinner />}
        
        {!imgError && cover ? (
          <img
            className={`object-contain h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            src={
              cover?.startsWith("O")
                ? `https://covers.openlibrary.org/b/olid/${cover}-M.jpg`
                : `https://covers.openlibrary.org/b/id/${cover}-M.jpg`
            }
            onLoad={() => setLoading(false)}
            onError={handleImageError}
            alt={`${title} cover`}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            <span className="text-sm">No cover available</span>
          </div>
        )}
      </div>

      <div className="h-[25%] w-full p-0 flex flex-col justify-center  bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
        <h1 
          className="font-bold text-gray-800 text-sm text-center line-clamp-2"
          title={title}
        >
          {title}
        </h1>
        <p className="text-xs text-gray-500 text-center truncate w-full">
          by <span className="text-gray-600 font-medium">{author || "Unknown"}</span>
        </p>
      </div>

    </div>
  );
};

export default BookCard;
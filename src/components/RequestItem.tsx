import { useState } from "react";
import { MdOutlineSwapVerticalCircle, MdExpandMore } from "react-icons/md";
import TooltipTitle from "./Tool";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

type book = {
  title: string;
  author: string;
  genre: string;
};

type Request = {
  time: string;
  username: string;
  type: "sent" | "received";
  requestType: "swap" | "buy";
  status: string;
  fromBook: book | { title: ""; author: ""; genre: "" };
  toBook: book;
};

const Request: React.FC<Request> = ({
  time,
  requestType,
  username,
  type,
  toBook,
  fromBook,
  status,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleAction = (action: string) => {
    console.log(`Action: ${action} on request from @${username}`);
  };

  return (
    <div className="cursor-pointer flex flex-col border-b border-gray-300">
      <div onClick={()=>setIsExpanded(!isExpanded)}
        className={`flex justify-center items-center p-1 transition-all duration-300 ${
          isExpanded ? "border-b-0" : "h-[10dvh]"
        }`}
      >
        <div className="w-[10%] flex justify-start items-center">
          <img
            className="h-10 w-10 bg-blue-400 rounded-full"
            src="/person.svg"
            alt="profile"
          />
        </div>

        <div className="w-[20%] flex justify-start items-center text-sm">
          <h1>
            @<span className="font-bold cursor-pointer">{username}</span>
          </h1>
        </div>

        <div className="w-[20%] flex relative justify-start items-center">
          <TooltipTitle
            title={toBook.title}
            author={toBook.author}
            genre={toBook.genre}
          />
        </div>

        <div className="w-[20%] flex flex-col justify-start items-center">
          <h1 className="font-semibold flex items-center gap-1">
            {requestType==='swap'?
            (
                <>
                {requestType}
            <MdOutlineSwapVerticalCircle />
            </>):
            (
                <>
                {requestType}
                <BiSolidPurchaseTagAlt />
                </>
            )
        }
            
          </h1>
          {requestType === "swap" && (
            <div className="flex text-sm">
              <h1 className="text-gray-600 mr-1">title:</h1>
              <TooltipTitle
                title={fromBook.title}
                author={fromBook.author}
                genre={fromBook.genre}
              />
            </div>
          )}
        </div>

        <div className="w-[10%] flex justify-start items-center">
          <h1>{status}</h1>
        </div>

        <div className="w-[20%] flex justify-around items-center">
          <span className="text-xs">{new Date(time).toLocaleString()}</span>
          <MdExpandMore
            className={`cursor-pointer bg-gray-300 dark:text-black text-bold rounded-full  transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="dark:bg-black cursor-auto p-4 text-sm rounded-b-md">
          <div className="flex flex-col md:flex-row md:gap-16">
            <div className="mb-2">
              <h2 className="font-bold mb-1">To Book:</h2>
              <p className="flex">📖<TooltipTitle
            title={toBook.title}
            author={toBook.author}
            genre={toBook.genre}
          /></p>
              <p>✍️ Author: {toBook.author}</p>
              <p>📚 Genre: {toBook.genre}</p>
            </div>

            {requestType === "swap" && (
              <div className="mb-2">
                <h2 className="font-bold mb-1">From Book:</h2>
                <p className="flex">📖 <TooltipTitle
                title={fromBook.title}
                author={fromBook.author}
                genre={fromBook.genre}
              /></p>
                <p>✍️ Author: {fromBook.author}</p>
                <p>📚 Genre: {fromBook.genre}</p>
              </div>
            )}

            <div className="mb-2">
              <h2 className="font-bold mb-1">Request Info:</h2>
              <p>📤 Type: {type}</p>
              <p>📌 Status: {status}</p>
              <p>🕒 Sent at: {new Date(time).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 justify-start">
            {status === "Pending" && requestType === "swap" && (
              <button
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => handleAction("Accept")}
              >
                Accept
              </button>
            )}
            {status === "Pending" && requestType === "swap" && (
              <button
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                onClick={() => handleAction("Ignore")}
              >
                Ignore
              </button>
            )}
            {(status === "Accepted" || status === "Rejected") && (
              <button
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                onClick={() => handleAction("Cancel")}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;

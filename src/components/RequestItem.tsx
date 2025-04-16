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
    <div className="flex flex-col border-b border-gray-300">
      <div 
        className={`flex justify-center items-center p-2 transition-all duration-300 ${
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
          <span className={`py-1 px-2 rounded-full text-xs font-medium ${
            status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
            status.toLowerCase() === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}>
            {status}
          </span>
        </div>

        <div className="w-[20%] flex justify-around items-center">
          {type === "received" && status.toLowerCase() === "pending" ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Accept");
                }}
                className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md shadow hover:shadow-md transition-all duration-200 text-sm font-medium"
                title="Approve Request"
              >
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Ignore");
                }}
                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-50 transition-all duration-200 text-sm font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                title="Decline Request"
              >
                Ignore
              </button>
              <MdExpandMore
                className={`cursor-pointer bg-gray-300 dark:text-black text-bold rounded-full transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
              />
            </div>
          ) : type === "sent" ? (
            <div className="flex items-center gap-2">
              <span className="text-xs">{new Date(time).toLocaleString()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Cancel");
                }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow hover:shadow-md transition-all duration-200 text-sm font-medium"
                title="Cancel Request"
              >
                Cancel
              </button>
              <MdExpandMore
                className={`cursor-pointer bg-gray-300 dark:text-black text-bold rounded-full transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs">{new Date(time).toLocaleString()}</span>
              <MdExpandMore
                className={`cursor-pointer bg-gray-300 dark:text-black text-bold rounded-full transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
              />
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="dark:bg-slate-900 bg-gray-50 cursor-default p-6 text-sm rounded-b-md shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h2 className="text-base font-semibold border-b pb-2 border-gray-300 dark:border-gray-700 mb-3">Request Details</h2>
              <div className="flex items-center">
                <span className="font-medium w-24">Status:</span>
                <span className={`py-1 px-2 rounded-full text-xs font-medium ${
                  status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                  status.toLowerCase() === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }`}>
                  {status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Type:</span>
                <span>{type === "sent" ? "Outgoing" : "Incoming"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Date:</span>
                <span>{new Date(time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Time:</span>
                <span>{new Date(time).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold border-b pb-2 border-gray-300 dark:border-gray-700 mb-3">Requested Book</h2>
              <div className="flex items-center">
                <span className="font-medium w-24">Title:</span>
                <TooltipTitle
                  title={toBook.title}
                  author={toBook.author}
                  genre={toBook.genre}
                />
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Author:</span>
                <span>{toBook.author}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Genre:</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-md text-xs">{toBook.genre}</span>
              </div>
            </div>

            {requestType === "swap" && (
              <div className="space-y-2">
                <h2 className="text-base font-semibold border-b pb-2 border-gray-300 dark:border-gray-700 mb-3">Offered Book</h2>
                <div className="flex items-center">
                  <span className="font-medium w-24">Title:</span>
                  <TooltipTitle
                    title={fromBook.title}
                    author={fromBook.author}
                    genre={fromBook.genre}
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Author:</span>
                  <span>{fromBook.author}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Genre:</span>
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-2 py-1 rounded-md text-xs">{fromBook.genre}</span>
                </div>
              </div>
            )}
          </div>

          

          <div className="mt-6 flex gap-3 justify-end border-t pt-4 border-gray-300 dark:border-gray-700">
            {type === "received" && status.toLowerCase() === "pending" && (
              <>
                <button
                  className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  onClick={() => handleAction("Ignore")}
                >
                  Decline
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => handleAction("Accept")}
                >
                  Accept
                </button>
              </>
            )}
            {type === "sent" && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                onClick={() => handleAction("Cancel")}
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
type Message = {
  sender: "me" | "other";
  text: string;
  timestamp: string;
};

type ChatProps = {
  messages: Message[],
  handler:()=>void
};

const Chatt: React.FC<ChatProps> = ({ messages,handler }) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="p-3 bg-blue-500 dark:bg-violet-700 flex justify-start gap-2 cursor-pointer items-center text-white">
      <MdOutlineArrowBackIosNew onClick={handler}/>
        <h2 className="font-bold">Rahul</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "me"? "bg-blue-500 text-white": "bg-gray-200 text-gray-800"}`}>
              <p>{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t bg-white dark:bg-gray-600">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border border-gray-500 rounded-lg focus:outline-0"
        />
      </div>
    </div>
  );
};

export default Chatt;
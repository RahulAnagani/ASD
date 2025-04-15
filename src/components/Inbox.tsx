import { useRef } from "react";
import Chatt from "./Chatt"
import Messages from "./Messages";
import gsap from "gsap";
const Inbox=()=>{
    const messages = [
        { name: "Rahul", time: "12h" },
        { name: "Priya", time: "11h" },
        { name: "Amit", time: "10h" },
        { name: "Neha", time: "9h" },
        { name: "Vikram", time: "8h" },
        { name: "Rahul", time: "7h" }
      ];
      type Message = {
        sender: "me" | "other";
        text: string; 
        timestamp: string; 
      };
      const chatMessages: Message[] = [
        {
          sender: "other",
          text: "Hey, how are you?",
          timestamp: "10:30 AM",
        },
        {
          sender: "me",
          text: "I'm good, thanks!",
          timestamp: "10:32 AM",
        },
        {
          sender: "other",
          text: "Are we meeting today?",
          timestamp: "10:33 AM",
        },
        {
          sender: "me",
          text: "Yes, at 6 PM!",
          timestamp: "10:35 AM",
        },
      ];
      const handler=()=>{
        gsap.to(chat.current,{
            right:0
        })
      }
      const back=()=>{
        gsap.to(chat.current,{
            right:"-100%"
        })
      }
      const chat=useRef(null);
      
    return (<>
        <div className="bg-gray-100/10 h-full border border-gray-200 dark:border-gray-700 w-full rounded relative">
            <div className=" h-[10%] p-3 rounded-t font-bold flex justify-between items-center w-full">
                <h1 >Messages</h1>
            </div>
            <div className="w-full flex relative h-[90%] overflow-y-auto overflow-x-hidden">
                <div>
                <Messages handleFunction={handler} persons={messages}></Messages>
                </div>
                <div ref={chat} className="absolute right-[-100%] w-full h-full">
                <Chatt handler={back} messages={chatMessages}></Chatt>
                </div>
            </div>
        </div>
    </>)
}
export default Inbox;
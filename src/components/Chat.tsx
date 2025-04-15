type chatprop={
    name:string,
    time:string,
    handler:()=>void,
}
const Chat:React.FC<chatprop>=({name,time,handler})=>{
    return (
        <>
            <div onClick={handler} className="w-full  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 border-r-0 border-l-0  flex justify-between items-center p-3">
                <div className="w-[15%] bg-gray-100 rounded-full p-1">
                <img src="person.svg"></img>
                </div>
                <div className="flex flex-col w-[90%] px-5">
                <h1 className="font-semibold">{name}</h1>
                <h1 className="text-sm text-gray-500 font-bold">{time}</h1>
                </div>
            </div>
        </>
    )
}
export default Chat
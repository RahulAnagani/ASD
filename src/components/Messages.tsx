import Chat from "./Chat"

type msgs={
    persons:{name:string,time:string}[],
    handleFunction:()=>void
}
const Messages:React.FC<msgs>=({persons,handleFunction})=>{
    return (
        <>
            <div className="flex flex-col gap-0 ">
           { persons.map((e,i)=>{
               return (<Chat handler={handleFunction} name={e.name} key={i} time={e.time}></Chat>)
            })}
            </div>
        </>
    )
}
export default Messages;
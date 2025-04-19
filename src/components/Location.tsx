import { FaMapLocationDot } from "react-icons/fa6";
type locationProps={
    description:string,
    place_id:string,
    handler:(place_id:string,description:string)=>void
}
const Location:React.FC<locationProps>=({description,handler,place_id})=>{
    return (
        <>
            <div onClick={()=>{
                handler(place_id,description);
            }} className="w-full cursor-pointer border hover:bg-gray-500 p-1 border-b-gray-500 border-t-0 border-l-0 border-r-0 p-2 flex bg-white">
                    <div className="w-[20%] flex justify-center items-center">
                    <FaMapLocationDot />
                    </div>
                    <div className="w-[80%]">
                        <h1 className="font-bold text-xs">{description}</h1>
                    </div>
            </div>
        </>
    )
}
export default Location;
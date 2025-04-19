import { BsSearch } from "react-icons/bs";
const SearchBar:React.FC<{handler:(e:React.ChangeEvent<HTMLInputElement>)=>void,value?:string}>=({handler,value})=>{
    return (
        <>
            <div className="w-[75%] fuf p-2 bg-gray-100 h-[75%] rounded rounded-b-none flex justify-center items-center">
            <input value={value??""} type="text"  name="search" className="dark:text-black focus:outline-0 placeholder:text-gray-500 h-full w-[80%] p-3 rounded-r" onChange={handler} placeholder="Search"></input>
            <div className="  rounded-l h-full p-3 flex justify-center items-center w-[20%] cursor-pointer" ><BsSearch className="dark:invert"/></div>
            </div>
        </>
    )
}
export default SearchBar;
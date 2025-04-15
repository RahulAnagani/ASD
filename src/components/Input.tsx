    import { useState } from "react";
    import { FaEyeSlash } from "react-icons/fa";
    import { FaEye } from "react-icons/fa";
    type InputProps={
        name:string,
        type:string,
        handler:(e:React.ChangeEvent<HTMLInputElement>)=>void,
        placeHolder:string,
        value?:string
    }
    const Input:React.FC<InputProps>=({name,type,handler,value,placeHolder})=>{
        const [toggle,setToggle]=useState<boolean>(false);
        return (
            <div className="w-full flex m-2 flex-col justify-center items-center relative">
                <div className="relative w-[75%] flex flex-col gap-2">
                <input required name={name} className="text-sm h-full w-full hover:placeholder-gray-500 focus:placeholder-gray-600 peer p-0 focus:outline-none" placeholder={placeHolder} onChange={handler} value={value} type={type === 'password'?(!toggle?"password":"text"):type}></input>
                {type==='password'&&toggle&&<FaEyeSlash className="absolute right-0 top-1 hover:cursor-pointer" onClick={()=>setToggle(!toggle)}/>}
                {type==='password'&&!toggle&&<FaEye className="absolute right-0 top-1 hover:cursor-pointer" onClick={()=>setToggle(!toggle)}/>}
                <div className="h-1 w-full bg-gray-500 peer-focus:bg-blue-600 peer-hover:bg-blue-500 rounded-full"></div>
                </div>
            </div>
        )
    }
        
    export default Input
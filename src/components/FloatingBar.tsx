import { FaPlus } from "react-icons/fa";

const FloatingBar:React.FC<{handler:()=>void}> = ({handler}) => {
  return (
    <div className="absolute bottom-5  right-5 z-10">
      <button onClick={handler} className="flex items-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full shadow-lg transition duration-300">
        <FaPlus className="text-white" />
        <span className="font-semibold">Add Book</span>
      </button>
    </div>
  );
};

export default FloatingBar;

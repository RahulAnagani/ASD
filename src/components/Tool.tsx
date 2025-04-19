import { useState } from "react";

const TooltipTitle = ({ title, author, genre }: { title: string; author: string; genre: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full flex relative justify-start items-center">
      <h1
        className="cursor-pointer font-semibold hover:underline"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        // onClick={()=>setHovered(true)} 
      >
        {title}
      </h1>

      {hovered && (
        <div
          onMouseEnter={() => setHovered(false)}
          className="absolute z-10 top-full left-0 w-64 dark:bg-gray-700 bg-white border border-gray-300 shadow-lg p-4 rounded-md transition-all duration-200"
        >
          <p>
            <span className="font-semibold">Author:</span> {author}
          </p>
          <p>
            <span className="font-semibold">Genre:</span> {genre}
          </p>
        </div>
      )}
    </div>
  );
};

export default TooltipTitle;

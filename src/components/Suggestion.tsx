type Book = {
  title: string;
  author: string;
  cover: string;
  coverId: string;
  Okey:string
};

const Suggestion: React.FC<{
  title: string;
  coverId: string;
  cover: string;
  author: string;
  handler: (obj: Book) => void;
  Okey:string
}> = ({ title, cover, handler, coverId, author,Okey}) => {
  return (
    <>
      <div
        onClick={() => handler({ title, cover, author, coverId,Okey})}
        className="w-full dark:bg-gray-900 p-1 border border-t-0 border-r-0 border-l-0 border-gray-400 dark:border-gray-800 cursor-pointer bg-gray-300 flex h-[10dvh]"
      >
        <div className="w-[15%]">
          {cover ? (
            <img
              src={`https://covers.openlibrary.org/b/olid/${cover}-S.jpg`}
              className="rounded object-contain object-center h-full w-full"
            />
          ) : (
            <img
              src={`https://covers.openlibrary.org/b/id/${coverId}-S.jpg`}
              className="rounded object-contain object-center h-full w-full"
            />
          )}
        </div>
        <div className="w-[85%] flex flex-col">
          <h1 className="font-bold text-black w-full dark:text-white h-[75%]">{title}</h1>
          <h1 className="font-semibold h-[25%] text w-full text-gray-700 dark:text-gray-300 text-xs">
            by <span className="font-bold text-gray-900 dark:text-white">{author}</span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Suggestion;

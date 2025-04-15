import { Book, MapPin, AlertCircle } from 'lucide-react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';

type availabilit = {
    owner:{
        username:string
    },
    location:{
      coords:{
        ltd:number,
        lng:number,
      }
      locationName:string
    },
    bookId:string
}

interface user {
    _id: string,
    email: string,
    username:string,
    wishlist: string[],
    swappedBooks: string[],
    books: string[],
    "__v": number
}

type availability = availabilit[];

const AVBox: React.FC<{availability: availability, bookName: string, handler:(a:string,b:string)=>void}> = ({availability, handler, bookName}) => {
    const user = useSelector((store: RootState) => (store.user)) as user;
    
    const otherUsersBooks = availability.filter(item => item.owner.username !== user.username);
    
    const hasAvailableBooks = otherUsersBooks.length > 0;
    console.log(hasAvailableBooks)
    return (
        <div className="flex flex-wrap justify-center  bg-gray-300 rounded items-center w-[75%] h-[75%] gap-4">
            {hasAvailableBooks ? (
                otherUsersBooks.map((item, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-3 text-blue-600">
                            <Book className="mr-2" size={20} />
                            <h3 className="font-semibold">{bookName}</h3>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                            Shared by: <span className="font-bold cursor-pointer">@{item.owner.username}</span>
                        </div>
                        
                        <div className="flex items-start text-sm text-gray-700 mb-4">
                            <MapPin className="mr-1 mt-1 flex-shrink-0" size={16} />
                            <p>{item.location.locationName}</p>
                        </div>
                        
                        <button 
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm font-medium"
                            onClick={()=>handler(item.bookId,item.owner.username)}
                        >
                            Make Request
                        </button>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <AlertCircle size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No availability found</h3>
                    <p className="text-gray-500 max-w-md">
                        Sorry, there are currently no available copies of "{bookName}" from other users.
                    </p>
                    <p className="text-gray-500 mt-2">
                        Try checking back later or exploring other books.
                    </p>
                </div>
            )}
        </div>
    );
}

export default AVBox;
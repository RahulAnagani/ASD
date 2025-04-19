import { Book, MapPin, AlertCircle, X, RefreshCw } from 'lucide-react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useState } from 'react';

type availabilit = {
    owner: {
        username: string
    },
    location: {
      coords: {
        ltd: number,
        lng: number,
      }
      locationName: string
    },
    bookId: string
}

export interface user {
    _id: string,
    email: string,
    username: string,
    wishlist: string[],
    swappedBooks: string[],
    books: string[],
    "__v": number
}

type availability = availabilit[];

type SwapRequest = {
    _id: string,
    fromUser: {
        _id: string,
        username: string
    },
    toUser: string,
    fromBook: {
        location: {
            ltd: number,
            lng: number
        },
        _id: string,
        owner: string,
        title: string,
        author: string,
        genre: string,
        condition: string,
        isAvailable: boolean,
        imageUrl: string,
        key: string,
        __v: number
    },
    toBook: {
        location: {
            ltd: number,
            lng: number
        },
        _id: string,
        owner: string,
        title: string,
        author: string,
        genre: string,
        condition: string,
        isAvailable: boolean,
        imageUrl: string,
        key: string,
        __v: number
    },
    status: string,
    type: string,
    createdAt: string,
    __v: number
}

const AVBox: React.FC<{
  availability: availability, 
  bookName: string, 
  handler: (a: string, b: string) => void,
  onClose: () => void,
  existingRequests?: SwapRequest[]
}> = ({availability, handler, bookName, onClose, existingRequests = []}) => {
    const user = useSelector((store: RootState) => (store.user)) as user;
    const [loading, setLoading] = useState(true);
    const otherUsersBooks = availability.filter(item => item.owner.username !== user.username);
    
    const hasAvailableBooks = otherUsersBooks.length > 0;
    const hasExistingRequests = existingRequests.length > 0;
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };
    loading
    return (
        <div className="relative flex flex-col bg-gray-300 rounded items-center w-4/5 h-4/5 p-6 overflow-auto">
            <button 
                onClick={onClose}
                className="absolute cursor-pointer top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                aria-label="Close"
            >
                <X size={20} className="text-gray-700" />
            </button>
            
            {hasExistingRequests && (
                <div className="w-full mb-6">
                    <div className="flex items-center mb-4">
                        <RefreshCw className="mr-2 text-blue-600" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">
                            {existingRequests.some(req => req.toUser === user._id) ? 'Incoming Swap Requests' : 'Your Active Requests'}
                        </h3>
                    </div>
                    
                    <div className="space-y-4">
                        {existingRequests.map((request, idx) => {
                            const isRecipient = request.toUser === user._id;
                            
                            return (
                                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-blue-600">
                                            {isRecipient ? 'Incoming Request' : 'Your Request'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(request.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                        <div className="flex-shrink-0 w-24 h-36 bg-gray-100 rounded overflow-hidden">
                                            {request.fromBook.imageUrl && (
                                                request.fromBook.imageUrl.startsWith("O") ? (
                                                    <img 
                                                        className="w-full h-full object-cover shadow-sm" 
                                                        src={`https://covers.openlibrary.org/b/olid/${request.fromBook.imageUrl}-M.jpg`} 
                                                        onLoad={() => setLoading(false)} 
                                                        alt={request.fromBook.title}
                                                    />
                                                ) : (
                                                    <img 
                                                        className="w-full h-full object-cover shadow-sm" 
                                                        src={`https://covers.openlibrary.org/b/id/${request.fromBook.imageUrl}-M.jpg`} 
                                                        onLoad={() => setLoading(false)} 
                                                        alt={request.fromBook.title}
                                                    />
                                                )
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-500 mb-1">
                                                {isRecipient ? 'User wants to swap:' : 'You requested to swap:'}
                                            </div>
                                            <h4 className="font-medium text-gray-800 mb-1">{request.fromBook.title}</h4>
                                            <p className="text-sm text-gray-600 mb-2">by {request.fromBook.author}</p>
                                            <p className="text-sm text-gray-600">
                                                From: <span className="font-semibold">@{request.fromUser.username}</span>
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-center px-4">
                                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                            </svg>
                                        </div>
                                        
                                        <div className="flex-shrink-0 w-24 h-36 bg-gray-100 rounded overflow-hidden">
                                            {request.toBook.imageUrl && (
                                                request.toBook.imageUrl.startsWith("O") ? (
                                                    <img 
                                                        className="w-full h-full object-cover shadow-sm" 
                                                        src={`https://covers.openlibrary.org/b/olid/${request.toBook.imageUrl}-M.jpg`} 
                                                        onLoad={() => setLoading(false)} 
                                                        alt={request.toBook.title}
                                                    />
                                                ) : (
                                                    <img 
                                                        className="w-full h-full object-cover shadow-sm" 
                                                        src={`https://covers.openlibrary.org/b/id/${request.toBook.imageUrl}-M.jpg`} 
                                                        onLoad={() => setLoading(false)} 
                                                        alt={request.toBook.title}
                                                    />
                                                )
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-500 mb-1">
                                                {isRecipient ? 'For your book:' : 'For this book:'}
                                            </div>
                                            <h4 className="font-medium text-gray-800 mb-1">{request.toBook.title}</h4>
                                            <p className="text-sm text-gray-600 mb-1">by {request.toBook.author}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-500">
                                                    Status: <span className="font-medium capitalize px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">{request.status}</span>
                                                </p>
                                                
                                                {isRecipient && request.status === "pending" && (
                                                    <div className="flex gap-2">
                                                        <button className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                                            Accept
                                                        </button>
                                                        <button className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {hasExistingRequests && hasAvailableBooks && (
                <div className="w-full flex items-center my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <h3 className="px-4 text-lg font-medium text-gray-700">Other Available Books</h3>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            )}
            
            <div className="w-full flex flex-wrap justify-center gap-4">
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
                                onClick={() => handler(item.bookId, item.owner.username)}
                            >
                                Make Request
                            </button>
                        </div>
                    ))
                ) : !hasExistingRequests && (
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
        </div>
    );
}

export default AVBox;
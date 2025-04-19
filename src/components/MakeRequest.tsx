import React, { useEffect, useState } from 'react';
import { ShoppingCart, Repeat, Check } from 'lucide-react';
import Loader from './Loader';
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FancySvg from './FancySvg';
import { ImCross } from "react-icons/im";

type BookType = {
  okey: string;
  title: string;
  cover: string;
  id: string;
  username: string
};

type RequestType = 'swap' | 'buy' | null;

interface BookRequestHandlerProps {
  tobook: BookType;
  onRequestComplete?: (requestDetails?: any) => void;
}

const BookRequestHandler: React.FC<BookRequestHandlerProps> = ({ 
  tobook, 
  onRequestComplete,
}) => {
  const [requestType, setRequestType] = useState<RequestType>(null);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [step, setStep] = useState(1);
  const [myBooks, setMyBooks] = useState<BookType[]>([]);
  const [success, setSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const serverAPI = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
    }
    else {
      axios.get(`${serverAPI}/user/getProfile`, {
        headers: {
          "Authorization": `pspk ${token}`
        }
      })
      .then((res) => {
        if (res.data.user) {
          if (res.data.user.books) {
            const books = res.data.user.books.map((e: any) => {
              return {
                title: e.title,
                okey: e.key,
                id: e._id,
                cover: e.imageUrl,
                username: res.data.user.username
              }
            });
            setMyBooks(books);
          }
        }
      })
      .catch(e => {
        console.log(e);
        setError("Failed to load your books. Please try again.");
      });
    }
  }, []);

  useEffect(() => {
    let timer: number;
    if (success && !showDetails) {
      timer = window.setTimeout(() => {
        setShowDetails(true);
      }, 3500); 
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success, showDetails]);

  const handleRequestTypeSelect = (type: RequestType) => {
    setRequestType(type);
    setStep(type === 'buy' ? 2 : 3);
  };

  const handleBookSelect = (book: BookType) => {
    setSelectedBook(book);
  };

  const getCoverImageUrl = (coverId: string) => {
    return typeof coverId === 'string' && coverId.startsWith("O")
      ? `https://covers.openlibrary.org/b/olid/${coverId}-L.jpg`
      : `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  };
  
  const [load, setLoad] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="flex flex-col h-[75%] dark-mode w-[75%] md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="relative">
          {tobook.cover ? (
            <>
              <img 
                className="rounded object-cover h-[300px]" 
                src={getCoverImageUrl(tobook.cover)}
                onLoad={() => setLoad(false)}
                alt="Book cover" 
              />
              {load && <Loader />}
            </>
          ) : (
            load && <Loader />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b">
            <h3 className="font-medium text-center">{tobook.title}</h3>
          </div>
        </div>
      </div>

      {!success && (
        <div className="w-full md:w-2/3 p-3 relative">
          <MdOutlineArrowBackIos 
            className="flex m-2 cursor-pointer" 
            onClick={() => {if(step > 1) setStep(1)}}
          />
          <ImCross 
            className="absolute right-3 top-3 hover:fill-red-500 cursor-pointer" 
            onClick={() => onRequestComplete && onRequestComplete()}
          />
          
          <div className="mb-4">
            <div className="flex items-center mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <div className="mx-2 flex-grow h-0.5 bg-gray-300"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              {requestType === 'swap' && (
                <>
                  <div className="mx-2 flex-grow h-0.5 bg-gray-300"></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                    3
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">How would you like to request this book?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRequestTypeSelect('buy')}
                  className="flex cursor-pointer items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <ShoppingCart className="text-blue-600 mr-3" size={24} />
                  <span className="text-lg font-medium">Buy</span>
                </button>
                
                <button
                  onClick={() => handleRequestTypeSelect('swap')}
                  className="flex cursor-pointer items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Repeat className="text-blue-600 mr-3" size={24} />
                  <span className="text-lg font-medium">Swap</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Confirm Your Purchase Request</h2>
              <p className="text-gray-600 mb-8">
                You're about to request to buy "{tobook.title}". Once the owner accepts, you'll 
                be able to arrange payment and delivery details.
              </p>
              
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  const token = localStorage.getItem("token");
                  if (token) {
                    axios.post(`${serverAPI}/request/request`, {
                      toBook: tobook.id
                    }, { headers: { "Authorization": `pspk ${token}` } })
                    .then((res) => {
                      setLoading(false);
                      if (res.data.success) {
                        console.log(res.data);
                        setRequestData(res.data.request || res.data);
                        setSuccess(true);
                      } else {
                        setError(res.data.message || "Request failed");
                      }
                    })
                    .catch(e => {
                      setLoading(false);
                      setError("Failed to submit request. Please try again.");
                      console.log(e);
                    });
                  }
                }}
                disabled={loading}
                className={`flex items-center justify-center ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-6 rounded-lg transition-colors w-full sm:w-auto`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2" size={20} />
                    Confirm Request
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Select a Book to Swap</h2>
              <p className="text-gray-600 mb-4">
                Choose one of your books to offer in exchange for "{tobook.title}".
              </p>
              
              {myBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 max-h-64 overflow-y-auto">
                  {myBooks.map((myBook) => (
                    <div 
                      key={myBook.id}
                      onClick={() => handleBookSelect(myBook)}
                      className={`cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedBook?.id === myBook.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img 
                        src={getCoverImageUrl(myBook.cover)} 
                        alt={myBook.title} 
                        className="w-full h-40 object-cover"
                      />
                      {selectedBook?.id === myBook.id && (
                        <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                          <Check className="text-white" size={16} />
                        </div>
                      )}
                      <div className="p-2 text-center text-sm font-medium truncate">{myBook.title}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-700 font-medium">You don't have any books to swap.</p>
                  <p className="text-yellow-600 mt-2">Add books to your library first to enable swapping.</p>
                </div>
              )}
              
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  const token = localStorage.getItem("token");
                  if (token && selectedBook?.id) {
                    axios.post(`${serverAPI}/request/swap`, {
                      toBook: tobook.id,
                      fromBook: selectedBook.id,
                    }, { headers: { "Authorization": `pspk ${token}` } })
                    .then(res => {
                      setLoading(false);
                      if (res.data.success) {
                        console.log(res.data);
                        setRequestData(res.data.request || res.data);
                        setSuccess(true);
                      } else {
                        setError(res.data.message || "Swap request failed");
                      }
                    })
                    .catch(e => {
                      setLoading(false);
                      setError("Failed to submit swap request. Please try again.");
                      console.log(e);
                    });
                  }
                }}
                disabled={!selectedBook || myBooks.length === 0 || loading}
                className={`flex items-center justify-center py-3 px-6 rounded-lg transition-colors w-full sm:w-auto ${
                  selectedBook && myBooks.length > 0 && !loading 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2" size={20} />
                    Confirm Swap Request
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="w-full md:w-2/3 p-3 relative flex items-center justify-center bg-gray-200">
          {!showDetails ? (
            <FancySvg />
          ) : (
            <div className="w-full p-6 animate-fadeIn">
              <ImCross 
                className="absolute right-3 top-3 hover:fill-red-500 cursor-pointer" 
                onClick={() => onRequestComplete && onRequestComplete()}
              />
              
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-full">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <Check className="text-green-600 dark:text-green-300" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">Request Submitted!</h2>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Your {requestData?.type === 'Swap' ? 'swap' : 'purchase'} request has been submitted successfully.
                  </p>
                  {requestData && (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Request ID: {requestData._id}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Submitted on: {requestData.createdAt ? formatDate(requestData.createdAt) : 'Just now'}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
                  <h3 className="font-medium mb-2">Request Details:</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <p className="mb-1">
                      <span className="font-medium">Type:</span> {requestData?.type || "Purchase"}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Status:</span> 
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium ml-1">
                        {requestData?.status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => onRequestComplete && onRequestComplete()}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookRequestHandler;
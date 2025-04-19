import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { MessageCircle, Search, ChevronLeft, Send, Check, CheckCheck, UserPlus, Loader2 } from 'lucide-react';
import { socketContext } from '../context/Socket';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { doesChatExist, findExistingChat } from '../utils/chatHelpers';
import NavBar from "../components/NavBar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideBar from "../components/SideBar";

interface User {
  _id: string;
  username: string;
}

interface ChatListItem {
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  timestamp: string;
  __v: number;
}

interface ChatListResponse {
  success: boolean;
  chatList: ChatListItem[];
}

interface ChatMessagesResponse {
  success: boolean;
  messages: Message[];
}

interface UserSearchResponse {
  success: boolean;
  users: User[];
}

interface user {
  _id: string,
  email: string,
  username: string,
  wishlist: string[],
  swappedBooks: string[],
  books: string[],
  "__v": number
}

interface Socket {
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
  emit: (event: string, data: any) => void;
}

const MessagingComponent: React.FC<{}> = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ username?: string }>();
  const socketCtx = useContext(socketContext);
  const socket = socketCtx?.socket as Socket | null;
  const user = useSelector((store: RootState) => (store.user)) as user;
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [fetchingUsername, setFetchingUsername] = useState<boolean>(false);
  const [fetchingChat, setFetchingChat] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatListLoadedRef = useRef<boolean>(false);
  const initialUrlProcessedRef = useRef<boolean>(false);

  const [sideBar, setSideBar] = useState<boolean>(false);
  const sideRef = useRef(null);
  const mainContentRef = useRef(null);

  useGSAP(() => {
    if (sideBar) {
      gsap.to(sideRef.current, {
        right: 0,
        width: window.innerWidth >= 768 ? "25%" : "100%",
        duration: 0.3
      });
      gsap.to(mainContentRef.current, {
        width: window.innerWidth >= 768 ? "75%" : "0%",
        duration: 0.3
      });
    } else {
      gsap.to(sideRef.current, {
        right: "-10%",
        width: 0,
        duration: 0.3
      });
      gsap.to(mainContentRef.current, {
        width: "100%",
        duration:0.3
      });
    }
  }, [sideBar]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchChatList();
        chatListLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  useEffect(() => {
    const processUrlParam = async () => {
      if (!initialUrlProcessedRef.current && chatListLoadedRef.current && params.username) {
        initialUrlProcessedRef.current = true;
        await handleUsernameFromUrl(params.username);
      }
    };
    
    processUrlParam();
  }, [chatList, params.username]);

  const handleUsernameFromUrl = async (username: string) => {
    try {
      setLoading(true);
      setFetchingUsername(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setFetchingUsername(false);
        return;
      }

      const existingChat = findExistingChat(chatList, '', username);
      if (existingChat) {
        setSelectedChat(existingChat);
        await fetchChat(existingChat.user._id);
        setLoading(false);
        setFetchingUsername(false);
        return;
      }
      
      const response = await axios.get<UserSearchResponse>(
        `${import.meta.env.VITE_API_URL}/user/search?username=${username}`,
        { headers: { "Authorization": `abcd ${token}` } }
      );
      
      if (response.data.success && response.data.users.length > 0) {
        const foundUser = response.data.users[0];
        
        if (doesChatExist(chatList, foundUser._id, foundUser.username)) {
          const chat = findExistingChat(chatList, foundUser._id, foundUser.username);
          if (chat) {
            setSelectedChat(chat);
            await fetchChat(chat.user._id);
          }
        } else {
          const newChatItem: ChatListItem = {
            user: {
              _id: foundUser._id,
              username: foundUser.username
            },
            lastMessage: "",
            timestamp: new Date().toISOString(),
            unreadCount: 0
          };
          
          setChatList(prevList => [newChatItem, ...prevList]);
          setSelectedChat(newChatItem);
          await fetchChat(foundUser._id);
        }
      }
    } catch (error) {
      console.error('Error fetching user by username:', error);
    } finally {
      setLoading(false);
      setFetchingUsername(false);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("new-message", (data: { senderId: string, senderUserName: string, content: string }) => {
        const { senderId, senderUserName, content } = data;
        
        if (selectedChat && selectedChat.user._id === senderId) {
          const newMessage: Message = {
            _id: Date.now().toString(),
            sender: senderId,
            receiver: user._id,
            content,
            read: true,
            timestamp: new Date().toISOString(),
            __v: 0
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
        
        setChatList(prevList => {
          const existingChatIndex = prevList.findIndex(chat => chat.user._id === senderId);
          
          if (existingChatIndex !== -1) {
            const updatedList = [...prevList];
            updatedList[existingChatIndex] = {
              ...updatedList[existingChatIndex],
              lastMessage: content,
              timestamp: new Date().toISOString(),
              unreadCount: selectedChat?.user._id === senderId ? 0 : updatedList[existingChatIndex].unreadCount + 1
            };
            return updatedList;
          } else {
            const newChat: ChatListItem = {
              user: {
                _id: senderId,
                username: senderUserName
              },
              lastMessage: content,
              timestamp: new Date().toISOString(),
              unreadCount: 1
            };
            return [newChat, ...prevList];
          }
        });
      });
      
      socket.on("typing", (data: { senderId: string }) => {
        if (selectedChat && selectedChat.user._id === data.senderId) {
          setTypingUsers(prev => ({ ...prev, [data.senderId]: true }));
          
          setTimeout(() => {
            setTypingUsers(prev => ({ ...prev, [data.senderId]: false }));
          }, 3000);
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off("new-message");
        socket.off("typing");
      }
      
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [socket, selectedChat, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (searchTerm.trim().length < 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  }, [searchTerm]);

  const fetchChatList = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post<ChatListResponse>(
        `${import.meta.env.VITE_API_URL}/message/getChatList`, 
        {}, 
        { headers: { "Authorization": `abcd ${token}` } }
      );
      
      if (response.data.success) {
        setChatList(response.data.chatList);
      }
    } catch (error) {
      console.error('Error fetching chat list:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const searchUsers = async (query: string): Promise<void> => {
    if (query.trim().length < 1) return;
    
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const response = await axios.get<UserSearchResponse>(
        `${import.meta.env.VITE_API_URL}/user/search?username=${query}`,
        { headers: { "Authorization": `abcd ${token}` } }
      );
      
      if (response.data.success) {
        const filteredUsers = response.data.users.filter(u => u._id !== user._id);
        setSearchResults(filteredUsers);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleDirectChat = (directUser: User): void => {
    const existingChat = chatList.find(chat => 
      chat.user._id === directUser._id ||
      chat.user.username.toLowerCase() === directUser.username.toLowerCase()
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
      fetchChat(existingChat.user._id);
    } else {
      const newChatItem: ChatListItem = {
        user: {
          _id: directUser._id,
          username: directUser.username
        },
        lastMessage: "",
        timestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      setChatList(prevList => [newChatItem, ...prevList]);
      setSelectedChat(newChatItem);
      fetchChat(directUser._id);
    }
    
    setSearchTerm("");
    setShowSearchResults(false);
    
    navigate(`/chat/${directUser.username}`, { replace: true });
  };

  const fetchChat = async (userId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setFetchingChat(true);
      const response = await axios.post<ChatMessagesResponse>(
        `${import.meta.env.VITE_API_URL}/message/getChat`, 
        { otherId: userId }, 
        { headers: { "Authorization": `abcd ${token}` } }
      );

      if (response.data.success) {
        const sortedMessages = [...response.data.messages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
        
        const selectedUserChat = chatList.find(chat => chat.user._id === userId);
        if (selectedUserChat) {
          setSelectedChat(selectedUserChat);
          
          setChatList(prevList => 
            prevList.map(chat => 
              chat.user._id === userId 
                ? { ...chat, unreadCount: 0 }
                : chat
            )
          );
        }
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setFetchingChat(false);
    }
  };

  const handleChatSelect = (userId: string): void => {
    const selectedUserChat = chatList.find(chat => chat.user._id === userId);
    if (selectedUserChat) {
      setSelectedChat(selectedUserChat);
      navigate(`/chat/${selectedUserChat.user.username}`, { replace: true });
      fetchChat(userId);
    }
    
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessageInput(e.target.value);
    
    if (selectedChat && socket) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      socket.emit("typing", {
        senderId: user._id,
        receiverId: selectedChat.user._id
      });
      
      const timeout = setTimeout(() => {
        setTypingTimeout(null);
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const sendMessage = (): void => {
    if (!messageInput.trim() || !selectedChat || !socket) return;
    
    socket.emit("send-message", {
      senderId: user._id,
      receiverUsername: selectedChat.user.username,
      content: messageInput
    });
    
    const newMessage: Message = {
      _id: Date.now().toString(),
      sender: user._id,
      receiver: selectedChat.user._id,
      content: messageInput,
      read: false,
      timestamp: new Date().toISOString(),
      __v: 0
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    setChatList(prevList => 
      prevList.map(chat => 
        chat.user._id === selectedChat.user._id 
          ? { ...chat, lastMessage: messageInput, timestamp: new Date().toISOString() }
          : chat
      )
    );
    
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (showSearchResults && searchResults.length > 0) {
        handleDirectChat(searchResults[0]);
      } else {
        sendMessage();
      }
    }
  };

  const filteredChats = chatList.filter(chat =>
    chat.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-screen h-screen relative bg-white dark-mode overflow-x-hidden">
      <ToastContainer />
      
      <div className="h-[15%] p-4 w-full flex justify-center items-center">
        <NavBar handler={() => { setSideBar(!sideBar); }} />
      </div>
      
      <div className="h-[85%] w-full flex gap-4 p-5 relative overflow-hidden">
        <div ref={mainContentRef} className="w-full h-full relative flex overflow-hidden">
          <div className="flex h-full bg-gray-100 w-full">
            <div className={`bg-white flex-shrink-0 border-r border-gray-200 ${selectedChat ? 'hidden md:block' : 'block'}`} 
                 style={{ width: selectedChat ? '320px' : '100%' }}>
              <div className="p-4 border-b dark-mode border-gray-200">
                <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  
                  {showSearchResults && searchTerm.trim() !== "" && (
                    <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                      {searchResults.length > 0 ? (
                        <>
                          {searchResults.map((result) => {
                            const isChatExisting = chatList.some(chat => 
                              chat.user._id === result._id || 
                              chat.user.username.toLowerCase() === result.username.toLowerCase()
                            );
                            return (
                              <div
                                key={result._id}
                                className="flex items-center p-3  hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleDirectChat(result)}
                              >
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
                                  {result.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-800">{result.username}</h3>
                                    {isChatExisting ? (
                                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Exists</span>
                                    ) : (
                                      <span className="text-xs text-blue-500 flex items-center">
                                        <UserPlus size={14} className="mr-1" /> New chat
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No users found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-y-auto dark-mode h-[calc(100%-8rem)]">
                {loading && chatList.length === 0 ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-pulse text-gray-500">Loading conversations...</div>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.user._id}
                      className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.user._id === chat.user._id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleChatSelect(chat.user._id)}
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
                        {chat.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-800">{chat.user.username}</h3>
                          <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 truncate max-w-[150px]">{chat.lastMessage}</p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
              {selectedChat ? (
                <>
                  <div className="bg-white dark-mode p-4 flex items-center border-b border-gray-200">
                    <button
                      className="md:hidden mr-2 text-gray-600"
                      onClick={() => {
                        setSelectedChat(null);
                        navigate('/chat', { replace: true });
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
                      {selectedChat.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-medium text-gray-800">{selectedChat.user.username}</h3>
                      <p className="text-xs text-gray-500">
                        {typingUsers[selectedChat.user._id] ? 'Typing...' : 'Active now'}
                      </p>
                    </div>
                    {fetchingUsername && (
                      <div className="ml-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-gray-50 p-4 dark-mode overflow-y-auto">
                    {fetchingChat ? (
                      <div className="flex flex-col justify-center items-center h-full space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-500">Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full text-gray-500">
                        No messages yet. Start a conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const isCurrentUser = message.sender === user._id;
                          const showDate = index === 0 ||
                            formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

                          return (
                            <div key={message._id}>
                              {showDate && (
                                <div className="text-center my-4">
                                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    {formatDate(message.timestamp)}
                                  </span>
                                </div>
                              )}
                              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-2 rounded-lg ${
                                  isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
                                }`}>
                                  <p>{message.content}</p>
                                  <div className={`text-xs mt-1 flex justify-end ${
                                    isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                                  }`}>
                                    <span>{formatTime(message.timestamp)}</span>
                                    {isCurrentUser && (
                                      <span className="ml-1">
                                        {message.read ? <CheckCheck size={12} /> : <Check size={12} />}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {typingUsers[selectedChat.user._id] && (
                          <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark-mode p-4 border-t border-gray-200">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                      />
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg flex items-center justify-center transition-colors"
                        onClick={sendMessage}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                  <MessageCircle size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium">Your Messages</h3>
                  <p className="text-sm mt-2">Select a conversation or search for a user to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div 
          ref={sideRef} 
          className="w-[25%] right-[-10%] absolute h-full flex flex-col gap-2 justify-center items-center overflow-y-auto"
        >
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default MessagingComponent;
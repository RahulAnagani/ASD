import { createContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  socketRef: React.MutableRefObject<Socket | null>;
};

export const socketContext = createContext<SocketContextType | null>(null);

interface Props {
  children: React.ReactNode;
  userId: string;
}

const SocketContextProvider: React.FC<Props> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const serverApi = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const newSocket = io(serverApi);

    console.log(`Socket connection established.`);

    newSocket.emit("join", { userId });

    
    setSocket(newSocket);
    socketRef.current = newSocket;


    newSocket.on("connect", () => {
      console.log(`Socket connected with ID: ${newSocket.id}`);
    });


    newSocket.on("disconnect", (reason) => {
      console.log(`Socket disconnected. Reason: ${reason}`);
    });

    return () => {
      console.log(`Disconnecting socket with ID: ${newSocket.id}`);
      newSocket.disconnect();
    };
  }, [userId, serverApi]);

  return (
    <socketContext.Provider value={{ socket, socketRef }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketContextProvider;

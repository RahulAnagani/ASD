import Login from './Pages/Login'
import Register from './Pages/Register'
import DashBoard from './Pages/DashBoard'
import "./app.css"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import AAth from './context/AAth'
import Requests from './Pages/Requests'
import Explore from './Pages/explore'
import BookPage from './Pages/BookPage'
import MessagingComponent from './Pages/Messages'

function App() {
  const ChatRedirect = () => {
    const path = window.location.pathname.toLowerCase();
    return <Navigate to={path} replace />;
  };

  return (
    <>
      <title>Swipe Swap Read</title>
      <BrowserRouter basename="/BookSwap-React">
        <Routes>
          <Route path="/" element={<AAth><DashBoard/></AAth>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={<AAth><DashBoard/></AAth>} />
          <Route path="/requests" element={<AAth><Requests/></AAth>} />
          <Route path="/explore" element={<AAth><Explore/></AAth>} />
          <Route path="/chat" element={<AAth><MessagingComponent/></AAth>} />
          <Route path="/chat/:username" element={<AAth><MessagingComponent/></AAth>} />
          <Route path="/book/:title" element={<AAth><BookPage/></AAth>} />
          <Route path="/chat/*" element={<ChatRedirect />} />
          <Route path="/chat/*" element={<ChatRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
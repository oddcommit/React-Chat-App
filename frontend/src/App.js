import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home'; 
import Chat from './pages/chat';


const socket = io.connect('http://localhost:4000');

function App() {

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route exact
            path='/'
            element={
            <Home
              username = {username}
              setUsername = {setUsername}
              room = {room}
              setRoom = {setRoom}
              socket = {socket}
            />}/>

           <Route exact
              path='/chat'
              element={<Chat username={username} room={room} socket={socket}/>}
            />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

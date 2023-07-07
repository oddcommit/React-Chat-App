import { useNavigate } from "react-router-dom";
import '../../App.css'

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    
    const navigate = useNavigate();
    
    const joinroom = () => {
        if(room !== '' && username !== '') {
            socket.emit('join_room', {username, room });
        }
        
        navigate('/chat', { replace: true });
    };

    return (
        <div className='container'>
            <div className='formcontainer'>
                <h1>ChatRooms</h1>
                <input className='input' 
                    placeholder='Username...'
                    onChange={(e) => setUsername(e.target.value)}    
                />

                <select 
                    className='input'
                    onChange={(e) => setRoom(e.target.value)}
                >
                    <option>Select Room</option>
                    <option value='javascript'>Javascript</option>
                    <option value='node'>Node</option>
                    <option value='express'>Express</option>
                    <option value='react'>React</option>
                </select>

                <button
                    className='btn btn-secondary'
                    onClick={joinroom}
                >
                    Join Room
                </button>
            </div>
        </div>
    )
}

export default Home;
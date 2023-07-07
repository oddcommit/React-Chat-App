import './chat.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
    const [roomUsers, setRoomUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('chatroom_users', (data) => {
            // console.log(data);
            setRoomUsers(data);
        });

        return () => socket.off('chatroom_users');
    }, [socket]);

    const leaveRoom = () => {
        const _createdtime_ = Date.now();
        socket.emit('leave_room', { username, room, _createdtime_});

        navigate('/', {replace: true});
    };

    const select_partner = (e) => {
        localStorage.setItem('partner', e.target.id);
        // const partner_id = e.target.id;
        // console.log('self',localStorage.self_id);
        // console.log('partner', partner_id);
        // socket.emit('send_partner',  { partner_id, username });

    }

    return (
        <div className='roomAndUsersColumn'>
            <label className='roomTitle'>{room}</label>

            <div>
                {roomUsers.length > 0 && <label className='usersTitle'>Users:</label>}
                <ul className='userslist'>
                    {roomUsers.map((user) => (
                        <li  style={{fontweight:`$user.username === username ? 'bold':'normal'`}}
                        key = {user.id}>
                            <button id={user.id} onClick={(e)=>select_partner(e)}>{user.username}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <button className='btn btn-outline' onClick={leaveRoom}>Leave</button>
        </div>
    )

}

export default RoomAndUsers;
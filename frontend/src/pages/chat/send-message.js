import './chat.css';
import React,{ useState } from 'react';

const SendMessage = ({ socket, username, room })=> {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if(message !== '') {
            const _createdtime_ = Date.now();
            socket.emit('send_message', { username, room, message, _createdtime_ });
            setMessage('');
        }
    };

    return (
        <div className='sendMessageContainer'>
            <input
                className='messageInput'
                placeholder='Message...'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <button className='btn btn-primary' onClick={sendMessage}>Send</button>
        </div>
    )
}

export default SendMessage;
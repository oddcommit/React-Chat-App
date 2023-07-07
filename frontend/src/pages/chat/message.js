import './chat.css';

import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket }) => {
    const [messagesReceived, setMessagesReceived] = useState([]);

    const messagesColumnRef = useRef(null);
    useEffect(() => {
        socket.on('receive_message', (data) => {
            if(data.user_id) localStorage.setItem('self_id', data.user_id);
            setMessagesReceived((state) => [
                ...state,
                    {
                        message: data.message,
                        username: data.username,
                        _createdtime_: data._createdtime_,
                    },
            ]);

        });

        return () => socket.off('receive_message');
    }, [socket]);

    useEffect(() => {
        socket.on('last_30_messages', (last30messages) =>{
            last30messages = sortMessagesByDate(last30messages);
            setMessagesReceived((state) => [...last30messages, ...state]);
        });

        return () => socket.off('last_30_messages');
    },[socket])

    
    useEffect(() => {
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    },[messagesReceived])

    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    function sortMessagesByDate(sort_messages) {
        sort_messages.sort(
            (a, b) => parseInt(a._createdtime_) - parseInt(b._createdtime_)
        );
        return sort_messages;
    }
    return (
        <div className='messagesColumn' ref={messagesColumnRef}>
            {messagesReceived.map((msg, key) => (
                <div className='message' key={key}>
                    <div style={{ display: 'flex', justifyContent:'space-between'}}>
                        <span className='msgMeta'>{msg.username}</span>
                        <span className='msgMeta'>{formatDateFromTimestamp(msg._createdtime_)}</span>    
                    </div>
                    <p className='msgText'>{msg.message}</p>
                </div>
            ))}
        </div>
    )

}

export default Messages;
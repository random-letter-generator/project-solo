import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Project2 = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const socketRef = useRef();
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch existing messages
    fetch('http://localhost:3000/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching messages:', err));

    // Initialize socket connection
    socketRef.current = io('http://localhost:3000/chat');

    socketRef.current.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('userJoined', (user) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          content: `${user} joined the chat`,
        },
      ]);
    });

    socketRef.current.on('userLeft', (user) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          content: `${user} left the chat`,
        },
      ]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socketRef.current.emit('join', username);
      setIsJoined(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socketRef.current.emit('message', { content: newMessage });
      setNewMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div className='flex items-center justify-center min-h-[50vh] bg-gray-50'>
        <form
          onSubmit={handleJoin}
          className='bg-white p-6 rounded-lg shadow-md w-80'
        >
          <h2 className='text-2xl mb-4 text-center'>Join Chat</h2>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Enter your username'
            className='w-full p-2 border rounded mb-4'
            required
          />
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[80vh] max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow'>
      <div className='flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4'>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.system
                ? 'text-gray-500 italic bg-gray-50'
                : msg.username === username
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}
          >
            {!msg.system && (
              <span className='font-bold'>
                {msg.username === username ? 'You' : msg.username}:
              </span>
            )}
            <span className='ml-2'>{msg.content}</span>
            {!msg.system && (
              <span className='text-xs text-gray-500 ml-2'>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 p-2 border rounded'
          required
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Project2;

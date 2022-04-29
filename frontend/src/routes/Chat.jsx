import { useRef, useState } from 'react';
import ChatRoom from '../components/chat/ChatRoom';

function Chat() {
  const userRef = useRef();
  const roomRef = useRef();
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');

  return (
    <>
      <h1>chat</h1>
      {user ? (
        <h3>접속한 유저: {user}</h3>
      ) : (
        <>
          <input ref={userRef} type="text" placeholder="user" />
          <button type="button" onClick={() => setUser(userRef.current.value)}>
            set User
          </button>
        </>
      )}
      <input ref={roomRef} type="text" placeholder="room" />
      <button type="button" onClick={() => setRoom(roomRef.current.value)}>
        join room
      </button>
      {user && room && <ChatRoom userName={user} />}
    </>
  );
}

export default Chat;

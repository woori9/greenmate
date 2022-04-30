import { useEffect, useRef, useState } from 'react';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import ChatRoom from '../components/chat/ChatRoom';
import app from '../service/firebase';
import signIn from '../service/chat_service';

const db = getFirestore(app);

function Chat() {
  const userRef = useRef();
  const moimRef = useRef();
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async content => {
    try {
      const roomref = doc(db, 'rooms', room);
      const messagesRef = collection(roomref, 'messages');
      const newMessage = {
        author: user,
        content,
        timestamp: serverTimestamp(),
      };

      await addDoc(messagesRef, newMessage);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  useEffect(() => {
    if (!room) return () => {};
    const q = query(
      collection(db, 'rooms', room, 'messages'),
      // 내가 join 한 시점 이후의 메세지만
      orderBy('timestamp'),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(
        snapshot.docs.map(docMessage => ({
          ...docMessage.data(),
          id: docMessage.id,
        })),
      );
    });

    return unsubscribe;
  }, [room]);

  return (
    <>
      <h1>chat</h1>
      {user ? (
        <h3>접속한 유저: {user}</h3>
      ) : (
        <>
          <input ref={userRef} type="text" placeholder="user" />
          <button
            type="button"
            onClick={() => {
              setUser(userRef.current.value);
              signIn(userRef.current.value);
            }}
          >
            set User
          </button>
        </>
      )}
      <input ref={moimRef} type="text" placeholder="room" />
      <button
        type="button"
        onClick={async () => {
          if (!moimRef.current.value) return;
          setRoom(moimRef.current.value);
        }}
      >
        create room
      </button>
      {user && room && (
        <ChatRoom sendMessage={sendMessage} messages={messages} />
      )}
    </>
  );
}

export default Chat;

import { useEffect, useRef, useState } from 'react';
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import ChatRoom from '../components/chat/ChatRoom';
import app from '../service/firebase';

const db = getFirestore(app);

function Chat() {
  const userRef = useRef();
  const roomRef = useRef();
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);

  // 회원가입 성공 후 시행
  const submit = async () => {
    if (!userRef.current.value) return;

    setUser(userRef.current.value);

    const docRef = doc(db, 'users', userRef.current.value);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      try {
        await setDoc(doc(db, 'users', userRef.current.value), {
          id: userRef.current.value,
          rooms: [],
          vaganType: userRef.current.value,
          nickname: `random${userRef.current.value}`,
        });
        console.log('임시 회원 가입 완료');
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    } else {
      console.log('이미 존재하는 회원입니다');
    }
  };

  const joinRoom = async () => {
    if (!roomRef.current.value) return;

    setRoom(roomRef.current.value);

    const docRef = doc(db, 'rooms', roomRef.current.value);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      try {
        await setDoc(doc(db, 'rooms', roomRef.current.value), {
          id: roomRef.current.value,
          users: [
            {
              id: userRef.current.value,
              vaganType: userRef.current.value,
              nickname: `random${userRef.current.value}`,
            },
          ],
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    } else {
      console.log('이미 존재하는 방');
    }
  };

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
          <button type="button" onClick={submit}>
            set User
          </button>
        </>
      )}
      <input ref={roomRef} type="text" placeholder="room" />
      <button type="button" onClick={joinRoom}>
        create room
      </button>
      {user && room && (
        <ChatRoom sendMessage={sendMessage} messages={messages} />
      )}
    </>
  );
}

export default Chat;

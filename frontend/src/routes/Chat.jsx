import { useEffect, useRef, useState } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import ChatRoom from '../components/chat/ChatRoom';
import app from '../service/firebase';
import {
  signIn,
  getRoomId,
  sendMessage,
  getPrivateRoomId,
  createPrivateRoom,
} from '../service/chat_service';

const db = getFirestore(app);

function Chat() {
  const userRef = useRef();
  const moimRef = useRef();
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);

  useEffect(() => {
    if (!user) return () => {};

    const roomsRef = collection(db, 'rooms');
    const q = query(
      roomsRef,
      where('members', 'array-contains', user),
      where('type', '==', 1),
      orderBy('recentMessage.sentAt'),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setChatRoomList(
        snapshot.docs.map(docChatRoom => ({
          ...docChatRoom.data(),
          id: docChatRoom.id,
        })),
      );
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!room) return () => {};
    const q = query(
      collection(db, 'message', room, 'messages'),
      // 내가 join 한 시점 이후의 메세지만
      // where('timestamp', '>', 'joinTimestamp'),
      orderBy('sentAt'),
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
        <>
          <h3>접속한 유저: {user}</h3>

          <h3>{user}의 채팅방 리스트(개인, 그룹 전부)</h3>
          {chatRoomList.map(chatRoom => (
            <h5 key={chatRoom.id}>chatroom</h5>
          ))}
        </>
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
          const roomId = await getRoomId(moimRef.current.value, user);
          setRoom(roomId);
        }}
      >
        채팅방 입장
      </button>

      <button
        type="button"
        onClick={async () => {
          // 임시로 상대방을 5번 유저로 설정
          const roomId = await getPrivateRoomId('5', user);
          if (roomId) {
            setRoom(roomId);
          } else {
            const createdRoomId = await createPrivateRoom('5', user);
            setRoom(createdRoomId);
          }
        }}
      >
        5번 유저와 채팅하기(상대 프로필의 메세지 아이콘)
      </button>

      {user && room && (
        <ChatRoom
          roomId={room}
          user={user}
          sendMessage={sendMessage}
          messages={messages}
        />
      )}
    </>
  );
}

export default Chat;

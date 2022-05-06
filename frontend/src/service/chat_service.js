import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

// 회원가입 성공 후 시행
const signIn = async userId => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) return;

  try {
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      vaganType: userId,
      nickname: `random${userId}`,
    });
  } catch (e) {
    throw new Error('firebase에 회원 정보를 저장하지 못했습니다.');
  }
};

const addRoomToUser = async (userId, chatRoomId, type) => {
  const userRoomRef = doc(db, 'users', userId, 'rooms', chatRoomId);
  await setDoc(userRoomRef, {
    countUnreadMessage: 0,
    type,
  });
};

const activateChatRoom = async (userId, chatRoomId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    activatedChatRooms: arrayUnion(chatRoomId),
  });
};

// 채팅방이 unmount 될 때 비활성화
const deactivateChatRoom = async (userId, chatRoomId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    activatedChatRooms: arrayRemove(chatRoomId),
  });
};

const getRoomId = async (moimId, userId) => {
  const moimRef = doc(db, 'moims', moimId);
  const docSnap = await getDoc(moimRef);

  if (docSnap.exists()) {
    // 맴버로 추가되어 있나 확인
    const chatRoomId = docSnap.data().roomId;
    const roomRef = doc(db, 'rooms', chatRoomId);
    const roomDocSnap = await getDoc(roomRef);
    const { members } = roomDocSnap.data();
    const targetMember = members.find(member => member === userId);

    if (!targetMember) {
      await updateDoc(roomRef, {
        members: arrayUnion(userId),
      });

      await updateDoc(roomRef, {
        membersInfo: arrayUnion({
          id: userId,
          joinDate: new Date(),
          nickname: `nickname${userId}`,
          veganType: userId,
        }),
      });

      await addRoomToUser(userId, chatRoomId, 0);
    }
    return chatRoomId;
  }

  // create moim and chat room
  try {
    // new chat room id
    const newRoomRef = doc(collection(db, 'rooms'));

    // new moim
    await setDoc(doc(db, 'moims', moimId), {
      id: moimId,
      roomId: newRoomRef.id,
    });

    const newRoom = {
      id: newRoomRef.id,
      members: [userId],
      membersInfo: [
        {
          id: userId,
          joinDate: new Date(),
          nickname: `nickname${userId}`,
          veganType: userId,
        },
      ],
      type: 0, // type 0: moim, 1: private
    };

    await setDoc(newRoomRef, newRoom);
    await addRoomToUser(userId, newRoomRef.id, 0);
    return newRoomRef.id;
  } catch (e) {
    throw new Error(e);
  }
};

const updateRecentMessage = async (roomId, payload) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);

    await updateDoc(roomRef, {
      recentMessage: payload,
    });
  } catch (e) {
    throw new Error(e);
  }
};

const sendMessage = async (roomId, content, user) => {
  try {
    const messageRef = doc(db, 'message', roomId);
    const messagesRef = collection(messageRef, 'messages');

    const newMessage = {
      content,
      sentBy: user,
      sentAt: new Date(),
    };

    await addDoc(messagesRef, newMessage);
    await updateRecentMessage(roomId, { ...newMessage, readBy: [] });
  } catch (e) {
    throw new Error(e);
  }
};

// 채팅 목록이 아닌 상대방 프로필의 메세지 아이콘을 눌렀을 때, 유저를 검색해서 눌렀을 때
const findPrivateChatRoom = async (pairId, userId) => {
  const roomsRef = collection(db, 'rooms');
  const q = query(
    roomsRef,
    where('members', 'array-contains', userId),
    where('type', '==', 1),
  );

  const querySnapshot = await getDocs(q);
  const targetRoom = querySnapshot.docs.find(docRoom => {
    const roomData = docRoom.data();
    return roomData.members.includes(pairId);
  });
  return targetRoom ? targetRoom.data() : null;
};

const createPrivateRoom = async (pair, user) => {
  console.log(pair, user);
  try {
    const newRoomRef = doc(collection(db, 'rooms'));

    const newRoom = {
      id: newRoomRef.id,
      type: 1, // type 0: moim, 1: private,
      members: [pair.id, user.id],
      membersInfo: [
        {
          ...user,
          joinDate: new Date(),
        },
        {
          ...pair,
          joinDate: new Date(),
        },
      ],
    };

    await setDoc(newRoomRef, newRoom); // 방 생성
    await addRoomToUser(user.id, newRoomRef.id, 1);
    await addRoomToUser(pair.id, newRoomRef.id, 1);
    const querySnapshot = await getDoc(doc(db, 'rooms', newRoomRef.id));
    return querySnapshot.data();
  } catch (e) {
    throw new Error(e);
  }
};

const getMessages = (selectedChat, callback) => {
  const q = query(
    collection(db, 'message', selectedChat, 'messages'),
    // 내가 join 한 시점 이후의 메세지만
    // where('timestamp', '>', 'joinTimestamp'),
    orderBy('sentAt'),
  );

  const unsubscribe = onSnapshot(q, callback);

  return unsubscribe;
};

export {
  signIn,
  getRoomId,
  sendMessage,
  findPrivateChatRoom,
  createPrivateRoom,
  activateChatRoom,
  deactivateChatRoom,
  getMessages,
};

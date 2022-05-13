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
  increment,
  deleteDoc,
} from 'firebase/firestore';
import app from './firebase';
import formatUserInfo from '../utils/formatUserInfo';

const db = getFirestore(app);

const signInFirebase = async payload => {
  const { id } = payload;
  const userRef = doc(db, 'users', id);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    alert('id가 겹치는 회원이 있습니다.');
    return;
  }

  try {
    await setDoc(doc(db, 'users', id), payload);
  } catch (e) {
    throw new Error('firebase에 회원 정보를 저장하지 못했습니다.');
  }
};

const addRoomToUser = async (userId, chatRoomId, type) => {
  const userRoomRef = doc(db, 'users', userId, 'rooms', chatRoomId);
  await setDoc(userRoomRef, {
    countUnreadMessage: 0,
    joinDate: new Date(),
    type,
  });
};

const activateChatRoom = async (userId, chatRoomId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    activatedChatRooms: arrayUnion(chatRoomId),
  });
};

const deactivateChatRoom = async (userId, chatRoomId) => {
  console.log('deactivate ', userId, ' s', chatRoomId);
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    activatedChatRooms: arrayRemove(chatRoomId),
  });
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
    await updateRecentMessage(roomId, { ...newMessage });
    return 'success';
  } catch (e) {
    throw new Error(e);
  }
};

const increaseUnreadMessage = async (chatRoomId, memberId) => {
  const userRef = doc(db, 'users', memberId);
  const snapShot = await getDoc(userRef);
  const { activatedChatRooms } = snapShot.data();

  // activatedChatRooms 가 한번도 조작되지 않았다면 undefined
  if (!activatedChatRooms || !activatedChatRooms.length) return;

  const userRoomRef = doc(db, 'users', memberId, 'rooms', chatRoomId);

  if (!activatedChatRooms.includes(chatRoomId)) {
    await setDoc(
      userRoomRef,
      {
        countUnreadMessage: increment(1),
      },
      { merge: true },
    );
  }
};

const resetUnreadMessage = async (userId, chatRoomId) => {
  console.log('reset ', userId, ' s unread message');
  const userRoomRef = doc(db, 'users', userId, 'rooms', chatRoomId);

  await setDoc(
    userRoomRef,
    {
      countUnreadMessage: 0,
    },
    { merge: true },
  );
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
  try {
    const newRoomRef = doc(collection(db, 'rooms'));

    const newRoom = {
      id: newRoomRef.id,
      type: 1, // type 2: moim, 1: private,
      members: [pair.id, user.id],
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
    collection(db, 'message', selectedChat.id, 'messages'),
    // 내가 join 한 시점 이후의 메세지만
    // where('timestamp', '>', 'joinTimestamp'),
    orderBy('sentAt'),
  );

  const unsubscribe = onSnapshot(q, callback);

  return unsubscribe;
};

const getMoimChatRoom = async moimId => {
  const moimRef = doc(db, 'moims', moimId);
  const docSnap = await getDoc(moimRef);
  if (!docSnap.exists()) {
    console.log('해당 모임이 존재하지 않습니다.');
    return null;
  }

  const { roomId } = docSnap.data();
  const roomRef = doc(db, 'rooms', roomId);
  const roomDocSnap = await getDoc(roomRef);
  return roomDocSnap.data();
};

const getJoinDate = async (userId, chatRoomId) => {
  try {
    const userRoomRef = doc(db, 'users', userId, 'rooms', chatRoomId);
    const { joinDate } = (await getDoc(userRoomRef)).data();
    return joinDate;
  } catch (err) {
    throw new Error(err);
  }
};

const getMembersInfo = async members => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('id', 'in', members));
  const querySnapshot = await getDocs(q);
  const membersInfo = querySnapshot.docs.map(snapshot => snapshot.data());
  return membersInfo;
};

const joinMoimChat = async (moimId, userId) => {
  console.log('JOIN MOIM CHAT', moimId, userId);
  try {
    const moimRef = doc(db, 'moims', moimId);
    const docSnap = await getDoc(moimRef);
    if (!docSnap.exists()) {
      alert('해당 모임이 존재하지 않습니다.');
      return;
    }

    const { roomId } = docSnap.data();
    const roomRef = doc(db, 'rooms', roomId);

    updateDoc(roomRef, {
      members: arrayUnion(userId),
    });
    addRoomToUser(userId, roomId, 2);
  } catch (e) {
    throw new Error(e);
  }
};

const createMoimChat = (moimId, userInfo) => {
  // veteType이 undefined면 에러
  const user = formatUserInfo(userInfo);
  try {
    // new chat room id
    const newRoomRef = doc(collection(db, 'rooms'));

    // new moim
    setDoc(doc(db, 'moims', moimId), {
      roomId: newRoomRef.id,
    });

    const newRoom = {
      id: newRoomRef.id,
      members: [user.id],
      type: 2, // type 1: private 2: moim
    };

    setDoc(newRoomRef, newRoom);
    addRoomToUser(user.id, newRoomRef.id, 2);
    return newRoomRef.id;
  } catch (e) {
    throw new Error(e);
  }
};

const saveNotification = async (userId, payload) => {
  const userRef = doc(db, 'users', userId);
  const notificationRef = collection(userRef, 'notifications');
  const notification = {
    notification: payload,
    createdAt: new Date(),
  };

  await addDoc(notificationRef, notification);
};

const deleteRoomFromUser = async (roomId, userId) => {
  const userRoomRef = doc(db, 'users', userId, 'rooms', roomId);
  await deleteDoc(userRoomRef);
};

const excludeFromChatRoom = async (moimId, userId) => {
  try {
    const moimRef = doc(db, 'moims', moimId);
    const docSnap = await getDoc(moimRef);
    if (!docSnap.exists()) {
      alert('해당 모임이 존재하지 않습니다.');
      return;
    }

    const { roomId } = docSnap.data();
    const roomRef = doc(db, 'rooms', roomId);

    updateDoc(roomRef, {
      members: arrayRemove(userId),
    });

    deleteRoomFromUser(roomId, userId);
  } catch (e) {
    throw new Error(e);
  }
};

const queryChatRoomInfo = async moimId => {
  const moimChatRoom = await getMoimChatRoom(`${moimId}`);

  if (!moimChatRoom) {
    alert('해당 모임이 존재하지 않습니다.');
    return null;
  }

  const joinDate = await getJoinDate('1', moimChatRoom.id); // userId, roomId
  const membersInfo = await getMembersInfo(moimChatRoom.members);
  const chatRoom = {
    ...moimChatRoom,
    joinDate,
    membersInfo,
  };

  return chatRoom;
};

export {
  signInFirebase,
  sendMessage,
  findPrivateChatRoom,
  createPrivateRoom,
  activateChatRoom,
  deactivateChatRoom,
  getMessages,
  getMoimChatRoom,
  createMoimChat,
  increaseUnreadMessage,
  resetUnreadMessage,
  saveNotification,
  joinMoimChat,
  excludeFromChatRoom,
  queryChatRoomInfo,
};

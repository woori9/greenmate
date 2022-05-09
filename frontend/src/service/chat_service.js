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

const getCurrentMembers = async chatRoomId => {
  const roomRef = doc(db, 'rooms', chatRoomId);
  const docSnap = await getDoc(roomRef);
  const { members } = docSnap.data();
  return members;
};

const increaseUnreadMessage = async (chatRoomId, memberId) => {
  console.log('increase member', memberId, 's unread message');
  const userRef = doc(db, 'users', memberId);
  const snapShot = await getDoc(userRef);
  const { activatedChatRooms } = snapShot.data();
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

const getMoimChatRoom = async moimId => {
  const moimRef = doc(db, 'moims', moimId);
  const docSnap = await getDoc(moimRef);
  // const chatRoomId = docSnap.data().roomId;
  return docSnap.exists() ? docSnap.data() : null;
};

const checkUserIsInMember = async (chatRoomId, user) => {
  const roomRef = doc(db, 'rooms', chatRoomId);
  const roomDocSnap = await getDoc(roomRef);
  const { members } = roomDocSnap.data();
  const targetMember = members.find(member => member === user.id);

  if (!targetMember) {
    await updateDoc(roomRef, {
      members: arrayUnion(user.id),
    });

    await updateDoc(roomRef, {
      membersInfo: arrayUnion({
        ...user,
        joinDate: new Date(),
      }),
    });

    await addRoomToUser(user.id, chatRoomId, 0);
  }
};

const createMoimChat = async (moimId, user) => {
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
      members: [user.id],
      membersInfo: [
        {
          ...user,
          joinDate: new Date(),
        },
      ],
      type: 2, // type 1: private 2: moim
    };

    await setDoc(newRoomRef, newRoom);
    await addRoomToUser(user.id, newRoomRef.id, 2);
    return newRoomRef.id;
  } catch (e) {
    throw new Error(e);
  }
};

export {
  signIn,
  sendMessage,
  findPrivateChatRoom,
  createPrivateRoom,
  activateChatRoom,
  deactivateChatRoom,
  getMessages,
  getMoimChatRoom,
  checkUserIsInMember,
  createMoimChat,
  getCurrentMembers,
  increaseUnreadMessage,
  resetUnreadMessage,
};

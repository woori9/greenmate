import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
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
    }
    return docSnap.data().roomId;
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
        // 추후 실제 데이터로 수정
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
const getPrivateRoomId = async (pairId, userId) => {
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

  return targetRoom ? targetRoom.id : null;
};

const createPrivateRoom = async (pairId, userId) => {
  try {
    const newRoomRef = doc(collection(db, 'rooms'));

    const newRoom = {
      id: newRoomRef.id,
      type: 1, // type 0: moim, 1: private,
      members: [userId, pairId],
      membersInfo: [
        // 추후 실제 데이터로 수정
        {
          id: userId,
          joinDate: new Date(),
          nickname: `nickname${userId}`,
          veganType: userId,
        },
        {
          id: pairId,
          joinDate: new Date(),
          nickname: `nickname${pairId}`,
          veganType: pairId,
        },
      ],
    };

    await setDoc(newRoomRef, newRoom);
    return newRoomRef.id;
  } catch (e) {
    throw new Error(e);
  }
};

export { signIn, getRoomId, sendMessage, getPrivateRoomId, createPrivateRoom };

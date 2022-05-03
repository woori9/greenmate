import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  serverTimestamp,
  addDoc,
  updateDoc,
  arrayUnion,
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

      const userRoomRef = doc(db, 'users', userId, 'rooms', chatRoomId);
      await setDoc(userRoomRef, {
        moimId,
        joinDate: Date.now(),
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
      moimId,
      id: newRoomRef.id,
      members: [userId],
    };

    const userRoomRef = doc(db, 'users', userId, 'rooms', newRoomRef.id);
    await setDoc(userRoomRef, {
      moimId,
      joinDate: Date.now(),
    });

    await setDoc(newRoomRef, newRoom);
    return newRoomRef.id;
  } catch (e) {
    throw new Error(e);
  }
};

const sendMessage = async (roomId, content, user) => {
  try {
    const messageRef = doc(db, 'message', roomId);
    const messagesRef = collection(messageRef, 'messages');

    const newMessage = {
      author: user,
      content,
      timestamp: serverTimestamp(),
    };

    await addDoc(messagesRef, newMessage);
  } catch (e) {
    throw new Error('firebase에 메세지를 저장하지 못했습니다.');
  }
};

export { signIn, getRoomId, sendMessage };

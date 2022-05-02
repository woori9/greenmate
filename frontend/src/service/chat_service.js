import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  serverTimestamp,
  addDoc,
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
      rooms: [],
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
    return docSnap.data().roomId;
  }

  try {
    const newRoomRef = doc(collection(db, 'rooms'));
    await setDoc(doc(db, 'moims', moimId), {
      id: moimId,
      roomId: newRoomRef.id,
    });

    const userRoomRef = doc(db, 'users', userId, 'rooms', newRoomRef.id);
    await setDoc(userRoomRef, {
      moimId,
      joinDate: serverTimestamp(),
    });

    const newRoom = {
      moimId,
      id: newRoomRef.id,
      updatedAt: serverTimestamp(),
    };

    await setDoc(newRoomRef, newRoom);
    return newRoomRef.id;
  } catch (e) {
    throw new Error(e);
  }
};

const sendMessage = async (roomId, content, user) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(roomRef, 'messages');

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

const getChatRoomIdList = async userId => {
  const collectionRoom = await getDocs(
    collection(db, 'users', userId, 'rooms'),
  );

  return collectionRoom.docs.map(docRoom => ({
    ...docRoom.data(),
    roomId: docRoom.id,
  }));
};

export { signIn, getRoomId, sendMessage, getChatRoomIdList };

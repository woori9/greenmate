import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
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

const getRoomId = async moimId => {
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

    const newRoom = {
      id: newRoomRef.id,
      moimId,
    };

    await setDoc(newRoomRef, newRoom);
    return newRoomRef.id;
  } catch (e) {
    return e;
  }
};

export { signIn, getRoomId };

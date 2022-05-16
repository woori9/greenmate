import { atom } from 'jotai';
// 사용자 정보

const atomWithSessionStorage = (key, initialValue) => {
  const getInitialValue = () => {
    const item = sessionStorage.getItem('userInfo');
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      sessionStorage.setItem(key, JSON.stringify(nextValue));
    },
  );
  return derivedAtom;
};
export const userInfoAtom = atomWithSessionStorage('userInfo', null);

// test
export const test = atom([]);

import { atom } from 'jotai';

const atomWithSessionStorage = (key, initialValue) => {
  const getInitialValue = () => {
    const item = sessionStorage.getItem('notifications');
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
const notificationAtom = atomWithSessionStorage('notifications', []);

export default notificationAtom;

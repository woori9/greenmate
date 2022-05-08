import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const isLogin = atomWithStorage('isLogin', true);
export function setFalseLoginStatus() {
  const [loginStatus, setStatus] = useAtom(isLogin);
  setStatus(false);
  console.log(loginStatus);
}
export const sdsf = atom(false);

import { useAtom } from 'jotai';
import { userInfoAtom } from '../atoms/accounts';

export default function useUserInfo() {
  const [userInfo] = useAtom(userInfoAtom);
  return userInfo;
}

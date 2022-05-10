import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 사용자 정보
export const userInfoAtom = atomWithStorage('userInfo', {});

// use
export const moimListAtom = atom([]);

import { atom } from 'jotai';

// 내 모임 카테고리
export const categoryAtom = atom(1);

// 현재 사용자에게 보여지는 모임 리스트
export const moimListAtom = atom([]);

// 모임 평가
export const evaluationAtom = atom([]);

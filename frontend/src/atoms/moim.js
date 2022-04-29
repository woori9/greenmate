import { atom } from 'jotai';

const baseCategoryAtom = atom(0);

const categoryAtom = atom(
  get => get(baseCategoryAtom),
  (_get, set, selected) => set(baseCategoryAtom, selected),
);

export default categoryAtom;

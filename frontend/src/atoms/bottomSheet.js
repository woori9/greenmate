import { atom } from 'jotai';

export const baseBottomSheetAtom = atom({
  open: false,
  header: '',
  component: undefined,
  onSubmit: undefined,
});

export const openSheetAtom = atom(
  get => get(baseBottomSheetAtom),
  (get, set, arg) =>
    set(baseBottomSheetAtom, {
      ...get(baseBottomSheetAtom),
      ...arg,
    }),
);

export const onDismissAtom = atom(
  get => get(baseBottomSheetAtom),
  (_, set) =>
    set(baseBottomSheetAtom, {
      open: false,
      Component: undefined,
      onSubmit: undefined,
      header: '',
    }),
);

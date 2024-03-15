import { atom } from "recoil";

export const loggedUserAtom = atom({
  key: "loggedUserAtom",
  default: "null"
});
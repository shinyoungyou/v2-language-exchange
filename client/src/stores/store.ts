import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import userStore from "./userStore";
import ModalStore from "./modalStore";
import MemberStore from './memberStore';

interface Store {
  commonStore: CommonStore;
  userStore: userStore;
  modalStore: ModalStore;
  memberStore: MemberStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  userStore: new userStore(),
  modalStore: new ModalStore(),
  memberStore: new MemberStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

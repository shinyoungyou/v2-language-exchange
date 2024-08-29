import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import userStore from "./userStore";
import ModalStore from "./modalStore";
import MemberStore from './memberStore';
import MessageStore from "./messageStore";
import PresenceStore from "./presenceStore";

interface Store {
  commonStore: CommonStore;
  userStore: userStore;
  modalStore: ModalStore;
  memberStore: MemberStore;
  messageStore: MessageStore;
  presenceStore: PresenceStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  userStore: new userStore(),
  modalStore: new ModalStore(),
  memberStore: new MemberStore(),
  messageStore: new MessageStore(),
  presenceStore: new PresenceStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

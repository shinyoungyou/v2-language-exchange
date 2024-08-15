import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import userStore from "./userStore";
import ModalStore from "./modalStore";

interface Store {
  commonStore: CommonStore;
  userStore: userStore;
  modalStore: ModalStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  userStore: new userStore(),
  modalStore: new ModalStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

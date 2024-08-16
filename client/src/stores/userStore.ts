import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "@/models/user";
import { router } from "@/routes/Routes";
import { store } from "./store";
import { UserParams } from "@/models/userParams";

export default class UserStore {
    user: User | null = null;
    loading = false;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.memberStore.setUserParams(new UserParams(this.user!));
            router.navigate('/connect');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    } 

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            console.log(user);
            
            runInAction(() => this.user = user);
            store.memberStore.setUserParams(new UserParams(this.user!));
        } catch (error) {
            console.log(error);
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const birthday = this.getDateOnly(creds.birthday);
            const values = { ...creds, birthday };
            const user = await agent.Account.register(values);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.memberStore.setUserParams(new UserParams(this.user!));
            router.navigate('/connect');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    private getDateOnly(dob: string | undefined) {
        if (!dob) return;
        let birthday = new Date(dob);
        return new Date(birthday.setMinutes(birthday.getMinutes()-birthday.getTimezoneOffset()))
          .toISOString().slice(0,10);
    }
}
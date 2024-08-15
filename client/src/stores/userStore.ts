import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "@/models/user";
import { router } from "@/routes/Routes";
import { store } from "./store";
import { UserParams } from "@/models/userParams";
import { string } from "yup";
import { Creds } from "@/models/creds";


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
            store.presenceStore.createHubConnection(user);
            router.navigate('/connect');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    } 

    logout = () => {
        store.commonStore.setToken(null);
        store.presenceStore.stopHubConnection();
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            console.log(user);
            
            runInAction(() => this.user = user);
            store.memberStore.setUserParams(new UserParams(this.user!));
            store.presenceStore.createHubConnection(user);
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
            store.presenceStore.createHubConnection(user);
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

    setPhotoUrl = (photoUrl: string) => {
        if (this.user) this.user.photoUrl = photoUrl;
    }

    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
    }

    changePassword = async (creds: Creds) => {
        this.loading = true;
        try {
            const user = await agent.Account.changePassword(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => (this.loading = false));
        }
    }

    googleLogin = async (accessToken: string) => {
        try {
            const user = await agent.Account.google(accessToken);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    complete = async (creds: any) => {
        try {
            const birthday = this.getDateOnly(creds.birthday);
            const values = { ...creds, birthday };
            console.log('complete before');
            
            const user = await agent.Account.complete(values);
            console.log('complete after');

            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.memberStore.setUserParams(new UserParams(this.user!));
            store.presenceStore.createHubConnection(user);
            router.navigate('/connect');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    delete = async () => {
        store.commonStore.setToken(null);
        store.presenceStore.stopHubConnection();
        this.user = null;
        store.memberStore.members.filter(u => u.username !== this.user?.username);
        router.navigate('/');
    }
}
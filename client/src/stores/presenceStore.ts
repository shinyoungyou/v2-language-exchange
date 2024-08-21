import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import { toast } from 'react-toastify';
import { router } from '@/routes/Routes';

export default class PresenceStore {
    hubConnection: HubConnection | null = null;
    onlineUsers: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_CHAT_URL + '/presence', {
                accessTokenFactory: () => store.commonStore.token!,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log('Error establishing connection: ', error));
        
        this.hubConnection.on('UserIsOnline', username => {
          runInAction(() => {
            this.onlineUsers.push(username);
          });
        });

        this.hubConnection.on('UserIsOffline', username => {
          runInAction(() => {
            this.onlineUsers.filter(x => x !== username);
          });
        });

        this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
          runInAction(() => {
            this.onlineUsers = usernames
          });
        });
        
        this.hubConnection.on('NewMessageReceived', (username) => {
          console.log(username);
          
          toast.info(username + ' has sent you a new message! Click me to see it', {
            onClick: () => {
              router.navigate('/members/' + username + '/messages');
            }
          });
        });
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }
}


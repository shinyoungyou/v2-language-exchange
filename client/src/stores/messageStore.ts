import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Message, Group } from "@/models/message";
import { store } from "./store";
import { Pagination, PagingParams } from "@/models/pagination";
import { toast } from "react-toastify";

export default class MessageStore {
    hubConnection: HubConnection | null = null;
    messages: Message[] = [];
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    container: string = "Unread";
    activeTab: number = 0;
    loadingInitial = false;
    deleteLoading = false;

    constructor() {
        makeAutoObservable(this); 

        reaction(
            () => this.container,
            () => {
              this.pagingParams = new PagingParams();
              this.messages = [];
              this.loadMessages();
            }
        )
    }

    get axiosParams() {
        const params = new URLSearchParams();
    
        params.append("pageNumber", this.pagingParams.pageNumber.toString());
        params.append("pageSize", this.pagingParams.pageSize.toString());
    
        params.append("Container", this.container);
    
        return params;
    }

    createHubConnection = (otherUsername: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_CHAT_URL + '/message?user=' + otherUsername, {
                accessTokenFactory: () => store.userStore.user?.token!,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log('Error establishing connection: ', error));

        this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
            runInAction(() => {
                this.messages = messages;
            });
        });

        this.hubConnection.on('UpdatedGroup', (group: Group) => {
            if (group.connections.some(x => x.username === otherUsername)) {
                runInAction(() => {
                    this.messages.forEach(message => {
                        if (!message.dateRead) {
                            message.dateRead = new Date(Date.now());
                        }
                    });
                });
            }
        });

        this.hubConnection.on('NewMessage', message => {
            runInAction(() => {
                this.messages.push(message);
            })
        })
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearMessages = () => {
        this.messages = [];
        this.stopHubConnection();
    }

    sendMessage = async (username: string, content: string) => {
        try {
            await this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content});
        } catch (error) {
            console.log(error);
        }
    }

    loadMessages = async () => {
        this.setLoadingInitial(true);
        try {
            const result = await agent.Messages.listForUser(this.axiosParams);
            if (result.data !== undefined) {
                this.messages = result.data;
            } else {
                this.messages = []
            }                
            if (result.pagination !== undefined) {
                this.setPagination(result.pagination);
            } else {
                this.setPagination(null);
            }
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    deleteMessage = async (id: number) => {
        this.deleteLoading = true;
        try {
            await agent.Messages.delete(id);
        } catch (error) {
            console.log(error);
            toast.error("Problem deleting message");
        } finally {
            this.deleteLoading = false;
        }
    }

    setPagination = (pagination: Pagination | null) => {
        this.pagination = pagination;
    }
    
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setActiveTab = (activeTab: any) => {  
        switch (activeTab) {
            case 0:
                this.container = "Unread"
                break;
            case 1:
                this.container = "Inbox"
                break;
            case 2:
                this.container = "Outbox"
                break;
            default:
                this.container = "Unread"
                break;
        }  
        this.activeTab = activeTab;
    }
}


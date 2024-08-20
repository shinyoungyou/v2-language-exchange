import { Member } from "../models/member";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { store } from "./store";
import { UserParams } from "@/models/userParams";
import { Pagination, PagingParams } from "@/models/pagination";

export default class memberStore {
  members: Member[] = [];
  member: Member | null = null;
  loadingInitial = false;
  loadingMember = false;
  uploading = false;
  loading = false;
  followings: Member[] = [];
  loadingFollowings = false;
  userParams: UserParams = new UserParams();
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  activeTab: number = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.userParams,
      () => {
        this.pagingParams = new PagingParams();
        this.members = [];
        this.loadMembers();
      }
    )
  }

  get axiosParams() {
    const params = new URLSearchParams();

    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());

    if (this.userParams) {
      params.append("minAge", this.userParams.minAge.toString());
      params.append("maxAge", this.userParams.maxAge.toString());
      params.append("gender", this.userParams.gender);
      params.append("orderBy", this.userParams.orderBy);
    }

    return params;
  }

  get isCurrentUser() {
    if (store.userStore.user && this.member) {
      return store.userStore.user.username === this.member.username;
    }
    return false;
  }

  setActiveTab = (activeTab: any) => {    
    this.activeTab = activeTab;
  }

  loadMembers = async () => {
    if (this.members.length > 0) {
      this.loadingInitial = false;
    } else {
      this.loadingInitial = true;
    }

    try {
      const result = await agent.Members.list(this.axiosParams);
      console.log(result.data);
      if (result.data === undefined) return;
      this.members = [...this.members, ...result.data];
      if (result.pagination === undefined) return;
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  loadMember = async (username: string) => {
    this.loadingMember = true;
    try {
      const member = await agent.Members.details(username);
      runInAction(() => {
        this.member = member;
        this.member.lastActive = member.lastActive;
        this.loadingMember = false;
      });
    } catch (error) {
      // if there's no user that has such username
      toast.error("Problem loading member");
      runInAction(() => {
        this.loadingMember = false;
      });
    }
  };


  updateMember = async (member: Partial<Member>) => {
    this.loading = true;
    try {
      await agent.Members.update(member);
      runInAction(() => {
        if (
          member.displayName &&
          member.displayName !== store.userStore.user?.displayName
        ) {
          store.userStore.setDisplayName(member.displayName);
        }
        if (member !== null) {
          this.member = { ...this.member, ...member } as Member
        };
        this.loading = false;
      });
    } catch (error: any) {
      console.log(error);
      runInAction(() => (this.loading = false));
      toast.error("Problem updating member");
      throw error;
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  }

  setLoadingInitial = (state: boolean) => {
      this.loadingInitial = state;
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  }

  setUserParams = (params: UserParams) => {
    this.userParams = params;
  }

  searchMembers = (value: string) => {
    if (value === '') {
      this.pagingParams = new PagingParams();
      this.members = [];
      this.loadMembers();
    }
    this.members = this.members.filter(
      m => m.displayName.toLowerCase().includes(value.toLowerCase())
     || m.country.toLowerCase().includes(value.toLowerCase())
    );
  }
}

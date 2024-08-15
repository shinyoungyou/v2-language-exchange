import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 50;
    orderBy = 'lastActive';

    constructor(user?: User) {
        if (user?.gender === null) {
            this.gender = 'All';
        } else {
            this.gender = user?.gender === 'Female' ? 'Male' : 'Female'
        }
    }
}
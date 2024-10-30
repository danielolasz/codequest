import { User } from "./user.model";

export interface Reward {
    ticketId: number;
    rewardedBy: User;
    rewarded: Date;
    reward: number;
}
import { User } from "./user.model";

export interface Reward {
    ticketId: string;
    rewardedBy: User;
    rewarded: Date;
    reward: number;
}
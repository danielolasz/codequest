import { User } from "./user.model";

export interface Ticket {
    _id: string;
    title: string;
    description: string;
    ticketId: number;
    level?: string | null;
    user: User;
    created: Date;
    status: string;
    level_explanation?: string | null;
    priority: string;
    reward: number;
}
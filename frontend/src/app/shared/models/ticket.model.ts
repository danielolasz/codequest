import { User } from "./user.model";

export interface Ticket {
    title: string;
    description: string;
    ticketId: number;
    level?: string | null;
    user: User;
    created: Date;
    status: string;
}
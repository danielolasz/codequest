import { Ticket } from "./ticket.model";

export interface User {
    _id: string;
    email: string;
    name: string;
    password: string;
    tickets: Ticket[] | null;
    role: 'developer' | 'manager';
  }
  
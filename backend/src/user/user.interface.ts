import { Ticket } from "src/ticket/ticket.schema";

export interface IUser {
  email: string;
  name: string;
  password: string;
  tickets: Ticket[] | null;
  role: 'developer' | 'manager';
}

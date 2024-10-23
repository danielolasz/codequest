import { ObjectId } from "mongoose";
import { Ticket } from "src/ticket/ticket.schema";

export interface IUser {
  _id: ObjectId | string;
  email: string;
  name: string;
  password: string;
  tickets: Ticket[] | null;
  role: 'developer' | 'manager';
}

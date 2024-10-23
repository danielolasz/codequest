import { IUser } from 'src/user/user.interface';
import { User } from 'src/user/user.schema';

export interface ITicket {
  ticketId: number;
  title: string;
  description: string;
  level?: string | null;
  user: User | IUser;
  created: Date;
  status: string;
}

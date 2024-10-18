import { IUser } from 'src/user/user.interface';
import { User } from 'src/user/user.schema';

export interface ITicket {
  title: string;
  description: string;
  level?: string | null;
  user: User | IUser | null;
}

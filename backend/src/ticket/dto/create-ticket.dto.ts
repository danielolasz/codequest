import { User } from 'src/user/user.schema';
import { IsDate, IsNumber, IsString } from 'class-validator';
export class CreateTicketDto {

  @IsNumber()
  ticketId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
  
  user: User;

  @IsDate()
  created: Date

  @IsString()
  status: string;

  @IsString()
  priority: string;
}

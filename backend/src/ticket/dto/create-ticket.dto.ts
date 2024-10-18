import { User } from 'src/user/user.schema';
import { IsString } from 'class-validator';
export class CreateTicketDto {

  @IsString()
  title: string;

  @IsString()
  description: string;
  
  user: User;
}

import { IsEmail, IsString, IsIn } from 'class-validator';

export class SignUpDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['manager', 'developer'], { message: 'Role must be either "manager" or "developer"' })
  role: string;
}

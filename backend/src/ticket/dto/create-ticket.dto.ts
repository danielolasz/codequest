import { User } from "src/user/user.schema";

export class CreateTicketDto {
    readonly title: string;
    readonly description: string;
    readonly user: User;
  }
  
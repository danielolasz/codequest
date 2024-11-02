import { IsDate, IsNumber } from 'class-validator';
export class RewardTicketDto {

  @IsNumber()
  ticketId: string;

  @IsNumber()
  reward: number;

  @IsDate()
  rewarded: Date;

  rewardedBy: number;
}

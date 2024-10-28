import { IsDate, IsNumber } from 'class-validator';
export class RewardTicketDto {

  @IsNumber()
  ticketId: number;

  @IsNumber()
  reward: number;

  @IsDate()
  rewarded: Date;

  rewardedBy: number;
}

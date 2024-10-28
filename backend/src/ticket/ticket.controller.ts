import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { RewardTicketDto } from './dto/reward-ticket.dto';
import { User } from 'src/user/user.schema';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async findAll(@Res() res) {
    const tickets = await this.ticketService.findAll();
    return res.json(tickets);
  }

  @Post('reward')
  async rewardTicket(@Body() reward: RewardTicketDto) {
    try {
      await this.ticketService.rewardTicket(reward);    
      return { message: 'Ticket rewarded successfully' };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('finish')
  async finishTicket(@Body() ticketId: number) {
    try {
      await this.ticketService.finishTicket(ticketId);    
      return { message: 'Ticket finished successfully' }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('assign')
  async assignTicket(@Body() ticketId: number, user: User) {
    try {
      await this.ticketService.assignTicket(ticketId, user);    
      return { message: 'Ticket assigned successfully' }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

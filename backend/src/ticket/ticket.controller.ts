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
  async finishTicket(@Body() param: { ticketId: string }) {
    try {
      await this.ticketService.finishTicket(param.ticketId);    
      return { message: 'Ticket finished successfully' }
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reopen')
  async reopenTicket(@Body() param: { ticketId: string }) {
    try {
      await this.ticketService.reopenTicket(param.ticketId);    
      return { message: 'Ticket reopened successfully' }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('assign')
  async assignTicket(@Body() param: { ticketId: string, user: User }) {
    try {
      await this.ticketService.assignTicket(param.ticketId, param.user);    
      return { message: 'Ticket assigned successfully' }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

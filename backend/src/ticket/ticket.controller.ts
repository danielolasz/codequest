import { Controller, Get, Res } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async findAll(@Res() res) {
    const tickets = await this.ticketService.findAll();
    return res.json(tickets);
  }
}

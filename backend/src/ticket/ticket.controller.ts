import { Controller, Get, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()

  @Get()
  async findAll() {
    return this.ticketService.findAll();
  }
}

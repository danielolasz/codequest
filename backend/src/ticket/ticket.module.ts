import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './ticket.schema';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]), UserModule],
    controllers: [TicketController],
    providers: [TicketService],
  })
  export class TicketModule {}
  
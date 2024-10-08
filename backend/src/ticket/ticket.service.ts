import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import fetch from 'node-fetch';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel('Ticket') private ticketModel: Model<TicketDocument>,
  ) {

    this.processTickets();
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(createTicketDto);
    return createdTicket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().exec();
  }

  async processTickets() {
    const tickets = await this.fetchTickets();
    for (const ticket of tickets) {
      const newTicket: CreateTicketDto = {
        title: ticket.fields.summary,
        description: ticket.fields.description
      }
      this.create(newTicket);
    }
  }

  async fetchTickets() {
    const url = 'https://bonago.atlassian.net/rest/api/2/search';
    const email = 'daniel.olasz@p92.hu';
    const apiToken =
      'ATATT3xFfGF0UETPb2YmHh6ZbITl6powfGuZSwkyKeAEM8R9K8ftsUnMwjgU46aVxBE4EPfxF7lYYlysc690UDA8sh_f8mv-fsFE25n7RFnRkHty1VjI8jddELrwQKP5qQh1pYCKxsSxzKBapaNr-Mx2cGhdsEUlZI3s6LEzWVwyhiTKfmt5Ngg=0C0196DC';

    try {
      const bodyData = JSON.stringify({
        jql: 'assignee = "daniel.olasz@p92.hu" ORDER BY created DESC',
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'description'],
        startAt: 0,
      });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: bodyData,
      });

      console.log(`Response: ${response.status} ${response.statusText}`);
      const text = JSON.parse(await response.text());
      return text.issues;
    } catch (error) {
      console.error('Error fetching Jira events:', error);
    }
  }
}

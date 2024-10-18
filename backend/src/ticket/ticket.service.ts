import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDocument } from './ticket.schema';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { ITicket } from './ticket.interface';
import { User } from 'src/user/user.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  private openai: OpenAI;
  private apiToken: string;
  private url: string = 'https://bonago.atlassian.net/rest/api/2/search';

  constructor(
    @InjectModel('Ticket') private ticketModel: Model<TicketDocument>, private userService: UserService,
    configService: ConfigService,
  ) {
    this.apiToken = configService.get<string>('JIRA_API_TOKEN');
    this.openai = new OpenAI({
      apiKey: configService.get<string>('CHATGPT_API_TOKEN'),
    });

    this.processTickets('daniel.olasz@p92.hu');
  }

  async create(newTicket: CreateTicketDto): Promise<ITicket> {
    const createdTicket = new this.ticketModel(newTicket);
    return createdTicket.save();
  }

  async findAll(): Promise<ITicket[]> {
    return this.ticketModel.find().exec();
  }

  async processTickets(email: string) {

    const user: User = await this.userService.findByEmail(email) as User;
    const tickets = await this.fetchTickets(email);

    if (!user) {
      console.error('User is required but was not provided.');
      return;
    }
    for (const ticket of tickets) {
      const newTicket: CreateTicketDto = {
        title: ticket.fields.summary ? ticket.fields?.summary : "Default Title",
        description: ticket.fields.description ? tickets.fields?.description : "No description",
        user: user
      };
      this.create(newTicket);
    }
  }

  async fetchTickets(email: string) {
    try {
      const bodyData = JSON.stringify({
        jql: 'assignee = "' + email + '" ORDER BY created DESC',
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'description'],
        startAt: 0,
      });
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${email}:${this.apiToken}`).toString('base64')}`,
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

  async callChatGpt(description: string) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content:
            'What dou you think about this programming task? Is it Junior, Medior or Senior? Reply with only one of these words. ' + description,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './ticket.schema';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  private openai: OpenAI;
  private apiToken: string;
  private url: string = 'https://bonago.atlassian.net/rest/api/2/search';
  private users: User[]

  constructor(
    @InjectModel('Ticket') private ticketModel: Model<TicketDocument>, private userService: UserService,
    configService: ConfigService,
  ) {
    this.apiToken = configService.get<string>('JIRA_API_TOKEN');
    this.openai = new OpenAI({
      apiKey: configService.get<string>('CHATGPT_API_TOKEN'),
    });


    this.processTickets();
  }

  async create(newTicket: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(newTicket);
    if(createdTicket) {
      await this.userService.addTicketToUser(createdTicket.user, createdTicket._id)
    }
    return createdTicket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().populate('user').exec();
  }

  async processTickets() {
    this.users = await this.userService.findAll();

    for (const user of this.users) {      
      const tickets = await this.fetchTickets(user.email);
      //console.log(JSON.stringify(tickets));
      if (!user) {
        console.error('User is required but was not provided.');
        return;
      }
      for (const ticket of tickets) {
        const existingTicket = await this.ticketModel.findOne({ ticketId: ticket.id }).exec();
        if(existingTicket) {
          continue;
        }

        try {
          const newTicket: CreateTicketDto = {
            ticketId: ticket.id,
            title: ticket.fields.summary ? ticket.fields.summary : "No Title",
            description: ticket.fields.description ? ticket.fields.description : "No description",
            user: user,
            created: ticket.fields.created ? ticket.fields.created : Date.now(),
            status: ticket.fields.status.name ? ticket.fields.status.name : "None",
            priority: ticket.fields.priority.name ? ticket.fields.priority.name : "None"
          };
          this.create(newTicket);

        } catch (error) {
          console.error("Error happend while creating ticket: " + error)
        }

      }
    }
  }

  async fetchTickets(email: string) {
    try {
      const bodyData = JSON.stringify({
        jql: 'assignee = "' + email + '" ORDER BY created DESC',
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'description', 'created', 'priority'],
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

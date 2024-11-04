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
import { RewardTicketDto } from './dto/reward-ticket.dto';

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
      apiKey: configService.get<string>('LLAMA_API_KEY'),
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });


    //this.processTickets();
  }

  async create(newTicket: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(newTicket);
    return createdTicket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().populate('user').exec();
  }

  async findById(_id: string): Promise<Ticket> {
    return this.ticketModel.findOne({ _id }).exec();
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
          const createdTicket = await this.create(newTicket);
          console.log("New ticket is added");
          await this.addTicketLevel(createdTicket)

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

      const text = JSON.parse(await response.text());
      return text.issues;
    } catch (error) {
      console.error('Error fetching Jira events: ', error);
    }
  }

  async callOpenAI(description: string):Promise<string> {

    const completion = await this.openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        {
          role: 'user',
          content:
            'Provide JSON template response when assessing the following task seniority for a web developer, using the format: { "level": <0-10>, "summary": "summary text here" }: ' +
            description +
            "Don't provide anything else but the json. Don't put quotes around it.",
        },
      ],
      temperature: 0,
      top_p: 1,
      max_tokens: 200,
      stream: false,
    });
    return completion.choices[0].message.content;
  }

  async rewardTicket(reward: RewardTicketDto): Promise<void> {
    const ticket = await this.findById(reward.ticketId);
    const user = await this.userService.findOne(reward.rewardedBy)
    ticket.rewardedBy = user;
    ticket.rewarded = reward.rewarded;
    ticket.reward = reward.reward;
    await this.userService.addRewardToUser(reward.rewardedBy, reward.reward);
    const rewardedTicket = new this.ticketModel(ticket);
    await rewardedTicket.save();
  }

  async finishTicket(ticketId: string): Promise<void> {
    const ticket = await this.findById(ticketId);
    ticket.status = "Done";
    const rewardedTicket = new this.ticketModel(ticket);
    await rewardedTicket.save();
  }

  async assignTicket(ticketId: string, user: User): Promise<void> {
    const ticket = await this.findById(ticketId);
    ticket.user = user;
    const rewardedTicket = new this.ticketModel(ticket);
    await rewardedTicket.save();
  }

  async addTicketLevel(ticket: Ticket): Promise<void> {    
    try {       
      const response = await this.callOpenAI(ticket.description);
      ticket.level = JSON.parse(response).level as number
      ticket.level_explanation = JSON.parse(response).summary;    
      await this.create(ticket);
      console.log("New ticket level is added.")
    } catch (error) {
       console.error('Error while trying to add ticket level: ', error);
    }
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TicketDocument = Ticket & Document<ObjectId>;;

@Schema()
export class Ticket {

  @Prop({ required: true })
  ticketId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  level:  number;

  @Prop()
  level_explanation: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  status: string;

  @Prop()
  created: Date;

  @Prop()
  priority: string;

  @Prop()
  reward: number;

  @Prop()
  rewarded: Date;

  @Prop({ type: Types.ObjectId, ref: 'User'})
  rewardedBy: User;
  
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
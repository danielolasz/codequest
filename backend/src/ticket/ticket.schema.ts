import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  level: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  user: User;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
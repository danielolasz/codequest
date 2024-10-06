import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
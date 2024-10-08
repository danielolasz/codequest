import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Ticket } from 'src/ticket/ticket.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {

  @Prop({ required: true })
  email: string;

  @Prop({ type: [Types.ObjectId], ref: 'Ticket' })
  tickets: Ticket[];
}

export const UserSchema = SchemaFactory.createForClass(User);
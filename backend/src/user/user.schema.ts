import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Ticket } from 'src/ticket/ticket.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Types.ObjectId], ref: 'Ticket' })
  tickets: Ticket[]
  
  @Prop({ required: true, enum: ['developer', 'manager'] })
  role: 'developer' | 'manager';
}

export const UserSchema = SchemaFactory.createForClass(User);
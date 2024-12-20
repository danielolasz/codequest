import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document<ObjectId>;

@Schema()
export class User {

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ required: true, enum: ['developer', 'manager'] })
  role: 'developer' | 'manager';

  @Prop({ })
  rewards: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
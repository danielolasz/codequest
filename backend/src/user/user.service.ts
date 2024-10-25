import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(signUpDto: SignUpDto): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({ email: signUpDto.email }).exec();
      if (existingUser) {
        throw new ConflictException('User with this email already exists.');
      }
      const createdUser = new this.userModel(signUpDto);
      createdUser.password = await this.hashPassword(signUpDto.password);
      return await createdUser.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('An error occurred while creating the user. ' + error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> | null {
    if (!email) {
      return null;
    }
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(id: number): Promise<User> | null {
    if (!id) {
      return null;
    }
    return this.userModel.findById(id);
  }

  async validateUser(email: string, password: string): Promise<User> | null {
    if (!email || !password) {
      return null;
    }
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  public async addTicketToUser(userId, ticketId): Promise<User> | null {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { tickets: ticketId } },
      { new: true }
    );
  }
}

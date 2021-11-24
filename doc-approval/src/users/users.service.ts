import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { User, UserDocument } from './schemas/user.schema';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userId: string): Promise<User> {
    console.log(`findOne() ${userId}`);
    return this.userModel.findOne({ id: userId });
  }

  async create(createUser: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUser);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

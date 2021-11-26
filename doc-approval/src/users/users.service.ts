import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { MongoRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async findOne(userId: string, password: string): Promise<User> {
    console.log(`findOne() ${userId} ${password}`);
    const result = await this.userRepository.findOne({ id: userId, password: password });
    console.log(result);
    return result;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const { id, name, password } = userDto;
    const user = new User();
    user.id = id;
    user.name = name;
    user.password = password;

    return this.userRepository.save(user);
  }
}

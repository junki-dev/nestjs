import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  /**
   * User 조회
   * @param {string} userId User 아이디
   * @returns {User} User 데이터
   */
  async findOne(userId: string): Promise<User> {
    this.logger.log(`findOne()`);
    const result = await this.userRepository.findOne({ id: userId });
    return result;
  }

  /**
   * User 데이터 전체 조회
   * @returns {User[]} User 데이터
   */
  async findAll(): Promise<User[]> {
    this.logger.log(`findAll()`);
    return this.userRepository.find();
  }

  /**
   * User 생성
   * @param {CreateUserDto} userDto User 데이터
   * @returns {string} result string
   */
  async create(userDto: CreateUserDto): Promise<string> {
    this.logger.log(`create()`);
    const { id, name, password } = userDto;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const user = new User();
    user.id = id;
    user.name = name;
    user.password = hash;

    const userExist = await this.findOne(id);
    if (userExist) {
      return `[${id}] is already exist`;
    }

    await this.userRepository.save(user);

    return `success`;
  }
}

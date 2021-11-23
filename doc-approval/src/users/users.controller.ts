import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'User 생성 API', description: 'User를 생성한다.' })
  @ApiCreatedResponse({ description: 'User를 생성한다.', type: User })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log(`call users create ${createUserDto}`);
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    console.log(`call users findAll`);
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOnById(@Param('id') id: string): Promise<User> {
    console.log(`call user findOneById`);
    return await this.userService.findOne(id);
  }
}

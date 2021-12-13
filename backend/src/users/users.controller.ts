import { Controller, Get, Logger, Post, Request } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Request() req: any): Promise<string> {
    this.logger.log(`[Post]/create api call`);
    return await this.userService.create(req.body);
  }

  @Get()
  async findAll(): Promise<User[]> {
    this.logger.log(`[Get]/findAll api call`);
    return await this.userService.findAll();
  }
}

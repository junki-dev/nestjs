import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(id: string, password: string): Promise<any> {
    console.log(`validateUser() id: ${id}, password: ${password}`);
    const user = await this.usersService.findOne(id, password);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: User) {
    const payload = { id: user.id, password: user.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

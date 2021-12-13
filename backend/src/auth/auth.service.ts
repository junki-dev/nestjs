import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  /**
   * User 검증
   * @param {string} id User 아이디
   * @param {string} password User 비밀번호
   * @returns {User || null} 검증 결과
   */
  async validateUser(id: string, password: string): Promise<any> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const user = await this.usersService.findOne(id);

    if (user && bcrypt.compare(user.password, hash)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * User 로그인, JWT 토큰 발급
   * @param {User} user User 데이터
   * @returns Login Access token
   */
  async login(user: User) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

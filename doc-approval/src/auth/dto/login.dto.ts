import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  public id: string;

  @ApiProperty()
  @IsString()
  public password: string;
}

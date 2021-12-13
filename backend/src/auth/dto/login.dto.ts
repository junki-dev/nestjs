import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
  })
  readonly id: string;

  @ApiProperty({
    description: 'UserPassword',
    type: String,
  })
  readonly password: string;
}

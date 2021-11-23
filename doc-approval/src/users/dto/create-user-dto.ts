import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
  })
  readonly id: string;

  @ApiProperty({
    description: 'User Name',
    type: String,
  })
  readonly name: string;

  @ApiProperty({
    description: 'UserPassword',
    type: String,
  })
  readonly password: string;
}

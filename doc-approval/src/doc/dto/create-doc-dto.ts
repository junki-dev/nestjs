import { ApiProperty } from '@nestjs/swagger';

export class CreateDocDto {
  @ApiProperty({
    description: 'Doc Title',
    type: String,
    nullable: false,
  })
  readonly title: string;

  @ApiProperty({
    description: 'Doc Type',
    type: String,
    nullable: false,
  })
  readonly type: string;

  @ApiProperty({
    description: 'Doc Content',
    type: String,
    nullable: false,
  })
  readonly content: string;

  @ApiProperty({
    description: 'Doc Drafter',
    type: String,
    nullable: false,
  })
  readonly drafter: string;

  @ApiProperty({
    description: 'First Approval ID',
    type: String,
    nullable: false,
  })
  readonly firstApproval: string;

  @ApiProperty({
    description: 'Second Approval ID',
    type: String,
    nullable: false,
  })
  readonly secondApproval: string;

  @ApiProperty({
    description: 'Third Approval ID',
    type: String,
    nullable: false,
  })
  readonly thirdApproval: string;
}

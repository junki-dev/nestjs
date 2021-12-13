import { IsIn, IsNotEmpty } from 'class-validator';

export class ApprovalDocDto {
  @IsNotEmpty()
  readonly docNumber: number; // Document 번호

  @IsNotEmpty()
  @IsIn(['Y', 'N'])
  readonly approvalYn: string; // Document 승인 여부

  readonly approvalComment: string; // Document 의견
}

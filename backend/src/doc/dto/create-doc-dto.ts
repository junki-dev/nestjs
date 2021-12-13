import { IsNotEmpty } from 'class-validator';

export class CreateDocDto {
  @IsNotEmpty()
  readonly title: string; // 제목

  @IsNotEmpty()
  readonly type: string; // 분류

  @IsNotEmpty()
  readonly content: string; // 내용

  @IsNotEmpty()
  readonly firstApproval: string; // 결재자1

  readonly firstApprovalComment: string; // 결재자1 의견

  readonly firstApprovalYn: string; // 결재자1 승인 여부

  readonly secondApproval: string; // 결재자2

  readonly secondApprovalComment: string; // 결재자2 의견

  readonly secondApprovalYn: string; // 결재자2 승인 여부

  readonly thirdApproval: string; // 결재자3

  readonly thirdApprovalComment: string; // 결재자3 의견

  readonly thirdApprovalYn: string; // 결재자3 승인 여부
}

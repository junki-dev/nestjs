import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Doc {
  @ObjectIdColumn()
  _id: ObjectID; // Primary Key

  @Column({ unique: true })
  docNumber: number; // Document 번호

  @Column()
  title: string; // 제목

  @Column()
  type: string; // 유형

  @Column()
  content: string; // 내용

  @Column()
  drafter: string; // 생성자

  @Column()
  firstApproval: string; // 결재자1

  @Column()
  firstApprovalComment: string = null; // 결재자1 의견

  @Column()
  firstApprovalYn: string = null; // 결재자1 승인 여부

  @Column()
  secondApproval: string; // 결재자2

  @Column()
  secondApprovalComment: string = null; // 결재자2 의견

  @Column()
  secondApprovalYn: string = null; // 결재자2 승인 여부

  @Column()
  thirdApproval: string = null; // 결재자3 의견

  @Column()
  thirdApprovalComment: string; // 결재자3 의견

  @Column()
  thirdApprovalYn: string = null; // 결재자3 승인 여부
}

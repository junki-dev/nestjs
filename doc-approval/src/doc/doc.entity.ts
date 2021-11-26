import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Doc {
  @ObjectIdColumn()
  docNumber: ObjectID;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  drafter: string;

  @Column({ nullable: false })
  firstApproval: string;

  @Column()
  secondApproval: string;

  @Column()
  thirdApproval: string;
}

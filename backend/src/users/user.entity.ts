import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID; // Primary Key

  @Column()
  id: string; // 아이디

  @Column()
  name: string; // 이름

  @Column()
  password: string; // 비밀번호
}

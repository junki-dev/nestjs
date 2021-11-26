import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;
}

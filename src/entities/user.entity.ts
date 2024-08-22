import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Seminar } from './seminar.entity';
import { SeminarParticipant } from './seminar-participant.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Seminar, (seminar) => seminar.creator)
  seminars: Seminar[];

  @OneToMany(() => SeminarParticipant, (participant) => participant.user)
  joinedSeminars: SeminarParticipant[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Seminar } from './seminar.entity';
import { SeminarParticipant } from './seminar-participant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Seminar, (seminar) => seminar.creator)
  seminars: Seminar[];

  @OneToMany(() => SeminarParticipant, (participant) => participant.user)
  joinedSeminars: SeminarParticipant[];
}

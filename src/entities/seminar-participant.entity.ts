import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Seminar } from './seminar.entity';

@Entity()
export class SeminarParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.joinedSeminars)
  user: User;

  @ManyToOne(() => Seminar, (seminar) => seminar.participants)
  seminar: Seminar;
}

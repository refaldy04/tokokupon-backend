import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { SeminarParticipant } from './seminar-participant.entity';

@Entity()
export class Seminar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  schedule: Date;

  @Column()
  maxParticipants: number;

  @ManyToOne(() => User, (user) => user.seminars)
  creator: User;

  @OneToMany(() => SeminarParticipant, (participant) => participant.seminar, {
    cascade: true,
  })
  participants: SeminarParticipant[];
}

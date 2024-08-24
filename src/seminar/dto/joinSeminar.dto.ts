import { IsInt } from 'class-validator';

export class JoinSeminarDto {
  @IsInt()
  userId: number;
}

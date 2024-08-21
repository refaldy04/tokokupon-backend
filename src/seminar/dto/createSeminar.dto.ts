import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateSeminarDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  schedule: string;

  @IsInt()
  @Min(1)
  maxParticipants: number;
}

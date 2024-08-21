import { PartialType } from '@nestjs/mapped-types';
import { CreateSeminarDto } from './createSeminar.dto';

export class UpdateSeminarDto extends PartialType(CreateSeminarDto) {}

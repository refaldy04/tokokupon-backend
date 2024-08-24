import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seminar } from 'src/entities/seminar.entity';
import { Repository } from 'typeorm';
import { CreateSeminarDto } from './dto/createSeminar.dto';
import { UpdateSeminarDto } from './dto/updateSeminar.dto';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constant';
import { User } from 'src/entities/user.entity';
import { SeminarParticipant } from 'src/entities/seminar-participant.entity';

@Injectable()
export class SeminarService {
  constructor(
    @InjectRepository(Seminar) private seminarRepo: Repository<Seminar>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SeminarParticipant)
    private seminarParticipantRepo: Repository<SeminarParticipant>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    return await this.seminarRepo.find({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
    });
  }

  async findOne(id) {
    const property = await this.seminarRepo.findOne({ where: { id } });

    if (!property) throw new NotFoundException('Seminar not found');
    return property;
  }

  async create(dto: CreateSeminarDto) {
    return await this.seminarRepo.save(dto);
  }

  async update(id: number, dto: UpdateSeminarDto) {
    return await this.seminarRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return await this.seminarRepo.delete({ id });
  }

  async joinSeminar(seminarId: number, userId: number): Promise<any> {
    const seminar = await this.seminarRepo.findOne({
      where: { id: seminarId },
      relations: ['participants'],
    });
    if (!seminar) {
      throw new NotFoundException('Seminar not found');
    }

    if (seminar.participants.length >= seminar.maxParticipants) {
      throw new BadRequestException('Seminar is full');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const participant = this.seminarParticipantRepo.create({ seminar, user });
    return this.seminarParticipantRepo.save(participant);
  }
}

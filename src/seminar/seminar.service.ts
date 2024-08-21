import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seminar } from 'src/entities/seminar.entity';
import { Repository } from 'typeorm';
import { CreateSeminarDto } from './dto/createSeminar.dto';
import { UpdateSeminarDto } from './dto/updateSeminar.dto';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constant';

@Injectable()
export class SeminarService {
  constructor(
    @InjectRepository(Seminar) private seminarRepo: Repository<Seminar>,
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
}

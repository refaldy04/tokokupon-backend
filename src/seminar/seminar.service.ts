import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seminar } from 'src/entities/seminar.entity';
import { In, Repository } from 'typeorm';
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

  async create(dto: CreateSeminarDto, creatorId: number) {
    // Cari user yang akan menjadi creator seminar
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });

    if (!creator) {
      throw new NotFoundException('User not found');
    }

    // Buat instance seminar baru dan tetapkan creator
    const seminar = this.seminarRepo.create({
      ...dto,
      creator,
    });

    // Simpan seminar ke database
    return await this.seminarRepo.save(seminar);
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

  async getUserJoinedSeminars(userId: number): Promise<Seminar[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const seminars = await this.seminarRepo
      .createQueryBuilder('seminar')
      .innerJoinAndSelect(
        'seminar.participants',
        'participant',
        'participant.userId = :userId',
        { userId },
      )
      .getMany();

    return seminars;
  }

  async getCreatedSeminars(userId: number): Promise<Seminar[]> {
    // Memeriksa apakah user ada
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Mengambil semua seminar yang dibuat oleh user
    const seminars = await this.seminarRepo.find({
      where: { creator: { id: userId } },
      relations: ['creator'],
    });

    return seminars;
  }

  async deleteSeminar(seminarId: number, userId: number): Promise<void> {
    // Cari seminar berdasarkan seminarId
    const seminar = await this.seminarRepo.findOne({
      where: { id: seminarId },
      relations: ['creator'], // untuk mendapatkan informasi tentang pembuat seminar
    });

    // Jika seminar tidak ditemukan, lemparkan NotFoundException
    if (!seminar) {
      throw new NotFoundException('Seminar not found');
    }

    // Periksa apakah seminar ini dibuat oleh pengguna yang meminta penghapusan
    if (seminar.creator.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this seminar',
      );
    }

    if (seminar.participants.length > 0) {
      const participantIds = seminar.participants.map((p) => p.id);
      await this.seminarParticipantRepo.delete({ id: In(participantIds) });
    }

    // Hapus seminar
    await this.seminarRepo.delete(seminarId);
  }
}

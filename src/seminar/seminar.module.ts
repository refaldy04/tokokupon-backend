import { Module, ValidationPipe } from '@nestjs/common';
import { SeminarController } from './seminar.controller';
import { SeminarService } from './seminar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seminar } from 'src/entities/seminar.entity';
import { APP_PIPE } from '@nestjs/core';
import { User } from 'src/entities/user.entity';
import { SeminarParticipant } from 'src/entities/seminar-participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seminar]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SeminarParticipant]),
  ],
  controllers: [SeminarController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // forbidNonWhitelisted untuk memberikan error ketika ada field yang tidak ada di dto
        forbidNonWhitelisted: true,
        // ini untuk mengonversi param dan query
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    SeminarService,
  ],
})
export class SeminarModule {}

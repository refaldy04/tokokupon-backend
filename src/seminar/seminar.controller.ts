import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SeminarService } from './seminar.service';
import { CreateSeminarDto } from './dto/createSeminar.dto';
import { UpdateSeminarDto } from './dto/updateSeminar.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('seminar')
export class SeminarController {
  constructor(private seminarService: SeminarService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.seminarService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.seminarService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSeminarDto) {
    console.log('dto', dto);
    return this.seminarService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() body: UpdateSeminarDto) {
    return this.seminarService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return this.seminarService.delete(id);
  }
}

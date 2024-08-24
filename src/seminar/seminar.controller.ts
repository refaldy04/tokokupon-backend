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
  Req,
  UseGuards,
} from '@nestjs/common';
import { SeminarService } from './seminar.service';
import { CreateSeminarDto } from './dto/createSeminar.dto';
import { UpdateSeminarDto } from './dto/updateSeminar.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JoinSeminarDto } from './dto/joinSeminar.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinSeminar(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.seminarService.joinSeminar(id, req.user.id);
  }
}

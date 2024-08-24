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

  @UseGuards(JwtAuthGuard)
  @Get('joined')
  async getJoinedSeminars(@Req() req) {
    return this.seminarService.getUserJoinedSeminars(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('created')
  async getCreatedSeminars(@Req() req) {
    return this.seminarService.getCreatedSeminars(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.seminarService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateSeminarDto) {
    return this.seminarService.create(dto, req.user.id);
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

  @UseGuards(JwtAuthGuard)
  @Delete(':seminarId')
  async deleteSeminar(
    @Param('seminarId', ParseIntPipe) seminarId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.seminarService.deleteSeminar(seminarId, userId);
  }
}

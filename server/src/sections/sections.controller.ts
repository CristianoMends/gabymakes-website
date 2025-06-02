import { Controller, Post, Get, Param, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('sections')
@ApiTags('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar nova seção promocional' })
  @ApiResponse({ status: 201, description: 'Seção criada com sucesso' })
  create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as seções com seus produtos' })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma seção específica pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma seção existente' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma seção pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.remove(id);
  }
}
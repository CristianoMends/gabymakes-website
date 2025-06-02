import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  ValidationPipe,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo produto' })
  @ApiBody({ type: CreateProductDto })
  async create(@Body(new ValidationPipe()) dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  async findAll() {
    return await this.productService.findAll();
  }
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'Obter produto por id' })
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,

  ) {
    return await this.productService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: UpdateProductDto
  ) {
    return await this.productService.update(id, dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar produtos com filtros' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({ name: 'priceMin', required: false })
  @ApiQuery({ name: 'priceMax', required: false })
  @ApiQuery({ name: 'quantityMin', required: false })
  @ApiQuery({ name: 'quantityMax', required: false })
  async findByFilters(@Query() query: any) {
    return await this.productService.findByFilters(query);
  }
}

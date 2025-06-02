import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Product } from 'src/products/entities/product.entity';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(dto: CreateSectionDto) {
    const products = await this.productRepository.findByIds(dto.productId);
    const section = this.sectionRepository.create({
      title: dto.title,
      products,
    });
    return this.sectionRepository.save(section);
  }

  findAll() {
    return this.sectionRepository.find({ relations: ['products'] });
  }

  async findOne(id: number) {
    const section = await this.sectionRepository.findOne({ where: { id }, relations: ['products'] });
    if (!section) throw new NotFoundException('Seção não encontrada');
    return section;
  }

  async update(id: number, dto: UpdateSectionDto) {
    const section = await this.findOne(id);
    if (dto.productId) {
      section.products = await this.productRepository.findByIds(dto.productId);
    }
    if (dto.title) section.title = dto.title;
    return this.sectionRepository.save(section);
  }

  async remove(id: number) {
    const section = await this.findOne(id);
    return this.sectionRepository.remove(section);
  }
}
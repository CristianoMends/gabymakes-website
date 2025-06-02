import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) { }

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(data);
    return await this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findById(id: string): Promise<Product | null> {
    const p = this.productRepo.findOneBy({ id });

    if (!p) throw new NotFoundException('Produto não encontrado');

    return p;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const updated = Object.assign(product, data);
    return this.productRepo.save(updated);
  }

  async findByFilters(filters: any): Promise<Product[]> {
    const where: any = {};

    if (filters.id) where.id = filters.id;
    if (filters.brand) where.brand = ILike(`%${filters.brand}%`);
    if (filters.category) where.category = ILike(`%${filters.category}%`);
    if (filters.description) where.description = ILike(`%${filters.description}%`);

    if (filters.priceMin || filters.priceMax) {
      const min = parseFloat(filters.priceMin) || 0;
      const max = parseFloat(filters.priceMax) || Number.MAX_VALUE;
      where.price = Between(min, max);
    }

    if (filters.quantityMin || filters.quantityMax) {
      const min = parseInt(filters.quantityMin) || 0;
      const max = parseInt(filters.quantityMax) || Number.MAX_SAFE_INTEGER;
      where.quantity = Between(min, max);
    }

    return this.productRepo.find({ where });
  }

}
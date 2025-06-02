import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Section } from './entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Product])],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule { }

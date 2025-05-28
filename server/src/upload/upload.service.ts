import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadStrategy } from './upload-strategy.interface';

@Injectable()
export class UploadService {
  constructor(private readonly strategy: UploadStrategy) {}

  upload(file: Express.Multer.File): Promise<string> {
    return this.strategy.upload(file);
  }

    getImage(filename: string): Buffer {
    if (!this.strategy.getImageBuffer) {
      throw new NotFoundException('Esta estratégia não suporta leitura de imagem');
    }
    return this.strategy.getImageBuffer(filename);
  }
}

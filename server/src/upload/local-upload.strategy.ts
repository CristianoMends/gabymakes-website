import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';
import { UploadStrategy } from './upload-strategy.interface';

@Injectable()
export class LocalUploadStrategy implements UploadStrategy {
  private uploadDir = join(__dirname, '..', '..', 'uploads');

  private generateFileName(originalName: string): string {
    const ext = originalName.split('.').pop();
    const hash = crypto.randomBytes(16).toString('hex');
    return `${hash}.${ext}`;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    try {
      if (!existsSync(this.uploadDir)) {
        mkdirSync(this.uploadDir, { recursive: true });
      }

      const filename = this.generateFileName(file.originalname);
      const filepath = join(this.uploadDir, filename);
      const stream = createWriteStream(filepath);
      stream.write(file.buffer);
      stream.end();

      return `http://localhost:3000/upload/image/${filename}`;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar a imagem localmente');
    }
  }

  getImageBuffer(filename: string): Buffer {
    const filePath = join(this.uploadDir, filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Imagem não encontrada');
    }
    return readFileSync(filePath);
  }

}

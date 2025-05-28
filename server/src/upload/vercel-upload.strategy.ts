import { Injectable } from '@nestjs/common';
import { UploadStrategy } from './upload-strategy.interface';

@Injectable()
export class VercelUploadStrategy implements UploadStrategy {
  async upload(file: Express.Multer.File): Promise<string> {

    throw new Error('uploadVercelBlob ainda não implementado');
  }
}

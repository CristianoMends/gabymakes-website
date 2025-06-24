import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadStrategy } from './upload-strategy.interface';
import { del, put } from '@vercel/blob';


@Injectable()
export class VercelUploadStrategy implements UploadStrategy {

  async upload(file: Express.Multer.File): Promise<string> {
    const blob = await put(`product/image.png`, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
    });
    return blob.url
  }

  async getImageBuffer?(filename: string): Promise<Buffer<ArrayBufferLike>> {

    const vercelBlobBaseUrl = process.env.VERCEL_BLOB_URL_BASE || 'https://<seu-store-id>.public.blob.vercel-storage.com/';
    const imageUrl = `${vercelBlobBaseUrl}product/${filename}`;

    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Image not found on Vercel Blob storage.');
        }
        throw new Error(`Failed to fetch image from Vercel Blob: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);

    } catch (error) {
      console.error(`Error fetching image buffer from Vercel Blob for ${filename}:`, error);
      throw new InternalServerErrorException(`Failed to retrieve image from storage: ${error.message}`);
    }
  }

}

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { basename } from 'path';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @ApiOperation({ summary: 'Faz upload de uma imagem' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Upload realizado com sucesso' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Arquivo não enviado.', HttpStatus.BAD_REQUEST);
    }

    const imageUrl = await this.uploadService.upload(file);
    return {
      message: 'Upload realizado com sucesso.',
      url: imageUrl,
    };
  }

  @Get('image')
  @ApiOperation({ summary: 'Retorna uma imagem pela URL completa gerada no upload' })
  @ApiQuery({ name: 'url', required: true, description: 'URL retornada no upload contendo o nome da imagem' })
  @ApiResponse({ status: 200, description: 'Imagem retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async getImage(@Query('url') url: string, @Res() res: Response) {
    try {
      const filename = basename(new URL(url, 'http://localhost').pathname);
      const imageBuffer = this.uploadService.getImage(filename);
      const ext = filename.split('.').pop();
      res.setHeader('Content-Type', `image/${ext}`);
      res.send(imageBuffer);
    } catch {
      throw new HttpException('Imagem não encontrada ou URL inválida', HttpStatus.NOT_FOUND);
    }
  }
}

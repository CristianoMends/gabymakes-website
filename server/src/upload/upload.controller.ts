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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { basename } from 'path';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @Get('image/:filename')
  @ApiOperation({ summary: 'Retorna uma imagem pelo nome do arquivo na URL' })
  @ApiParam({
    name: 'filename',
    required: true,
    description: 'Nome completo do arquivo da imagem (ex: e66232dbe039f0a144670e82e0eb148e.jpg)',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Imagem retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    try {

      const imageBuffer = this.uploadService.getImage(filename);
      const ext = filename.split('.').pop();

      if (!ext) {
        throw new HttpException('Nome de arquivo inválido na URL (sem extensão)', HttpStatus.BAD_REQUEST);
      }

      res.setHeader('Content-Type', `image/${ext}`);
      res.send(imageBuffer);
    } catch (error) {
      throw new HttpException('Imagem não encontrada ou nome de arquivo inválido', HttpStatus.NOT_FOUND);
    }
  }
}

import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { LocalUploadStrategy } from './local-upload.strategy';
import { UploadStrategy } from './upload-strategy.interface';
import { UploadController } from './upload.controller';
// import { VercelUploadStrategy } from './strategies/vercel-upload.strategy';

@Module({
    controllers: [UploadController],
    providers: [
        UploadService,
        { provide: 'UploadStrategy', useClass: LocalUploadStrategy },
        { provide: LocalUploadStrategy, useClass: LocalUploadStrategy },
        // Para trocar a estratégia: useClass: VercelUploadStrategy
        {
            provide: UploadService,
            useFactory: (strategy: UploadStrategy) => new UploadService(strategy),
            inject: ['UploadStrategy'],
        },
    ],
    exports: [UploadService],
})
export class UploadModule { }

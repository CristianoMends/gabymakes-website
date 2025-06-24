import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { LocalUploadStrategy } from './local-upload.strategy';
import { VercelUploadStrategy } from './vercel-upload.strategy';
import { UploadStrategy } from './upload-strategy.interface';
import { UploadController } from './upload.controller';

@Module({
    imports: [
        ConfigModule,
    ],
    controllers: [UploadController],
    providers: [
        LocalUploadStrategy,
        VercelUploadStrategy,
        {

            provide: 'UploadStrategy',
            useFactory: (configService: ConfigService, localStrategy: LocalUploadStrategy, vercelStrategy: VercelUploadStrategy): UploadStrategy => {
                const strategyType = configService.get<string>('UPLOAD_STRATEGY');

                console.log(`Using upload strategy: ${strategyType}`);

                switch (strategyType) {
                    case 'vercel':
                        return vercelStrategy;
                    case 'local':
                    default:
                        return localStrategy;
                }
            },

            inject: [ConfigService, LocalUploadStrategy, VercelUploadStrategy],
        },

        {
            provide: UploadService,
            useFactory: (strategy: UploadStrategy) => new UploadService(strategy),
            inject: ['UploadStrategy'],
        },
    ],
    exports: [UploadService],
})
export class UploadModule { }
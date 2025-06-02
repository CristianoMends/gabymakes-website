import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsArray } from 'class-validator';

export class CreateSectionDto {
    @ApiProperty({ example: 'Promoções de Batons' })
    title: string;

    @ApiProperty({
        example: ['550e8400-e29b-41d4-a716-446655440000'],
        description: 'IDs dos produtos incluídos na seção (UUIDs)'
    })
    @IsArray()
    @IsUUID("4", { each: true })
    productId: string[];
}

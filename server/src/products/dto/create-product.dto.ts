import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 59.9 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @ApiProperty({ example: '/uploads/example.png' })
    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    brand: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

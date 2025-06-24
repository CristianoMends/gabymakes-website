import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'O primeiro nome é obrigatório.' })
    @IsString({ message: 'O primeiro nome deve ser uma string.' })
    firstName: string;

    @IsNotEmpty({ message: 'O sobrenome é obrigatório.' })
    @IsString({ message: 'O sobrenome deve ser uma string.' })
    lastName: string;

    @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @IsString({ message: 'A senha deve ser uma string.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password: string;

    @IsOptional()
    @IsString({ message: 'O WhatsApp deve ser uma string.' })
    whatsapp?: string;

    @IsOptional()
    @IsString({ message: 'O gênero deve ser uma string.' })
    gender?: string;
}
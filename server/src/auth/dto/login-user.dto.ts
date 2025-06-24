import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @IsString({ message: 'A senha deve ser uma string.' })
    password: string;
}
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {

        this.googleClient = new OAuth2Client(
            this.configService.get<string>('GOOGLE_CLIENT_ID'),
            this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        );
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {

                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        const { password, ...userSafeInfo } = user;

        return {
            access_token,
            user: {
                id: userSafeInfo.id,
                firstName: userSafeInfo.firstName,
                lastName: userSafeInfo.lastName,
                email: userSafeInfo.email,
                role: userSafeInfo.role,
            }
        };
    }


    async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestException('Este e-mail já está em uso.');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
            role: 'user',
        });

        const { password, ...result } = newUser;
        return result;
    }

    async googleAuth(code: string) {
        try {
            const { tokens } = await this.googleClient.getToken({
                code: code,
                redirect_uri: this.configService.get<string>('GOOGLE_REDIRECT_URI') || 'postmessage',
            });

            const idToken = tokens.id_token;

            if (!idToken) {
                throw new UnauthorizedException('ID Token do Google não recebido.');
            }


            const ticket = await this.googleClient.verifyIdToken({
                idToken: idToken,
                audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();

            if (!payload) {
                throw new UnauthorizedException('Payload do token Google inválido.');
            }

            const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;


            let user = await this.usersService.findOneByGoogleId(googleId);
            if (!user) {
                user = await this.usersService.create({
                    email: email ?? '',
                    firstName,
                    lastName,
                    googleId,
                    password: Math.random().toString(36).slice(-8),
                    role: 'user',
                });
            }


            return this.login(user);
        } catch (error) {
            console.error('Erro na autenticação Google (backend):', error);
            throw new UnauthorizedException('Falha na autenticação Google.');
        }
    }


    async googleLogin(token: string): Promise<{ access_token: string, user: Partial<User> }> {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new UnauthorizedException('Não foi possível obter os dados do usuário do Google.');
            }
            const email = payload.email;
            const googleId = payload.sub;
            const firstName = payload.given_name;
            const lastName = payload.family_name;
            const picture = payload.picture;

            let user = await this.usersService.findOneByGoogleId(googleId);

            if (!user) {

                if (!email) {
                    throw new BadRequestException('O e-mail do Google não foi fornecido.');
                }
                const existingUserByEmail = await this.usersService.findOneByEmail(email);

                if (existingUserByEmail) {




                    throw new BadRequestException('Este e-mail já está registrado com uma senha. Por favor, faça login com sua senha ou vincule sua conta Google.');
                }


                user = await this.usersService.create({
                    email: email,
                    googleId: googleId,
                    firstName: firstName,
                    lastName: lastName,
                    role: 'user',
                });
            } else if (!user.email) {


                user.email = email ?? '';

            }


            const jwtPayload = { email: user.email, sub: user.id, googleId: user.googleId };
            const accessToken = this.jwtService.sign(jwtPayload);


            const { password, ...safeUser } = user;
            return { access_token: accessToken, user: safeUser };

        } catch (error) {
            console.error('Erro na autenticação Google:', error.message);
            throw new UnauthorizedException('Não foi possível autenticar com o Google. Tente novamente.');
        }
    }
}

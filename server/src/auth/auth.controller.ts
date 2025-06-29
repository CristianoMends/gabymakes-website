import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }



    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {

        return this.authService.login(req.user);
    }


    @Post('google')
    @HttpCode(HttpStatus.OK)
    async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
        return this.authService.googleAuth(googleLoginDto.code);
    }


    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {

        return req.user;
    }
}

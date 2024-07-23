import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async createAccess(@Body() body: CreateAuthDto) {
        console.log('Trying to create auth...', { body });
        try {
            const access = await this.authService.createAccess(body);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Access created successfully',
                data: access,
            };
        } catch (error) {
            console.log('Error', { error });
            throw new HttpException(error.response, error.status);
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async authenticate(@Body() body: CreateAuthDto) {
        console.log('Trying to authenticate...', { body });
        try {
            const token = await this.authService.authenticate(body);
            console.log('authenticated token', { token });
            if (!token) {
                console.log('Invalid credentials!');
                throw new HttpException(
                    'Unauthorized',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'Authentication successful',
                token,
            };
        } catch (error) {
            console.log('Error', { error });
            throw new HttpException(error.response, error.status);
        }
    }
}

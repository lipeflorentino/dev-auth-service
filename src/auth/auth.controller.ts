import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    HttpException,
    Logger,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async createAccess(@Body() body: CreateAuthDto) {
        this.logger.log('Trying to create auth...', { body });

        try {
            const access = await this.authService.createAccess(body);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Access created successfully',
                data: access,
            };
        } catch (error) {
            this.logger.error('Error', { error });
            throw new HttpException(error.response, error.status);
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: CreateAuthDto) {
        this.logger.log('Trying to login...', { body });

        try {
            const token = await this.authService.login(body);

            if (!token) {
                this.logger.log('Invalid credentials!');

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
            this.logger.error('Error', { error });
            throw new HttpException(error.response, error.status);
        }
    }

    @Post('validate')
    @HttpCode(HttpStatus.OK)
    async validateToken(@Req() req: Request) {
        try {
            const token = req.headers['authorization'];

            const { isValid, apiKeyValid } =
                await this.authService.validateTokenAndApiKey(token);

            if (!isValid || !apiKeyValid) {
                throw new UnauthorizedException('Invalid token or API key');
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'Token and API key are valid',
            };
        } catch (error) {
            this.logger.error('Error', { error });
            throw new HttpException(
                error.response.message || 'Internal Server Error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

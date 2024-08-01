import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { Access } from './entities/access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(Access) private accessRepository: Repository<Access>,
        private jwtService: JwtService,
    ) {}

    async createAccess(createAuthDto: CreateAuthDto): Promise<Access> {
        this.logger.log('Creating access', { createAuthDto });
        const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
        const accessKey = uuidv4();
        const newAccess = this.accessRepository.create({
            email: createAuthDto.email,
            password: hashedPassword,
            accessKey,
            accessType: createAuthDto.accessType,
        });

        return this.accessRepository.save(newAccess);
    }

    async login({ email, password }: Partial<CreateAuthDto>): Promise<string> {
        this.logger.log('login...', { email });
        let accessToken = null;
        const access = await this.accessRepository.findOneBy({ email });

        console.log('Access informations', { access });
        const passwordMatch = await bcrypt
            .compare(password, access.password)
            .catch((error) => console.log(error));

        console.log(passwordMatch);

        if (access && passwordMatch) {
            const payload = {
                email: access.email,
                accessKey: access.accessKey,
                accessType: access.accessType,
            };

            console.log(payload);

            accessToken = await this.jwtService
                .signAsync(payload)
                .catch((error) => console.log(error));
        }
        console.log('Token generated', { accessToken });
        return accessToken;
    }

    async validateTokenAndApiKey(
        token: string,
    ): Promise<{ isValid: boolean; apiKeyValid: boolean }> {
        try {
            const payload = await this.jwtService.verify(token);
            const authInfos = await this.accessRepository.findOne({
                where: { email: payload.email },
            });
            const apiKeyValid = authInfos.accessKey === payload.accessKey;
            return { isValid: !!payload, apiKeyValid };
        } catch (error) {
            console.log(error);
            return { isValid: false, apiKeyValid: false };
        }
    }
}

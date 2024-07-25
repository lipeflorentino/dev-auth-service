import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { Access } from './entities/access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Access) private accessRepository: Repository<Access>,
        private jwtService: JwtService,
    ) {}

    async createAccess(createAuthDto: CreateAuthDto): Promise<Access> {
        console.log('Creating access', { createAuthDto });
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

    async authenticate({ email, password }: CreateAuthDto): Promise<string> {
        console.log('Authenticating...', { email });
        let accessToken = null;
        const access = await this.accessRepository.findOneBy({ email });

        if (access && (await bcrypt.compare(password, access.password))) {
            const payload = {
                email: access.email,
                accessKey: access.accessKey,
                accessType: access.accessType,
            };

            accessToken = await this.jwtService.signAsync(payload);
        }
        return accessToken;
    }
}

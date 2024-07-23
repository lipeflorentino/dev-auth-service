import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Access } from '../src/auth/entities/access.entity';
import { Repository } from 'typeorm';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;
    let jwtService: JwtService;
    let accessRepository: Repository<Access>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mockToken'),
                    },
                },
                {
                    provide: getRepositoryToken(Access),
                    useClass: Repository, // Use uma classe mock ou uma implementação mock aqui
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        accessRepository = module.get<Repository<Access>>(
            getRepositoryToken(Access),
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(accessRepository).toBeDefined();
    });
});

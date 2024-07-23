import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Access } from '../src/auth/entities/access.entity';
import { Repository } from 'typeorm';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let accessRepository: Repository<Access>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        accessRepository = module.get<Repository<Access>>(
            getRepositoryToken(Access),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(accessRepository).toBeDefined();
    });

    // Adicione mais testes aqui
});

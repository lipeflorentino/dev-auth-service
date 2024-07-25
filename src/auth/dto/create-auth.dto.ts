import { AccessType } from '../entities/access.entity';

export class CreateAuthDto {
    email: string;
    password: string;
    accessType: AccessType;
}

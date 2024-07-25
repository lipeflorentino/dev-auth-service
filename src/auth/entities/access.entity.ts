import { Entity, ObjectIdColumn, Column } from 'typeorm';

export enum AccessType {
    CUSTOMER = 'customer',
    VENDOR = 'vendor',
}

@Entity()
export class Access {
    @ObjectIdColumn()
    email: string;

    @Column()
    password: string;

    @Column()
    accessKey: string;

    @Column({
        type: 'enum',
        enum: AccessType,
        default: AccessType.CUSTOMER,
    })
    accessType: AccessType;
}

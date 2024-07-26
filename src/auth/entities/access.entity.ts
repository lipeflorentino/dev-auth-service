import { Entity, ObjectIdColumn, Column, Index, ObjectId } from 'typeorm';

export enum AccessType {
    CUSTOMER = 'customer',
    VENDOR = 'vendor',
}

@Entity()
export class Access {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    @Index({ unique: true })
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

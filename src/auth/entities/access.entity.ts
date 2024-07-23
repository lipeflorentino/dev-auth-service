import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Access {
    @ObjectIdColumn()
    email: string;

    @Column()
    password: string;

    @Column()
    accessKey: string;
}

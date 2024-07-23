import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: 'mongodb://localhost:27017/authdb',
            synchronize: true,
            useUnifiedTopology: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

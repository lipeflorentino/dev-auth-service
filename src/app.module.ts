import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: process.env.MONGO_URL,
            //alterar para false em prod utilizar migrations
            synchronize: true,
            useUnifiedTopology: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}/${configService.get<string>('DB_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TicketModule,
    AuthModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

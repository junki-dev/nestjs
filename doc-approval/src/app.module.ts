import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DocModule } from './doc/doc.module';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DocModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://document:document@localhost:27017/document?authSource=admin&authMechanism=SCRAM-SHA-1',
      logging: true,
      autoLoadEntities: true,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}

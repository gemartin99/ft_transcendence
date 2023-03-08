import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from  './user/user.entity';
import { UserService } from './user/user.service';
import { UsersController } from './user/users.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './user/users.module';
import { ChatModule } from './chat/chat.module';
import { OnlineUserService } from './onlineuser/onlineuser.service';
import { OnlineUserEntity } from './onlineuser/onlineuser.entity';
import { AvatarController } from './user/avatar/avatar.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host:  'postgres',
      port: 5432,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, OnlineUserEntity]),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
  controllers: [AppController, UsersController, AvatarController],
  providers: [AppService, UserService, AuthService, OnlineUserService],
})
export class AppModule { }

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       database: 'test',
//       username: 'test',
//       password: 'test',
//       host:  'postgres',
//       port: 5432,
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//     AuthModule,
//   ],
//   controllers: [AppController, UsersController],
//   providers: [AppService, UserService],
// })
// export class AppModule { }



import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RoomEntity } from './rooms/room.entity';
import { RoomService } from './rooms/room.service';
import { OnlineUserEntity } from '../onlineuser/onlineuser.entity';
import { OnlineUserService } from '../onlineuser/onlineuser.service';

@Module({
  imports: [AuthModule, UsersModule, forwardRef(() => UsersModule), TypeOrmModule.forFeature([ User, RoomEntity, OnlineUserEntity])],
  providers: [ChatGateway, AuthService, RoomService, OnlineUserService]
})
export class ChatModule {} 
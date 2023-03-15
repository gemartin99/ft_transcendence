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
import { MessageService } from './message/message.service';
import { JoinedRoomService } from './joined-room/joined-room.service';
import { MessageEntity } from './message/message.entity';
import { JoinedRoomEntity } from './joined-room/joined-room.entity';
import { OperatorService } from './operator/operator.service';
import { OwnerService } from './owner/owner.service';
import { OperatorEntity } from './operator/operator.entity';
import { OwnerEntity } from './owner/owner.entity';
import { MatchService } from '../game/match/match.service';
import { MatchEntity } from '../game/match/match.entity';



@Module({
  imports: [AuthModule, UsersModule, forwardRef(() => UsersModule), TypeOrmModule.forFeature([ User, RoomEntity, OnlineUserEntity, MessageEntity, JoinedRoomEntity, OperatorEntity, OwnerEntity, MatchEntity])],
  providers: [ChatGateway, AuthService, RoomService, OnlineUserService, MessageService, JoinedRoomService, OperatorService, OwnerService, MatchService]
})
export class ChatModule {} 
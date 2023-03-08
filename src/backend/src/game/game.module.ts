import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { GameGateway } from './game.gateway';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { OnlineUserEntity } from '../onlineuser/onlineuser.entity';
import { OnlineUserService } from '../onlineuser/onlineuser.service';
import { MatchController } from './match/match.controller';
import { MatchService } from './match/match.service';
import { MatchEntity } from './match/match.entity';


@Module({
  imports: [AuthModule, UsersModule, forwardRef(() => UsersModule), TypeOrmModule.forFeature([ User, OnlineUserEntity, MatchEntity])],
  providers: [GameGateway, AuthService, OnlineUserService, MatchService],
  controllers: [MatchController]
})
export class GameModule {}

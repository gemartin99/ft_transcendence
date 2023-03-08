import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
  imports: [AuthModule, UsersModule, forwardRef(() => UsersModule), TypeOrmModule.forFeature([User])],
  providers: [ChatGateway, AuthService]
})
export class ChatModule {} 
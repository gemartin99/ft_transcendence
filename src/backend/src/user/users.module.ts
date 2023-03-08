import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { AvatarController } from './avatar/avatar.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService, AuthService],
  exports: [UserService],
  controllers: [AvatarController],
})
export class UsersModule {}
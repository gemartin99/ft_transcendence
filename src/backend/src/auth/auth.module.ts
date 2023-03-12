import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { School42Strategy } from './school42.strategy'; 
import { UsersModule } from '../user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { TwoFactorController } from './two-factor/two-factor.controller';
import { TwoFactorService } from './two-factor/two-factor.service';



@Module({
  controllers: [AuthController, TwoFactorController],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    School42Strategy,
    TwoFactorService, 
  ]
})
export class AuthModule {}
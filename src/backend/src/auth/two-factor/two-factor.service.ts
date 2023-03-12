import { Injectable } from '@nestjs/common';
import { toFileStream } from 'qrcode';
import { toFile } from 'qrcode';
import { authenticator } from 'otplib';
import { User } from '../../user/user.entity';
import { UserI } from '../../user/user.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class TwoFactorService {
  constructor (
    private readonly usersService: UserService,
	//private readonly jwtService: JwtService,
    //private readonly configService: ConfigService
  ) {}
 
  public async generateTwoFactorSecret(user: UserI) {
    const secret = authenticator.generateSecret();
    console.log('generatign secret 2fa: ' + secret);
	
    //const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
    const otpauthUrl = authenticator.keyuri(user.id.toString(),'crazy-pong', secret);
    console.log('generatign otpauthUrl: ' + otpauthUrl);
	
    await this.usersService.setTwoFactorSecret(secret, user.id);
 	console.log('after setTwoFactorSecret');
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(otpauthUrl: string) {	  
	  toFile('src/uploads/qrcode/qrcode.png',otpauthUrl);
  }

  public checkCodeIsValid(code: string, user: User) {
    return authenticator.verify({
      token: code,
      secret: user.twofactor_secret
    })
  }

 //  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: UserEntity) {
 //    return authenticator.verify({
 //      token: twoFactorAuthenticationCode,
 //      secret: user.twoFactorAuthenticationSecret
 //    })
 //  }

 //  public getCookieWithJwtToken(userId: number, isSecondFactorAuthenticated = false) {
 //    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
 //    const token = this.jwtService.sign(payload, {
 //      secret: this.configService.get('JWT_SECRET'),
 //      expiresIn: `10000`
 //    });
 //    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('10000')}`;
	// return {
	// 	cookie,
	// 	token,
	//   };
 //  }

 //  async validate(payload: TokenPayload) {
 //    const user = await this.usersService.getOne(payload.userId);
 //    if (!user.twoFactorAuthEnabled || payload.isSecondFactorAuthenticated) {
 //      return user;
 //    }
 //  }
}

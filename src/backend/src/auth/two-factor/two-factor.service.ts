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
	  await toFile('src/uploads/qrcode/qrcode.png',otpauthUrl);
  }

  public checkCodeIsValid(code: string, user: User) {
    return authenticator.verify({
      token: code,
      secret: user.twofactor_secret
    })
  }
}

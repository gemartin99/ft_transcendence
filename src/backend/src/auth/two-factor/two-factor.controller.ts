import { Controller, Get, Req, Res, Post, Body } from '@nestjs/common';
import * as qrcode from 'qrcode';
import { TwoFactorService } from './two-factor.service';
import { Observable, of } from 'rxjs';
import path = require('path');
import { join } from 'path';
import * as fs from 'fs';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Controller()
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly usersService: UserService,
  ) {}

  @Post('generate')
  async register(@Req() req, @Res() res) {
    const otpauth = await this.twoFactorService.generateTwoFactorSecret(
      req.body,
    );
    console.log('generating otpauth: ' + otpauth);
    this.twoFactorService.pipeQrCodeStream(otpauth.otpauthUrl);
    console.log('after: pipeQrCodeStream');
    return res.send(JSON.stringify(otpauth.secret));
  }

  @Get('qrcode')
  async findQrCode(@Res() res) {
    console.log('in: get qrcode');
    return of(res.sendFile(join(process.cwd(), 'src/uploads/qrcode/qrcode.png')));
  }

  //@UseGuards(JwtAuthGuard)
  @Post('2faAuthentificate')
  async authenticate(@Body() body: { user: User, code: string }) {
    const { user, code } = body;
    // Check if the code is empty or not 6 characters
    if (!code || code.length !== 6) {
      return(false);
    }
    // Check if the code only contains digits
    if (!/^\d+$/.test(code)) {
      return(false);
    }
    console.log('2faAuthentificate!!!!!! code received');
    console.log('User:', user);
    console.log('Code:', code);
    const isCodeValid = this.twoFactorService.checkCodeIsValid(
      code, user
    );
    if (!isCodeValid) {
      console.log('Code IS NOT VALID!!!!!!!');
    }
    else
    	console.log('Code IS VALID!!!!!!!');
    await this.usersService.setTwoFactorAuthentificated(user.id);
    return(isCodeValid);
  }

  @Post('2faUserUnset')
  async disable2fa(@Body() user: User) {
  	console.log('Backend: inside disable2fa');
    const result = await this.usersService.unsetTwoFactorAuthentificated(user.id);
    if(result)
    {
    	console.log('Two factor disabled');
    	return(true);
    }
    console.log('Two factor keeps enabled');
    return(true);
  }
}
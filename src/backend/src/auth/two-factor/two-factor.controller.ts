import { Controller, Get, Req, Res, Post } from '@nestjs/common';
import * as qrcode from 'qrcode';
import { TwoFactorService } from './two-factor.service';
import { Observable, of } from 'rxjs';
import path = require('path');
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class TwoFactorController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorService,
  ) {}

  @Post('generate')
  async register(@Req() req, @Res() res) {
    const otpauth = await this.twoFactorAuthenticationService.generateTwoFactorSecret(
      req.body,
    );
    console.log('generating otpauth: ' + otpauth);
    this.twoFactorAuthenticationService.pipeQrCodeStream(otpauth.otpauthUrl);
    console.log('after: pipeQrCodeStream');
    return res.send(JSON.stringify(otpauth.secret));
  }

  @Get('qrcode')
  async findQrCode(@Res() res) {
    console.log('in: get qrcode');
    return of(res.sendFile(join(process.cwd(), 'src/uploads/qrcode/qrcode.png')));
  }
}
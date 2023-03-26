import { Controller, Get, UseGuards, Res, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as cookieParser from 'cookie-parser';
import * as jsonwebtoken from 'jsonwebtoken';
// import { Request} from '@nestjs/common';
import { Response } from 'express';
import { TwoFactorGuard } from './two-factor/two-factor.guard';


@Controller('auth')
export class AuthController {

    constructor(private userService: UserService){
    }


    @Get('school42')
    @UseGuards(AuthGuard('school42'))
    school42Login()
    {
        // initiates the School OAuth2 login flow
    }

    @Get('school42/callback')
    @UseGuards(AuthGuard('school42'))
    async school42Callback(@Req() req, @Res() res)
    {
        //console.log('call to school42/callback');
        //console.log(req.user);
        //console.log(req.query);
        if(!req.err)
        {
            if(!req.user.id42)
                return res.redirect('http://crazy-pong.com');
            //Set the jwt token cookie
            res.cookie('crazy-pong', req.user.jwt);

            //console.log('user id 42 es: ' + req.user.id42);
            let user: User = await this.userService.getBy42Id(req.user.id42);
            //User was totaly registered
            if(user)
            {
                //console.log('Usuario encontrado, ye preregistradi');
                //User was found but register is not yet completed
                if(!user.reg_completed)
                    return res.redirect('http://crazy-pong.com/register');
                else
                {
                    
                    if(!user.twofactor)
                    {
                        user.is_online = true;
                        await this.userService.save(user);
                        return res.redirect('http://crazy-pong.com'); //User is totaly registered and not have two-factor auth
                    }
                    else
                    {
                        user.twofactor_valid = false;
                        await this.userService.save(user);
                        return res.redirect('http://crazy-pong.com/two-factor'); //User is totaly registered but have two-factor auth
                    }
                }
            }
            else
            {
                //console.log('Usuario NO encontrado');
                //User is not yet pregistered
                let user: User = await this.userService.register(req.user.id42);
                if(user)
                    return res.redirect('http://crazy-pong.com/register');
                else
                    return res.redirect('http://crazy-pong.com');
            }
        }
        return res.redirect('http://crazy-pong.com');
    }

    @Get('protected')
    @UseGuards(AuthGuard('jwt'))
    protectedResource()
    {
        return 'JWT is working!';
    }

    @Get('')
    userIsAuth(@Req() req: any, @Res() res: Response) {
    //console.log(req.cookies);
        //console.log('BAKEND USER IS AUTH?');
        const token = req.cookies['crazy-pong'];
        if (!token) {
            //console.log('USER NOT AUTH!!!');
            //return res.send({ message: 'Unauthorized', user: undefined });
            return res.send( false );
            //return false;
        }
        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            //console.log('USER IS AUTHORITZED');
            //return res.send({ message: 'Authorized', user: decoded });
            return res.send(true);
            //return true;
        } catch (err) {
            //console.log('USER NOT AUTH!!!');
            //return res.send({ message: 'Unauthorized', user: undefined });
            return res.send( false );
            //return false;
        }
    }

    @Get('twofactor')
    @UseGuards(AuthGuard('jwt'))
    async userIsTwoFactorAuth(@Req() req: any, @Res() res: Response) {
    //console.log(req.cookies);
        //console.log('BAKEND USER IS AUTH?');
        const token = req.cookies['crazy-pong'];
        if (!token) {
            //console.log('USER NOT AUTH!!!');
            //return res.send({ message: 'Unauthorized', user: undefined });
            return res.send( false );
            //return false;
        }
        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            //console.log('USER IS AUTHORITZED');
            const user = await this.userService.getBy42Id(decoded.thirdPartyId);
            if(!user)
                return res.send( false );
            if (user.twofactor)
            {
                if(!user.twofactor_valid)
                    return res.send( false );
            }
            //return res.send({ message: 'Authorized', user: decoded });
            return res.send(true);
            //return true;
        } catch (err) {
            //console.log('USER NOT AUTH!!!');
            //return res.send({ message: 'Unauthorized', user: undefined });
            return res.send( false );
            //return false;
        }
    }

    @Get('user')
    async getLoggedUser(@Req() req: any, @Res() res: Response) {
        //console.log('inside getLoggedUser');
        // console.log(req.cookies);
        const token = req.cookies['crazy-pong'];
        if (!token) {
            //console.log('No hay token en getLoggedUser');
            return undefined;
        }
        try {
            //console.log('SI hay token en getLoggedUser');
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            let user: User = await this.userService.getBy42Id(decoded.thirdPartyId);
            //console.log('Auth user devuelve' + user);
            return res.send( user );
        } catch (err) {
            return undefined;
        }
    }

    @Get('/logout')
    @UseGuards(AuthGuard('jwt'))
    async logoutEndpoint(@Req() req, @Res() res) {
        let user: User = await this.userService.getBy42Id(req.user.thirdPartyId);
        //console.log('INSIDE BACKEND LOGOUT');
        //console.log(req.user);
        user.is_playing = 0;
        user.is_online = false;
        user.twofactor_valid = false;
        await this.userService.save(user);
        res.clearCookie('crazy-pong', {domain:'crazy-pong.com', path:'/'});
        return res.json({ message: 'Logged out successfully' });
    }
}

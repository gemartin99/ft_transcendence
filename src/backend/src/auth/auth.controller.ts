import { Controller, Get, UseGuards, Res, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {

    // constructor(private userService: UserService){
    // }


    @Get('school42')
    @UseGuards(AuthGuard('school42'))
    school42Login()
    {
        // initiates the Google OAuth2 login flow
    }

    @Get('school42/callback')
    @UseGuards(AuthGuard('school42'))
    school42Callback(@Req() req, @Res() res)
    {
        console.log('call to school42/callback');
        console.log(req.user);
        console.log(req.query);
        if(!req.err)
        {
            console.log('User not exist, redirect him to register');
            res.header('Authorization', 'Bearer ' + req.user.jwt);
            res.cookie('access_token', req.user.jwt);
            return res.redirect('http://crazy-pong.com/register');
        }
        res.redirect('http://crazy-pong.com');
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin()
    {
        // initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Req() req, @Res() res)
    {
        // handles the Google OAuth2 callback
        const jwt: string = req.user.jwt;
        if (jwt)
            res.redirect('http://localhost:4200/login/succes/' + jwt);
        else 
            res.redirect('http://localhost:4200/login/failure');
    }

    @Get('protected')
    @UseGuards(AuthGuard('jwt'))
    protectedResource()
    {
        return 'JWT is working!';
    }
}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { AuthService, Provider } from "./auth.service";
import axios from 'axios';
import { Response } from '@nestjs/common';


@Injectable()
export class School42Strategy extends PassportStrategy(Strategy, 'school42')
{
    
    constructor(
        private readonly authService: AuthService
    )
    {
        super({
            authorizationURL: process.env.API42AUTHURL,
            tokenURL: "https://api.intra.42.fr/oauth/token",
            clientID: process.env.API42CLIENTID,     // <- Replace this with your client id
            clientSecret: process.env.API42SECRET, // <- Replace this with your client secret
            callbackURL : 'http://crazy-pong.com:3000/auth/school42/callback',
            scope: ['public'],
            proxy: true
        })
    }


    async validate(accessToken: string, refreshToken: string, profile: any, done: Function, res: Response)
    {

        //console.log('validating...');
        //console.log('accessToken:' + accessToken);
        //console.log('refreshToken:' + refreshToken);
        //console.log('profile:' + profile);

        try
        {
            const { data } = await  axios.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            //console.log('Id usuario 42:' + data.id);
            const jwt: string = await this.authService.validateOAuthLogin(data.id, Provider.SCHOOL42);
            // localStorage.setItem('jwt', jwt);
            
            const user = 
            {
                jwt,
                id42: data.id
            }
            done(null, user);
        }
        catch(err)
        {
            //console.log('Error try de valdiate2');
            //console.log(err)
            done(err, false);
        }
    }

}

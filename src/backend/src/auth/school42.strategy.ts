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
            authorizationURL: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0a3a4869eb0242ff32bdffe102dc9021ccbba3501e7da809f76c877b404a84ba&redirect_uri=http%3A%2F%2Fcrazy-pong.com%3A4200&response_type=code",
            tokenURL: "https://api.intra.42.fr/oauth/token",
            clientID: 'u-s4t2ud-0a3a4869eb0242ff32bdffe102dc9021ccbba3501e7da809f76c877b404a84ba',     // <- Replace this with your client id
            clientSecret: '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', // <- Replace this with your client secret
            callbackURL : 'http://crazy-pong.com:3000/auth/school42/callback',
            scope: ['public'],
            proxy: true
        })
    }


    async validate(accessToken: string, refreshToken: string, profile: any, done: Function, res: Response)
    {

        console.log('validating...');
        console.log('accessToken:' + accessToken);
        console.log('refreshToken:' + refreshToken);
        console.log('profile:' + profile);

        try
        {
            const { data } = await  axios.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log('Id usuario 42:' + data.id);
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
            console.log('Error try de valdiate2');
            console.log(err)
            done(err, false);
        }
    }

}

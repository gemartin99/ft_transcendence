import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { AuthService, Provider } from "./auth.service";
import axios from 'axios';
import { UserService } from '../user/user.service';


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


    async validate(accessToken: string, refreshToken: string, profile: any, done: Function)
    {

        console.log('validating...');
        console.log('accessToken:' + accessToken);
        console.log('refreshToken:' + refreshToken);
        console.log('profile:' + profile);

        const { data } = await  axios.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log('Id usuario 42:' + data.id);

        try
        {
            console.log('Entro try de valdiate');
            const jwt: string = await this.authService.validateOAuthLogin(data.id, Provider.SCHOOL42);
            console.log('Entro try de valdiate2');
            console.log('Miro si usuario ya existe');
            let internal_user = await this.usersService.getUserBy42Id(data.id);
            // if(internal_user != undefined)
            // {
            //     const user = 
            //     {
            //         jwt,
            //         internal_user
            //     }
            // }
            // else
            // {
                const user = 
                {
                    jwt
                }
            // }

            console.log('Entro try de valdiate3');
            console.log('Entro try de valdiate3');
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

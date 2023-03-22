import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService, Provider } from "./auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    
    constructor(
        private readonly authService: AuthService
    )
    {
        super({
            clientID    : '371838028942-1of01tej2qpvk0sodrbiv3o5o2on81ei.apps.googleusercontent.com',     // <- Replace this with your client id
            clientSecret: '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', // <- Replace this with your client secret
            callbackURL : 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile']
        })
    }


    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function)
    {
        try
        {
            //console.log(profile);

            const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
            const user = 
            {
                jwt
            }

            done(null, user);
        }
        catch(err)
        {
            // console.log(err)
            done(err, false);
        }
    }

}

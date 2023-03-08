import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

export enum Provider
{
    GOOGLE = 'google'
}

@Injectable()
export class AuthService {
    
    private readonly JWT_SECRET_KEY = 'vwts1k+tsUuMYh1ZIGQ5eeWu/DjlHy2xlNXsBC6dzyFXRhVrC/d2R4SbhLhsbiWlJHqTEHPUA9N7l+UfGziEYixc0xqif5PHY+d7DojbebbFws/mik07eJf6MkE+SAC1jbQm2EY6C6vhIdcXbIDLwnjL3ePzyW4Itu68N4nbugPRkQO/5T0N27TDCBNQG8vDkh0609iZFU3bw5609Egu7H2XwiR6sqPv7xj1j1Qw8TipLoQ/XSuzmArgsWABQu6u6X/KKh6dTSTDWroCQNwx1Y1870uwNBZKWiBYAFhCWFdqEX6uWZyp4XZZ0lgYWXK67/4qkfgSDal7wbHihJ4lNw=='; // <- replace this with your secret key

    constructor(/*private readonly usersService: UsersService*/) {
    };

    async validateOAuthLogin(thirdPartyId: string, provider: Provider): Promise<string>
    {
        try 
        {
            // You can add some registration logic here, 
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);
            
            // if (!user)
                // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);
                
            const payload = {
                thirdPartyId,
                provider
            }

            const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 3600 });
            return jwt;
        }
        catch (err)
        {
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }

}

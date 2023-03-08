import { Injectable, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { User } from  '../user/user.entity';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from  'typeorm';

export enum Provider
{
    GOOGLE = 'google',
    SCHOOL42 = 'school42'
}

@Injectable()
export class AuthService {
    
    private readonly JWT_SECRET_KEY = 'vwts1k+tsUuMYh1ZIGQ5eeWu/DjlHy2xlNXsBC6dzyFXRhVrC/d2R4SbhLhsbiWlJHqTEHPUA9N7l+UfGziEYixc0xqif5PHY+d7DojbebbFws/mik07eJf6MkE+SAC1jbQm2EY6C6vhIdcXbIDLwnjL3ePzyW4Itu68N4nbugPRkQO/5T0N27TDCBNQG8vDkh0609iZFU3bw5609Egu7H2XwiR6sqPv7xj1j1Qw8TipLoQ/XSuzmArgsWABQu6u6X/KKh6dTSTDWroCQNwx1Y1870uwNBZKWiBYAFhCWFdqEX6uWZyp4XZZ0lgYWXK67/4qkfgSDal7wbHihJ4lNw=='; // <- replace this with your secret key

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService)  { }

    async validateOAuthLogin(thirdPartyId: number, provider: Provider): Promise<string>
    {
        console.log('Entro a auth.AuthService validateOAuthLogin...');
        try 
        {
            // You can add some registration logic here, 
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);
            
            // if (!user)
                // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);
            
            let user: User = await this.userService.getBy42Id(thirdPartyId);
            // if (!user)
            //     user = await this.usersService.register(thirdPartyId);

            const payload = {
                thirdPartyId,
                provider
            }

            console.log('Entro a auth.AuthService intento firmar el JWT...');
            const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 3600 });
            console.log('JWT Firmado...');
            return jwt;
        }
        catch (err)
        {
            console.log('JWT Error Firmando...');
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }
}

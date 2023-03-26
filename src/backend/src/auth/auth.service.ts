import { Injectable, InternalServerErrorException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { User } from  '../user/user.entity';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from  'typeorm';
// import { jwt } from 'jsonwebtoken';


export enum Provider
{
    GOOGLE = 'google',
    SCHOOL42 = 'school42'
}

@Injectable()
export class AuthService {
    
    private readonly JWT_SECRET_KEY = process.env.JWT_SECRET; // <- replace this with your secret key

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService)  { }

    async validateOAuthLogin(thirdPartyId: number, provider: Provider): Promise<string>
    {
        //console.log('Entro a auth.AuthService validateOAuthLogin...');
        try 
        {
            // You can add some registration logic here, 
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);
            
            // if (!user)
                // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);
            
            //let user: User = await this.userService.getBy42Id(thirdPartyId);
            // if (!user)
            //     user = await this.usersService.register(thirdPartyId);

            const payload = {
                thirdPartyId,
                provider
            }

            //console.log('Entro a auth.AuthService intento firmar el JWT...');
            const signed_token: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 86400 });
            //console.log('JWT Firmado...');
            return signed_token;
        }
        catch (err)
        {
            //console.log('JWT Error Firmando...');
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }

    //Posat recentment
    async verifyJwt(authorizationHeader: string): Promise<any> {
      if (!authorizationHeader) {
        //console.log('no authorizationHeader:' + authorizationHeader);
        throw new UnauthorizedException();
      }

      const [bearer, jwtToken] = authorizationHeader.split(' ');
      if (bearer !== 'Bearer') {
        //console.log('no Bearer');
        throw new UnauthorizedException();
      }

      //console.log('jwt.verify :' + jwtToken);
      // jwt.verify(jwtToken, process.env.JWT_SECRET)
      // console.log('resultado verify: ' + jwt.verify(jwtToken, process.env.JWT_SECRET));
      // return(1);
      try {
        //console.log('jwt.verify :' + jwtToken);
        return verify(jwtToken, this.JWT_SECRET_KEY);
      } catch (err) {
        //console.log('jwt.verify FAILS: ' + err);
        throw new UnauthorizedException();
      }
    }
}

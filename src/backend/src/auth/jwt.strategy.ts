import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(){
        super({
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
                let data = request.cookies["crazy-pong"];
                if(!data){
                    //console.log('En JWT NO COOKIE ENCONTRADA')
                    return null;
                }
                //console.log('COOKIE ENCONTRADA')
                //console.log(data);
                return data;
            }])
        });
    }
 
    async validate(payload, done: Function){
        if(payload === null){
            throw new UnauthorizedException();
        }
        return payload;
    }
}

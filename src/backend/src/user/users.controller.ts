import { UserService } from './user.service';
import { Controller, Get, Post,Put, Delete, Body, Param, Req, Res, UseGuards } from  '@nestjs/common';
import { User } from  './user.entity';
import { AuthGuard } from '@nestjs/passport';
// import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UserService){
    }

    @Get()
    read(): Promise<User[]> {
      return this.userService.readAll();
    }
    
    @Post('create')
    async create(@Body() user: User): Promise<any> {
      return this.userService.create(user);
    }  
    
    @Put(':id/update')
    async update(@Param('id') id, @Body() user: User): Promise<any> {
        user.id = Number(id);
        return this.userService.update(user);
    }  
    
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.userService.delete(id);
    }

    @Post('register')
    @UseGuards(AuthGuard('jwt'))
    async completeRegister(@Req() req, @Res() res, @Body() body): Promise<any> {
      console.log('Call to abckend completeRegister');
      console.log(body);
      res.header('Access-Control-Allow-Origin', 'http://crazy-pong.com');
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if(user) {
        user.name = body.name;
        user.reg_completed = true;
        return res.send(await this.userService.update(user));
      }
      return res.send(await this.userService.update(user));
    }

    @Get('test')
    @UseGuards(AuthGuard('jwt'))
    async test(@Req() req, @Res() res): Promise<any> {
      return res.send('test works');
    }
}

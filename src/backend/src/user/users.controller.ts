import { UserService } from './user.service';
import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards, Query } from  '@nestjs/common';
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

    @Get('/find-by-username')
    @UseGuards(AuthGuard('jwt'))
    async findAllByUsername(@Query('name') name: string) {
       console.log('Inside find-by-name');
       return this.userService.findAllByUsername(name);
    }

    @Get('/find-by-id')
    @UseGuards(AuthGuard('jwt'))
    async getUserById(@Query('id') id: string) {
      console.log('Inside find-by-id');
      const user = await this.userService.getById(parseInt(id));
      console.log('when get firends the current user is ' + user);
      return null;
    }

    @Get('find/:id')
    getById(@Param('id') id: string): Promise<User>  {
      console.log('find/:id');
      return null;
    }





    //EDIT PROFILE TWO FACTOR
    @Put('twofactor')
    @UseGuards(AuthGuard('jwt'))
    async updateTwofactor(@Req() req, @Res() res, @Body() body: { twofactor: boolean }): Promise<User> {
        const user = await this.userService.getBy42Id(req.user.thirdPartyId);
        user.twofactor = body.twofactor;
        return this.userService.save(user);
    }


    //FRIENDS FUNCTIONALITY
    @Post('friends')
    @UseGuards(AuthGuard('jwt'))
    async addFriend(@Req() req, @Res() res, @Body() body): Promise<any> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if(user) {
          console.log(user);
          const user_friends = await this.userService.findUserFriends(user.id);
          const friendUser = await this.userService.getById(body.friendId);
          if(friendUser && friendUser.id != user.id){
            if (!user_friends) {
              console.log('starting a empty array of friends');
              user.friends = []; // initialize the friends array if it doesn't exist
              user_friends.push(friendUser);
              return res.status(200).json({ message: 'Friend added successfully' });
            }
            else if (user_friends.find((friend) => friend.id === friendUser.id))
            {
              return res.status(200).json({ message: 'Friend was not added (users was alredy friend)' });
            }
            user_friends.push(friendUser);
            user.friends = user_friends;
            await this.userService.save(user);
            console.log('Returning of post friends');
            console.log(user.friends);
            return user.friends;
          }
      }
      return res.status(200).json({ message: 'Friend was not added' });
    }

    @Get('friends')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Req() req, @Res() res): Promise<any> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      console.log('when get firends the current user is ' + user);
      const friends = await this.userService.findUserFriends(user.id);
      return res.json(friends);
    }

    @Delete('friends/:id/delete')
    @UseGuards(AuthGuard('jwt'))
    async removeFriend(@Req() req, @Res() res, @Param('id') friendId: number): Promise<any> {
      // console.log('Enter to NEST DELETE FRIEND para fiendId: ' + friendId);
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      console.log(user);
      if (user) {
        user.friends = await this.userService.findUserFriends(user.id);
        // user.friends = user.friends.filter(friend => friend.id !== (friendId as number));
        // console.log('Ahora user friends es:');
        // console.log(user.friends);
        user.friends = user.friends.filter(friend => friend.id != friendId);
        // console.log('Ahora user friends es:');
        // console.log(user.friends);
        // const num: number = (friendId as number);
        // console.log(num);
        // const friends = user.friends.filter(friend => friend.id !== num);
        // console.log('Ahora despues de const num var friends es:');
        // console.log(friends);
        // const friends2 = user.friends.filter(friend => friend.id != num);
        // console.log('Ahora despues de const num var friends es:');
        // console.log(friends2);
        await this.userService.save(user);
        return res.status(200).json({ message: 'Friend removed successfully' });
      }
      console.log('Friend not found');
      return res.status(200).json({ message: 'Friend not found' });
    }
}
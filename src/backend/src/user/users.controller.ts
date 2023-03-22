import { UserService } from './user.service';
import { ArchivementsService } from '../archivements/archivements.service';
import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards, Query } from  '@nestjs/common';
import { User } from  './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { TwoFactorGuard } from '../auth/two-factor/two-factor.guard';
// import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UserService, private archivementsService: ArchivementsService){
    }

    // @Get()
    // read(): Promise<User[]> {
    //   return this.userService.readAll();
    // }
    
    // @Post('create')
    // async create(@Body() user: User): Promise<any> {
    //   return this.userService.create(user);
    // }  
    
    // @Put(':id/update')
    // async update(@Param('id') id, @Body() user: User): Promise<any> {
    //     user.id = Number(id);
    //     return this.userService.update(user);
    // }  
    
    // @Delete(':id/delete')
    // async delete(@Param('id') id): Promise<any> {
    //   return this.userService.delete(id);
    // }
    
    @Post('isvalidname')
    @UseGuards(AuthGuard('jwt'))
    async isValidName(@Req() req, @Body() body: { name: string }): Promise<boolean> {
      //console.log('Inside BACKEND isvalidname');
      //console.log('Inside BACKEND name:' + body.name);
      const name = body.name;
      if (!name) {
        //console.log('Inside BACKEND Name is empty');
        return false; // Name is empty, so it's not valid
      }
      if (name.length > 30) {
        //console.log('Inside BACKEND isvalidname name length is too long');
        return false; // Name is too long, so it's not valid
      }
      const regex = /^[a-zA-Z0-9]*$/;
      if (!regex.test(name)) {
        //console.log('Inside BACKEND isvalidname name dont pass the regex');
        return false; // Name contains invalid characters, so it's not valid
      }
      const user = await this.userService.getByName(name);
      if (user && (user.id42 != req.user.thirdPartyId)) {
        //console.log('Inside BACKEND isvalidname Name is in use');
        return false; // Name is already in use by another user, so it's not valid
      }
      //console.log('Inside BACKEND req.user.thirdPartyId:' + req.user.thirdPartyId);
      const req_user = await this.userService.getBy42Id(req.user.thirdPartyId);
      //console.log('Inside BACKEND name is valid going to update it for user');
      //console.log(req_user);
      req_user.name = body.name;
      await this.userService.save(req_user);
      return true; // Name is valid
    }

    @Post('register')
    @UseGuards(AuthGuard('jwt'))
    async completeRegister(@Req() req, @Res() res, @Body() body): Promise<any> {
      //console.log('Call to abckend completeRegister');
      //console.log(body);
      // Validate name field
      const nameRegex = /^[a-zA-Z0-9]{1,30}$/;
      if (!body.name || !nameRegex.test(body.name)) {
        return res.send(false);
      }
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
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async test(@Req() req, @Res() res): Promise<any> {
      return res.send('test works');
    }

    @Get('/find-by-username')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async findAllByUsername(@Query('name') name: string) {
      if (!name) {
        return [];
      }
      if (name.length > 30) {
        return [];
      }
      const regex = /^[a-zA-Z0-9]*$/;
      if (!regex.test(name)) {
        return [];
      }
      return this.userService.findAllByUsername(name);
    }

    @Get('/find-by-id')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getUserById(@Query('id') id: string) {
      //console.log('Inside find-by-id');
      const user = await this.userService.getById(parseInt(id));
      //console.log('when get firends the current user is ' + user);
      return null;
    }

    @Get('find/:id')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getById(@Param('id') id: number): Promise<User>  {
      //console.log('find/:id');
      return null;
    }

    @Get('rank/:userId')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getUserRanking(@Param('userId') userId: number): Promise<number> {
      return this.userService.getUserRanking(userId);
    }

    @Get('relation/with/:userId')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getRelationByUserId(@Req() req, @Param('userId') userId: number): Promise<{is_friend: boolean, is_blocked: boolean}  | null> {
      return this.userService.getRelationById(req.user.thirdPartyId ,userId);
    }

    @Get('finding/:userId')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getUserFindingById(@Param('userId') userId: number): Promise<User> {
      //console.log('ENDFINDING!!!!!!!');
      const user = await this.userService.getById(userId);
      return user;
    }

    @Get('block')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getBlockedUsers(@Req() req, @Res() res): Promise<any> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      const blockeds = await this.userService.findBlockedUsers(user.id);
      return res.json(blockeds);
    }

    @Post('game/options')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async setGameOption(@Req() req, @Body() body: { optionId: number }): Promise<User> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if (user) {
        user.game_options = body.optionId;
        await this.userService.save(user);
      }
      return user;
    }

    @Get('game/options')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getGameOption(@Req() req): Promise<number> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if(!user)
        return 0;
      return user.game_options;
    }


    @Get('block/:userId')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async blockUser(@Req() req, @Res() res, @Param('userId') userId: number): Promise<User> {
      console.log('In backend call to block user');
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if(user) {
          const targetUser = await this.userService.getById(userId);
          if(targetUser) {
              if (!user.blocked_users) {
                  user.blocked_users = [];
              }
              user.blocked_users.push(targetUser);
              await this.userService.save(user);
          }
      }
      return res.json(user);
    }

    @Get('unblock/:userId')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async unblockUser(@Req() req, @Res() res, @Param('userId') userId: number): Promise<User> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if (user) {
        if (!user.blocked_users) {
            user.blocked_users = [];
        }
        user.blocked_users = user.blocked_users.filter((blockedUser) => blockedUser.id != userId);
        await this.userService.save(user);
      }
      return res.json(user);
    }

    //ARCHIVEMENTS
    @Get('archivements/:userId')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getArchivements(@Req() req, @Res() res, @Param('userId') userId: number): Promise<any> {
      // console.log('Requesting archivements for user:' + userId)
      // if (typeof userId !== 'number') {
      //   console.log('USER ID is not NUMBER');
      //   return res.status(200).send([]);
      // }
      // console.log('USER ID is NUMBER');
      const archivements = await this.archivementsService.getArchivementsForUser(userId);
      return res.status(200).send(archivements);
    }

    //EDIT PROFILE TWO FACTOR
    @Put('twofactor')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async updateTwofactor(@Req() req, @Res() res, @Body() body: { twofactor: boolean }): Promise<User> {
        const user = await this.userService.getBy42Id(req.user.thirdPartyId);
        user.twofactor = body.twofactor;
        return this.userService.save(user);
    }


    //FRIENDS FUNCTIONALITY
    @Post('friends')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async addFriend(@Req() req, @Res() res, @Body() body): Promise<any> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      if(user) {
          //console.log(user);
          const user_friends = await this.userService.findUserFriends(user.id);
          const friendUser = await this.userService.getById(body.friendId);
          if(friendUser && friendUser.id != user.id){
            if (!user_friends) {
              //console.log('starting a empty array of friends');
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
            //console.log('Returning of post friends');
            //console.log(user.friends);
            return res.status(200).json({ message: 'Friend added successfully' });
          }
      }
      return res.status(200).json({ message: 'Friend was not added' });
    }

    @Get('friends')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async getFriends(@Req() req, @Res() res): Promise<any> {
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      //console.log('when get firends the current user is ' + user);
      const friends = await this.userService.findUserFriends(user.id);
      return res.json(friends);
    }

    @Delete('friends/:id/delete')
    @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
    async removeFriend(@Req() req, @Res() res, @Param('id') friendId: number): Promise<any> {
      // console.log('Enter to NEST DELETE FRIEND para fiendId: ' + friendId);
      const user = await this.userService.getBy42Id(req.user.thirdPartyId);
      //console.log(user);
      if (user) {
        user.friends = await this.userService.findUserFriends(user.id);
        user.friends = user.friends.filter(friend => friend.id != friendId);
        await this.userService.save(user);
        return res.status(200).json({ message: 'Friend removed successfully' });
      }
      //console.log('Friend not found');
      return res.status(200).json({ message: 'Friend not found' });
    }
}

import { UserService } from './user.service';
import { Controller, Get, Post,Put, Delete, Body, Param } from  '@nestjs/common';
import { User } from  './user.entity';
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
}

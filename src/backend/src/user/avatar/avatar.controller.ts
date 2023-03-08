import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user.service';
import { v4 as uuidv4 } from 'uuid';


export const storage = {
  storage: diskStorage({
      destination: './src/uploads/avatar',
      filename: (req, file, cb) => {
          //const filename: string = path.parse(file.originalname).name;
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          //const uniqueId: string = uuidv4();

          //cb(null, `${filename}-${uniqueId}${extension}`);
          cb(null, `${filename}${extension}`)
      }
  })

}

@Controller('avatar')
export class AvatarController {
    constructor(private userService: UserService){
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    async uploadFile(@UploadedFile() file, @Request() req): Promise<Object> {
        console.log(file.filename);
        //const user: UserI = await this.userService.getById(req.user.id);
        // Remove old avatar
        // if (fs.existsSync('src/uploads/avatar/' + user.avatar) && user.avatar != "user.png"){
        //     fs.unlinkSync('src/uploads/avatar/' + user.avatar)
        // }
        // if (fs.existsSync('src/uploads/avatar/test.png')){
        //     fs.unlinkSync('src/uploads/avatar/test.png')
        // }
        return null;
    }

    @Get(':imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'src/uploads/avatar/' + imagename)));
    }
}

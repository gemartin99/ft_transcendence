import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { v4 as uuidv4 } from 'uuid';


export const storage = {
  storage: diskStorage({
      destination: './src/uploads/avatar',
      filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`)
      }
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = path.extname(file.originalname);
    if (!allowedExtensions.includes(extension)) {
      const error = new Error('Invalid file type: only .jpg, .jpeg, .png, and .gif files are allowed');
      console.log(error);
      return cb(error, false);
    }
    cb(null, true);
  }
}

@Controller('avatar')
export class AvatarController {
    constructor(private userService: UserService){
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    async uploadFile(@UploadedFile() file, @Request() req): Promise<Object> {
      console.log('uploadFile');
      try {
          console.log('try');
          console.log(file.filename);
          const user: User = await this.userService.getById(req.user.id);
          console.log('try2');
          await this.userService.setUserAvatar(user, file.filename);
          console.log('try3');
          return null;
      } catch (error) {
          console.log('catch 1');
          console.error('Error uploading file:', error);
          throw error;
      }
      console.log('here 1');
      return null;
    }

    @Get(':imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'src/uploads/avatar/' + imagename)));
    }
}

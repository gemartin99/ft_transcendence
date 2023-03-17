import { Body, Controller, Param, Get, Req, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
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

    @Post('upload')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', storage))
    @UseGuards(AuthGuard('jwt'))
    async uploadFile(@UploadedFile() file, @Body() body, @Req() req): Promise<Object> {
      console.log('uploadFile');
      try {
          console.log(req)
          const user: User = await this.userService.getById(body.id);
          await this.userService.setUserAvatar(user, file.filename);
          return null;
      } catch (error) {
          console.error('Error uploading file:', error);
          return null;
      }
      console.log('here 1');
      return null;
    }

    @Get(':imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'src/uploads/avatar/' + imagename)));
    }
}

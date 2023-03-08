import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('avatar')
export class AvatarController {
	
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
	  console.log(file);
	}
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (req, file, cb) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //       cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  //     },
  //   }),
  // }))
  // uploadFile(@UploadedFile() file: Express.Multer.File): string {
  //   console.log(file.filename);
  //   return file.filename;
  // }
}

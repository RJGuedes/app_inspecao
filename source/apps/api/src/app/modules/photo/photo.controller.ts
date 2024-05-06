import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Crud, CrudController, ParsedBody } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PhotoEntity } from './photo.entity';
import { PhotoService } from './photo.service';
import { Express } from 'express';
import { Multer, diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './photo.utils';

@Crud({
  model: {
    type: PhotoEntity,
  },
  params: {
    slug: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      item: {
        eager: true,
        allow: ['name'],
        alias: 'item',
      },
    },
    alwaysPaginate: true,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('photos')
export class PhotoController implements CrudController<PhotoEntity> {
  constructor(public service: PhotoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, `../shared/files/seyconel`);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('entity') entity: string,
    @Body('data') _data: any
  ) {
    console.log({ file, entity });
    const data = JSON.parse(_data);
    return await this.service.uploadSave(file ? file.filename : null, data);
  }
}

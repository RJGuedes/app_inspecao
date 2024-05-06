import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { PhotoEntity } from './photo.entity';
import { join } from 'path';
import { unlink } from 'fs';

// This should be a real class/interface representing a photo entity

@Injectable()
export class PhotoService extends TypeOrmCrudService<PhotoEntity> {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private photoRepository: Repository<PhotoEntity>
  ) {
    super(photoRepository);
  }

  async uploadSave(fileData, _data: any) {
    /*let oldPhoto;
    if (oldId) {
      oldPhoto = await this.photoRepository.findOne(oldId);
    }*/
    const { file, ...data } = _data;
    const photo = await this.photoRepository.save({
      ...data,
      ...(fileData ? { file: fileData } : null),
    });
    /*if (oldPhoto) {
      const staticPath = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'shared',
        'files',
        oldPhoto.photoUrl
      );
      unlink(`${staticPath}`, () => {
        console.log('unlinked');
      });
    }
    */
    return photo;
  }
}

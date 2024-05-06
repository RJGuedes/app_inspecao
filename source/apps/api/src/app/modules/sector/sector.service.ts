import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { SectorEntity } from './sector.entity';

// This should be a real class/interface representing a sector entity

@Injectable()
export class SectorService extends TypeOrmCrudService<SectorEntity> {
  constructor(
    @Inject('SECTOR_REPOSITORY')
    private sectorRepository: Repository<SectorEntity>
  ) {
    super(sectorRepository);
  }

  async findAll(): Promise<SectorEntity[]> {
    return this.sectorRepository.find();
  }

  /*async findOne(email: string): Promise<SectorEntity | undefined> {
    return this.sectors.find((sector) => sector.email === email);
  }*/
}

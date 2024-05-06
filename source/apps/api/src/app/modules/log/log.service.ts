import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { LogEntity } from './log.entity';

// This should be a real class/interface representing a log entity

@Injectable()
export class LogService extends TypeOrmCrudService<LogEntity> {
  constructor(
    @Inject('LOG_REPOSITORY')
    private logRepository: Repository<LogEntity>
  ) {
    super(logRepository);
  }

  async findAll(): Promise<LogEntity[]> {
    return this.logRepository.find();
  }

  /*async findOne(email: string): Promise<LogEntity | undefined> {
    return this.logs.find((log) => log.email === email);
  }*/
}

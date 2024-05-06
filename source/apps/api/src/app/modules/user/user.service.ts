import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserEntity } from './user.entity';

// This should be a real class/interface representing a user entity

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>
  ) {
    super(userRepository);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password'],
    });
  }
}

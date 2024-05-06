import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

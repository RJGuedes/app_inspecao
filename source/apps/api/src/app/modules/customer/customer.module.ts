import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { CustomerController } from './customer.controller';
import { customerProviders } from './customer.providers';
import { CustomerService } from './customer.service';

@Module({
  imports: [DatabaseModule],
  providers: [...customerProviders, CustomerService],
  exports: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}

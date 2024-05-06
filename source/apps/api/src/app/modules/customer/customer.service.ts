import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CustomerEntity } from './customer.entity';

// This should be a real class/interface representing a customer entity

@Injectable()
export class CustomerService extends TypeOrmCrudService<CustomerEntity> {
  constructor(
    @Inject('CUSTOMER_REPOSITORY')
    private customerRepository: Repository<CustomerEntity>
  ) {
    super(customerRepository);
  }

  async findAll(): Promise<CustomerEntity[]> {
    return this.customerRepository.find();
  }

  /*async findOne(email: string): Promise<CustomerEntity | undefined> {
    return this.customers.find((customer) => customer.email === email);
  }*/
}

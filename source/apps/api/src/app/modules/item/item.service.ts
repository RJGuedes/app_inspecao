import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ItemEntity } from './item.entity';
import { CrudRequest, GetManyDefaultResponse } from '@dataui/crud';

// This should be a real class/interface representing a item entity

@Injectable()
export class ItemService extends TypeOrmCrudService<ItemEntity> {
  constructor(
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<ItemEntity>
  ) {
    super(itemRepository);
  }

  async getManyAndCount(
    req: CrudRequest
  ): Promise<ItemEntity[] | GetManyDefaultResponse<ItemEntity>> {
    const { parsed, options } = req;
    const builder = await this.createBuilder(parsed, options);
    builder.loadRelationCountAndMap(
      'ItemEntity.photosCount',
      'ItemEntity.photos',
      'photosCount'
    );
    return this.doGetMany(builder, parsed, options);
  }
  public async getOneAndCount(req: CrudRequest): Promise<ItemEntity> {
    return this.getOneAndCountOrFail(req);
  }

  protected async getOneAndCountOrFail(
    req: CrudRequest,
    shallow = false,
    withDeleted = false
  ): Promise<ItemEntity> {
    const { parsed, options, } = req;
    const builder = shallow
      ? this.repo.createQueryBuilder(this.alias)
      : await this.createBuilder(parsed, options, true, withDeleted);

    if (shallow) {
      this.setSearchCondition(builder, parsed.search, {});
    }

    builder.loadRelationCountAndMap(
      'ItemEntity.photosCount',
      'ItemEntity.photos',
      'photosCount'
    );

    const found = withDeleted
      ? await builder.withDeleted().getOne()
      : await builder.getOne();

    if (!found) {
      this.throwNotFoundException(this.alias);
    }

    return found;
  }

  /*async findOne(email: string): Promise<ItemEntity | undefined> {
    return this.items.find((item) => item.email === email);
  }*/
}

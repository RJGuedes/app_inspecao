import { environment } from '../../../environments/environment';
import { Entity, Column, ManyToOne, AfterLoad } from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { ItemEntity } from '../item/item.entity';

@Entity('photos')
export class PhotoEntity extends IaBaseEntity {
  @ManyToOne(() => ItemEntity, (item) => item.photos)
  item: ItemEntity;

  @Column({ nullable: true })
  itemId: string;

  @Column({ length: 255 }) file: string;

  protected photoUrl: string;

  @Column({ type: 'simple-json', nullable: true }) data?: string;

  @Column({ type: 'timestamp', nullable: true })
  savedAt?: Date;

  @AfterLoad()
  getPhotoUrl() {
    this.photoUrl = this.file ? `${environment.cdnUrl}/${this.file}` : null;
  }
}

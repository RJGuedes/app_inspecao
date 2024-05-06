import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { PhotoEntity } from '../photo/photo.entity';
import { SectorEntity } from '../sector/sector.entity';

@Entity('items')
export class ItemEntity extends IaBaseEntity {
  @Column({ length: 255 })
  traceability: string;

  @OneToMany(() => PhotoEntity, (photo) => photo.item)
  photos: PhotoEntity;

  photosCount?: number;

  @ManyToOne(() => SectorEntity, (sector) => sector.items)
  sector: SectorEntity;

  @Column({ nullable: true })
  sectorId: string;

  @Column({ type: 'json', nullable: true, default: null })
  data: any;

  @Column({ nullable: false, default: false })
  approved: boolean;
}

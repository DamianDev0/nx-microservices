import { Column, Entity, Index } from 'typeorm';
import { CommonEntity } from '@microservices/common';

@Entity('users')
export class UserEntity extends CommonEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 150 })
  firstName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phone?: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}

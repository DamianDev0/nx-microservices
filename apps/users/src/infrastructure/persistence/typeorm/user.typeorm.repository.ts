import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repository/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  create(user: UserEntity): Promise<UserEntity> {
    return this.repo.save(user);
  }

  update(user: UserEntity): Promise<UserEntity> {
    return this.repo.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }
}

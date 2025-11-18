import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/repository/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: IUserRepository) {}

async create(dto: CreateUserDto): Promise<UserEntity> {
  const exists = await this.userRepo.findByEmail(dto.email);
  if (exists) throw new ConflictException('Email already exists');

  const user = new UserEntity();
  Object.assign(user, dto);

  return this.userRepo.create(user);
}


  async findAll(): Promise<UserEntity[]> {
    return this.userRepo.findAll();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepo.create(user);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepo.delete(id);
  }
}

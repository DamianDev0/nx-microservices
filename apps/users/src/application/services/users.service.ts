import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/repository/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { KafkaService, KAFKA_TOPICS } from '@microservices/kafka';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly kafkaService: KafkaService, 
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already exists');

    const user = new UserEntity();
    Object.assign(user, dto);

    const created = await this.userRepo.create(user);

  
    await this.kafkaService.emit(KAFKA_TOPICS.USER_CREATED, {
      id: created.id,
      email: created.email,
      firstName: created.firstName,
      createdAt: created.createdAt,
    });

    return created;
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

    const updated = await this.userRepo.update(user);

    
    await this.kafkaService.emit(KAFKA_TOPICS.USER_UPDATED, {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      updatedAt: updated.updatedAt,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepo.delete(id);

    // 🔥 Emitir evento delete
    await this.kafkaService.emit(KAFKA_TOPICS.USER_DELETED, { id });
  }
}

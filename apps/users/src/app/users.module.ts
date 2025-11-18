import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../domain/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from '../application/services/users.service';
import { UsersProviders } from './users.providers';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../domain/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from '../application/services/users.service';
import { UsersProviders } from './users.providers';
// Temporarily disabled messaging imports
import { KafkaModule } from '@microservices/kafka';
// import { RabbitMQModule } from '@microservices/rabbitmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    // Temporarily disable messaging modules to isolate the issue
    KafkaModule,
    // RabbitMQModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
})
export class UsersModule {}

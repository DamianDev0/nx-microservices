import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    @Inject('RABBITMQ_CLIENT')
    private readonly client: ClientProxy
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ successfully');
    } catch (error) {
      this.logger.error(
        'RabbitMQ connection failed - application will continue without RabbitMQ messaging',
        error instanceof Error ? error.stack : String(error)
      );
      // Don't throw error here to prevent application startup failure
    }
  }

  async emit(pattern: string, message: unknown) {
    try {
      this.logger.log(`Publishing message -> Pattern: ${pattern}`);
      await lastValueFrom(this.client.emit(pattern, message));
    } catch (err) {
      this.logger.error(`Failed to publish message: ${err}`);
      throw err;
    }
  }
}

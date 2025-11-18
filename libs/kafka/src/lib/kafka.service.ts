import { Inject, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '../constants/kafka.constants';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async emit(topic: string, message: unknown) {
    const timestamp = new Date().toISOString();
    const payload = typeof message === 'object' && message !== null ? JSON.stringify(message) : String(message);

    this.logger.log(`Publishing event to Kafka. Topic: ${topic} | Timestamp: ${timestamp} | Payload: ${payload}`);

    try {
      this.kafkaClient.emit(topic, message);
      this.logger.log(`Event successfully published. Topic: ${topic} | Timestamp: ${timestamp}`);
    } catch (error) {
      this.logger.error(`Publishing event failed. Topic: ${topic} | Error: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }

  async onModuleInit() {
    this.logger.log('Attempting connection to Kafka broker');
    try {
      await this.kafkaClient.connect();
      this.logger.log('Kafka connection established');
    } catch (error) {
      this.logger.error('Kafka connection failed', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing Kafka connection');
    await this.kafkaClient.close();
    this.logger.log('Kafka connection closed');

  }
}

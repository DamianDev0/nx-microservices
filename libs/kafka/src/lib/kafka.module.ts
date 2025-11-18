import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '../constants/kafka.constants';
import { KafkaService } from './kafka.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'microservices-app',
            brokers: [process.env['KAFKA_BROKER'] || 'localhost:9092'],
          },
          consumer: {
            groupId: 'default-group', 
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}

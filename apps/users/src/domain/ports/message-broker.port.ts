export abstract class IMessageBrokerPort {
  abstract emit(pattern: string, payload: unknown): Promise<void>;
}

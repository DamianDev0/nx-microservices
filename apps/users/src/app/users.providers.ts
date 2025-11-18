import { IUserRepository } from '../domain/repository/user.repository';
import { UserTypeOrmRepository } from '../infrastructure/persistence/typeorm/user.typeorm.repository';

export const UsersProviders = [
  {
    provide: IUserRepository,
    useClass: UserTypeOrmRepository,
  },
];

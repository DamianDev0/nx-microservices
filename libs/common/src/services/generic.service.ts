import {
  BaseEntity,
  DeepPartial,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationResponse, PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class GenericService<T extends BaseEntity & { id: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as never });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: string, updateDto: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    this.repository.merge(entity, updateDto);
    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<T> {
    const item = await this.repository.findOne({ where: { id } as never });
    if (!item) throw new NotFoundException(`Entity with ID ${id} not found`);

    await this.repository.softDelete(id);
    return item;
  }

  async findWithPassword(email: string): Promise<T | null> {
    return this.repository
      .createQueryBuilder('entity')
      .addSelect('entity.password')
      .where('entity.email = :email', { email })
      .andWhere('entity.deleted_at IS NULL')
      .getOne();
  }

  async findByEmail(email: string): Promise<T | null> {
    return await this.repository.findOne({ where: { email } as never });
  }

  async findWithPagination(
    paginationDto: PaginationDto,
    customizeQueryBuilder?: (
      qb: SelectQueryBuilder<T>,
    ) => SelectQueryBuilder<T>,
  ): Promise<IPaginationResponse<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = paginationDto;

    const qb = customizeQueryBuilder
      ? customizeQueryBuilder(
          this.repository.createQueryBuilder('entity'),
        )
      : this.repository.createQueryBuilder('entity');

    const [result, total] = await qb
      .orderBy(`entity.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(Number(limit))
      .getManyAndCount();

    return {
      result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

import { Body, Controller, Get, Param, Post, Delete, Patch } from '@nestjs/common';
import { UsersService } from '../application/services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

@Post()
async create(@Body() dto: CreateUserDto) {
  return this.service.create(dto);
}


  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

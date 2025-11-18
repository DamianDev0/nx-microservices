import { Body, Controller, Get, Param, Post, Delete, Patch } from '@nestjs/common';
import { UsersService } from '../application/services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

@Post()
create(@Body() dto: CreateUserDto) {
  return this.service.create(dto);
}


  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

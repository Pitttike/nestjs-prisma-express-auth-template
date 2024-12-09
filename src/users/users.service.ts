import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.db.user.create({
        data: {
            userName: createUserDto.userName,
            password: hashedPassword
        },
        select: {
            id: true,
            userName: true,
            cartItems: true,
            password: false
        }
    });
}

  async findAll() {
    return await this.db.user.findMany();
  }

  async findOneById(id: number) {
    return await this.db.user.findUnique({
      where: {
        id: id
      },
      include: {
        cartItems: true
      }
    });
  }

  async findOneByName(username: string) {
    return await this.db.user.findUnique({
      where: {
        userName: username
      }
    })
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.db.user.update({
      where: {
        id: id
      },
      data: {
        updateUserDto,
      }
    })
  }

  async remove(id: number) {
    return await this.db.user.delete({where: {id: id}});
  }

}

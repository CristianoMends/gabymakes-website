import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
  ) { }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user ?? undefined;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new InternalServerErrorException('Erro ao buscar usuário por e-mail.');
    }
  }

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { googleId } });
      return user ?? undefined;
    } catch (error) {
      console.error('Error finding user by Google ID:', error);
      throw new InternalServerErrorException('Erro ao buscar usuário por Google ID.');
    }
  }

  async findOneById(id: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      return user ?? undefined;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new InternalServerErrorException('Erro ao buscar usuário por ID.');
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const newUser = this.usersRepository.create(user); 
      return await this.usersRepository.save(newUser); 
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  
  async update(id: string, partialUser: Partial<User>): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new InternalServerErrorException('Usuário não encontrado para atualização.');
      }
      this.usersRepository.merge(user, partialUser); 
      return await this.usersRepository.save(user); 
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async create(refreshToken: string) {
    const token = new Token();
    token.token = refreshToken;
    return await this.tokenRepository.save(token);
  }

  async findOne(refreshToken: string) {
    return await this.tokenRepository.findOneBy({ token: refreshToken });
  }
}

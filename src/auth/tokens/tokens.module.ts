import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService],
})
export class TokensModule {}

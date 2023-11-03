import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      database: 'ediaristas',
      username: 'root',
      password: '',
      host: 'localhost',
      port: 3306,
      synchronize: false,
      type: 'mysql',
      entities: [join(__dirname, '..', '**/*entity.{ts,js}')],
      migrations: [
        join(__dirname, '..', './database/migrations/mysql/*{ts,js}'),
      ],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}

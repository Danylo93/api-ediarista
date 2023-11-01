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
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASS'),
      host: this.config.get<string>('DATABASE_HOST'),
      port: parseInt(this.config.get('DATABASE_PORT')),
      // url: this.config.get<string>('DATABASE_URL'),
      synchronize: false,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      type: 'mysql',
      entities: [join(__dirname, '..', '**/*entity.{ts,js}')],
      migrations: [
        join(__dirname, '..', './database/migrations/postgres/*{ts,js}'),
      ],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}

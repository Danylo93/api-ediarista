import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from './typeorm-config';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config({ path: '.env.dev' });
const configService = new ConfigService();
const dataBase = new TypeOrmConfigService(configService);
export const dataConfigMigrations = new DataSource(
  dataBase.createTypeOrmOptions() as DataSourceOptions,
);

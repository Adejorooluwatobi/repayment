import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const databaseUrl = config.get<string>('DATABASE_URL');
    const isDev = config.get<string>('NODE_ENV') === 'development';

    if (databaseUrl) {
      return {
        type: 'postgres',
        url: databaseUrl,
        autoLoadEntities: true,
        synchronize: true, // Simple TypeORM auto schema sync (no migrations)
        logging: isDev ? ['error', 'warn'] : false,
      };
    }

    return {
      type: 'postgres',
      host: config.get<string>('DB_HOST', 'localhost'),
      port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
      username: config.get<string>('DB_USERNAME', 'postgres'),
      password: config.get<string>('DB_PASSWORD', 'postgres'),
      database: config.get<string>('DB_DATABASE', 'repayment_db'),
      autoLoadEntities: true,
      synchronize: true, // Simple TypeORM auto schema sync (no migrations)
      logging: isDev ? ['error', 'warn'] : false,
    };
  },
};

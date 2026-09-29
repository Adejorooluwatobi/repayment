import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const databaseUrl = config.get<string>('DATABASE_URL');
    const isDev = config.get<string>('NODE_ENV') === 'development';
    const dbSslEnv = config.get<string>('DB_SSL');

    // Detect if database is running locally or on internal container network
    const isLocalhost =
      !databaseUrl ||
      databaseUrl.includes('localhost') ||
      databaseUrl.includes('127.0.0.1') ||
      databaseUrl.includes('@postgres:5432');

    // Enable SSL for cloud providers (Render, Neon, Supabase, AWS RDS, etc.)
    const enableSsl =
      dbSslEnv === 'true' ||
      (dbSslEnv !== 'false' &&
        ((!isLocalhost && !!databaseUrl) ||
          databaseUrl?.includes('sslmode=require') ||
          databaseUrl?.includes('.render.com')));

    const sslOptions = enableSsl ? { rejectUnauthorized: false } : false;

    if (databaseUrl) {
      return {
        type: 'postgres',
        url: databaseUrl,
        autoLoadEntities: true,
        synchronize: true, // Simple TypeORM auto schema sync (no migrations)
        logging: isDev ? ['error', 'warn'] : false,
        ssl: sslOptions,
        extra: {
          ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
        },
      };
    }

    const host = config.get<string>('DB_HOST', 'localhost');
    const isHostLocal = host === 'localhost' || host === '127.0.0.1' || host === 'postgres';
    const hostEnableSsl =
      dbSslEnv === 'true' || (dbSslEnv !== 'false' && !isHostLocal && !isDev);

    return {
      type: 'postgres',
      host,
      port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
      username: config.get<string>('DB_USERNAME', 'postgres'),
      password: config.get<string>('DB_PASSWORD', 'postgres'),
      database: config.get<string>('DB_DATABASE', 'repayment_db'),
      autoLoadEntities: true,
      synchronize: true, // Simple TypeORM auto schema sync (no migrations)
      logging: isDev ? ['error', 'warn'] : false,
      ssl: hostEnableSsl ? { rejectUnauthorized: false } : false,
      extra: {
        ssl: hostEnableSsl ? { rejectUnauthorized: false } : undefined,
      },
    };
  },
};

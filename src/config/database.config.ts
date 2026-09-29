import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const databaseUrl = config.get<string>('DATABASE_URL');
    const isDev = config.get<string>('NODE_ENV') === 'development';
    const dbSslEnv = config.get<string>('DB_SSL');

    let host = config.get<string>('DB_HOST', 'localhost');
    let port = parseInt(config.get<string>('DB_PORT', '5432'), 10);
    let username = config.get<string>('DB_USERNAME', 'postgres');
    let password = config.get<string>('DB_PASSWORD', 'postgres');
    let database = config.get<string>('DB_DATABASE', 'repayment_db');
    let isCloud = false;

    if (databaseUrl) {
      try {
        const parsed = new URL(databaseUrl);
        host = parsed.hostname;
        port = parsed.port ? parseInt(parsed.port, 10) : 5432;
        username = decodeURIComponent(parsed.username || '');
        password = decodeURIComponent(parsed.password || '');
        database = parsed.pathname.replace(/^\//, '');

        if (
          !host.includes('localhost') &&
          !host.includes('127.0.0.1') &&
          host !== 'postgres'
        ) {
          isCloud = true;
        }
      } catch (err) {
        // If URL parsing fails, fallback to string check
        if (
          !databaseUrl.includes('localhost') &&
          !databaseUrl.includes('127.0.0.1') &&
          !databaseUrl.includes('@postgres:5432')
        ) {
          isCloud = true;
        }
      }
    } else {
      if (
        !host.includes('localhost') &&
        !host.includes('127.0.0.1') &&
        host !== 'postgres'
      ) {
        isCloud = true;
      }
    }

    // Enable SSL for cloud environments (Render, Neon, Supabase, etc.)
    const enableSsl =
      dbSslEnv === 'true' ||
      (dbSslEnv !== 'false' && (isCloud || databaseUrl?.includes('.render.com')));

    const sslConfig = enableSsl ? { rejectUnauthorized: false } : false;

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true, // Simple TypeORM auto schema sync (no migrations)
      logging: isDev ? ['error', 'warn'] : false,
      ssl: sslConfig,
      extra: {
        ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
      },
    };
  },
};

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonUtilities } from 'nest-winston';
import * as winston from 'winston';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { FilesModule } from './common/files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { SanitizationMiddleware } from './common/middleware/sanitization.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { CasesModule } from './modules/cases/cases.module';
import { ServicePackagesModule } from './modules/service-packages/service-packages.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { BlogPostsModule } from './modules/blog-posts/blog-posts.module';
import { CaseNotesModule } from './modules/case-notes/case-notes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { RedisService } from './common/services/redis.service';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonUtilities.format.nestLike('RepaymentBackend', { colors: true, prettyPrint: true }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    }),
    FilesModule,
    FastifyMulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', '127.0.0.1'),
          port: parseInt(config.get('REDIS_PORT', '6379'), 10),
          password: config.get('REDIS_PASSWORD'),
          maxRetriesPerRequest: null,
        },
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    UserModule,
    AdminModule,
    CasesModule,
    ServicePackagesModule,
    OrdersModule,
    ConsultationsModule,
    TestimonialsModule,
    BlogPostsModule,
    CaseNotesModule,
    NotificationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    RedisService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, SanitizationMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}

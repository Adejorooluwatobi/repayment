import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fastifyStatic from '@fastify/static';
import helmet from '@fastify/helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';


async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({ logger: true })
  );

  // Security middleware
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `'unsafe-inline'`],
      },
    },
  });

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor()
  );
  
  // Validation pipe with security settings
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, // Automatically strip non-whitelisted properties instead of throwing errors
    transform: true,
    validateCustomDecorators: true,
  }));

  // CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      // If we are not in production, allow all
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // In production, allow if origin is localhost or in ALLOWED_ORIGINS
      const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
      if (!origin || origin.includes('localhost') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // Block other origins
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'Accept'],
  });
  
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Repayment API')
      .setDescription('Comprehensive repayment platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication')
      .addTag('Users')
      .addTag('Admin')
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });

  // Static file serving
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(fastifyStatic.default, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
    decorateReply: true,
    index: false,
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`📚 API Documentation: ${await app.getUrl()}/api/docs`);
  logger.log(`🏥 Health Check: ${await app.getUrl()}/api/v1/health`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});


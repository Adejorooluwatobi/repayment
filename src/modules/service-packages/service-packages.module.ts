import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePackagesController } from './service-packages.controller';
import { ServicePackagesService } from './service-packages.service';
import { ServicePackage } from './entities/service-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePackage])],
  controllers: [ServicePackagesController],
  providers: [ServicePackagesService],
  exports: [ServicePackagesService, TypeOrmModule],
})
export class ServicePackagesModule {}

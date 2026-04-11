import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return false;
    }
    
    // Check for ADMIN role in the request user object
    const hasRole = user.role?.toUpperCase() === 'ADMIN';
    if (!hasRole) {
      throw new ForbiddenException('Admin access required');
    }
    
    return true;
  }
}
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return false;
    }
    
    // Check for USER role in the request user object
    const hasRole = user.role?.toUpperCase() === 'USER';
    if (!hasRole) {
      throw new ForbiddenException('User access required');
    }
    
    return true;
  }
}
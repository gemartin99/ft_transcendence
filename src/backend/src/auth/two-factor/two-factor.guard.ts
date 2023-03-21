import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable()
export class TwoFactorGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const thirdPartyId = req.user.thirdPartyId;
    return this.userService.getBy42Id(thirdPartyId).then(user => {
      if (!user) {
        return false;
      }
      if (user.twofactor && !user.twofactor_valid) {
        return false;
      }
      return true;
    });
  }
}

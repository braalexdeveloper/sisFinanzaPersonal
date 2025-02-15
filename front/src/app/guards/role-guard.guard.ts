import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const roleGuardGuard: CanActivateFn = async (route, state) => {
  const router:Router=inject(Router);

  const authService=inject(AuthService);

  const user= await firstValueFrom(authService.user$);
  const roleName=user?.role?.name;
  const roleRequired=route.data?.['role']

  console.log(roleName)
  console.log(roleRequired)

  if(!roleRequired){
    return true;
  }

  if(roleName===roleRequired){
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

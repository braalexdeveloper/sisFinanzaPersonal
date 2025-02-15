import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {

  const router=inject(Router)
 const token=JSON.parse(localStorage.getItem("token") || 'null')

 if(token){
  router.navigate(['/dashboard'])
   return false;
 }

  return true;
};

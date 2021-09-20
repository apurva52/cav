import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
// import { MatDialog } from '@angular/material';
import { ConfirmationService } from 'primeng/api';

export interface ConfigCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanDeactivate<ConfigCanDeactivate> {

  constructor(private confirmationService: ConfirmationService){
    
  }

  canDeactivate(component: ConfigCanDeactivate, currentRoute: ActivatedRouteSnapshot,
     currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean | Observable<boolean> {
      if(!component){
        return true;
      }
      return component.canDeactivate ? component.canDeactivate() : true;

  }
}

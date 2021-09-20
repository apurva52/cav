import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { MessageOptions } from './message.model';
import { AppError } from './../../../core/error/error.model';


@Injectable({
  providedIn: 'root'
})
export class AppMessageService {
  public subject = new Subject<MessageOptions>();
  public keepAfterRouteChange = true;

  constructor(public router: Router) { 
    // clear toast message on route change unless 'keepAfterRouterChange' flag is
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear toast
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
}

success(label: string, keepAfterRouteChange = false) {
    this.showNotification('success', label, keepAfterRouteChange);
}

error(error: AppError, keepAfterRouteChange = false) {
  this.showNotification('error', error, keepAfterRouteChange);
}

info(label: string, keepAfterRouteChange = false) {
    this.showNotification('info', label, keepAfterRouteChange);
}

warn(label: string, keepAfterRouteChange = false) {
    this.showNotification('warning', label, keepAfterRouteChange);
}

empty(label: string, keepAfterRouteChange = false) {
  this.showNotification('empty', label, keepAfterRouteChange);
}

neutral(label: string, keepAfterRouteChange = false) {
  this.showNotification('neutral', label, keepAfterRouteChange);
}

showNotification(type: string, label: any, keepAfterRouteChange = false) {
  this.keepAfterRouteChange = keepAfterRouteChange;
  this.subject.next({ type, label } as MessageOptions);
}


clear() {
    this.subject.next();
}

}

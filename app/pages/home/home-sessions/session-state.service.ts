import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SessionService } from 'src/app/core/session/session.service';
interface StateData {
  key: string,
  value: any
}

@Injectable({
  providedIn: 'root'
})
export class SessionStateService {
  private staticStateMap : Map<string, any>;
  private _stateSubject: Subject<StateData>;

  constructor(private sessionService: SessionService) { 
    this.staticStateMap = new Map<string, any>();
    this._stateSubject = new Subject<StateData>();
  }

  
  set(key, value, broadcast = false) {
    this.staticStateMap.set(key, value);
    if (broadcast) {
      this._stateSubject.next({key, value});
    }
  }

  setAll(values: Object, broadcast = false) {
    Object.entries(values).forEach((item) => {
      this.set(item[0], item[1], broadcast);
    });
  }
 
  get(key, defaultValue?:any): any {
    return this.staticStateMap.get(key) || defaultValue;
  }

  on<T>(key: string): Observable<T> {
    return this._stateSubject.asObservable()
    .pipe(filter(event => event.key == key))
    .pipe(map(event => event.value as T));
  }

  getSelectedSession() {
    let sessions = this.get('sessions.data', []);
    let idx = this.get('sessions.selectedSessionIdx', 0);
    if (idx != -1 && idx < sessions.length) {
      return sessions[idx];
    }
    return null;
  }

  getSelectedSessionPage() {
    let pages = this.get('sessions.pages.data', []);
    let idx = this.get('sessions.selectedPageIdx', 0);
    if (idx != -1 && idx < pages.length) {
      return pages[idx];
    }
    return null;
  } 
  getSelectedPage() {
    let pages = this.get('sessions.pages.data', []);
    return pages;
    }

  // some common methods which are used in components very frequently. 
  onSessionChange(): Observable<number> {
    return this.on('sessions.selectedSessionIdx');
  }

  onSessionPageChange(): Observable<number> {
    return this.on('sessions.selectedPageIdx');
  }
 isAdminUser() {
    let AdminUser: boolean = false;
    if (this.sessionService.session && this.sessionService.session.permissions) {
      for (const c of this.sessionService.session.permissions) {
        for (const d of c.permissions) {
          d.permission === 7 ? AdminUser = true : AdminUser = false;
        }
      }
    }
    return AdminUser;
  }
}

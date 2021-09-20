import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DashboardWidgetComponent } from './widget/dashboard-widget.component';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private subject = new Subject<any>();

  constructor() {}

  openSidePanel(isShow: boolean, menuType: String, widget?: DashboardWidgetComponent) {
    this.subject.next({ text: isShow, type: menuType, widget: widget });
  }

  closeSidePanel(isShow: boolean) {
    this.subject.next({ text: isShow });
  }

  getOpenCommand(): Observable<any> {
    return this.subject.asObservable();
  }

  getCloseCommand(): Observable<any> {
    return this.subject.asObservable();
  }
}

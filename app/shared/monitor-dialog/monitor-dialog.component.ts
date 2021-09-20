import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';

@Component({
  selector: 'app-monitor-dialog',
  templateUrl: './monitor-dialog.component.html',
  styleUrls: ['./monitor-dialog.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class MonitorDialogComponent  extends PageDialogComponent 
implements OnInit {

  @Input() dashboard: DashboardComponent;
  
  constructor() {
    super();
   }

  ngOnInit(): void {
  }

  closeDialog(){
    super.hide()
  }

  open(){
    const me = this;
    super.show();
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-running-monitors',
  templateUrl: './running-monitors.component.html',
  styleUrls: ['./running-monitors.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RunningMonitorsComponent extends PageDialogComponent
implements OnInit {

 constructor() {
    super();
  }


  ngOnInit(): void {
  }

  openRunningMonitorDialog(){
  
    super.show();
  }
}

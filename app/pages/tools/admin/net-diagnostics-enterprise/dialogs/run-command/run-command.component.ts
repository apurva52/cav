import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { CONVERSION_REPORT_TABLE_DATA } from 'src/app/pages/home/home-sessions/form-analytics/conversion-report/service/conversion-report.dummy';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { DashboardWidgetComponent } from 'src/app/shared/dashboard/widget/dashboard-widget.component';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { DashboardWidget } from 'src/assets/dummyData/dummy.model';

@Component({
  selector: 'app-run-command',
  templateUrl: './run-command.component.html',
  styleUrls: ['./run-command.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RunCommandComponent  extends PageDialogComponent
implements OnInit {
  allScope: MenuItem[];
 

  constructor(private router: Router,private dashboardService: DashboardService) {
    super();
  }


  ngOnInit(): void {
    const me = this;
    me.allScope = [
      { label: 'All' },
      { label: 'All' },
    ];
  }

  openRunCommandDialog(widget:DashboardWidgetComponent){
    this.dashboardService.setFromWidgetFlag(true);
    this.dashboardService.setSelectedWiget(widget);
    
    this.router.navigate(['/run-command-V1'] );
    //super.show();
  }
  openRunCommandDialog1(){
    super.show();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
@Component({
  selector: 'app-crash-report',
  templateUrl: './crash-report.component.html',
  styleUrls: ['./crash-report.component.scss']
})
export class CrashReportComponent implements OnInit {
  sid: any;
  starttime: any;
  endtime: any;
   breadcrumb: BreadcrumbService
  constructor(private router: Router, private route: ActivatedRoute,  breadcrumb: BreadcrumbService) { 
    this.breadcrumb = breadcrumb;
  }

  ngOnInit(): void {
    let me = this;
    me.route.queryParams.subscribe(params => {
      me.sid = (params.Sid);
      me.starttime = (params.startTime);
      me.endtime = (params.endTime);
    });
  
     this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({label: 'Home', routerLink: '/home'} as MenuItem);
      this.breadcrumb.addNewBreadcrumb({label: 'Sessions', routerLink: '/home/home-sessions'});
       this.breadcrumb.add({label: 'Unique Crash', routerLink: '/app-crash-filter'});
        this.breadcrumb.add({label: 'All Crash', routerLink: '/app-crash-summary'});
         this.breadcrumb.add({label: 'Crash Report', routerLink: '/app-crash-report'});
  }

}




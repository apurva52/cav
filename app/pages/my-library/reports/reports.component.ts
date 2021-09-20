import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng';
import {Message,MessageService} from 'primeng/api';
import { ReportsService } from './service/reports.service';
import { SETTINGS_TABLE } from '../reports/metrics/service/metrics.dummy';
import { Store } from 'src/app/core/store/store';
import { SchedulerEnableLoadingState,SchedulerEnableLoadedState,SchedulerEnableLoadingErrorState } from '../reports/service/reports.state';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService,
    ConfirmationService
  ]
})
export class ReportsComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  widgetReportItems: MenuItem[];
  activeTab: MenuItem;
  dialogVisible = false;
  schBtnDisable: boolean = false;
  disableSchButton: boolean = false;
  tip:string = "";
  featurePermission = 7;
  tooltip: string = "";

  constructor(
    private router : Router,
    private messageService: MessageService,
    private reportsService: ReportsService,
    public confirmation: ConfirmationService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    const me = this;
    let stateSession = this.sessionService.session;
    if (stateSession) {
      if (stateSession.permissions || stateSession.permissions.length > 0) {
        if (stateSession.permissions[1].key === "WebDashboard") {
          if (stateSession.permissions[1].permissions || stateSession.permissions[1].permissions.length > 0) {
            this.featurePermission = stateSession.permissions[1].permissions[40].permission;
            if (this.featurePermission == 0
              ) {
              this.disableSchButton = true;
              this.tip = "No Permission";
            }
          }
        }
      }
    }
    if(this.reportsService.successReportGeneration === true){
      this.msgAftrSuccessReportGen();
      this.reportsService.successReportGeneration = false;
        }
    me.breadcrumb = [
      // { label: 'Home', routerLink: '/home/dashboard' },
      // { label: 'System', routerLink: '/home/system'},
      // { label: 'Reports', routerLink: '/reports/metrics' },
    ]
    me.widgetReportItems = [
      {
        label: 'METRICS',
        command: (event: any) => {
          me.router.navigate(['/reports/metrics']);
        },
      },
      {
        label: 'DRILL DOWN',
        command: (event: any) => {
          me.router.navigate(['/reports/detailed']);
        },
      },
      {
        label: 'READY',
        command: (event: any) => {
          me.router.navigate(['/reports/ready']);
        },
      },
      {
        label: 'UX',
        command: (event: any) => {
          me.router.navigate(['/reports/ux']);
        },
      },
      {
        label: 'LOGS / VISUALIZATION',
        command: (event: any) => {
          me.router.navigate(['/reports/logs-visualization']);
        },
      },
    ];
    this.activeTab = this.widgetReportItems[0];
    this.getIsSchedulerEnable();
  }
  msgAftrSuccessReportGen() {
    setTimeout(() => {
      let rptType;
      console.log('report name', this.reportsService.reportName);
      console.log('report Type', this.reportsService.reportType);
      rptType = this.getReportTypeFromInt(this.reportsService.reportType, this.reportsService.trendEnable);
      this.messageService.add({severity:"success", summary:"Report Generation", detail:"Report "+this.reportsService.reportName+" with Report Type "+rptType+" Generated Successfully." });
    }, 500);
   }
 openTemplate(){
    SETTINGS_TABLE.paginator.first = 0;
    SETTINGS_TABLE.paginator.rows = 10;
    this.router.navigate(['/template']);
  }

  openSchedule(){
    SETTINGS_TABLE.paginator.first = 0;
    SETTINGS_TABLE.paginator.rows = 10;
    this.router.navigate(['/schedules']);
  }
  getReportTypeFromInt(reporttype, trendEnable){
    let reportType : number = reporttype;
    let rptTypName = "Performance Stats";

    if(reportType == 4 || reportType == 8 || reportType == 9 || reportType == 20){
       if(trendEnable == "true"){
           rptTypName = "Trend Compare";
       }else{
           rptTypName = "Compare";
       }
    }
    else if(reportType == 0){
      rptTypName = "Excel"
    }
    else if(reportType == 5){
      rptTypName = "Hierarchical"
    }
    else if(reportType == 10){
      rptTypName = "Summary"
    }
    return rptTypName;
}
  getIsSchedulerEnable(){
  const me = this;
  me.reportsService.getIsSchedulerEnable().subscribe(
    (state: Store.State) => {
      if (state instanceof SchedulerEnableLoadingState) {
        me.onLoadingSchedulerEnable(state);
        return;
      }

      if (state instanceof SchedulerEnableLoadedState) {
        me.onLoadedSchedulerEnable(state);
        return;
      }
    },
    (state: SchedulerEnableLoadingErrorState) => {
      me.onLoadingErrorSchedulerEnable(state);

    }
  );
  }
  onLoadingSchedulerEnable(state){}
  onLoadedSchedulerEnable(state){
    if(state.data.schedulerEnable){
      this.schBtnDisable = false;
      // this.tip = "";
    }
    else{
      this.schBtnDisable = true;
      this.tip = "Disabled due to no configuration";
    }
  }
  onLoadingErrorSchedulerEnable(state){}
  confirmationDialog(head, msg) {
    this.dialogVisible = true;
    this.confirmation.confirm({
      key: 'reports',
      message: msg,
      header: head,
      accept: () => {
        this.dialogVisible = false;
        return;
      },
      rejectVisible: false
    });
  }

}

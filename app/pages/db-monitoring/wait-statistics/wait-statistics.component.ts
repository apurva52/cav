import { Component, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';
import { DBMonitoringService } from '../services/db-monitoring.services';
import { SessionStatComponent } from '../session-stats/session-stats.component';
import { SessionStatService } from '../session-stats/session-stats.service';
import { WaitStatsComponent } from '../wait-stats/wait-stats.component';
import { WaitStatisticsTable } from './services/wait-staristics.model';
import { WAIT_STATISTICS_CHART_DATA, WAIT_STATISTICS_TABLE } from './services/wait-statistics.dummy';
import { SessionWaitStatsComponent } from './session-wait-stats/session-wait-stats.component';

@Component({
  selector: 'app-wait-statistics',
  templateUrl: './wait-statistics.component.html',
  styleUrls: ['./wait-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WaitStatisticsComponent implements OnInit {

  @ViewChild('sessionWait')
  sessionWait : SessionWaitStatsComponent;

  @ViewChild('wait')
  wait : WaitStatsComponent;

  @ViewChild('sessionStats')
  sessionStats : SessionStatComponent;
  dataChart: ChartConfig;
  // items: MenuItem[];

  // data: WaitStatisticsTable;
  error: AppError;
  loading: boolean;
  // empty: boolean;
  // emptyTable: boolean;
  // totalRecords: number;

  // cols: TableHeaderColumn[] = []; 
  // _selectedColumns: TableHeaderColumn[] = []; 

  // globalFilterFields: string[] = [];  
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  isCheckbox: boolean;
  enableChart: boolean = false;
  timeRange: string = '';
  items: MenuItem[];
  // isShowColumnFilter: boolean = false;
  // finalValue: any;

  // isEnabledColumnFilter: boolean = false;  
  // filterTitle: string = 'Enable Filters';

  constructor(public dbMonService : DBMonitoringService) { }

  ngOnInit(): void {
    const me = this;

    me.items = me.dbMonService.getSubMenus('WAIT');
    me.dbMonService.populateToggleIcons(me.items[0]);
    // me.items = [
    //   {label: 'Session Stats', icon: 'icons8 icons8-forward', routerLink: '/db-monitoring/wait-statistics/session-stats'},
    //   {label: 'SQL Plan ', icon: 'icons8 icons8-forward', routerLink: '/wait-statistics/'},
    //   {label: 'SQL Query', icon: 'icons8 icons8-forward', routerLink: '/wait-statistics/'}
    // ];

    

    // me.data = WAIT_STATISTICS_TABLE;
    
  //   me.cols = me.data.waitStatistics.headers[0].cols;
  //   for (const c of me.data.waitStatistics.headers[0].cols) {
  //     me.globalFilterFields.push(c.valueField);
  //     if (c.selected) {
  //       me._selectedColumns.push(c);
  //     }
  //   }

  }

  // ngAfterViewInit() {
  //   const me = this;
  //   setTimeout(() => {
  //     // me.dataChart = me.sessionWait.dataChart;
  //     me.enableChart = true;
  //   }, 100);
  // }
  // @Input() get selectedColumns(): TableHeaderColumn[] {
    //   const me = this;
    //   return me._selectedColumns;
    // }
    
    // set selectedColumns(val: TableHeaderColumn[]) {
  //   const me = this;
  //   me._selectedColumns = me.cols.filter((col) => val.includes(col));
  // }
  

  // toggleFilters() {
    //   const me = this;
    //   me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    //   if (me.isEnabledColumnFilter === true) {
      //     me.filterTitle = 'Disable Filters';
  //   } else {
  //     me.filterTitle = 'Enable Filters';
  //   }
  // }

  updateChart(waitDataChart:ChartConfig){
    const me = this;
    me.enableChart = false;
    me.dataChart = waitDataChart;
    setTimeout(() => {
      me.enableChart = true;
    }, 100);
  }
}

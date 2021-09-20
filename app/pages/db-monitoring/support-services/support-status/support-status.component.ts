import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { SupportService } from './service/support-service';
import { SUPPORT_STATUS_CHART_DATA, SUPPORT_STATUS_TABLE } from './service/support-status.dummy';

@Component({
  selector: 'app-support-status',
  templateUrl: './support-status.component.html',
  styleUrls: ['./support-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupportStatusComponent implements OnInit {

  items: MenuItem[];
  downloadOptions: MenuItem[];
  dataTable: DBMonTable
  dataChart;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number = 0;

  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = []; 

  globalFilterFields: string[] = [];  
  selectedRow: any;
  isShow: boolean = false;   
  isShowColumnFilter: boolean = false;
  finalValue: any;
  enableChart:boolean = false;

  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  dataSubscription: Subscription;
  timeRange: string = '';
  title: string = '';

  constructor(private supportService: SupportService  ,
    private dbMonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService) { }

  ngOnInit(): void {
    const me = this;

    me.cols = me.dbMonService.loadTableHeaders('SERVICES','SUPPORT');
    if(me.dbMonService.databaseType !=2){
      me.title = 'SQL Support Service';
    }else{
      me.title = 'MySQL Event Stats';
    }
    me.dataTable = {
      paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 30, 50, 100],
      },
  
      headers: [
        {
          cols: me.cols,
        },
      ],
      data: [],
      tableFilter: true,
    };
    me.dataChart = [
      {
        title: 'Graphical Representation of Service Status History',
        highchart: {
          chart: {
            height: '200px',
            zoomType: 'x',
            spacing: [10, 10, 0, 7],
            marginBottom: 50,
            type: 'bar'
          },
          title: {
            text: null,
          },
          legend: {
            align: 'right',
            enabled: true,
            x: 0,
            verticalAlign: 'middle',
            floating: false,
            shadow: false,
            layout: 'vertical',
            symbolWidth: .001,
            symbolHeight: .001,
            symbolRadius: .001,
            itemStyle: { fontSize: '11', fontWeight: 'bold', fontFamily: 'sans-serif' },
            labelFormatter: function () {
              return '<div style="color: #348e4a"><p>Running</p></div><br>' +
                '<div style="color: #0400ff"><p>Paused</p></div><br>' +
                '<div style="color: #ff0000"><p>Stopped</p></div><br>'
            }
          },
          xAxis: {
            categories: []
          },
          yAxis: {
            min: 0,
            type: 'datetime',
            title: {
              text: null,
            },
            stackLabels: {
              enabled: false,
              style: {
                fontWeight: 'bold'
              }
            }
          },
          tooltip: {
            formatter: function () {
              let _st = '';
              switch (this.color) {
                case '#348e4a':
                  _st = 'Running';
                  break;
                case '#0400ff':
                  _st = 'Paused';
                  break;
                case '#ff0000':
                  _st = 'Stopped';
                  break;
                case '#cb6a8b':
                  _st = 'Other (start pending)';
                  break;
                case '#ff8000':
                  _st = 'Other (stop pending)';
                  break;
                case '#d4ae3f':
                  _st = 'Other (continue pending)';
                  break;
                case '#d4ae3f':
                  _st = 'Other (pause pending)';
                  break;
              }
              return this.x + ': ' + '<br>' + _st;
            }
          },
          plotOptions: {
            credits: {
              enabled: false,
            },
            series: {
              stacking: 'normal',
              pointWidth: 10,
              events: {
                legendItemClick: function () {
                  return false;
                }
              }
            },
            // allowPointSelect: false
          },
          series: [],
        },
      }
    ];
  me.load();
  for (const c of me.cols) {
    me.globalFilterFields.push(c.field);
    if (c.selected) {
      me._selectedColumns.push(c);
    }
  }
  me.subscribeScheduleLoad();
}
ngAfterViewInit() {
  const me = this;
  me.scheduleLoad();
}

private subscribeScheduleLoad(){
  const me = this;
  me.dataSubscription = me.dbMonService.scheduleDataRequestObservable$.subscribe(
    result => {
      me.load();
      me.scheduleLoad();
  });
}

// @Input() get selectedColumns(): TableHeaderColumn[] {
//   const me = this;
//   return me._selectedColumns;
// }
// set selectedColumns(val: TableHeaderColumn[]) {
//   const me = this;
//   me._selectedColumns = me.cols.filter((col) => val.includes(col));
// }

private scheduleLoad(){
  const me = this;
  if(me.schedulerService){
    me.schedulerService.unsubscribe('load-supportstats');
  }
  if(me.dbMonService.isAnalysisMode){
    return;
  }
  me.schedulerService.subscribe('load-supportstats', () => {
    me.load();
  }, 'progressInterval');
}

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
 

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  load() {
    const me = this;
    if (!me.sessionSerivce.isActive()) {
      return;
    }
    const payload = {} as DBMonCommonParam;
      me.supportService.getPresetAndLoad(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof DBMonitoringLoadingState) {
          me.onLoading(state);
          return;
        }
        
        if (state instanceof DBMonitoringLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DBMonitoringLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    
    }
    private onLoading(state: DBMonitoringLoadingState) {
      const me = this;
      // me.dataTable.data = null;
      me.error = null;
      me.empty = false;
      me.loading = true;
    }
  
    private onLoadingError(state: DBMonitoringLoadingErrorState) {
      const me = this;
      //me.dataTable.data = null;
      me.error = state.error;
      me.empty = false;
      me.loading = false;
    }

  private onLoaded(state: DBMonitoringLoadedState) {
    const me = this;

    me.dataTable.data = state.data['msSqlServiceStatusDTO'];
    if(me.dataTable.data){
      me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
    if (me.totalRecords && me.totalRecords == 0) {
      me.emptyTable = true;
    }
    me.enableChart = false;
    if(me.dbMonService.isRealTimeAppled){
    me.timeRange = state.data['arrStartAndEndTimeForDB'][2];
    }else{
      me.timeRange = state.data['arrStartAndEndTimeForDB'][2] + ' to ' + state.data['arrStartAndEndTimeForDB'][1];
    }
    me.addDataInChart(state.data);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
    me.error = state.error;
    me.loading = false;
  }
  
  addDataInChart(chartData) {
    const me = this;
    try {
      let finalData = [];
      let categories = chartData.arrServiceNameList;
      let data = [];
      let graphData = chartData.serviceNameWithTime;
      
      if(graphData == undefined || graphData == null){
        me.dataChart[0]['highchart'].series = [];
        return;
      }
      for (let _data in graphData) {
        if (graphData.hasOwnProperty(_data)) {
          let tsArr = [];
          let stArr = [];
          let supportServiceChartLocal = {};
          let tmpGraphData = graphData[_data][0];
          for (let timeData in tmpGraphData) {
            if (tmpGraphData.hasOwnProperty(timeData)) {
              tsArr.push(Number(timeData));
              stArr.push(tmpGraphData[timeData]);
            }
          }
          let tsArr11 = [];
          let stArr11 = [];
          let tsArr22 = [];
          let stArr22 = [];
          tsArr11.push(tsArr[0]);
          stArr11.push(stArr[0]);
          for (let i = 1; i < tsArr.length - 1; i++) {
            if (stArr[i] !== stArr[i + 1]) {
              tsArr11.push(tsArr[i]);
              stArr11.push(stArr[i]);
              tsArr11.push(tsArr[i + 1]);
              stArr11.push(stArr[i + 1]);
            }
          }
          tsArr11.push(tsArr[tsArr.length - 1]);
          stArr11.push(stArr[stArr.length - 1]);
          for (let i = 0; i < tsArr11.length; i++) {
            if (tsArr22.indexOf(tsArr11[i]) == -1) {
              tsArr22.push(tsArr11[i]);
              stArr22.push(stArr11[i])
            }
          }
          supportServiceChartLocal['serviceType'] = _data;
          supportServiceChartLocal['statusArry'] = stArr22;
          supportServiceChartLocal['timestampArr'] = tsArr22;
          finalData.push(supportServiceChartLocal);
        }
      }

      for (let s = 0; s < finalData.length; s++) {
        let _isFisrt = true;
        let timeStamp, _prevTS, _currTS;
        for (let i = 0; i < finalData[s].timestampArr.length; i++) {
          let timeData = Number(finalData[s].timestampArr[i]);
          if (_isFisrt) {
            timeStamp = timeData;
            _prevTS = timeStamp;
            _isFisrt = false;
          } else {
            _currTS = timeData;
            timeStamp = _currTS - _prevTS;
            _prevTS = _currTS;
          }
          let _dataRow = {};
          _dataRow['x'] = categories.indexOf(finalData[s].serviceType);
          _dataRow['y'] = timeStamp;
          _dataRow['color'] = this.getColorOnBasisOfValue(finalData[s].statusArry[i]);
          data.push(_dataRow);
        }
      }

      // let seriesLength = me.dataChart[0]['highchart'].series.length;
      // for (let _x = sereisLength - 1; _x > -1; _x--) {
      //   me.dataChart[0]['highchart'].series[_x].remove();
      // }
      me.dataChart[0]['highchart'].series.push({
        // type: 'bar',
        data: data,
        name: ''
      });
      me.dataChart[0]['highchart']['xAxis']['categories'] = categories;
      me.dataChart[0]['highchart']['yAxis']['min'] = moment(finalData[0].timestampArr[0]).tz('Asia/Kolkata');
      me.dataChart[0]['highchart']['yAxis']['labels'] = {
        formatter: function () {
          return moment(this.value).tz('Asia/Kolkata').format('HH:mm');
        }
      };

      //   labelFormatter: function() {
      //     return '<div style="color: #348e4a"><p>Running</p></div><br>' +
      //     '<div style="color: #0400ff"><p>Paused</p></div><br>' +
      //     '<div style="color: #ff0000"><p>Stopped</p></div><br>' +
      //     '<div style="color: #cb6a8b"><p>Other (start pending)</p></div><br>' +
      //     '<div style="color: #ff8000"><p>Other (stop pending)</p></div><br>' +
      //     '<div style="color: #7437e2"><p>Other (continue pending)</p></div><br>' +
      //     '<div style="color: #d4ae3f"><p>Other (pause pending)</p></div><br>'
      //  },
    } catch (error) {
      console.error('Exception in addDataInChartForService ' + error);
    }
  }

  getColorOnBasisOfValue(value) {
    try {
      let color = '#0080ff';
      switch (value) {
        case 'Running':
          color = '#348e4a';
          break;
        case 'Paused':
          color = '#0400ff';
          break;
        case 'Stopped':
          color = '#ff0000';
          break;
        case 'Other (start pending)':
          color = '#cb6a8b';
          break;
        case 'Other (stop pending)':
          color = '#ff8000';
          break;
        case 'Other (continue pending)':
          color = '#d4ae3f';
          break;
        case 'Other (pause pending)':
          color = '#d4ae3f';
          break;
      }
      return color;

    } catch (error) {
      console.error('Error ', error);
    }
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-supportstats');
    if(me.dataSubscription){
    me.dataSubscription.unsubscribe();
    }
  }
}
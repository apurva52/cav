import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { BatchService } from './batch-jobs.service';


@Component({
  selector: 'app-batch-jobs',
  templateUrl: './batch-jobs.component.html',
  styleUrls: ['./batch-jobs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BatchJobsComponent implements OnInit {

  dataTable: DBMonTable;
  historyDataTable: DBMonTable;
  dataChart: any;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  errorHistory: AppError;
  loadingHistory: boolean;
  emptyHistoryTable: boolean;
  totalRecords: number = 0;
  totalRecordsHistory: number = 0;
  cols: TableHeaderColumn[] = []; 
  _selectedColumns: TableHeaderColumn[] = [];
  
  colsHistory: TableHeaderColumn[] = []; 
  _selectedColumnsHistory: TableHeaderColumn[] = []; 
  timeRange: string = '';
  timeRange1: string = '';
  globalFilterFields: string[] = []; 
  globalFilterFieldsHistory: string[] = []; 
  dataSubsciption: Subscription;
  isShow: boolean = false;   
  isShowColumnFilter: boolean = false;
  isShowColumnFilterHistory: boolean = false;
  finalValue: any;
  arrWeek: MenuItem[];
  selectedInterval: string;
  selectedJobId: string;

  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  enableChart: boolean = false;

  constructor(private dbMonService: DBMonitoringService,
    private sessionSerivce: SessionService,
    private schedulerService: SchedulerService,
    private batchService: BatchService,
    private dbmonService: DBMonitoringService) { }

  ngOnInit(): void {
    const me = this;

    me.cols = me.dbMonService.loadTableHeaders('SERVICES','BATCH');
    me.colsHistory = me.dbMonService.loadTableHeaders('SERVICES','BATCHHIS');
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
    me.historyDataTable = {
      paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 30, 50, 100],
      },
      headers: [
        {
          cols: me.colsHistory,
        },
      ],
      data: [],
      tableFilter: true,
    };
    me.dataChart = [
      {
        title: 'Graphical Representation of BatchJobs History',
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
            itemStyle: { fontSize: 11, fontWeight: 'bold', fontFamily: 'sans-serif' },
            labelFormatter: function () {
              return '<div style="color: #ff0000"><p>Failure</p></div><br>' +
                '<div style="color: #348e4a"><p>Success</p></div><br>' +
                '<div style="color: #cdde16"><p>Retry</p></div><br>' +
                '<div style="color: #bc1dc4"><p>Cancel</p></div><br>' +
                '<div style="color: #3535f2"><p>In Progress</p></div><br>'
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
          },
          plotOptions: {
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
  for (const c of me.colsHistory) {
    me.globalFilterFieldsHistory.push(c.field);
    if (c.selected) {
      me._selectedColumnsHistory.push(c);
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
  me.dataSubsciption = me.dbMonService.scheduleDataRequestObservable$.subscribe(
    result => {
      me.load();
      me.scheduleLoad();
  });
}

private scheduleLoad(){
  const me = this;
  if(me.schedulerService){
    me.schedulerService.unsubscribe('load-batchjobstats');
  }
  if(me.dbMonService.isAnalysisMode){
    return;
  }
  me.schedulerService.subscribe('load-batchjobstats', () => {
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

  @Input() get selectedColumnsHistory(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumnsHistory;
  }

  set selectedColumnsHistory(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumnsHistory = me.colsHistory.filter((col) => val.includes(col));
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
      me.batchService.getPresetAndLoad(payload).subscribe(
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
      me.emptyTable = false;
      me.loading = true;
    }
  
    private onLoadingError(state: DBMonitoringLoadingErrorState) {
      const me = this;
      //me.dataTable.data = null;
      me.error = state.error;
      me.emptyTable = false;
      me.loading = false;
    }

  private onLoaded(state: DBMonitoringLoadedState) {
    const me = this;

    me.dataTable.data = state.data['msSqlJobStats'];
    if (me.dataTable.data) {
      me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
    if (state.data['arrStartAndEndTimeForTable'][0] && state.data['arrStartAndEndTimeForTable'][1] && state.data['arrStartAndEndTimeForTable'][1] != null && state.data['arrStartAndEndTimeForTable'][0] != null) {
      if(me.dbmonService.isRealTimeAppled){
    me.timeRange = state.data['arrStartAndEndTimeForTable'][1]; 
      }else{
        me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1]; 
      }
    }
    me.arrWeek = [];
    for (var val of state.data['arrWeek']) {
    me.arrWeek.push ({
      label : val
    });
  }
    me.selectedInterval = me.arrWeek[0].label;
    me.selectedJobId = me.dataTable.data[0]['jobId'];
    let data = {'jobId': me.selectedJobId}; 
    me.getJobHistoryData(data);
    me.error = state.error;
    me.loading = false;
  }

    public onIntervalChange(event){
      const me = this;
      me.selectedInterval = event.target.innerText;
      let data = {'jobId': me.selectedJobId}; 
      me.getJobHistoryData(data);
    }

    getJobHistoryData(data) {
      const me = this;
      me.selectedJobId = data.jobId;
      me.batchService.loadHistory(me.selectedJobId, me.selectedInterval).subscribe(
        (state: Store.State) => {
          if (state instanceof DBMonitoringLoadedState) {
            me.onHistoryLoaded(state);
            return;
          }
        }
        );
  }

  private onHistoryLoaded(state: DBMonitoringLoadedState) {
    const me = this;

    me.historyDataTable.data = state.data['msSqlJobHistoryStats'];
    if (me.historyDataTable.data) {
      me.totalRecordsHistory = me.historyDataTable.data.length;
      console.log('nwejgnqengkqqngaw3ngv ', me.totalRecordsHistory);
    }else{
      me.historyDataTable.data = [];
    }
    me.enableChart = false;
    if (state.data !=null && state.data['arrStartAndEndTimeForTable'] !=null && state.data['arrStartAndEndTimeForTable'][0] && state.data['arrStartAndEndTimeForTable'][1] && state.data['arrStartAndEndTimeForTable'][1] != null && state.data['arrStartAndEndTimeForTable'][0] != null) {
      me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1]; 
      }
    me.addDataInChartForJobHistory(state.data['panelData']);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
    me.errorHistory = state.error;
    me.loadingHistory = false;
  }

  /* Drawing chart for the Batch Jobs History Data. */
  addDataInChartForJobHistory(panelData) {
    const me = this;
    try {
      let categories = panelData[0].panelGraphArr[0].graphName;
      let timeStampArray = [];
      let data = [];
      let timeStampGraphData = panelData[0].arrTimestamp;
      let _isFirst = true;
      let timeStamp, _prevTS, _currTS;
      for (let i = 0; i < timeStampGraphData.length; i++) {
        let singletimeData = timeStampGraphData[0];
        if (_isFirst) {
          timeStamp = Number(singletimeData);
          _prevTS = timeStamp;
          _isFirst = false;
        } else {
          _currTS = Number(timeStampGraphData[i]);
          timeStamp = _currTS - _prevTS;
          _prevTS = _currTS;
        }
        let _dataRow = {};
        _dataRow['x'] = 0;
        _dataRow['y'] = timeStamp;
        _dataRow['color'] = me.getColorOnBasisOfBatchJobs(panelData[0].panelGraphArr[0].graphData[i]);
        timeStampArray.push(timeStamp);
        data.push(_dataRow);
      }
      // let seriesLength = me.dataChart['highchart'].chart.series.length;
      // for (let _x = seriesLength - 1; _x > -1; _x--) {
      //   this.chart.series[_x].remove();
      // }
      me.dataChart['highchart'].chart.series.push({
        data: data,
        name: ''
      });
      me.dataChart['highchart']['xAxis']['categories'] = categories;
      me.dataChart['highchart']['yAxis']['min'] = timeStampArray[0];
      me.dataChart['highchart']['yAxis']['max'] = timeStampGraphData[timeStampGraphData.length - 1];
      me.dataChart['highchart']['yAxis']['labels'] = {
        formatter: function () {
          return moment(this.value).tz('Asia/Kolkata').format('HH:mm');
        }
      };
      me.dataChart['highchart']['tooltip'] = {
        formatter: function () {
          let _st = '';
          switch (this.color) {
            case '#ff0000':
              _st = 'Failure';
              break;
            case '#348e4a':
              _st = 'Success';
              break;
            case '#e8f92c':
              _st = 'Retry';
              break;
            case '#bc1dc4':
              _st = 'Cancel';
              break;
            case '#3535f2':
              _st = 'In Progress';
              break;
          }
          return this.x + ': ' + _st + '<br>' + 'Start Time: ' + moment(timeStampArray[0],).tz(sessionStorage.timeZoneId).format('HH:mm:ss') + '<br>' + 'End Time: ' +
            moment(timeStampGraphData[timeStampGraphData.length - 1]).tz(sessionStorage.timeZoneId).format('HH:mm:ss');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* Method to get the color of the graph based on the batch job value. */
  getColorOnBasisOfBatchJobs(value) {
    try {
      let color = '#0080ff';
      switch (value) {
        case 0:
          color = '#ff0000';
          break;
        case 1:
          color = '#348e4a';
          break;
        case 2:
          color = '#cdde16';
          break;
        case 3:
          color = '#bc1dc4';
          break;
        case 4:
          color = '#3535f2';
          break;
      }
      return color;

    } catch (error) {
      console.error('Error ', error);
    }
  }
  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('load-batchjobstats');
    if(me.dataSubsciption){
      me.dataSubsciption.unsubscribe();
      }
  }
}

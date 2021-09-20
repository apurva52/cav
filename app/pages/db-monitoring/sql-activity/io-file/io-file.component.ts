import { Component, Input, OnInit } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { MenuItem } from 'primeng';
import { IOService } from './io-file.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Subscription } from 'rxjs';
import { DBMonCommonParam } from '../../services/request-payload.model';

@Component({
  selector: 'app-io-file',
  templateUrl: './io-file.component.html',
  styleUrls: ['./io-file.component.scss']
})
export class IoFileComponent implements OnInit {
  dataTable: DBMonTable;
  dataChart: ChartConfig[];
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  graphError: AppError;
  graphLoading: boolean;
  graphEmpty: boolean;
  totalRecords: number = 0;
  downloadOptions: MenuItem[];
  cols: TableHeaderColumn[] = []; 
  timeRange: string = '';
  _selectedColumns: TableHeaderColumn[] = []; 

  globalFilterFields: string[] = [];
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;  
  filterTitle: string = 'Enable Filters';
  dataSubsciption: Subscription;
  enableChart :boolean = false;


  constructor(private ioService: IOService  ,
    public dbMonService: DBMonitoringService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService ) { }

  ngOnInit(): void {

    const me = this;

    me.cols = me.dbMonService.loadTableHeaders('ACTIVITY','IOFILE');
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
          title: null,
          highchart: {
            chart: {
              height: '200px',
              zoomType: 'x',
              type: 'spline'
            },
            title: {
              text: null,
            },
            legend: {
              enabled: true,
              align: 'center',
              verticalAlign: 'bottom',
              x: 0,
              y: 0,
              layout: 'horizontal',
              itemStyle: {
                // width: 70,
                color: '#333333',
                fontFamily: 'Product Sans',
                fontSize: '11px',
              },
            },
            xAxis: {
              type: 'datetime'
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            tooltip: {
              pointFormat:
                '{series.name} <b>{point.y:,.0f}</b>',
            },
            plotOptions: {
              spline: {
                marker: {
                  enabled: false,
                  symbol: 'circle',
                  radius: 2,
                  states: {
                    hover: {
                      enabled: true,
                    },
                  },
                },
              }
            },
            credits: {
              enabled: false,
            },
            series: [] as Highcharts.SeriesOptionsType[],
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
    me.dataSubsciption = me.dbMonService.scheduleDataRequestObservable$.subscribe(
      result => {
        me.load();
        me.scheduleLoad();
    });
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  private scheduleLoad(){
    const me = this;
    if(me.schedulerService){
      me.schedulerService.unsubscribe('load-iofilestats');
    }
    if(me.dbMonService.isAnalysisMode){
      return;
    }
    me.schedulerService.subscribe('load-iofilestats', () => {
      me.load();
    }, 'progressInterval');
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
      me.ioService.getPresetAndLoad(payload).subscribe(
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

    me.dataTable.data = state.data['msSqlIOFileStats'];
    if (state.data != null && state.data['arrStartAndEndTimeForTable'] != null && state.data['arrStartAndEndTimeForTable'][1] && state.data['arrStartAndEndTimeForTable'][0] && state.data['arrStartAndEndTimeForTable'][1] != null && state.data['arrStartAndEndTimeForTable'][0] != null){
      if(me.dbMonService.isRealTimeAppled){
      me.timeRange = state.data['arrStartAndEndTimeForTable'][1];
      }else{
        me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1];
      }
  }
    if(me.dataTable.data &&  me.dataTable.data !=null ){
    let selectedDBName = me.dataTable.data[0]['databaseName'];
    let selectedFileType = me.dataTable.data[0]['fileType'];
    
    me.loadGraph(selectedDBName, selectedFileType);
  }

    if (me.dataTable.data) {
      me.empty = !me.dataTable.data.length;
      me.totalRecords = me.dataTable.data.length;
    }else{
      me.dataTable.data = [];
    }
    // me.selectedUserOption = me.dataTable.options[0].label;
    // me.dataTable.headers[0].cols.forEach(c => me.globalFilterFields.push(c['valueField']));
    me.error = state.error;
    me.loading = false;
    }

    loadGraph(selectedDBName, selectedFileType) {
      const me = this;
      if (!me.sessionSerivce.isActive()) {
        return;
      }
        me.ioService.loadGraph(selectedDBName, selectedFileType).subscribe(
        (state: Store.State) => {
          if (state instanceof DBMonitoringLoadingState) {
            me.onLoadingGraph(state);
            return;
          }
          
          if (state instanceof DBMonitoringLoadedState) {
            me.onLoadedGraph(state);
            return;
          }
        },
        (state: DBMonitoringLoadingErrorState) => {
          me.onLoadingErrorGraph(state);
        }
      );
      me.ioService.loadGraph(selectedDBName, selectedFileType).subscribe(
        (state: Store.State) => {
          if (state instanceof DBMonitoringLoadedState) {
            
          }
        }
        );
      }

      private onLoadingGraph(state: DBMonitoringLoadingState) {
        const me = this;
        // me.dataTable.data = null;
        me.graphError = null;
        me.graphEmpty = false;
        me.graphLoading = true;
      }
    
      private onLoadingErrorGraph(state: DBMonitoringLoadingErrorState) {
        const me = this;
        //me.dataTable.data = null;
        me.graphError = state.error;
        me.graphEmpty = false;
        me.graphLoading = false;
      }

    private onLoadedGraph(state: DBMonitoringLoadedState){
      const me = this;
      if (state.data && state.data['panelDataForIOStat']) {
        me.enableChart = false;
      //   if (state.data['arrStartAndEndTimeForTable'][1] && state.data['arrStartAndEndTimeForTable'][0] && state.data['arrStartAndEndTimeForTable'][1] != null && state.data['arrStartAndEndTimeForTable'][0] != null){
      //     me.timeRange = state.data['arrStartAndEndTimeForTable'][0] + ' to ' + state.data['arrStartAndEndTimeForTable'][1];
      // }
        let graphData = state.data['panelDataForIOStat'];
        let series = [];
        if (graphData['panelGraphArr'] && graphData['panelGraphArr'] != null) {
          graphData['panelGraphArr'].forEach(graph => {
            series.push(
              {
                name: graph['graphName'],
                color: graph['graphColor'],
                data: me.dbMonService.getTimedDataArray(graphData['arrTimestamp'], graph['graphData'])
              }
            );
          });
        }
        me.dataChart[0]['highchart']['series'] = series as Highcharts.SeriesOptionsType[];
        setTimeout(() => {
          this.enableChart = true;
        }, 100);
      }
      if (me.dataChart[0]['highchart']['series']) {
        me.graphEmpty = !me.dataChart[0]['highchart']['series'].length;
      }
      me.graphError = state.error;
      me.graphLoading = false;
    }

    ngOnDestroy() {
      const me = this;
      me.schedulerService.unsubscribe('load-iofilestats');
      if(me.dataSubsciption){
        me.dataSubsciption.unsubscribe();
        }
    }
}

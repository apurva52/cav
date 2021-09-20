import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState } from '../../db-monitoring.state';
import { DBMonitoringService } from '../../services/db-monitoring.services';
import { DBMonTable } from '../../services/dbmon-table.model';
import { DBMonCommonParam } from '../../services/request-payload.model';
import { CustomQueryService } from '../custom-query/custom-query.service';
import { ProcedureNameService } from './procedure-name.service';

@Component({
  selector: 'app-procedure-name',
  templateUrl: './procedure-name.component.html',
  styleUrls: ['./procedure-name.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProcedureNameComponent implements OnInit {

  items: MenuItem[];

  dataTable: DBMonTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  isShowColumnFilter: boolean = false;
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  dataSubsciption: Subscription;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  isDisabled = false;


  /* query related variables*/
  customQuery: string;
  enableDisbaleTextArea = false;
  selectedQuery: string;

  enableForward = false;
  enableRewind = false;
  lazy = false;
  lastEvent: any;

  isRewind: boolean = false;

  time: string;

  rewindOn: boolean = false;

  startDate: any;
  startTime: any;
  endTime: any;
  endDate: any;

  isPagination: boolean = false;

  isEnableFilter: boolean = false;
  title: string;
  querySize: any;
  queryData: any[];
  textInCustom: string = '';

  constructor(private procedureService: ProcedureNameService,
    private sessionSerivce: SessionService,
    private customQueryService: CustomQueryService ) { }
  ngOnInit(): void {

    const me = this;
    me.load();
  }

  load() {
    const me = this;
    const payload = {} as DBMonCommonParam;
    if (!me.sessionSerivce.isActive()) {
      return;
    }
    me.procedureService.load(payload).subscribe(
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
    me.updateProcedureDataView(state);

  }

  updateProcedureDataView(result) {
    this.title = 'Procedure Name';

    if (result != null) {
      if (result.data[0] != "NA") {
        this.selectedQuery = result.data[0];
        this.setListOfQuery(result.data);
      } else {
        this.selectedQuery = 'CustomQuery';
      }
    }

  }

  /* push queries in the array */
  setListOfQuery(data) {
    try {
      this.queryData = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i] != 'NA' && data[i] != '' && data[i] != undefined) {
          this.queryData.push(data[i]);
        }
      }

      if (this.queryData.length == 0) {
        this.enableDisbaleTextArea = false;
      }

    } catch (error) {
      //   this.log.errorLog('SqlProcedureNameComponent', 'setListOfQuery', 'exception', error);
    }
  }


  dataCorrespondingToQuery() {

    const me = this;
    const payload = {} as DBMonCommonParam;
    if (me.selectedQuery == 'CustomQuery') {
      me.customQueryService.load(payload, me.textInCustom);
    } else {
      me.customQueryService.load(payload, me.selectedQuery);
    }

  }
  ngOnDestroy() {
    const me = this;
    
  }
}


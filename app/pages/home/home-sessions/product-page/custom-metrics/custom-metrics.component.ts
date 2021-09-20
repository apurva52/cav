import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from './../../common/interfaces/metadata';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { CustomDataTable } from './service/custom-metrics.model';
import { CUSTOM_METRICS_DATA } from './service/custom-metrics.dummy';
import { CustomMetricsDataTableHeaderColumn } from './service/custom-metrics.model';
import { CustomMetricsService } from './service/custom-metrics.service';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import {
  CustomMetricsLoadedState, CustomMetricsLoadingErrorState, CustomMetricsLoadingState
} from './service/custom-metrics.state';
import { SessionStateService } from '../../session-state.service';

import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation'
import { Session } from '../../common/interfaces/session';

@Component({
  selector: 'app-custom-metrics',
  templateUrl: './custom-metrics.component.html',
  styleUrls: ['./custom-metrics.component.scss']
})
export class CustomMetricsComponent implements OnInit {
  breadcrumb: MenuItem[];


  data: CustomDataTable;
  error: AppError;
  loading: boolean = true;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: CustomMetricsDataTableHeaderColumn[] = [];
  _selectedColumns: CustomMetricsDataTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  //error: boolean;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  selectedSession: Session;
  selectedPage: any;
  filterCriteria: any;
  filterCriteriaList: any;
  metadata: Metadata;
  constructor(private router: Router, private stateService: SessionStateService, private customservice: CustomMetricsService, private metadataService: MetadataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const me = this;
    //me.pageservice.LoadSessionPageData();

    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: ' Color Management' },

    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.options = [
      { label: 'All' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];


    me.data = CUSTOM_METRICS_DATA;
    this.route.queryParams.subscribe(params => {
      //console.log("params in sessions details : ", params);
      //console.log(" -- ", this.selectedSession );

    });

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      me.reload();
    });

    me.reload();
  }

  reload() {
    const me = this;
    this.selectedSession = this.stateService.getSelectedSession();
    this.selectedPage = this.stateService.getSelectedSessionPage();
    me.customservice.LoadCustomMetricsData(this.selectedPage, this.selectedSession).subscribe(
      (state: Store.State) => {

        if (state instanceof CustomMetricsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof CustomMetricsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: CustomMetricsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

  }

  get selectedColumns(): CustomMetricsDataTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: CustomMetricsDataTableHeaderColumn[]) {
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

  private onLoading(state: CustomMetricsLoadingState) {
    const me = this;
    me.data.data = []; 
    me.loading = true;
    me.empty = false;
    me.error = null;
    //me.loading = true;
  }

  private onLoadingError(state: CustomMetricsLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    //me.error = true;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = true;
  }

  private onLoaded(state: CustomMetricsLoadedState) {
    const me = this;
    me.metadataService.getMetadata().subscribe(metadata => {
      me.metadata = metadata;
      me.data = CUSTOM_METRICS_DATA;
      if (state.data.data.length > 0) {
        me.data.data = state.data.data.map((temp, i) => {
          let pagename = me.metadata.getPageName(temp['pageid']);
          temp['pagename'] = pagename.name;
          return temp;
        }
        )
      }
      else {
        me.data.data = [];
      }

      //console.log("DATA", me.data.data)
      //me.data.data = state.data;
      me.empty = !me.data.data.length;
      //me.error = false;
      me.loading = false;
    })

  }

}


import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { USER_ACTION_TABLE } from './service/user-action.dummy';
import { UserActionTable, UserActionTableHeaderColumn } from './service/user-action.model';
import { UserActionService } from './service/user-action.service';
import { UserActionLoadedState, UserActionLoadingErrorState, UserActionLoadingState } from './service/user-action.state';
import { UserActionData } from './user-action-data';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation';
import { Session } from '../../common/interfaces/session';
import { SessionStateService } from '../../session-state.service';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserActionComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;

  data: UserActionTable;
  error: AppError;
  loading: boolean = true;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: UserActionTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: UserActionTableHeaderColumn[] = [];
  emptyTable: boolean;
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  analyticsOptions: MenuItem[];
  linkOptions: MenuItem[];
  selectedPage: any;
  selectedSession : Session;

  selectedCars2: string[] = [];
  multiOptions: SelectItem[];
  offset:number;
 
  constructor(private router: Router, private route: ActivatedRoute, private useractionservice:UserActionService,
    private stateService: SessionStateService) { }

  ngOnInit(): void {
    let me = this;
    me.data = USER_ACTION_TABLE;
    this.route.queryParams.subscribe(params => {
      console.log('user-action, params change - ', params);
    });

    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('user-action, page change - ', idx);

      me.reload();
    });

    me.reload();
  }

  reload() {
    const me = this;
    me.selectedSession = me.stateService.getSelectedSession();
    me.selectedPage = me.stateService.getSelectedSessionPage();

    me.useractionservice.LoadUserActionTableData(this.selectedPage,this.selectedSession).subscribe(
      (state: Store.State) => {

        if (state instanceof UserActionLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof UserActionLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: UserActionLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  @Input() get selectedColumns(): UserActionTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: UserActionTableHeaderColumn[]) {
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



  private onLoading(state: UserActionLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: UserActionLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = false;
  }
  private onLoaded(state: UserActionLoadedState) {
     const me = this;
     me.loading = false;
    //me.metadataService.getMetadata().subscribe(metadata => {
      me.data = USER_ACTION_TABLE;
      me.data.data = state.data.data.map(a => {
        let curroffset = 0.0;
        let timestamp = new Date(me.selectedPage.navigationStartTime).getTime();
        //let recordTime = new Date(moment.utc(a.timestamp + 1388534400000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf();
        let recordTime = new Date(moment.utc(a.timestamp + 1388534400000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD HH:mm:ss')).valueOf();
        curroffset = (recordTime - timestamp) / 1000;
        return new UserActionData(a, curroffset); 
      });
      this.totalRecords = me.data.data.length; 
       me.empty = !me.data.data.length;
  //});
 }



}








  /*constructor(
    private useractionservice:UserActionService,
    private metadataService: MetadataService
) { }

  ngOnInit(): void {
    const me = this;
    me.data = USER_ACTION_TABLE;
    this.route.queryParams.subscribe(params => {
      this.selectedPage = JSON.parse(params.selectedPage);
      me.customservice.LoadCustomMetricsData(this.selectedPage,this.selectedSession).subscribe(
      (state: Store.State) => {
   // me.useractionservice.LoadUserActionTableData();
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];

    me.multiOptions = [
      {label: 'Audi', value: 'Audi'},
      {label: 'BMW', value: 'BMW'},
      {label: 'Fiat', value: 'Fiat'},
      {label: 'Ford', value: 'Ford'},
  ],
  me.linkOptions = [
    { label: 'Sessions' ,routerLink: '/sessions-details' },
    { label: 'Play Session' ,routerLink: '/play-sessions' },
  ],
    me.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label: 'Revenue Analytics' ,routerLink: '/revenue-analytics' },
      { label: 'Ux Agent Setting' ,routerLink: '/ux-agent-setting' },
      { label: 'Custom Metrics' },
      { label: 'Path Analytics', routerLink: '/path-analytics' },
      { label: 'Form Analytics' },
      { label: 'Marketing Analytics',routerLink: '/marketing-analytics' }
    ]

    me.data = USER_ACTION_TABLE;
    this.route.queryParams.subscribe(params => {
      this.selectedPage = JSON.parse(params.selectedPage);
     me.useractionservice.LoadUserActionTableData(this.selectedPage).subscribe(
      (state: Store.State) => {

        if (state instanceof UserActionLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof UserActionLoadedState) {
          me.onLoaded(state);
          return;
        }
        //if (state instanceof PageListLoadingErrorState) {
         // me.onLoadingError(state);
         // return;
        //}
      },
      (state: UserActionLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
   

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }


  @Input() get selectedColumns(): UserActionTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: UserActionTableHeaderColumn[]) {
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

 private onLoading(state: UserActionLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: UserActionLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    //me.error = state.data["name"];
    //me.error.message = state.data["message"];
    //me.error = {'error' : "", "message" : 'ss'};
    me.loading = true;
  }

  private onLoaded(state: UserActionLoadedState) {
    const me = this;
    //me.metadataService.getMetadata().subscribe(metadata => {
      me.data = USER_ACTION_TABLE;
      me.data.data = state.data.data.map(a => {
         let curroffset = 0.0;
        let timestamp = new Date(me.selectedPage.navigationStartTime).getTime();
        let recordTime = new Date(moment.utc(a.timestamp + 1388534400000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf();
        curroffset = (recordTime - timestamp) / 1000;
        return new UserActionData(a,curroffset);
      });
      this.totalRecords = me.data.data.length;
  //});
 }
}*/

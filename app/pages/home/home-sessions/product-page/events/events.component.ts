import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError } from 'src/app/core/error/error.model';
import { EventsDataTable, EventsDataTableHeaderColumn } from './service/events-data.model';
import { EVENTS_DATA } from './service/events.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { EventService } from './service/events.service';
import { Store } from 'src/app/core/store/store';
import { EventLoadedState, EventLoadingErrorState, EventLoadingState } from './service/events-state';
import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation';
import { Session } from '../../common/interfaces/session';
import { SessionStateService } from '../../session-state.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  breadcrumb: MenuItem[];
  globalFilterFields: string[] = [];
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  isCheckbox: boolean;
  data: EventsDataTable;
  error: AppError;
  loading: boolean = true ;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  selectedPage: any;

  cols: EventsDataTableHeaderColumn[] = [];
  _selectedColumns: EventsDataTableHeaderColumn[] = [];
  selectedRow: any;
  tooltipzindex = 100000;
  selectedValues: string[] = [];
  selectedSession: Session;

  constructor(private router: Router, private route: ActivatedRoute, private eventservice: EventService, private stateService: SessionStateService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("params in events : ", params);
    });

    let me = this;
    me.data = EVENTS_DATA;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
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
    me.eventservice.LoadEventsData(this.selectedPage, this.selectedSession).subscribe(
      (state: Store.State) => {

        if (state instanceof EventLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof EventLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EventLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
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



  private onLoading(state: EventLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: EventLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = true;
  }
  private onLoaded(state: EventLoadedState) {
    const me = this;
    me.data = EVENTS_DATA;
    let counter = 0;
    me.data.data = state.data.data.map(temp => {
      temp['eventcounter'] = counter++;
      return temp;
    });
    me.totalRecords = me.data.data.length;
    me.empty = !me.data.data.length;
    me.error = null;
    me.loading = false;
  }
  pushToBag(data) {
    console.log(data);
  }

}

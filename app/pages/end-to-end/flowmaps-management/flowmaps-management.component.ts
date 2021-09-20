import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { FlowMapsData } from './service/flowmaps-management.model';
import { FlowmapsManagementService } from './service/flowmaps-management.service';
import {
  FlowMapsDataLoadedState,
  FlowMapsDataLoadingErrorState,
  FlowMapsDataLoadingState,
} from './service/flowmaps-management.state';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-flowmaps-management',
  templateUrl: './flowmaps-management.component.html',
  styleUrls: ['./flowmaps-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FlowmapsManagementComponent implements OnInit {
  sys_flowmap: SelectItem[];
  user_flowmap: SelectItem[];
  selected_sys_flowmap: any;
  selected_user_flowmap: any;
  flowMapData = [];

  data: FlowMapsData;
  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  selectedFlowMaps: any;
  selectedRow: any;
  breadcrumb: MenuItem[];
  totalRecords: any = 0;
  isAdmin: false;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  rowData: any;

  deleteRowData: any = [];

  endToEndURL = '/end-to-end';

  _selectedColumns: TableHeaderColumn[] = [];
  cols: TableHeaderColumn[] = [];
  downloadOptions: { label: string }[];

  constructor(
    private flowmapsService: FlowmapsManagementService,
    public timebarService: TimebarService,
    private router: Router,
    private sessionService : SessionService
  ) { }

  ngOnInit(): void {
    const me = this;
    me.load();

    this.breadcrumb = [{ label: 'System' }, { label: 'End To End Tier' }];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];

    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
      const viewBy = _.get(value, 'viewBy.selected.id', null);
      if (timePeriod) {
        me.endToEndURL += '/detailed/' + timePeriod + '/' + viewBy;
      }
    });
  }

  load() {
    const me = this;
    const qParam = {
      flowMapDir: ".flowmaps",
      dc: "",
      user: me.sessionService.session.cctx.u,
    };
    me.flowmapsService.load(qParam).subscribe(
      (state: Store.State) => {
        if (state instanceof FlowMapsDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof FlowMapsDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: FlowMapsDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: FlowMapsDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: FlowMapsDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: FlowMapsDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;

    if (me.data) {
      me.selected_sys_flowmap = me.data.systemDefaultFM;
      me.selected_user_flowmap = me.data.defaultFM;
      me.data.flowmapOptions.unshift({label : "default", value : "default"});
      me.empty = false;
      if (!me.data.flowmapData.data && me.data.flowmapData.data == null) {
        me.emptyTable = true;
      }
      me.cols = me.data.flowmapData.headers[0].cols;
      for (const c of me.data.flowmapData.headers[0].cols) {
        if (c.selected) {
          me._selectedColumns.push(c);
        }
      }
    } else {
      me.empty = true;
    }
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  saveChanges() {
    const me = this;
    try {
      let shared = [];
      me.data.flowmapData.data.forEach((e) => {
        if (e.shared && e.owner)
          shared.push(e.name);
      });
      // alert(me.selected_sys_flowmap + " | " + me.selected_user_flowmap + " | " + shared.toString());

      const qParam = {
        flowMapDir: ".flowmaps",
        dc: "",
        user: me.sessionService.session.cctx.u,
        defaultFM: me.selected_user_flowmap,
        sharedFlowmap: shared.toString(),
      };
      if(me.isAdmin){
        qParam['systemDefaultFM'] =  me.selected_sys_flowmap;
      }
      me.flowmapsService.save(qParam).subscribe(
        (state: boolean) => {
          if(state){
            // alert("Changes Saved Successfully")
          }
          else{
            console.error("Error in saving flowmap changes");
          }            
        },
        (err) => {
          console.error(err);
        }
      );
    }
  catch(error) {
    console.error("************** Error in saveChanges **************", error);
  }
  this.router.navigate([this.endToEndURL]);
}

deleteFlowmap() {
  const me = this;
  try {
    if (me.deleteRowData.length < 1) {
      return;
    }

    // alert(me.deleteRowData.toString());
    const qParam = {
      flowMapDir: ".flowmaps",
      dc: "",
      user: me.sessionService.session.cctx.u,
      deleteFlowmap : me.deleteRowData.toString()
    };
    me.flowmapsService.delete(qParam).subscribe(
      (state: boolean) => {
        if(state){
          // alert("Flowmap Deleted Successfully")
        }
        else{
          console.error("Error in deleting fl");
        }            
      },
      (err) => {
        console.error(err);
      }
    );
  }
  catch (error) {
    console.error("************** Error in deleteFlowmap **************", error);
  }
  this.router.navigate([this.endToEndURL]);
}

onRowSelect(event) {
  const me = this;
  me.deleteRowData.push(event.data);
}

onRowUnselect(event) {
  const me = this;
  me.deleteRowData.splice(me.deleteRowData.indexOf(event.data), 1);
}

onChangeSharedFlowmap(event, row) {
  this.rowData = row;
}
}

import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng';
import { Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { EteTimeFilterComponent } from 'src/app/shared/ete-time-filter/ete-time-filter.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { EndToEnd, Duration } from './service/end-to-end.model';
import { EndToEndService } from './service/end-to-end.service';
import {
  EndToEndDataLoadedState,
  EndToEndDataLoadingErrorState,
  EndToEndDataLoadingState,
} from './service/end-to-end.state';

@Component({
  selector: 'app-end-to-end',
  templateUrl: './end-to-end.component.html',
  styleUrls: ['./end-to-end.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EndToEndComponent implements OnInit, AfterViewInit {
  data: EndToEnd;
  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[];
  _selectedColumns: TableHeaderColumn[]; //p-multiselect

  rowData: any;
  selectedNode: any;
  showLegends: boolean = false;
  items: MenuItem[];
  showNewGroup = false;
  breadcrumb: MenuItem[];

  selectedNodes: any;
  filteredNodes: any[];

  isShowSearch: boolean = false;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  endToEndTimeFilterChangeSubscription: Subscription;
  private timeperiod: string = null;

  endToEndGraphicalURL = '/end-to-end/graphical-tier';

  constructor(
    private endtoendService: EndToEndService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  openNewGroup() {
    this.showNewGroup = true;
  }
  ngOnInit(): void {
    const me = this;
    this.items = [{ label: 'Save' }, { label: 'Save As' }];

    me.breadcrumb = [{ label: 'System' }, { label: 'End To End Tier' }];

    // me.route.params.subscribe((params) => {
    //   if (params && params.tp && me.timeperiod != params.tp) {
    //     me.endToEndGraphicalURL +=
    //       '/graphical-tier/' + params.tp + '/' + params.vb;
    //     me.load(params.tp);
    //   }
    // });

    EteTimeFilterComponent.getInstance().subscribe(
      (endToEndTimeFilterComponent: EteTimeFilterComponent) => {
        if (me.endToEndTimeFilterChangeSubscription) {
          me.endToEndTimeFilterChangeSubscription.unsubscribe();
        }

        me.endToEndTimeFilterChangeSubscription = endToEndTimeFilterComponent.onChange.subscribe(
          (data) => {
            // TO-DO : Time Period state management
            me.endtoendService.setDuration(me.endtoendService.createDuration(data.temporaryTimeFrame[1],data.temporaryTimeFrame[2],data.timePeriod.selected.id,+data.viewBy.selected.id));
            me.load(me.endtoendService.getDuration());
          }
        );
      }
    );
  }

  ngAfterViewInit(): void {}

  filterNodes(event) {
    let filtered: any[] = [];
    let query = event.query;
    // for(let i = 0; i < this.data.options.nodesGroup.length; i++) {
    //     let nodesall = this.data.options.nodesGroup[i];
    //     if (nodesall.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
    //         filtered.push(nodesall);
    //     }
    // }

    this.filteredNodes = filtered;
  }

  load(duration: Duration) {
    const me = this;
    me.timeperiod = duration.preset;
    me.endtoendService.load(duration).subscribe(
      (state: Store.State) => {
        if (state instanceof EndToEndDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof EndToEndDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EndToEndDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: EndToEndDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: EndToEndDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: EndToEndDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.empty = false;

    if (me.data) {
      //me.data.treeTable.data == null;
      me.empty = false;
      if (
        !me.data.endToEndTableView.data &&
        me.data.endToEndTableView.data == null
      ) {
        me.emptyTable = true;
      }
    } else {
      me.empty = true;
    }

    me.cols = me.data.endToEndTableView.headers[0].cols;
    me._selectedColumns = me.cols;
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  rowExpand: any;
  expandNode($event) {
    console.log('data', $event);
    const me = this;
    me.rowExpand = $event.node.expanded;
  }

  paginate(event) {
    // alert("test"+JSON.stringify(event));
    console.log('Index of the first record::' + event.first);
    console.log('Number of rows to display in new page::' + event.rows);
    console.log('Index of the new page::' + event.page);
    console.log('Total number of pages::' + event.pageCount);
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
}

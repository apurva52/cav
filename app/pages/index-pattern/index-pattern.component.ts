import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { INDEX_PATTERN_TABLE } from './service/index-pattern.dummy';
import { IndexPatternHeaderCols, IndexPatternTable,  User } from './service/index-pattern.model';
import { Store } from 'src/app/core/store/store';
import { IndexPatternLoadingState, IndexPatternLoadingErrorState, IndexPatternLoadedState } from './service/index-pattern.state';
// import { IndexPatternLoadedState } from 'src/app/shared/widget-setting/service/dashboard-widget-service/select-item.state';
import { FilterUtils } from 'primeng/utils';
import { IndexPatternService } from './service/index-pattern.service';

@Component({
  selector: 'app-index-pattern',
  templateUrl: './index-pattern.component.html',
  styleUrls: ['./index-pattern.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class IndexPatternComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
 
  users: User[];
 
  selectedUser: User;
  allUser: MenuItem[];
  
  allSelectedUser: MenuItem;
  groupBy: MenuItem[];
  selectedGroupBy: MenuItem;

  data: IndexPatternTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: IndexPatternHeaderCols[] = [];
  _selectedColumns: IndexPatternHeaderCols[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  flowPathData = [];
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;
  allNumber: MenuItem[];
  allFormat: MenuItem[];
 
  groupData =[];
    
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  
  menuItems: MenuItem[];

  tabs: MenuItem[];
  activeIndex: number;
  isOn: number;
  activetab : number = 1;
  showTabs;
  showTabs1;
  value17: number = 50;

  constructor( private indexPatternService: IndexPatternService,) {}

  ngOnInit(): void {

    const me = this;
    me.load();

    me.showTabs = {
      "one": true,
      "two": true,
    };
    me.showTabs1 = {
      "one": true,
      "two": true,
      "three": true
    };
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: 'Index Pattern' },
      { label: 'Field' },
    ];

    // me.data = INDEX_PATTERN_TABLE;

    // me.cols = me.data.headers[0].cols;
    // for (const c of me.data.headers[0].cols) {
    //   if (c.selected) {
    //     me._selectedColumns.push(c);
    //   }
    // }
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
    me.indexPatternService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof IndexPatternLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof IndexPatternLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: IndexPatternLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: IndexPatternLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: IndexPatternLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: IndexPatternLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    if (me.data) {
      me.empty = false;
      if(!me.data.data && me.data.data == null){
        me.emptyTable = true;
      }
      let check = {}
      me.loadPagination(check);
      this.totalRecords = this.data.data.length;
    } else {
      me.empty = true;
    }
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me.cols.push(c);
      }
    }
    // me.cols = me.data.headers[0].cols;
    me._selectedColumns = me.cols;
  }

  loadPagination(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
        if (this.data.data) {
            this.groupData = this.data.data.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
}

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }
  

  @Input() get selectedColumns(): IndexPatternHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: IndexPatternHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }


}

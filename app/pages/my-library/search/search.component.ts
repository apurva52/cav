import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppError } from 'src/app/core/error/error.model';
import { SEARCH_TABLE } from './service/search.dummy';
import { SearchTable, SearchHeaderCols } from './service/search.model';
import { MenuItem, MessageService } from 'primeng';
import { SavedSearchLoadedState, SavedSearchLoadingErrorState, SavedSearchLoadingState } from './service/search.state';
import { Store } from 'src/app/core/store/store';
import { SearchService } from './service/search.service';
import { QueryParams } from '../../tools/actions/dumps/service/common.services';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  data: SearchTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;

  cols: SearchHeaderCols[] = [];
  _selectedColumns: SearchHeaderCols[] = [];
  globalFilterFields: string[] = [];
  
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  userPermission: any;
  constructor(
    private router : Router,
    private messageService: MessageService,
    private savedSerchService: SearchService,
    public sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const me = this;

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.downloadOptions = [
      {
        label: 'Word',
      },
      {
        label: 'Excel',
      },
      {
        label: 'PDF',
      },
    ];
    const perArray = this.sessionService.session.permissions;
    const nfPermission = perArray.filter((arr) => arr.key === 'NetforestUI');
    const permissionArr = nfPermission[0].permissions.filter((nfPer) => nfPer.feature === 'Searches');
    this.userPermission = permissionArr[0].permission;
    console.log('User permission is ::', this.userPermission);
    me.data = SEARCH_TABLE;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
   me.getSavedData();
  }

  getSavedData() {
    this.savedSerchService.getSavedSearch().subscribe(
      (state: Store.State) => {
        if (state instanceof SavedSearchLoadingState) {
          this.onLoading(state);
          return;
        }

        if (state instanceof SavedSearchLoadedState) {
          this.onLoaded(state);
          return;
        }
      },
      (state: SavedSearchLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );
  }
  onLoading(state: SavedSearchLoadingState) {
    const me = this;
    me.data.data = null
  }

  onLoadingError(state: SavedSearchLoadingErrorState) {
    const me = this;
    me.data.data = null
  }

  onLoaded(state: SavedSearchLoadedState) {
    const me = this;
    me.data.data = state.data;
  }

  editSearch(data){
    console.log(data.sourceData)
    if (this.userPermission < 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Error:-',
        detail: 'You do not have Read Permission.',
      });
      return;
    }
    this.router.navigate(['/home/logs'],{queryParams:{query:data.sourceData.query,gte:data.sourceData.time.from,lte:data.sourceData.time.to,title:data.name}});
  }

  deleteSearch(data){
    this.savedSerchService.deleteSavedSearch(data).subscribe(
      (state: Store.State) => {
        if (state instanceof SavedSearchLoadingState) {
          this.onLoading(state);
          return;
        }

        if (state instanceof SavedSearchLoadedState) {
          // this.onLoaded(state);
          console.log('==========delete search');
          this.messageService.add({
            severity: 'success',
            summary: 'Search Delete Successfully.',
            detail: 'Delete Search',
          });
          this.getSavedData()
          return;
        }
      },
      (state: SavedSearchLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );
  }
 
  @Input() get selectedColumns(): SearchHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: SearchHeaderCols[]) {
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
}

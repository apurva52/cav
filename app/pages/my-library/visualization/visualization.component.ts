import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SaveDialogComponent } from 'src/app/shared/save-dialog/save-dialog.component';
import { VISUALIZATION_TABLE } from './service/visualization.dummy';
import { VisualizationTable } from './service/visualization.model';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { VisualizationService } from '../../create-visualization/service/visualization.service';
import { Store } from 'src/app/core/store/store';
import { visualLoadedState, visualLoadingErrorState, visualLoadingState } from '../../create-visualization/service/visualization-state';
import { SearchService } from '../search/service/search.service';
import { SavedSearchLoadedState, SavedSearchLoadingErrorState, SavedSearchLoadingState } from '../search/service/search.state';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisualizationComponent implements OnInit {

  data: VisualizationTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  isShow: boolean = false;
  settingOptions: MenuItem[];
  orderList = [];
  filteredReports: any[];
  saveReports : boolean = false;
  reportitem: any[];
  userPermission: any;
  @ViewChild('saveSearchData', { read: SaveDialogComponent })
  private saveSearchData: SaveDialogComponent;

  constructor(private router : Router, public breadcrumb: BreadcrumbService,private vs:VisualizationService,private messageService: MessageService,
    private savedSerchService: SearchService,public sessionService: SessionService) { }

  ngOnInit(): void {
    const me = this;
  //  me.breadcrumb = [
  //     { label: 'Home', routerLink: '/home/dashboard' },
  //     { label: 'My Library' },
  //     { label: 'Visualization' },
  //   ];
  this.breadcrumb.removeAll()
  this.breadcrumb.addNewBreadcrumb({ label: 'Saved Visualization', routerLink: ['/visualization'] });
    me.settingOptions = [
      { label: 'Alerts' },
      { label: 'Dashboard' },
      { label: 'Tier Status' },
    ];
  me.data = VISUALIZATION_TABLE;
    const perArray = this.sessionService.session.permissions;
    const nfPermission = perArray.filter((arr) => arr.key === 'NetforestUI');
    const permissionArr = nfPermission[0].permissions.filter((nfPer) => nfPer.feature === 'Visualizations');
    this.userPermission = permissionArr[0].permission;
    console.log('User permission is ::', this.userPermission);
  me.getVisData();
}

onLoadingError(state: visualLoadingErrorState) {
  const me = this;
  me.data.storeTier = []
}
onLoaded(state: visualLoadedState) {
  const me = this;
  me.data.storeTier = state.data;
  console.log(state.data)
}
onLoading(state: visualLoadingState) {
  const me = this;
  me.data.storeTier = []
}

getVisData(){
  this.vs.getVisualization().subscribe(
    (state: Store.State) => {
      if (state instanceof visualLoadingState) {
        this.onLoading(state);
        return;
      }

      if (state instanceof visualLoadedState) {
        this.onLoaded(state);
        return;
      }
    },
    (state: visualLoadingErrorState) => {
      this.onLoadingError(state);
    }
  );
}

  saveReport(){
    const me = this;
    me.saveReports = true;
  }

  closeReport(){
    const me = this;
    me.saveReports = false;
  }
  showReport(){
    this.isShow = true;
  }
  filterFields(event) {
       
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.data.autocompleteData.length; i++) {
        let reportitem = this.data.autocompleteData[i];
        if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(reportitem);
        }
    }
    
    this.filteredReports = filtered;
}

editSearch(rowData){
  console.log(rowData.sourceData)
  if (this.userPermission < 4) {
    this.messageService.add({
      severity: 'error',
      summary: 'Permission Error:-',
      detail: 'You do not have Read Permission.',
    });
    return;
  }
  this.vs.fieldDataCarrier.next({buck:rowData.sourceData.bucketAgg,met:rowData.sourceData.metricAgg})
  this.router.navigate(['/create-visualization'],{queryParams:{query:rowData.sourceData.query,gte:rowData.sourceData.time.from,lte:rowData.sourceData.time.to,title:rowData.sourceData.title,chartType:rowData.sourceData.chartType}});
}


  toCreateVisualization(){
    this.router.navigate(['/create-visualization-sub']);
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
          this.getVisData();
          return;
        }
      },
      (state: SavedSearchLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );
    }
}

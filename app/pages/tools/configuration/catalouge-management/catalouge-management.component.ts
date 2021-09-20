import { Component, ChangeDetectorRef,EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { LowerPanelService } from 'src/app/shared/lower-tabular-panel/service/lower-tabular-panel.service';
import { onDownloadLoadedState, onDownloadLoadingErrorState, onDownloadLoadingState } from 'src/app/shared/lower-tabular-panel/service/lower-tabular-panel.state';
import { CatalogueTableData, SaveCatalogue } from 'src/app/shared/pattern-matching/catalogue-management/service/catalogue-management.model';
import { CatalogueManagementService } from 'src/app/shared/pattern-matching/catalogue-management/service/catalogue-management.service';
import { PatternMatchingService } from 'src/app/shared/pattern-matching/service/pattern-matching.service';
import { deleteCatalogueCreatedState, deleteCatalogueCreatingErrorState, deleteCatalogueCreatingState, getCatalogueCreatedState, getCatalogueCreatingErrorState, getCatalogueCreatingState } from 'src/app/shared/pattern-matching/service/pattern-matching.state';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { CATALOUGE_MANAGEMENT_TABLE } from './service/catalouge-management-table.dummy';

@Component({
  selector: 'app-catalouge-management1',
  templateUrl: './catalouge-management.component.html',
  styleUrls: ['./catalouge-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalougeManagementComponent implements OnInit {

  breadcrumb: MenuItem[] = [];
  activeTab: MenuItem;

  data: Table;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  enableMangeCatalogue:boolean=false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  catalogueResponse: any;
  datatable: any;
  cataloguedata:CatalogueTableData[] =[];
  catDescription: string;
  catalogueName: string;
  deleteCatalogueManage: boolean =false;
  dataDeleteres: any;
  duration:any;
  dashboard:DashboardComponent;
  globalCatFlag :boolean =false;
  constructor(private lowerpanelService: LowerPanelService,private catalogueManagementService :CatalogueManagementService,public timebarService: TimebarService,public sessionService: SessionService,public patternMatchingService: PatternMatchingService,public confirmation: ConfirmationService,private messageService: MessageService,private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const me = this;
    const cctx = this.sessionService.session.cctx;
    me.catalogueManagementService.setGlobalCatFlag(true);
    me.catalogueManagementService.isDashboard().subscribe(value => {
      // console.log("value----", value);
      me.dashboard =value;
      console.log("from new compo",me.dashboard);
    })
    const payload = {
      "opType": "get",
      "cctx":cctx,
    }
    me.getCatalogueInfo(payload);
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]
    
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Catalogue Management' },
    ]
   

    me.data = CATALOUGE_MANAGEMENT_TABLE;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

  }
  getCatalogueInfo(payload){
    let me =this;
    me.patternMatchingService.getCatalogue(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof getCatalogueCreatingState) {
          me.getCatalogueonLoading(state);
          return;
        }
  
        if (state instanceof getCatalogueCreatedState) {
          me.getCatalogueonLoaded(state);
        }
      },
      (state: getCatalogueCreatingErrorState) => {
        me.getCatalogueonLoadingError(state);
      }
    );
  }

  getCatalogueonLoadingError(state: getCatalogueCreatingErrorState) {
    const me = this;
    me.catalogueResponse = null;
    me.error = state.error;
    me.loading = false;
  }
  getCatalogueonLoading(state: getCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  getCatalogueonLoaded(state: getCatalogueCreatedState) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.catalogueResponse =state.data;
    me.datatable = CATALOUGE_MANAGEMENT_TABLE;
    me.datatable.data[0].data = me.catalogueResponse.data;
    me.cataloguedata =me.catalogueResponse.data;
    // me.catDescription='';
    // me.catalogueName='';
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

  deleteManageCatalogue(index,row){
    let me =this;
    me.deleteCatalogueManage = true;
    console.log("row",row);
    if(row.createdBy===this.sessionService.session.cctx.u){
    this.confirmation.confirm({
      key: 'deleteManageCat',
      header: 'Delete Catalogue',
      message: 'Are you sure to delete Catalogue ' + row.name + '?',
      accept: () => { this.deleteCataloguebyName(index,row); me.test1(); },
      reject: () => { return;
      }
    });
  }
  else{
    this.confirmation.confirm({
      key: 'deleteManageCat',
      header: 'Delete Catalogue',
      message: 'Catalogue created by other User can not be deleted',
      accept: () => { return; },
      rejectVisible: false
    });
  }
}
test1(){
  let me =this;
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Catalogue deleted successfully' });
  //me.cd.detectChanges();
}
  deleteCataloguebyName(index,row){
    let me =this;
    let creationDate:string;
    const cctx = this.sessionService.session.cctx;
   creationDate =new Date().toLocaleString();
    let payload: SaveCatalogue={
      'opType':"delete",
      'cctx':cctx,
      'targetData': row.targetData,
      'name':row.name,
      'description':"",
      'createdBy':row.createdBy,
      "creationDate":row.creationDate,
      "metricType":"Normal",
      "chartType":"0",
	    "seriesType":"",
	   "arrPercentileOrSlabValues":[] 
    }
    me.patternMatchingService.deleteCatalogue(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof deleteCatalogueCreatingState) {
          me.deleteOnLoading(state);
          return;
        }
  
        if (state instanceof deleteCatalogueCreatedState) {
          me.deleteOnLoaded(state,index);
          //return;
        }
      },
      (state: deleteCatalogueCreatingErrorState) => {
        me.deleteOnLoadingError(state);
      }
    );
  }
  deleteOnLoading(state: deleteCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  deleteOnLoadingError(state: deleteCatalogueCreatingErrorState) {
    const me = this;
    me.error = null;
    me.dataDeleteres = null;
    me.loading = true;
  }
  deleteOnLoaded(state: deleteCatalogueCreatedState,index) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.dataDeleteres =state.data;
    if(me.dataDeleteres.status.code === 203){
     // me.cataloguedata =[];
    }
    const cctx = this.sessionService.session.cctx;
    me.enableMangeCatalogue=false;
    const payload = {
      "opType": "get",
      "cctx":cctx,
    }
    me.getCatalogueInfo(payload);
    me.cataloguedata.splice(index,1);
    me.cd.detectChanges();
  }
getRefreshCatalogueList(){
  let me =this;
  const cctx = this.sessionService.session.cctx;
  const payload = {
    "opType": "get",
    "cctx":cctx,
  }
  me.getCatalogueInfo(payload);
}
downloadTableData(type) {
  const me = this;
  let header = [];
  let skipColumn = ['Action'];
  for (const c of me.cols) {
    if (c.label != 'Action' )
      header.push(c.label);
    if (!me.selectedColumns.includes(c)) {
      skipColumn.push(c.label);
    }
  }

  let data :any[]=[];
  for(let i=0;i<me.cataloguedata.length;i++){
    let obj ={
      serial:i+1,
      name:me.cataloguedata[i].name,
      metricType:me.cataloguedata[i].metricType,
      description:me.cataloguedata[i].description,
      createdBy:me.cataloguedata[i].createdBy,
      creationDate:me.cataloguedata[i].creationDate,
      
    }
    data.push(obj);
  }
  me.catalogueManagementService.downloadCatalogueTableData(type, data, header, skipColumn).subscribe(
    (state: Store.State) => {
      if (state instanceof onDownloadLoadingState) {
        me.downloadTableDataLoading(state);
        return;
      }
      if (state instanceof onDownloadLoadedState) {
        me.downloadTableDataLoaded(state);
        return;
      }
    },
    (state: onDownloadLoadingErrorState) => {
      me.downloadTableDataLoadingError(state);
    }

  );
}

downloadTableDataLoading(state) { }
downloadTableDataLoaded(state) {
  let path = state.data.path.trim();
  let url = window.location.protocol + '//' + window.location.host;
  path = url + "/common/" + path;
  window.open(path + "#page=1&zoom=85", "_blank");
}
downloadTableDataLoadingError(state) { }

}

import { ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { headerFormatPipe } from 'src/app/pages/tools/admin/retention-policy-V1/components/retention-policy-main/headerFormatPipe';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { HierarchialDataLoadedState, HierarchialDataLoadingErrorState, HierarchialDataLoadingState } from '../../../service/alert.state';
import { AlertMaintenanceService } from '../../service/alert-maintenance.service';
import { INDICES_TABLE_DATA } from './service/selected-indices.dummy';
import { IndicesTable } from './service/selected-indices.model';

@Component({
  selector: 'app-selected-indices',
  templateUrl: './selected-indices.component.html',
  styleUrls: ['./selected-indices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectedIndicesComponent extends PageDialogComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: IndicesTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  tagList = []; 
  duration ;
  levels = [];
  status: any;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  visible : boolean;
  

 
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private _alertMaintenanceService: AlertMaintenanceService,
    private messageService: MessageService,
    private ref: ChangeDetectorRef
  ) {super(); }

  ngOnInit(): void {
    const me = this;
  
   

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

    me.data = INDICES_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
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

  showDialog() {
    super.show();
  }
  open(tags: any, duration: any[], status: any){
    const me = this;
    if(tags.length < 1){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select indices.'});
      return;
    }
    me.tagList = [];
    me.duration = [];
    for(let i = 0; i < tags.length ; i++){
      me.tagList.push(tags[i]);
    }
    me.status = status;
    me.duration = duration;
    const payload = me.makePayloadForGettingHierarchy(me.tagList,me.duration, status);
    this.getIndicesList(payload);
    this.visible = true;
  }

  getIndicesList(payload) {
    const me = this;
    this._alertMaintenanceService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof HierarchialDataLoadingState) {
          me.onIndLoading(state);
          return;
        }

        if (state instanceof HierarchialDataLoadedState) {
          me.onIndLoaded(state);
          return;
        }
      },
      (state: HierarchialDataLoadingErrorState) => {
        me.onIndLoadingError(state);
      }
    );


  }

  onIndLoadingError(state: HierarchialDataLoadingErrorState) {
    throw new Error('Method not implemented.');
  }
  onIndLoaded(state: HierarchialDataLoadedState) {

    const me = this;
    //console.log("state.data == ", state.data);
    console.log("state.data == ", me.data);
    me.makeTestData(state.data);
   }
  onIndLoading(state: HierarchialDataLoadingState) {
    throw new Error('Method not implemented.');
  }

  makePayloadForGettingHierarchy(tags: any , duration: any, status: any){
    if(status.code == 1008){
      const payLoad =
      {
        "opType": "9",
        "tr": this.sessionService.testRun.id,
        "cctx": this.sessionService.session.cctx,
        "duration": duration,
        "clientId": "Default",
        "appId": "Default",
        "levels": 0,
        "subject": {
          "tags": tags
        }
      }
      return payLoad;
    }
    else{
    const payLoad =
    {
      "opType": "9",
      "tr": this.sessionService.testRun.id,
      "cctx": this.sessionService.session.cctx,
      "duration": duration,
      "clientId": "Default",
      "appId": "Default",
      "levels": -1,
      "subject": {
        "tags": tags
      }
    }
    return payLoad;
  }
   
  }

  makeTestData(resData){
    const me = this;
    let heirarchy = resData.hierarchy;
    let isVectorList = false;
    this.data = {};
    let tempHierarchy = [];
    if (heirarchy && heirarchy.length > 0) {

      let paginator = {
        first: 0,
        rows: 10,
        rowsPerPageOptions: [10, 20, 40, 80, 100],
      }
      for(let i = 0 ; i < heirarchy.length ; i++){
        if(heirarchy[i].subjects.length == 0 && heirarchy[i].vectorList.length > 0){
          isVectorList = true;
          heirarchy[i].vector = heirarchy[i].metadata;
          console.log("newhierar == ",heirarchy);
          for(let j = 0 ; j < heirarchy[i].vectorList.length ; j++){
            heirarchy[i].subjects.push({
                    "metadata": heirarchy[i].vectorList[j],
                    "vectorList": [],
                    "vector": heirarchy[i].vectorList[j],
                    "subjects": []
            });
          }
        }
      }
      if(isVectorList){
        for(let i = 0 ; i < heirarchy.length ; i++){
        for(let j = 0 ; j < heirarchy[i].subjects.length ; j++){
          tempHierarchy.push(heirarchy[i].subjects[j]);
        }
        }
        heirarchy = null ;
        heirarchy = tempHierarchy;
        isVectorList = false;
      }

      if(me.status.code != 1008){
        let tagListNew = [];
        for(let i = 0 ; i < me.tagList.length ; i++){
          tagListNew.push({
            "metadata": me.tagList[i].key,
            "vectorList": [],
            "vector": me.tagList[i].value,
            "subjects": heirarchy
          });
        }
        for(let j = tagListNew.length-1 ; j > 0 ; j--){
          tagListNew[j-1].subjects = [];
          tagListNew[j-1].subjects.push(tagListNew[j]);
        }
        heirarchy = []
        heirarchy.push(tagListNew[0]);
        
        // for (let i = this.tagList.length -1; i >= 0; i--)
        //   {
        //   let tempHeirarchy: any[] = [];
        //   tempHeirarchy.push({
        //   "metadata": me.tagList[i].key,
        //   "vectorList": [],
        //   "vector": me.tagList[i].value,
        //   "subjects": heirarchy
        //   });
        //   heirarchy = tempHeirarchy;
        //   }
      }

      let headers = me.makeHeader(heirarchy);
     
      let data = me.getTreeTableData(heirarchy);
      
      let k = {};

      me.data.paginator = { ...paginator };
      me.data.headers = [...headers];
      me.data.data = [...data];
      me.data = { ...me.data };
    
      me.ref.detectChanges();

    }

  }
  getTreeTableData(res: any) {
    let finalOp = [];
    for (let index = 0; index < res.length; index++) {
      let obj1 = {};
      let data = {};
      let children = [];

      let op1 = res[index];
      data[op1.metadata] = op1.vector;
      obj1['data'] = data;
      if (op1['subjects'] && op1['subjects'].length > 0) {
        this.recu(op1['subjects'], children);
        obj1['children'] = children;
        finalOp.push(obj1);
      }
      else{
        obj1['children'] = children;
        finalOp.push(obj1);
      }
    }

    return finalOp;

  }

  recu(subject: [], children) {
    
    for (let index = 0; index < subject.length; index++) {
      let element = subject[index];
      let data = {};
      let obj = {};
      data[element['metadata']] = element['vector'];
      obj['data'] = data;

      if (element['subjects']) {
        let children1 = [];
        this.recu(element['subjects'], children1);
        obj['children'] = children1;
      }
      children.push(obj);
    }
  }


  makeHeader(heirarchy){
    try {
      let header = [];
      let headerJson = {};
      let colArr = [];
     
        if (heirarchy && heirarchy !== "") {
          let level = 0;
          this.getDepthOfHierarchy(heirarchy, level);
         

          for(let i = 0 ;i < this.levels.length ; i++){
              let json = {};
              json['label'] = "Level "+(i+1);
              json['valueField'] = "level"+i;
              json['classes'] = 'text-left';
              json['isSort'] = false;
              let filterJson = {};
              filterJson['isFilter'] = false;
              filterJson['type'] = 'contains';
              json['filter'] = filterJson;
              colArr.push(json);
            }
          }

            headerJson['cols'] = colArr;
            header.push(headerJson);
           return header;
    } catch (error) {
      return [];
    }
  }
  getDepthOfHierarchy(heirarchy, level) {
    const me = this;
  if(this.levels.length > 1){
    if(this.levels[this.levels.length-1] != level){
        this.levels.push(level);
    }
  }else{
    this.levels.push(level);
  }
    for(let i = 0 ; i < heirarchy.length ; i++){
      heirarchy[i].metadata = "level"+level;
    }
    this.getNextHierarchy(heirarchy, level+1);
  }
  getNextHierarchy(heirarchy: any , level) {
    const me = this;
    for(let i = 0 ; i < heirarchy.length ; i++){
      if(heirarchy[i].subjects.length > 0){
        this.getDepthOfHierarchy(heirarchy[i].subjects, level);
      }
    }
  }
  closeDialog(){
    this.visible = false;
    this.levels = [];
    this.data = null;

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
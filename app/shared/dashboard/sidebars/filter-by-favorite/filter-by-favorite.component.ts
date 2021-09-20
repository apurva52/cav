import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DashboardComponent } from '../../dashboard.component';
import { PARAMETERS_DATA } from './service/filter-by-favorite.dummy';
import { ParameterService } from './service/filter-by-favorite.service';
import { Store } from 'src/app/core/store/store';
import { HierarchialDataLoadingState, HierarchialDataLoadingErrorState, HierarchialDataLoadedState } from './service/filter-by-favorite.state';
import { DashboardTime } from '../../service/dashboard.model';
import * as _ from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { ParametersData } from './service/filter-by-favorite.model';
import { FILTER_DATA } from './service/filter-by-favorite.dummy';
import { FilterData } from './service/filter-by-favorite.model';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'app-filter-by-favorite',
  templateUrl: './filter-by-favorite.component.html',
  styleUrls: ['./filter-by-favorite.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class FilterByFavoriteComponent
  extends PageSidebarComponent
  implements OnInit {
  @Input() dashboard: DashboardComponent;
  classes = 'page-sidebar parameters-manager';
  visible: boolean;
  selectedRow = [];
  data : ParametersData["data"];
  error: boolean;
  empty: boolean;
  selecteditem: any[] = [];
  loading: boolean;
  tierList: MenuItem[];
  serverList: MenuItem[];
  metaData: string = "";
  totalData = [];
  vList = [];
  selectedTierServer: string = "";
  dropDownIndex: number = 0;
  tagList = [];
  onFirstTimeLoad: boolean = false;
  appliedActions = [];
  selectedVector: string = "";
  selectedTier: string;
  selectedServer: string;
  selectedInstance: string;
  toEnterPattern: boolean = false;
  metaDataNameFromHierarchy: string;
  pattern: string = "";
  groupName: string = "";
  totalHierarchyList: any[];
  dataHierarchial: any;
  metadataName: any;
  layout: DashboardLayoutComponent;
  tagListData : any =[];
  constructor(private parameterService: ParameterService, private sessionService: SessionService, private cdRef: ChangeDetectorRef, private dashboardService : DashboardService) {
    super();
  }

  show() {
    super.show();
    this.setInitialValues();
  }

  ngOnInit(): void {
    const me = this;
    // me.data = PARAMETERS_DATA;
    me.data = [];
    me.tagList = [];
  }

  getDuration() {
    try {

      const dashboardTime: DashboardTime = this.dashboard.getTime();
      const startTime: number = _.get(dashboardTime, 'time.frameStart.value', null);
      const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
      const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
      const viewBy: string = _.get(dashboardTime, 'viewBy', null);

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy: viewBy
      }
      return duration;
    } catch (error) {
      console.error("Error is coming while getting the duration object ", error);
      return null;
    }
  }

  private onLoading(state: HierarchialDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HierarchialDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = true;
    me.loading = false;
  }

  private onLoaded(state: HierarchialDataLoadedState , index , metaData) {
    const me = this;
    me.dataHierarchial = state.data;
    me.error = null;
    me.loading = false;
    this.populateGroupData(me.dataHierarchial);
    let newTotalData :any[]=[];
    let uniqueObjects :{};
   //need to filter total Data on basis of favorite ctx.
   for(let s=0;s<this.dashboard.data.favDetailCtx.widgets.length;s++){
     for(let k=0;k<this.dashboard.data.favDetailCtx.widgets[s].dataCtx.gCtx.length;k++){
      //for(let l=0;l<this.dashboard.data.favDetailCtx.widgets[s].dataCtx.gCtx[k].subject.tags.length;l++){
       // for (let r = i + 1; r < this.totalData.length; r++) {
          for(let h=0;h<this.totalData[index+1].vectorList.length;h++){
            if(metaData !== "All"){
          if(this.dashboard.data.favDetailCtx.widgets[s].dataCtx.gCtx[k].subject.tags[index+1].value ===this.totalData[index+1].vectorList[h].label){
            newTotalData.push(this.totalData[index+1].vectorList[h]);
          }
          }
          else{
            newTotalData.push(this.dashboard.data.favDetailCtx.widgets[s].dataCtx.gCtx[k].subject.tags[index+1].value);
          }
        }
        //}
      //}
       
     }
   }
   if(newTotalData.length !==0){
   newTotalData.push({ label: 'ALL', value: 'ALL' });
   }
   uniqueObjects = [...new Map(newTotalData.map(item => [item.label, item])).values()];
   this.totalData[index+1].vectorList =uniqueObjects;
  }

  populateGroupData(dataToPopulate) {
    let json = dataToPopulate['hierarchy'];
    if (!json) {
      return;
    }
    for (let i = 0; i < json.length; i++) {
      let vList = [];
      this.metadataName = json[i]['metadata']
      let metadataPresent = false;
      let count = 0;
      for (let k = 0; k < this.totalHierarchyList.length; k++) {
        if (this.totalHierarchyList[k] === this.metadataName) {
          metadataPresent = true;
          count = k;
          break;
        }
      }

      if (metadataPresent) {
        // vList.push({ label: 'ANY', value: 'ANY' })
        vList.push({ label: 'ALL', value: 'ALL' })
        // vList.push({ label: 'Select Pattern', value: 'Select Pattern' })
        for (let j = 0; j < json[i].vectorList.length; j++) {
          vList.push({ label: json[i].vectorList[j], value: json[i].vectorList[j] })
        }


        let k = this.totalData[count];
        let data = {
          metadata: k.metadata,
          vectorList: vList,
          isPatterBox: false,
          value: ""
        }

        this.totalData[count] = { ...data };
        // this.totalData.forEach((element , index) => {
        //   this.totalData[index].vectorList.splice(0,0,{label: "Select Item", value: "SelectItem"})
        // });
      
        this.cdRef.detectChanges();
      }
    }
  }

  closeDialog() {
    const me = this;
    me.visible = false;
  }


  OnHierarchyChange(event, i, metadataName) {
    console.log("selected item" , this.selecteditem)
    this.onFirstTimeLoad = false;

    if (this.dropDownIndex >= i) {
      this.tagList = this.tagList.slice(0, i);
      for (let k = i + 1; k < this.totalData.length; k++) {
        this.totalData[k].vectorList = [];
        this.totalData[k].isPatterBox = false;
        this.totalData[k].value = "";
      }
    }

    if (event.value == 'Select Pattern') {
      this.toEnterPattern = true;
      this.totalData[i]['isPatterBox'] = true;
      this.totalData[i].value = "";
      this.tagList = this.gettingListOfTaggs('ALL',i, metadataName);

    }
    else {
      this.totalData[i]['isPatterBox'] = false;
      this.totalData[i].value = event.value;
      this.tagList = this.gettingListOfTaggs(event.value,i, metadataName)
    }
    this.metaDataNameFromHierarchy = metadataName;
    // let graphNameObj = this.getGroupNameObject(this.groupName);
    let glbMgId = '01000100';
    let payLoad = this.makePayloadForGettingHierarchy(this.tagList, 1, glbMgId);
    this.getIndicesListOnComponentLoad(payLoad,i, event.value);
    this.dropDownIndex = i;
    this.pattern = '';


  }

  getIndicesListOnComponentLoad(payload , index , metaData) {
    const me = this;
    this.parameterService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof HierarchialDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HierarchialDataLoadedState) {
          me.onLoaded(state, index, metaData);
          return;
        }
      },
      (state: HierarchialDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }

  gettingListOfTaggs(metaDataValue ,i , metadata) {
    let mode = 1;
    if (this.onFirstTimeLoad)
      return [];
    else {
      if (metaDataValue == "ALL") {
        mode = 2;
      }
      this.tagList.push(
        {
          "key": metadata,
          "value": this.selecteditem[i],
          "mode": mode
        }       
      )
    }
    console.log("tag list" , this.tagList)
    return this.tagList;

  }

  makePayloadForGettingHierarchy(taggs, level, glbMgId) {
    const payLoad =
    {
      "opType": "9",
      "tr": this.sessionService.testRun.id,
      "cctx": this.sessionService.session.cctx,
      "duration": this.getDuration(),
      "clientId": "Default",
      "appId": "Default",
      "glbMgId": "01000300",
      "levels": level,
      "subject": {
        "tags": taggs
      }
    }
    return payLoad;
  }

  addToTable(){
    const me  = this;
    let rowData = "";
   for (let k = 0; k < this.tagList.length; k++) {
      if(k == 0){
  rowData = me.tagList[k]['value']
    }
else{
  rowData = rowData + '>' + this.tagList[k]['value'];
}
  }
  me.data.push(rowData);
    this.tagListData.push(this.deepCopyFunction(this.tagList));
  }

  applyFilters(){
    
    const me  = this;
    this.dashboardService.setReloadFavorite(false);
    let selectedState = { label: 'dashboardFilter',
    selectedItem: 'dashboardFilter'}
    me.dashboard.openParam(me.tagListData,selectedState);

    super.hide();
  }

  resetFilters(){
      this.data  = [];
      this.tagList=[];
      this.tagListData=[];
      this.selecteditem = [];
     // this.setInitialValues();
      
  }

  deepCopyFunction = (inObject) => {
    let outObject, value, key;

    if (typeof inObject !== 'object' || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = this.deepCopyFunction(value);
    }

    return outObject;
  };

  setInitialValues(){
    this.totalData = [];
    const me = this;
    me.data  = [];
    me.tagList=[];
    me.tagListData=[];
    me.selecteditem = [];
    const payload = this.makePayloadForGettingHierarchy([], 1, '01000100');
    me.getIndicesListOnComponentLoad(payload , -1,null);
    this.totalHierarchyList = ('Tier>Server>Instance').split(">");
    for (let i = 0; i < this.totalHierarchyList.length; i++) {
      let json = {};
      json['metadata'] = this.totalHierarchyList[i];
      json['vectorList'] = [];
      json['isPatterBox'] = false;
      json['value'] = "";
      this.totalData.push(json);
    }

  }
}

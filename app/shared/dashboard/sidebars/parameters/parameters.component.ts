import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DashboardComponent } from '../../dashboard.component';
import { PARAMETERS_DATA } from './service/parameters.dummy';
import { ParameterService } from './service/parameters.service';
import { Store } from 'src/app/core/store/store';
import { HierarchialDataLoadingState, HierarchialDataLoadingErrorState, HierarchialDataLoadedState } from './service/parameters.state';
import { DashboardTime } from '../../service/dashboard.model';
import * as _ from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { ParametersData } from './service/parameters.model';
import { DashboardService } from '../../service/dashboard.service';
import { NF_TYPE } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/add-custom-monitor.component';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParametersComponent
  extends PageSidebarComponent
  implements OnInit {
  @Input() dashboard: DashboardComponent;
  classes = 'page-sidebar parameters-manager';
  visible: boolean;
  selectedRow = [];
  data : ParametersData["data"];
  error: boolean;
  empty: boolean;
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
  patternValue : string;
  selectPattenText: string[] = [];
  previousSessionParametrizeData : any;
  previousData : any = [];
  hierarchyState : number = 0;
  selectPattenArray: any= [];
  selectedHierarchy : any;
  newtagList = [];
  constructor(private parameterService: ParameterService, private sessionService: SessionService, private cdRef: ChangeDetectorRef,private dashboardService : DashboardService) {
    super();
  }

  show() {
    super.show();
    this.totalData = [];
    const me = this;
    me.selectPattenText = [];
    me.tagList = [];
    me.vList = [];
    me.hierarchyState  = 0;
    const payload = this.makePayloadForGettingHierarchy([], 1, '01000100');
    me.getIndicesListOnComponentLoad(payload, null,null);
    this.totalHierarchyList = ('Level 0>Level 1>Level 2').split(">");
    for (let i = 0; i < this.totalHierarchyList.length; i++) {
      let json = {};
      json['metadata'] = this.totalHierarchyList[i];
      json['vectorList'] = [];
      json['isPatterBox'] = false;
      json['value'] = "";
      this.totalData.push(json);
    }
    if(sessionStorage.getItem('previousSessionParametrizeValue') == "null"){
      this.previousData = [];
    }
    else{
    var value = sessionStorage.getItem("previousSessionParametrizeValue");
    this.previousData = [];
      var arr = value.split(",");
      arr.forEach(element => {
        this.previousData.push(element);
      });
    }

  }

  ngOnInit(): void {
    const me = this;
    // me.data = PARAMETERS_DATA;
    me.data = [];
    me.patternValue = "";
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

  private onLoaded(state: HierarchialDataLoadedState , index , value) {
    const me = this;
    me.dataHierarchial = state.data;
    me.error = null;
    me.loading = false;
    this.populateGroupData(me.dataHierarchial , index , value);
  }

  // populateGroupData(dataToPopulate , index, value) {
  //   let json = dataToPopulate['hierarchy'];
  //   if (!json || json.length == 0 ) {
  //     if(index+1 !== 3){
  //     if(value == "ANY"){
  //       let vList = [];
  //       vList.push({ label: 'ANY', value: 'ANY' });
  //       let data = {
  //         metadata:  index +1  == 1 ? "Server" : index+1 ==2 ?"Instance" : index +1 ==3 ? "Instance" : "Tier",
  //         vectorList: vList,
  //         isPatterBox: false,
  //         value: ""
  //       }

  //       this.totalData[ index +1] = { ...data };
  //       this.cdRef.detectChanges();
  //     }
  //   }
  //     return;
  //   }
  //   for (let i = 0; i < json.length; i++) {
  //     let vList = [];
  //     this.metadataName = json[i]['metadata']
  //     let metadataPresent = false;
  //     let count = 0;
  //     for (let k = 0; k < this.totalHierarchyList.length; k++) {
  //       if (this.totalHierarchyList[k] === this.metadataName) {
  //         metadataPresent = true;
  //         count = k;
  //         break;
  //       }
  //     }

  //     if (metadataPresent) {
  //       vList.push({ label: 'ANY', value: 'ANY'})
  //       vList.push({ label: 'ALL', value: 'All' })
  //       vList.push({ label: 'Select Pattern', value: 'Select Pattern' })
  //       for (let j = 0; j < json[i].vectorList.length; j++) {
  //         vList.push({ label: json[i].vectorList[j], value: json[i].vectorList[j] })
  //       }


  //       let k = this.totalData[count];
  //       let data = {
  //         metadata: k.metadata,
  //         vectorList: vList,
  //         isPatterBox: false,
  //         value: ""
  //       }

  //       this.totalData[count] = { ...data };
  //       this.cdRef.detectChanges();
  //     }
  //   }
  // }

  populateGroupData(dataToPopulate , index,value) {
    let json = dataToPopulate['hierarchy'];
  if (!json || json.length == 0 ) {
      if(index+1 !== 3){
      if(value == "ANY"){
        let vList = [];
        vList.push({ label: 'ANY', value: 'ANY' });
        let data = {
          metadata:  index +1  == 1 ? "Server" : index+1 ==2 ?"Instance" : index +1 ==3 ? "Instance" : "Tier",
          vectorList: vList,
          isPatterBox: false,
          value: ""
        }

        this.totalData[ index +1] = { ...data };
        this.cdRef.detectChanges();
      }
    }
      return;
    }
    for (let i = 0; i < json.length; i++) {
      let vList = [];
      this.metadataName = json[i]['metadata']
      let metadataPresent = true;

      if (i == 0 && this.hierarchyState !==0 && this.vList.length == 0) {
        this.vList.push({ label: 'ANY', value: 'ANY'})
        this.vList.push({ label: 'ALL', value: 'All' })
        this.vList.push({ label: 'Select Pattern', value: 'Select Pattern' })
      }
      else if (i == 0 && this.hierarchyState ==0 && this.vList.length == 0) {
        this.vList.push({ label: 'Select Pattern', value: 'Select Pattern' })
      }
        for (let j = 0; j < json[i].vectorList.length; j++) {
          this.vList.push({ label: json[i].vectorList[j] + " ("+ json[i].metadata + ") ", value:json[i].vectorList[j], metadata : json[i].metadata })
        } 
      

        let k = this.totalData[this.hierarchyState];
        let data = {
          metadata: k.metadata,
          vectorList: this.vList,
          isPatterBox: false,
          value: ""
        }

        this.totalData[this.hierarchyState] = { ...data };
        this.cdRef.detectChanges();
      
    }
  }

  closeDialog() {
    const me = this;
    me.visible = false;
  }


  OnHierarchyChange(event, i, metadataName, list) {
    this.newtagList = [];
    this.onFirstTimeLoad = false;
    this.hierarchyState = i+1;
    if (event.value !== 'Select Pattern' && event !== 'Select Pattern') {
      this.selectedHierarchy = this.getCurrentHierarchy(list, event.value);
      }
    if (this.dropDownIndex >= i) {
      this.tagList = this.tagList.slice(0, i);
      for (let k = i + 1; k < this.totalData.length; k++) {
        this.totalData[k].vectorList = [];
        this.totalData[k].isPatterBox = false;
        this.totalData[k].value = "";
      }
    }

    if (event.value == 'Select Pattern' || event == 'Select Pattern') {
      this.toEnterPattern = true;
      this.totalData[i]['isPatterBox'] = true;
      this.totalData[i].value = "";
      let value = null;
      if(event == 'Select Pattern'){
        value = this.selectPattenText[i];
      }

      this.tagList = this.gettingListOfTaggs('Select Pattern', metadataName,value,list);

    }
    else if (event.value == 'All'){
      this.totalData[i]['isPatterBox'] = false;
      this.totalData[i].value = event.value;
      this.tagList = this.gettingListOfTaggs(event.value, this.selectedHierarchy['metadata'],null,list);
    }
    else {
      this.totalData[i]['isPatterBox'] = false;
      this.totalData[i].value = event.value;
      this.tagList = this.gettingListOfTaggs(event.value, this.selectedHierarchy['metadata'],null,null);
    }
    this.patternValue = "";
    this.metaDataNameFromHierarchy = metadataName;
    // let graphNameObj = this.getGroupNameObject(this.groupName);
    let glbMgId = '01000100';
    this.vList = [];
        this.newtagList.forEach((element , index) => {
      let payLoad = this.makePayloadForGettingHierarchy(element, 1, glbMgId);
      this.getIndicesListOnComponentLoad(payLoad, i , event.value);
    });
    // let payLoad = this.makePayloadForGettingHierarchy(this.tagList, 1, glbMgId);
    // this.getIndicesListOnComponentLoad(payLoad, i , event.value);
    this.dropDownIndex = i;
    this.pattern = '';


  }

  getIndicesListOnComponentLoad(payload , index, value) {
    const me = this;
    this.parameterService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof HierarchialDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HierarchialDataLoadedState) {
          me.onLoaded(state,index,value);
          return;
        }
      },
      (state: HierarchialDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }

  gettingListOfTaggs(metaDataValue, metadata, patternValue, data) {
    this.newtagList = [];
    let mode = 1;
    if (this.onFirstTimeLoad)
      return [];
    else {
      if (metaDataValue == "All") {
        mode = 2; 
      }
      else if(metaDataValue == "Select Pattern")
      {
        mode = 4;
      }
      if(metaDataValue == "Select Pattern" && data){
        this.getUniqueHierarcyList(data);
        this.selectPattenArray.forEach(element => {
          let data = [];
          data.push(
            {
              "key": element,
              "value": metaDataValue == "Select Pattern" ? patternValue !== null ? patternValue:metaDataValue  : metaDataValue,
              "mode": mode
            }
          )
          
          this.newtagList.push(data);

        } );
        this.tagList.push(this.newtagList);
        }
        else if (metaDataValue == "All"){
          this.getUniqueHierarcyList(data);
          this.selectPattenArray.forEach(element => {
            let data = [];
            data.push(
              {
                "key": element,
                "value": "All",
                "mode": 2
              }
            )
            
            this.newtagList.push(data);
            this.tagList.push(data);
          } );
        }
      else{
        let data = [];
      data.push(
        {
          "key": metadata,
          "value": metaDataValue == "Select Pattern" ? patternValue !== null ? patternValue:metaDataValue  : metaDataValue,
          "mode": mode
        }
      )
      this.newtagList.push(data);
      this.tagList.push(data);
      }
    }
    console.log("tag list" , this.tagList)
    return this.tagList;

  }

  makePayloadForGettingHierarchy(taggs, level, glbMgId) {
    let dataTagList : any = [] ;
    if(this.tagList && this.tagList.length > 1 && taggs.length != 0){
      for(var i =0 ; i< this.tagList.length-1;i++){
        dataTagList[i] = JSON.parse(JSON.stringify(this.tagList[i]));
            }
            dataTagList[0][this.tagList.length-1] = taggs[0];
            console.log("this.tagList================"+this.tagList);
            //this.tagList = dataTagList;
    }
else{
  dataTagList[0] = taggs;
}
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
        "tags": taggs.length == 0 ? taggs : dataTagList[0]
      }
    }
    return payLoad;
  }

  addToTable(){
    const me  = this;
    if(this.tagList.length >= 3){
    // for (let k = 0; k < this.tagList.length; k++) {

     // let rowData = this.tagList[k]['value'] + '>' + this.tagList[k+1]['value'] + '>' + this.tagList[k+2]['value'];
      let rowData = this.tagList[0]['value'] + '>' + this.tagList[1]['value'] + '>' + this.tagList[2]['value'];

    if(me.data.indexOf(rowData) === 0){
      console.log("if")
    }
    else{
      console.log("else")
    }
    me.data.push(rowData);
      }
    //}
    else
    alert('Please select complete metadata to add in table.')
  }

  applyFilters(){
    const me  = this;
    // DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {

    //   dc.layout.renderWidgets(true, true);

    // });

    let selectedState = { label: 'FavParametrization',
    selectedItem: 'FavParametrization'}

    // me.tagList.reverse();
  this.tagList.forEach(element => {
    //element.forEach(e => {
      if(element.value == "Select Pattern"){
      element.value = this.patternValue;
      }
      if(element.value == "ANY"){
        element.key = "ANY";
      }
    //});
  });
    me.dashboard.openParam(this.tagList,selectedState);
    let data :any = "";
    let key : any = "" ;
    let paramData: any = [];
    // this.tagList.forEach((element , index) => {
    //   data = index == 0 ? element.key + "-"+ element.value : data +"" +element.key + "-"+ element.value
    // });

    for (let k = 0; k < this.tagList.length; k++) {
      key = "";
      for(let n = 0; n< this.tagList[k].length; n++){
        let currentTag = this.tagList[k][n][0];
        if(!currentTag){
          currentTag = this.tagList[k][n];
          data = k == 0 ? currentTag.key + "-"+ currentTag.value : data + " " +currentTag.key + "-"+ currentTag.value
        }
        else{
          key = n == 0 ? currentTag.key : key + " " +currentTag.key ;
          data = k ==0 ?  key + "-"+ currentTag.value : data + " " +key+ "-"+ currentTag.value;
        }
        }
      }
    paramData.push(data);
    let previousSessionParametrizeValue: any;
    previousSessionParametrizeValue = sessionStorage.getItem("previousSessionParametrizeValue");
    if(previousSessionParametrizeValue == "null"){
    sessionStorage.setItem("previousSessionParametrizeValue",paramData);
    }
    else{
      previousSessionParametrizeValue = sessionStorage.getItem("previousSessionParametrizeValue");
      var arr = previousSessionParametrizeValue.split(",");
      arr.forEach(element => {
        paramData.push(element);
      });
      sessionStorage.setItem("previousSessionParametrizeValue",paramData);
    }
    me.dashboardService.setReloadFavorite(false);
    this.tagList = [];
    super.hide();
  }

  resetFilters(){
      this.data  = [];
      this.patternValue = "";
  }

  onSelectionChange(event){
    event.value.length = 0;
  }

  getCurrentHierarchy(list , value){
    let selectedH = null;
    for(var i =0; i<list.length;i++){
      if(list[i].value == value){
        selectedH = list[i];
      break;
      }
    }
    return selectedH;
  }

  getUniqueHierarcyList(list)
  {
    let array = [];
    for(var i =0; i<list.length;i++){
      if(list[i].metadata){
     array.push(list[i].metadata);
      }
    }
  array = array.filter(onlyUnique);
  this.selectPattenArray = array;
  console.log(array);
  }

}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

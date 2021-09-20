import { ChangeDetectorRef, Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as EventEmitter from 'events';
import { ConfirmationService, MessageService, SelectItem } from 'primeng';
import { merge, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { getGraphPayload, graphData, groupData } from '../../derived-metric/service/derived-metric.model';
import { PageDialogComponent } from '../../page-dialog/page-dialog.component';
import { SubjectTags, TargetData } from '../pattern-matching.model';
import { PatternMatchingService } from '../service/pattern-matching.service';
import { deleteCatalogueCreatedState, deleteCatalogueCreatingErrorState, deleteCatalogueCreatingState, getCatalogueCreatedState, getCatalogueCreatingErrorState, getCatalogueCreatingState, patternMatchingGraphCreatedState, patternMatchingGraphCreatingErrorState, patternMatchingGraphCreatingState, patternMatchingGroupCreatedState, patternMatchingGroupCreatingErrorState, patternMatchingGroupCreatingState, saveCatalogueCreatedState, saveCatalogueCreatingErrorState, saveCatalogueCreatingState, updateCatalogueCreatedState, updateCatalogueCreatingErrorState, updateCatalogueCreatingState } from '../service/pattern-matching.state';
import { CATALOGUE_Data_Window, CATALOGUE_MANAGEMENT_DATA } from './service/catalogue-management.dummy';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from './service/catalogue-management.model';
import { CatalogueManagementService } from './service/catalogue-management.service';
@Component({
  selector: 'app-catalogue-management',
  templateUrl: './catalogue-management.component.html',
  styleUrls: ['./catalogue-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueManagementComponent extends PageDialogComponent
  implements OnInit {

  data;
  error: AppError;
  error1: boolean;
  loading: boolean;
  visible: boolean =false;
  sourceData: any[];
  targetData: TargetData[];
  graphType: string = "Business Transaction";
  datatable;
  activeTab: number = 1;
  tableData:CatalogueTableData[];
  cataloguedata:CatalogueTableData[] =[];
  catalogueNameDisableOnEdit:boolean =false;
  catalogueName:string;
  catDescription:string =null;
  metricType:string='all';
  graphList:any[];
  dataGraph:graphData;
  groupList:any[];
  previousTargetData:TargetData[];
  saveResponse :SaveCatlogueResponse;
  catalogueResponse:SaveCatlogueResponse;
  updatecatalogue1:boolean=false;
  updateCatalogueflag:boolean=false;
  SpecifiedFormula :string ;
  metricTypeDerived:string=null;
  enableMangeCatalogue:boolean=false;
   editCatalogueFlag:boolean=false;
   deleteCatalogueManage:boolean=false;
   dataDeleteres:SaveCatlogueResponse;
   editRowIndex:any;
   catalogueEditData :any;
  // dashboard:DashboardComponent;
  private patternMatchSubscription: Subscription;
   groupNameObject:any;
   group2:any =null;
   group3:any =null;
   disableCatalogue:boolean =false;
  dataGroup: groupData;
  addCatal:boolean =false;
  addCatfromGlobal:boolean =false;
  @Input() dashboard :DashboardComponent;
  duration:any;
  constructor( private catalogueManagementService :CatalogueManagementService,public patternMatchingService: PatternMatchingService,private cd: ChangeDetectorRef,public sessionService: SessionService,public confirmation: ConfirmationService , private messageService: MessageService,) {
    super();
    this.metricType ="all";
  }

  ngOnInit(): void {
    const me = this;
    me.data = CATALOGUE_MANAGEMENT_DATA;
    me.datatable = CATALOGUE_Data_Window;
    me.data.categoryName = me.patternMatchingService.groupData;
    this.catalogueManagementService.setDashboard(me.dashboard);
    this.sourceData = [
      {
        label: 'MRP-Cenral',
        value: 'picklist',
      },
      {
        label: 'MRP-Eastern',
        value: 'picklist',
      },
      {
        label: 'Cavisson',
        value: 'picklist',
      },
      {
        label: 'KPI',
        value: 'picklist',
      },
      {
        label: 'MRP-SnbPerf',
        value: 'picklist',
      },
      {
        label: 'AccPerf',
        value: 'picklist',
      },
      {
        label: 'Ns_Perf',
        value: 'picklist',
      },
      {
        label: 'KPI',
        value: 'picklist',
      },
    ];
    this.targetData = [];
  }
  
  closeDialog() {
    this.visible = false;
  }


openFromConfiguration(rowIndex,row,dashboard){
  const me = this;
  console.log(rowIndex,row);
  let createdBy= null;
  //me.addCatal =true;
    // me.cataloguedata =row.targetData;
    const cctx = this.sessionService.session.cctx;

    const payload = {
      "opType": "get",
      "cctx":cctx,
    }
    if(!me.cataloguedata){
    me.getCatalogueInfo(payload);
    }
  me.previousTargetData =[];
  me.disableCatalogue =false;
  if(me.group3==='group3'){
   me.group3 =null;
  }
  me.group2 ='group2';
  me.graphType =null;
  if(me.targetData){
    me.targetData =[];
    me.graphList =[];
  }
  me.catalogueNameDisableOnEdit = false;
    me.enableMangeCatalogue = true;
    if(me.activeTab===0){
      me.enableMangeCatalogue = false;
    }

    me.data.data = [];
    let headers= CATALOGUE_MANAGEMENT_DATA.headers;
    if(!me.data.headers){
      me.data.headers = [];
      me.data.headers = headers;
    }
    for(let k=0;k<row.targetData.length;k++){
      me.previousTargetData.push(row.targetData[k]);
      me.data.data.push(row.targetData[k]);
    }
    
    // for(let i=0;i<me.cataloguedata.length;i++){
    //   if(me.cataloguedata[i].name ===me.catalogueName){
    //     me.catDescription=me.cataloguedata[i].description;
    //      let metricType =me.cataloguedata[i].metricType;
    //      if(metricType==='Normal'){
    //        me.metricType ="all";
    //      }
    //      else{
    //        me.metricType ="zero";
    //      }
    //     for(let k=0;k<me.cataloguedata[i].targetData.length;k++){
    //       me.cataloguedata[i].targetData[k].value =metricType;
    //     }
    //     me.previousTargetData=me.cataloguedata[i].targetData;
    //     break;
    //   }
    // }
  
  //  for(let k=0; k<me.previousTargetData.length;k++){
  //    me.data.data.push(me.previousTargetData[k]);
  //  }
  //  if(me.data.data.length == 0){
  //    me.data.data =row.targetData;
  //  }

  me.catalogueName = row.name;
  me.catDescription = row.description;
  let tmpValue = dashboard.timebarService.tmpValue;
   me.duration = {
    st: tmpValue.time.frameStart.value,
    et: tmpValue.time.frameEnd.value,
    preset: tmpValue.timePeriod.selected.id,
    viewBy:tmpValue.viewBy.selected.id
  }
  const gPayload = {
    "opType": "4",
    "cctx": cctx,
    "duration": me.duration,
    "tr": this.sessionService.testRun.id,
    "clientId": "Default",
    "appId": "Default",
    "selVector": null
    
  }
  me.loadGroup(gPayload);
  
    for(let i=0;i<me.cataloguedata.length;i++){
      if(me.cataloguedata[i].name ===me.catalogueName){
       createdBy = me.cataloguedata[i].createdBy;
       break;
      }
    }
    if(createdBy !==me.sessionService.session.cctx.u){
     me.disableCatalogue =true;
    }
    else{
      me.enableMangeCatalogue =true;
    }
    if( me.cataloguedata===undefined ||me.cataloguedata.length===undefined ||me.cataloguedata.length ===0 ||me.cataloguedata ===null){
      // return;
    }
    this.visible=true;
    this.cd.detectChanges();
    //me.addCatal= true;
}
 

loadGroup(gPayload) {
  const me = this;
  merge(
    me.patternMatchingService.loadGroupCategory(gPayload)
  ).subscribe((state: Store.State) => {
    if (state instanceof patternMatchingGroupCreatingState) {
      me.onLoadingGroup(state);
      return;
    }

    if (state instanceof patternMatchingGroupCreatedState) {
      me.onLoadedGroup(state);
      me.cd.detectChanges();
      return;
    }
  },
  (state: patternMatchingGroupCreatingErrorState) => {
    me.onLoadingGroupError(state);
  }
);
}

onLoadingGroup(state: patternMatchingGroupCreatingState) {
  const me = this;
  me.error = null;
  me.loading = false;
}

onLoadedGroup(state: patternMatchingGroupCreatedState) {
  const me = this;
  me.dataGroup = state.data;
  me.error = null;
  me.loading = false;
  me.populateGroupData(me.dataGroup);
}

populateGroupData(dataGroup: groupData) {
  const me = this;
  me.groupList = [];
  let i = 0;
  let len = dataGroup.group.length;
  while (i < len) {
    let json = dataGroup.group[i];
    json['label'] = dataGroup.group[i].groupName;
    json['value'] = dataGroup.group[i].groupName;
    me.groupList.push(json);
    i++;
  }
  me.data.categoryName =me.groupList;

  this.patternMatchingService.setGroupData(me.dataGroup);
}

onLoadingGroupError(state: patternMatchingGroupCreatingErrorState) {
  const me = this;
  me.dataGroup = null;
  me.error = state.error;
  me.loading = false;
}

  open() {
    const me = this;
    let createdBy= null;
    me.disableCatalogue =false;
    this.visible = true;
    if(me.group3==='group3'){
     me.group3 =null;
    }
    me.group2 ='group2';
    me.graphType =null;
    if(me.targetData){
      me.targetData =[];
      me.graphList =[];
    }
    me.catalogueNameDisableOnEdit = false;
    me.enableMangeCatalogue = true;
    if(me.activeTab===0){
      me.enableMangeCatalogue = false;
    }
   
    me.data.categoryName = me.patternMatchingService.groupData.group;
    me.groupList =me.patternMatchingService.groupData.group;
    me.catalogueName = me.patternMatchingService.selectedCatalogue;
    me.cataloguedata =me.patternMatchingService.catalogueTableData;
    for(let i=0;i<me.cataloguedata.length;i++){
      if(me.cataloguedata[i].name ===me.catalogueName){
       createdBy = me.cataloguedata[i].createdBy;
       break;
      }
    }
    if(createdBy !==me.sessionService.session.cctx.u){
     me.disableCatalogue =true;
    }
    if( me.cataloguedata===undefined ||me.cataloguedata.length===undefined ||me.cataloguedata.length ===0 ||me.cataloguedata ===null){
      return;
    }
    else{
    for(let i=0;i<me.cataloguedata.length;i++){
      if(me.cataloguedata[i].name ===me.catalogueName){
        me.catDescription=me.cataloguedata[i].description;
         let metricType =me.cataloguedata[i].metricType;
         if(metricType==='Normal'){
           me.metricType ="all";
         }
         else{
           me.metricType ="zero";
         }
        for(let k=0;k<me.cataloguedata[i].targetData.length;k++){
          me.cataloguedata[i].targetData[k].value =metricType;
        }
        me.previousTargetData=me.cataloguedata[i].targetData;
        break;
      }
    }
    let catalogueDataTobeUpdated:TargetData[] =[];
    let uniqueObjects = [...new Map(me.previousTargetData.map(item => [item.name, item])).values()];
    catalogueDataTobeUpdated =uniqueObjects;
    me.previousTargetData =catalogueDataTobeUpdated;
  }
    me.data.data =me.previousTargetData;
  }
  addCatalogueInfo(){
    let me =this;
    const cctx = this.sessionService.session.cctx;
    let creationDate:string;
    me.metricType= "Normal";
    if(me.catalogueName==null ||me.catDescription=="" ||me.catDescription ==null || me.catalogueName==""){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add  catalogue name and description' });
      me.cd.detectChanges();
      return;
     }
     creationDate =new Date().toLocaleString();
    let payload: SaveCatalogue={
      'opType':"save",
      'cctx':cctx,
      'targetData': me.previousTargetData,
      'name':me.catalogueName,
      'description':me.catDescription,
      'createdBy':cctx.u,
      "creationDate":creationDate,
      "metricType":me.metricType,
      "chartType":"0",
      "seriesType":"",
      "arrPercentileOrSlabValues":[] 
    }
    me.patternMatchingService.saveCatalogue(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof saveCatalogueCreatingState) {
          me.onSaveLoading(state);
          return;
        }
  
        if (state instanceof saveCatalogueCreatedState) {
          me.onSaveLoaded(state);
          //me.visible =false;
          //return;
        }
      },
      (state: saveCatalogueCreatingErrorState) => {
        me.onSaveLoadingError(state);
      }
    );
    
    //const cctx = this.sessionService.session.cctx;
    this.messageService.add({ severity: 'success', summary: 'Success message', detail:'Catalogue '+  me.catalogueName  + " saved successfully" });
    this.closeDialog();  
    me.cd.detectChanges();
  }

  onSaveLoadingError(state: saveCatalogueCreatingErrorState) {
    const me = this;
    me.error = null;
    me.data = null;
    me.loading = true;
  }
  onSaveLoaded(state: saveCatalogueCreatedState) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.data =state.data;
    if(me.data.status.code === 201){
      // me.savecatalogue1 = true;
      // this.confirmation.confirm({
      //   header:'Save Catalogue',
      //   key: 'saveCatByName',
      //   message: 'Catalogue '+  me.name  +' saved successfully',
      //   accept: () => { },
      //   rejectVisible: false
      // });
     // alert("Catalogue saved successfully");
    }
    //me.savecatalogue1 = false;
  }

  onSaveLoading(state: saveCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  
addCatalogue(dashboard){
let me =this;
me.enableMangeCatalogue =false;
me.group2 ='group2';
me.group2 = null;
me.catalogueName = null;
me.catDescription= null;
me.patternMatchingService.setFinalArrayOfSelectedIndices(null);
me.patternMatchingService.setExpressionForAdvancedSelection(null);
me.previousTargetData =[];
me.addCatfromGlobal =true;
me.addCatal =true;
me.data.data = [];
me.patternMatchingService.setGlobalCatalogue(true);
me.patternMatchingService.setFlagPattern(true);
const cctx = this.sessionService.session.cctx;
  const payload = {
    "opType": "get",
    "cctx":cctx,
  }
  me.getCatalogueInfo(payload);
  let time = dashboard.dashboardTime;
   me.duration = {
    st: time.time.frameStart.value,
    et: time.time.frameEnd.value,
    preset: time.graphTimeKey,
    viewBy:time.viewBy
  }
  me.patternMatchingService.setDuration(me.duration);
  const gPayload = {
    "opType": "4",
    "cctx": cctx,
    "duration": me.duration,
    "tr": this.sessionService.testRun.id,
    "clientId": "Default",
    "appId": "Default",
    "selVector": null
    
  }
  me.loadGroup(gPayload);
  }

  
  selectGraphs(type) {
    const me = this;
    me.graphType = type;
    console.log("me.graphType------->",me.graphType);
     this.graphList = [];
     if(me.graphType){
      me.group2 ="group2";
      me.group3=null;
      this.patternMatchingService.finalArrayOfSelectedIndices= null;
      this.patternMatchingService.expressionForAdvancedSelection=null;
     }
     me.groupNameObject = this.getGroupNameObject(type);
     let duration =null;
     if(this.patternMatchingService.duration){
     duration = this.patternMatchingService.duration;
     }
     else{
   duration = me.duration;
     }
    const cctx = this.sessionService.session.cctx;
    let createdBy =null;
    this.patternMatchingService.setGroupNameObject(me.groupNameObject);
    const graphPayload: getGraphPayload = {
      "opType": "5",
      "cctx": cctx,
      "duration": duration,
      "tr": this.sessionService.session.testRun.id,
      "clientId": "Default",
      "appId": "Default",
      "mgId": me.groupNameObject.mgId,
      "glbMgId": me.groupNameObject.glbMgId,
      "grpName": me.groupNameObject.groupName
    }
    if (me.groupNameObject.groupName != undefined && me.groupNameObject.groupName != 'undefined') {
      me.patternMatchSubscription = me.patternMatchingService.loadGraphData(graphPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof patternMatchingGraphCreatingState) {
            me.onLoadingGraph(state);
            return;
          }

          if (state instanceof patternMatchingGraphCreatedState ) {
            me.onLoadedGraph(state);
            this.cd.detectChanges();
            return;
          }
        },
        (state: patternMatchingGraphCreatingErrorState) => {
          me.onLoadingGraphError(state);
        }
      );
    }
  
    //me.data.categoryName = me.patternMatchingService.groupData;
  }
  getGroupNameObject(groupName: any) {
    try {
      let me =this;
       if (me.groupList && me.groupList.length > 1) {
         for (let i = 0; i < me.groupList.length; i++) {
           if (groupName === me.groupList[i].value) {
             return me.groupList[i];
 
           }
         }
       }
 
     } catch (error) {
 
     }
  }
  private onLoadingGraph(state: patternMatchingGraphCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingGraphError(state: patternMatchingGraphCreatingErrorState) {
    const me = this;
    me.dataGraph = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoadedGraph(state: patternMatchingGraphCreatedState) {
    const me = this;
    me.dataGraph = state.data;
    me.error = null;
    me.loading = false;
    me.populateGraphData(me.dataGraph);
  }

  populateGraphData(dataGraph: graphData) {
    const me = this;
    let i = 0;
    me.graphList =[];
    let len = dataGraph.graph.length;
    while (i < len) {
      let json = dataGraph.graph[i];
      json['label'] = dataGraph.graph[i].name;
      json['value'] = dataGraph.graph[i].name;
      me.graphList.push(json);
      i++;
    }
    console.log("dataGraph--------->",dataGraph);
   // me.patternMatchingService.setGroupData(me.graphList);
  }

 /* Method called during the change of the Tab Headers in Catalogue Management. */
 handleChangeInTabs(event) {
   let me =this;
  try {
    if (event.index === 1) {
      me.enableMangeCatalogue=true;
     // me.activeTab = event.index;
      me.catalogueNameDisableOnEdit = false;
      me.data.categoryName = me.patternMatchingService.groupData.group;
      me.catalogueName = me.patternMatchingService.selectedCatalogue;
      for(let i=0;i<me.cataloguedata.length;i++){
        if(me.cataloguedata[i].name ===me.catalogueName){
          me.catDescription=me.cataloguedata[i].description;
          me.data.data =me.cataloguedata[i].targetData
          break;
        }
      }

    } else {
     // this.activeTab = event.index;
      me.enableMangeCatalogue=false;
      const cctx = this.sessionService.session.cctx;
      const payload = {
        "opType": "get",
        "cctx":cctx,
      }
      me.getCatalogueInfo(payload);
    }
  } catch (error) {
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
  me.datatable = CATALOGUE_Data_Window;
  me.datatable.data[0].data = me.catalogueResponse.data;
  me.cataloguedata =me.catalogueResponse.data;
  // me.catDescription='';
  // me.catalogueName='';
  me.visible=true;
}

// OperationType(opType){
// if(opType ="all"){
//   this.metricType ="Normal";
// }
// else{
//   this.metricType="Derived";
// }
// }
editManageCatalogue(cataloguedata,row,rowIndex){
  let me =this;
  if(me.sessionService.session.cctx.u !==row.createdBy){
    this.confirmation.confirm({
      key: 'deleteManageCat',
      header: 'Error',
      message: 'Catalogue created by other User can not be edited',
      accept: () => { return; },
      rejectVisible: false
    });
    return;
  }
  me.enableMangeCatalogue =true;
  me.activeTab =1;
  me.data.categoryName = me.patternMatchingService.groupData.group;
  me.catalogueName = row.name;
  me.metricType =row.metricType;
  if(me.metricType==='Normal'){
    me.metricType ="all";
  }
  else{
    me.metricType ="zero";
  }
  for(let i=0;i<cataloguedata.length;i++){
    if(me.cataloguedata[i].name ===me.catalogueName){
      me.catDescription=me.cataloguedata[i].description;
      me.data.data =me.cataloguedata[i].targetData
      break;
    }
  }
}

editCatalogue(catalogueData,row,rowIndex){
let me =this;
for(let i=0;i<me.data.categoryName.length;i++){
  if(me.data.categoryName[i].groupName ===row.mg){
    me.graphType = row.mg;
    me.editCatalogueFlag=true;
     me.editRowIndex =rowIndex;
     me.catalogueEditData =catalogueData;
     this.confirmation.confirm({
      key: 'deleteManageCat',
      header: 'Edit Metric',
      message: 'Are you sure you want to edit row?',
      accept: () => {me.selectGraphs(me.graphType);  },
      reject: () => { return;
      }
    });
    //if(me.editCatalogueFlag){
     // catalogueData.splice(rowIndex,1);
    //}
    break;
  }
 
}
}

deleteCatalogue(index,row){
let me =this;
//if(!me.updateCatalogueflag){
  this.confirmation.confirm({
    key: 'deleteManageCat',
    header: 'Delete Metric',
    message: 'Are you sure you want to delete ' + row.name +' metric ?',
    accept: () => {me.previousTargetData.splice(index,1); me.test();},
    reject: () => { return;
    }
  });
//}
// else{
//  me.previousTargetData = me.previousTargetData.splice(index,1);
//  me.data.data =me.previousTargetData;
//   //me.updateCatalogue(); 
// }

//console.log("me------->",index,me.previousTargetData );
}
test(){
  let me =this;
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Metric deleted successfully' });
}

addGraphToTable(targetData:TargetData[]){
let me =this;
let finalNewUpdateData:any[] =[];
let tags :SubjectTags;
let uniqueObjects= {}; 
if(targetData.length===0){
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select metric to add in table' });
  return;
}
if(me.addCatal && !me.catalogueManagementService.globalCatFlag){
  me.disableCatalogue =false;
  me.previousTargetData = [];
}
else if(targetData && me.previousTargetData){
    for(let k=0;k<targetData.length;k++){
  finalNewUpdateData.push(targetData[k]);
    }

    // for(let i=0;i<finalNewUpdateData.length;i++){
    // me.previousTargetData.push(finalNewUpdateData[i]);
    // }
}

if(me.editCatalogueFlag){
  me.catalogueEditData.splice(me.editRowIndex,1);
}
tags ={
  "sMeta":me.groupNameObject.hierarchicalComponent,
  "appName":null,
  "key":null,
   "sName":null,
   "value":null,
    "mode":0
}
if(!me.previousTargetData){
  me.previousTargetData = [];
}
for(let i=0;i<targetData.length;i++){
  targetData[i].mgId=me.groupNameObject.mgId;
  targetData[i].mg=me.groupNameObject.groupName;
  targetData[i].glbMetricId=me.groupNameObject.glbMgId;
  targetData[i].vectorName=tags;
  if(targetData[i].value ="Normal"){
  targetData[i].description = "*";
  }
   me.previousTargetData.push(targetData[i]);
}
uniqueObjects = [...new Map(me.previousTargetData.map(item => [item.name, item])).values()];
for(let i=0;i<me.previousTargetData.length;i++){
  me.previousTargetData[i].value ="Normal";
}
 //finalNewUpdateData = me.previousTargetData.push(targetData);
//  if(me.addCatal){
//   this.data.data = me.previousTargetData;
//  }
//  else{
this.data.data =uniqueObjects;
// }
if(this.patternMatchingService.selectedTestIndices==='Specified'){
  let specifiedData = me.patternMatchingService.finalArrayOfSelectedIndices;
  console.log("specifiedData------>",specifiedData);
    for(let i=0;i<targetData.length;i++){
      targetData[i].description = specifiedData;
      targetData[i].value ="Normal";
    }
}
if(this.patternMatchingService.selectedTestIndices==='Advance'){
  let advanceData = me.patternMatchingService.expressionForAdvancedSelection;
  let finalAdvance = advanceData.split("PATTERN#"); 
    for(let i=0;i<targetData.length;i++){
      targetData[i].description = advanceData;
      targetData[i].value ="Normal";
    }
}

me.targetData =[];
 }

  validategraphs(targetData ) {
    let me =this;
    if(targetData.name === undefined || targetData.name === null || targetData.name === ""){
      this.confirmation.confirm({
        key: 'graphs',
        header: 'Catalogue Error',
        message: 'Please select a graph to add',
        accept: () => {return; },
        rejectVisible:false,
      });
    }
    for(let i=0; i<me.data.data.length; i++){
      for(let j=0; j<targetData.length; j++){
      if(me.data.data[i].name === targetData[j].name){
        // alert("this graph is already added");
        this.confirmation.confirm({
          key: 'graphs',
          header: 'Catalogue Error',
          message: 'this graph is already added',
          accept: () => {return; },
          rejectVisible:false,
        });
      }
    } 
  }
  }

updateCatalogue(){
  let me =this;
  me.updateCatalogueflag =true;
  let catalogueNameTobeUpdated = me.catalogueName;
  let catalogueDescriptionTobeUpdated =me.catDescription;
  let catalogueDataTobeUpdated:TargetData[] =[];
  console.log("me.previousTargetData------->",me.previousTargetData);
 let uniqueObjects = [...new Map(me.previousTargetData.map(item => [item.name, item])).values()];
  catalogueDataTobeUpdated =uniqueObjects;
  let creationDate:string;
  const cctx = this.sessionService.session.cctx;
 creationDate =new Date().toLocaleString();
 if(me.metricType==="all"){
   me.metricType=null;
   me.metricType ="Normal";
 }
 if(me.sessionService.session.cctx.u ==='guest'){
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Guest User Can not update catalogue' });
  me.cd.detectChanges();
  return;
 }
 if(catalogueDescriptionTobeUpdated===null ||catalogueDescriptionTobeUpdated===""){
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add description' });
  me.cd.detectChanges();
  return;
 }
  let payload: SaveCatalogue={
    'opType':"update",
    'cctx':cctx,
    'targetData': catalogueDataTobeUpdated,
    'name':catalogueNameTobeUpdated,
    'description':catalogueDescriptionTobeUpdated,
    'createdBy':cctx.u,
    "creationDate":creationDate,
    "metricType":me.metricType,
    "arrPercentileOrSlabValues":[],
    "chartType":"0",
    "seriesType":""
  }
  me.patternMatchingService.updateCatalogue(payload).subscribe(
    (state: Store.State) => {
      if (state instanceof updateCatalogueCreatingState) {
        me.updateonLoading(state);
        return;
      }

      if (state instanceof updateCatalogueCreatedState) {
        me.updateonLoaded(state);
        return;
      }
    },
    (state: updateCatalogueCreatingErrorState) => {
      me.updateonLoadingError(state);
    }
  );
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Catalogue Updated successfully' });
  this.closeDialog();  
  me.cd.detectChanges();
}
  updateonLoadingError(state: updateCatalogueCreatingErrorState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  updateonLoaded(state: updateCatalogueCreatedState) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.saveResponse =state.data;
    // me.datatable.data[0].data =me.saveResponse.data;
    // me.cataloguedata =me.saveResponse.data;
    // me.catDescription=null;
    // me.catalogueName=null;
    if(me.saveResponse===null){
      //alert("Catalogue updated succesfuly");
      //return null;
    
    }
    // if(me.saveResponse.status.code === 202){
    //  // me.visible =false;
    // }

  }
  updateonLoading(state: updateCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.saveResponse = null;
    me.loading = true;
  }
  
  openderWindow(){
    let me =this;
    me.SpecifiedFormula =this.patternMatchingService.derivedFormula;
  }
  onPage(event) {
    const me = this;
    me.sessionService.setSetting('lowerTabularPanelRows', event.rows);
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
      message: 'Catalogue created by user '+row.createdBy+' can not be deleted by '+me.sessionService.session.cctx.u,
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
  deleteOnLoading(state: deleteCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  picklistToTarget(event){
    let me =this;
    for(let i=0;i<me.targetData.length;i++){
      
    if(me.targetData[i].label.includes("|")){

    }
    else{
      me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name;
      if(me.patternMatchingService.expressionForAdvancedSelection !=null){
        me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name+">"+me.patternMatchingService.expressionForAdvancedSelection;
      }
      else if(me.patternMatchingService.finalArrayOfSelectedIndices !=null){
        me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name+">"+me.patternMatchingService.finalArrayOfSelectedIndices;
      }
    // me.targetData[i].label= me.patternMatchingService.groupNameObject.groupName + "|"+ me.targetData[i].name;
    me.targetData[i].mgId=me.patternMatchingService.groupNameObject.mgId;
    me.targetData[i].mg =me.patternMatchingService.groupNameObject.groupName;
    me.targetData[i]['vectorName']=me.patternMatchingService.groupNameObject.hierarchicalComponent;
  }
}

    }
    pickListToSource(event){
      let me =this;
      console.log(event);
      let value=null;
      for(let i=0;i<event.items.length;i++){
      // let value= event.items[i].label.split("|");
      //  event.items[i].label = value[1];
      if(event.items[i].label.includes('>')){
        value= event.items[i].label.split(">");
        let value1= value[0].split("|");
     event.items[i].label = value1[1];
      }
      else{
        // /value= event.items[i].label.split("|");
        let value1= event.items[i].label.split("|");
        event.items[i].label = value1[1];
      }
  
      }
    }

    testForSpecicified(){
      let me =this;
      me.metricType ='all';
      if(me.group2==='group2'){
        me.group2 =null;
      }
    }

}

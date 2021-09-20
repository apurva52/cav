import { ChangeDetectorRef,Component, OnInit,Input } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from '../catalogue-management/service/catalogue-management.model';
import { SubjectTags, TargetData } from '../pattern-matching.model';
import { PatternMatchingService } from '../service/pattern-matching.service';
import { getCatalogueCreatedState, getCatalogueCreatingErrorState, getCatalogueCreatingState, saveCatalogueCreatedState, saveCatalogueCreatingErrorState, saveCatalogueCreatingState } from '../service/pattern-matching.state';
import { RelatedmetricsComponent } from './../../metrics/relatedmetrics/relatedmetrics.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PatternMatchingComponent } from '../pattern-matching.component';
@Component({
  selector: 'app-save-catalogue',
  templateUrl: './save-catalogue.component.html',
  styleUrls: ['./save-catalogue.component.scss']
})
export class SaveCatalogueComponent implements OnInit {
  isVisible1:boolean= false;
  name: string;
  description:string;
  targetData: TargetData[];
  error: AppError;
  error1: boolean;
  loading: boolean;
  data:SaveCatlogueResponse;
  savecatalogue1:boolean=false;
  metricType:string;
  catalogueList:any;
  relatedCatalogue:boolean= false;
  flagTrue:boolean =false;
  graphType: string = "Business Transaction";
  @Input() patternMatchingComponent :PatternMatchingComponent;
  @Input() relatedmetricsComponent: RelatedmetricsComponent;
  constructor(private patternMatchingService: PatternMatchingService,public sessionService: SessionService,public confirmation: ConfirmationService,private messageService: MessageService, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
  
  }
  
  
show(taregetData1,graphType,metricTypederived,catalogueList){
  let me =this;
  me.name=null;
  me.description=null;
  if(taregetData1===undefined ||taregetData1===null ||taregetData1.length ===0){
    this.messageService.add({ severity: 'success', summary: 'Success message', detail:"No metric selected for saving catalogue" });
    return;
  }
  me.targetData =taregetData1;
  console.log("me.targetData--------->",me.targetData);
  //  const cctx = this.sessionService.session.cctx;
  //  let payload1 = {
  //   "opType": "get",
  //   "cctx":cctx,
  // }
 // me.catalogueList =me.getCatalogueInfo(payload1);
 // me.catalogueList =this.patternMatchingService.catalogueList;
 if(metricTypederived==="zero" &&metricTypederived!==null){
   this.metricType="Derived";
 }
 else{
  this.metricType="Normal";
 }
  me.isVisible1=true;
}


closeDialog(){
  this.isVisible1=false;
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
        return;
      }
    },
    (state: getCatalogueCreatingErrorState) => {
      me.getCatalogueonLoadingError(state);
    }
  );
}
getCatalogueonLoadingError(state: getCatalogueCreatingErrorState) {
  const me = this;
  me.data = null;
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
  me.data =state.data;
  if(me.data.status.code===501){
    me.catalogueList = [];
    return;
  }
  else{
  me.getcatalogueList(me.data.data);
  }
}
getcatalogueList(data: CatalogueTableData[]) {
  let me =this;
  me.catalogueList = [];
  for(let i=0;i<data.length;i++){
    if(data[i].name ===undefined){
      data.splice(i,1);
    }
    let json = data[i];
    json['label'] = data[i].name;
    json['value'] = data[i].name;
    //me.groupList.push(json);
   me.graphType= data[0].name;
   me.catalogueList.push(json);
   //if(me.data.data.length===1){
     me.patternMatchingService.setSelectedCatalogue(me.data.data[0].name);
     me.patternMatchingService.setCatalogueTableData(me.data.data);
     me.patternMatchingService.setCatalogueList(me.catalogueList);
   //}
  }
 }

/*This method calling from Open Related Metrics*****/
openSaveCatalogue(OpenrelatedCatalogue:boolean,catalogueList) {
  const me = this;
  me.relatedCatalogue = OpenrelatedCatalogue;
  me.catalogueList = catalogueList;
  me.name = '';
  me.description ='';
  me.isVisible1=true;
}

saveCatalogue(){
  let me =this;
  me.flagTrue =false;
  if(me.relatedCatalogue){
      me.validateNameAndDescription(me.name,me.description);
      if(me.flagTrue){
        return;
      }
      this.relatedmetricsComponent.updateCatalogue(me.name, me.description);
     
      me.isVisible1 = false;
  }
  else{
  me.validateNameAndDescription(me.name,me.description);
  if(me.metricType ){

  }
  if(me.flagTrue){
    return;
  }
  me.fillTargetData(this.patternMatchingService.groupNameObject,me.targetData);
  const cctx = this.sessionService.session.cctx;
  let creationDate:string;
  me.metricType= "Normal";
  // for(let i=0;i<me.targetData.length;i++){
  //   if(this.patternMatchingService.selectedTestIndices==='Specified'){
  //     let specifiedData = me.patternMatchingService.finalArrayOfSelectedIndices;
  //     // //me.targetData[i].description = specifiedData;
  //     // me.metricType= "Normal";
  //   }
  //   else if(this.patternMatchingService.selectedTestIndices==='Advance'){
  //   let advance =  this.patternMatchingService.expressionForAdvancedSelection;
  //   //let finalAdvance = advance.split("PATTERN#"); 
  //    // me.targetData[i].description = finalAdvance[1];
  //     //me.metricType= "Normal";
    
  //   }
  //   else{
  //       // me.targetData[i].description = '*';    
  //       // me.metricType= "Normal"; 
  //   }
  // }
  creationDate =new Date().toLocaleString();
  let payload: SaveCatalogue={
    'opType':"save",
    'cctx':cctx,
    'targetData': me.targetData,
    'name':me.name,
    'description':me.description,
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
        me.onLoading(state);
        return;
      }

      if (state instanceof saveCatalogueCreatedState) {
        me.onLoaded(state);
        //me.visible =false;
        //return;
      }
    },
    (state: saveCatalogueCreatingErrorState) => {
      me.onLoadingError(state);
    }
  );
  }
  //const cctx = this.sessionService.session.cctx;
  this.messageService.add({ severity: 'success', summary: 'Success message', detail:'Catalogue '+  me.name  + " saved successfully" });
   me.cd.detectChanges();
  me.isVisible1 =false;

}


  fillTargetData(groupNameObject: any, targetData: any[]) {
    let me =this;
    let tags :SubjectTags;
 
    for(let i=0;i<targetData.length;i++){
      tags ={
        "sMeta":targetData[i].vectorName,
        "appName":null,
        "key":null,
         "sName":null,
         "value":null,
          "mode":0
      }
      targetData[i].vectorName= tags;
   }
   

  }
  validateNameAndDescription(catalogueName: string, catalogueDescription: string) {
    let me =this;
    if ((catalogueName === undefined || catalogueName === null || catalogueName === "") &&  (catalogueDescription === "" || catalogueDescription === undefined || catalogueDescription === null)) {
     // me.savecatalogue1 = true;
      me.flagTrue =true;
      this.confirmation.confirm({
        header:'Catalogue Save Error',
        key: 'saveCatByName',
        message: 'Please enter valid name and description',
        accept: () => {return; },
        rejectVisible: false
      });
     // me.savecatalogue1 = false;
  }
  else if((catalogueName === undefined || catalogueName === null || catalogueName === "") && (catalogueDescription !== "" || catalogueDescription !== undefined || catalogueDescription !== null)){
    me.flagTrue =true;
    this.confirmation.confirm({
      header:'Catalogue Save Error',
      key: 'saveCatByName',
      message: 'Please enter valid name',
      accept: () => {return; },
      rejectVisible: false
    });
  }
  
 else if(catalogueDescription === "" || catalogueDescription === undefined || catalogueDescription === null){
    me.flagTrue =true;
    this.confirmation.confirm({
      header:'Catalogue Save Error',
      key: 'saveCatByName',
      message: 'Please enter valid description',
      accept: () => {return; },
      rejectVisible: false
    });
  }
  
else if(catalogueDescription!==undefined ||catalogueDescription!==null){
  if (catalogueDescription.startsWith('_') || catalogueDescription.includes('[') || 
    catalogueDescription.includes(']')) {
      //me.savecatalogue1 = true;
      me.flagTrue =true;
      this.confirmation.confirm({
        header:'Catalogue Save Error',
        key: 'saveCatByName',
        message: 'Please enter valid catalogue description. Catalogue description must start with alphabet. Maximum length is 128. Allowed characters are alphanumeric and following special characters: ( ) { } _ - . :',
        accept: () => {return; },
        rejectVisible: false
      });
      //me.savecatalogue1 = false;
      return;
  } 
}
else if(catalogueDescription === "" || catalogueDescription === undefined || catalogueDescription === null){
  me.flagTrue =true;
  this.confirmation.confirm({
    header:'Catalogue Save Error',
    key: 'saveCatByName',
    message: 'Please enter valid description',
    accept: () => {return; },
    rejectVisible: false
  });
}
 else if(catalogueName === "" || catalogueName === undefined || catalogueName === null){
  me.flagTrue =true;
  this.confirmation.confirm({
    header:'Catalogue Save Error',
    key: 'saveCatByName',
    message: 'Please enter valid description',
    accept: () => {return; },
    rejectVisible: false
  });
}
 if(catalogueDescription && catalogueName){
  if(catalogueName!==undefined ||catalogueName!==null||catalogueName!=="") {
    if (/[!$%^&*+|~=`{}:/<>?@#]/g.test(catalogueName)  || /^[0-9]/.test(catalogueName) || catalogueName.startsWith('_') || catalogueName.includes('[')||
    catalogueName.includes(']') || catalogueName.length > 32) {
      me.flagTrue =true;
        this.confirmation.confirm({
          header:'Catalogue Save Error',
          key: 'saveCatByName',
          message: 'Please enter valid name for catalogue having maximum 32 Characters, alphanumeric characters and special characters(-, _).',
          accept: () => {return; },
          rejectVisible: false
        });
        return;
    }
   }
  
  if(me.catalogueList){
    for(let i=0;i<me.catalogueList.length;i++){
        if(me.catalogueList[i].label ===catalogueName){
          me.flagTrue =true;
          this.confirmation.confirm({
            header:'Catalogue Save Error',
            key: 'saveCatByName',
            message: 'This catalogue name is already exist. Please specify different name.',
            accept: () => {return; },
            rejectVisible: false
          });
            break;
        }
       
    }
  }
    }

  }

  onLoadingError(state: saveCatalogueCreatingErrorState) {
    const me = this;
    me.error = null;
    me.data = null;
    me.loading = true;
  }
  onLoaded(state: saveCatalogueCreatedState) {
    let me =this;
    me.error = null;
    me.loading = false;
    me.data =state.data;
    if(me.data.status.code === 201){
      me.savecatalogue1 = true;
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
    me.isVisible1 =false;
  }

  onLoading(state: saveCatalogueCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

}

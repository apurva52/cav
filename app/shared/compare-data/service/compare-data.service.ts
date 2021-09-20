import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { CompareDataLoadingState, CompareDataLoadedState, CompareDataLoadingErrorState } from './compare-data.state';
import { COMPARE_DATA_TABLE } from './compare-data.dummy';
import { environment } from 'src/environments/environment';
import { Measurement, CompareDataSavedSnapshot, CompareDataTable, SnapShot } from './compare-data.model';
import { AnyCnameRecord } from 'dns';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class CompareDataService extends Store.AbstractService {
  constructor(private sessionService: SessionService) {
     super();
  } 
  snapshotsList: SnapShot;
 tmpMeasurement : Measurement;
 applyGlobalCompareFlag:boolean=false;
 widgetWiseCompareFlag :boolean =false;
 measurementSet:CompareDataSavedSnapshot[];
 measurementList:Measurement[];
 snapshotData:SnapShot[];
 getSnapshotData(){
   return this.snapshotData;
 }
 setSnapshotData(snapshotData:SnapShot[]){
  this.snapshotData =snapshotData;
 }
   getSnapshotsList(){
    return this.snapshotsList;
 }
 setSnapshotsList(snapshotsList:SnapShot){
   this.snapshotsList=snapshotsList;
   }
getTmpMeasurement(){
 return this.tmpMeasurement;
}
setTmpMeasurement(tmpMeasurement:Measurement){
  this.tmpMeasurement=tmpMeasurement;
}
setApplyGlobalCompareFlag(applyGlobalCompareFlag:boolean){
this.applyGlobalCompareFlag =applyGlobalCompareFlag
}
getApplyGlobalCompareFlag(){
  return this.applyGlobalCompareFlag;
}
getWidgetWiseCompareFlag(){
 return this.widgetWiseCompareFlag;
}
setWidgetWiseCompareFlag(widgetWiseCompareFlag:boolean){
this.widgetWiseCompareFlag =widgetWiseCompareFlag;
}
getMeasurementSet(){
  return this.measurementSet;
}
setMeasurementSet( measurementSet:CompareDataSavedSnapshot[]){
  this.measurementSet =measurementSet;
}
getMeasurementList(){
  return this.measurementList;
}
setMeasurementList(measurementList:Measurement[]){
this.measurementList =measurementList;
}

loadCategory(data1:SnapShot, snapshots?: CompareDataSavedSnapshot[]) {
    let me =this;
  const output: Subject<Store.State> = new Subject<Store.State>();
  let session =this.sessionService.session
  // output.next(new TireLoadingState());
  let data2 :any[]  = [];
  data2.push(data1);
  me.measurementSet =snapshots;
  me.setMeasurementSet(me.measurementSet);

  console.log("measurementSet----->",me.measurementSet);
  console.log("data2-e31111111111--------->",data1);
  console.log("data2---------->",data2);
  // /// DEV CODE ----------------->
let snapshotsList: CompareDataSavedSnapshot[]= [];
     let newSnapshotsList: CompareDataSavedSnapshot[]= [];

    newSnapshotsList =snapshots;
 
   const input: CompareDataTable = {
    data: data2,
    headers: COMPARE_DATA_TABLE.headers,
    snapshots:newSnapshotsList,
  snapshotsData:data2,
    };

  // setTimeout(() => {
  //   output.next(new CompareDataWidgetWiseLoadedState(input));
  // }, 2000);
  
  
  return input;
  
  }
  


  load(data1:SnapShot): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new CompareDataLoadingState());
    }, 0);

    /// DEV CODE ----------------->
    setTimeout(() => {
      output.next(new CompareDataLoadedState(COMPARE_DATA_TABLE));
      output.complete();
    }, 2000);
 
    const path = environment.api.compareData.load.endpoint;
    let payload = null;
     payload={
      cctx: me.sessionService.session.cctx,
      data:[data1]
       
     }
     me.controller.post(path, payload).subscribe(
      (data: any) => {
       output.next(new CompareDataLoadedState(me.parseMasurementData(data,data1)));
        output.complete();
      },
     (e: any) => {
       output.error(new CompareDataLoadingErrorState(e));
        output.complete();
       me.logger.error('Compare Data loading failed', e);
      }
    );
    return output;
  }

  parseMasurementData(data: any,data1:SnapShot): CompareDataTable {
    console.log("data----------->",data);
    let me = this;
    let snapshotsList: CompareDataSavedSnapshot[]= [];
    let newSnapshotsList: CompareDataSavedSnapshot[]= [];
    if(data === null ||data ===undefined ||data ===[] ||data ===''){
      return;
    }
    if(data.status.code === 201){
      if(sessionStorage.getItem('dataValue')){
        data.data = JSON.parse(sessionStorage.getItem('dataValue'));  
     }
     if(sessionStorage.getItem('dataLabel')){
      snapshotsList  = JSON.parse(sessionStorage.getItem('dataValue'));  
   }
    }
    else if(data.status.code === 202){
      if(sessionStorage.getItem('afterDeleteLabel')){
        snapshotsList= JSON.parse(sessionStorage.getItem('afterDeleteLabel'));  
     }
     if(sessionStorage.getItem('afterDeleteValue')){
      data.data  = JSON.parse(sessionStorage.getItem('afterDeleteValue'));  
   }
     
    }
 

    if(data.status === 501){
      data.data = data1;
      const input: CompareDataTable = {
        data: data,
        headers: COMPARE_DATA_TABLE.headers,
        snapshots:data.data,
        snapshotsData:data.data,
        };
        return input;
    }
    
    else{
    data.data.forEach(snapshotsList => { 
      newSnapshotsList.push({label:snapshotsList.snapShotName ,value: snapshotsList.snapShotName});
    });
    me.setMeasurementSet(newSnapshotsList);
      const input: CompareDataTable = {
      data: data,
      headers: COMPARE_DATA_TABLE.headers,
      snapshots:newSnapshotsList,
      snapshotsData:data.data,
      };
      return input;
  }
}





}

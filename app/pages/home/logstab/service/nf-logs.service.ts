import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { from, Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { AggDataLoadedState, AggDataLoadingErrorState, AggDataLoadingState, FieldsDataLoadedState, FieldsDataLoadingErrorState, LogsLoadedState, LogsLoadingErrorState, LogsLoadingState } from './logstab.state';
import {Duration} from '../service/logstab.model';

// const httpOptions = {
//   headers: new HttpHeaders({
//     // "Access-Control-Allow-Origin":"*",
//     // "Access-Control-Allow-Credentials": "true",
//     // 'Access-Control-Allow-Headers': 'Accept, Access-Control-Allow-Headers, X-Opaque-Id, Authorization, Content-Type',
      
//     'Content-Type': 'application/json',
    
//     // 'content-type': 'text/plain',
//     // 'Accept': 'application/json, text/plain, */*'
     

//     // 'Accept': '*/*'
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class NfLogsService extends Store.AbstractService {
  pipetempindex_value: any;
  timeDataCarrier: Subject<any> = new Subject<any>();

  requestpayload:object
  duration: Duration;
  

  constructor(private http:HttpClient) {
  super()
   }

  clientMsearch(indexpatternlist,query,gte, lte, sortparams,size,pipetempindex,tracktotalhits,_sourceFormat,plus_arr,minus_arr,exist_arr,maxdocVal,isLargeDataSet,responseformat,interval,timezone):Observable<Store.State> {
    const output = new Subject<Store.State>();
console.log(interval)
    setTimeout(() => {
    output.next(new LogsLoadingState());
    }, 0);

    this.pipetempindex_value =pipetempindex
    this.requestpayload={"requestType":"_msearch","index":indexpatternlist,"pipetempindex":this.pipetempindex_value,
    "isSummaryIndex":false,"ignore_unavailable":true,"size":size,"order":sortparams,"unmapped_type":"boolean",
    "gte":gte,"lte":lte,"format":"epoch_millis","query":query,"Track_Total_Hits":tracktotalhits,"interval":interval,"timezone":timezone,
    "_sourceFormat":_sourceFormat,"responseFormat":responseformat,"isLargeDataSet":isLargeDataSet,"plusFilterValue":plus_arr,"minusFilterValue":minus_arr,"existFilterValue":exist_arr}
  
    if( maxdocVal !== undefined) {
      this.requestpayload['maxdocVal'] = maxdocVal;
    }

  
    const msearch_url=environment.api.logs.msearch.endpoint
 //  return this.http.post(msearch_url, requestpayload, httpOptions)

 this.controller.post(msearch_url,this.requestpayload).subscribe((data)=>{ 
  output.next(new LogsLoadedState(data));
  output.complete();
  },
  (e: any) => {
  output.error(new LogsLoadingErrorState(e));
  output.complete();
  this.logger.error('loading failed', e);
  });
  return output
  


  }

  getAggData(): Observable<Store.State>{
    const output = new Subject<Store.State>();

setTimeout(() => {
output.next(new AggDataLoadingState());
}, 0);
    let aggUrl=environment.api.logs.aggdata.endpoint
     let payload={"requestType":"getaggdata"}
    this.controller.post(aggUrl,payload).subscribe((data)=>{
      console.log(data)
      
      output.next(new AggDataLoadedState(data));
      output.complete();
      },
      (e: any) => {
      output.error(new AggDataLoadingErrorState(e));
      output.complete();
      this.logger.error('loading failed', e);
      });
      return output

  }
  getFieldsData(): Observable<Store.State>{
    const output = new Subject<Store.State>();

setTimeout(() => {
output.next(new AggDataLoadingState());
}, 0);
    let fieldsUrl=environment.api.logs.fieldsdata.endpoint
    let payload={"requestType":"getfields"} 
    this.controller.post(fieldsUrl,payload).subscribe((data)=>{
      console.log(data)
      
      output.next(new FieldsDataLoadedState(data));
      output.complete();
      },
      (e: any) => {
      output.error(new FieldsDataLoadingErrorState(e));
      output.complete();
      this.logger.error('loading failed', e);
      });
      return output

  }

  

}

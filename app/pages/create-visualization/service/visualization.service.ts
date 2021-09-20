import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { Duration } from '../../home/logstab/service/logstab.model';
import { mappingLoadedState, mappingLoadingErrorState, visualLoadedState, visualLoadingErrorState } from './visualization-state';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService extends Store.AbstractService{
  duration: Duration;
  requestpayload: { isWebdashboard: boolean; requestType: string; gte: any; lte: any;order:string;  pipetempindex: any; timeZone: string; query: any; indexPattern: any; metricAggregation: any; bucketAggregation: any; _sourceFormat: any; docSampleSize: any };
  fieldDataCarrier: Subject<any> = new Subject<any>();
  constructor() {
    super()
   }

  visualization(query,index,gte,lte,sortparams,metvalue,buckvalue,timezone,pipetemindexvalue,_sourceformatvalue,sampleSize){
    const output = new Subject<Store.State>();
    let visualization_url=environment.api.logs.msearch.endpoint
console.log(sortparams)
    this.requestpayload={
      isWebdashboard:true,
      requestType:"unified_visualize_data",
      gte: gte,
      lte: lte,
      order:sortparams,
      pipetempindex: pipetemindexvalue,
      timeZone: 'Asia/Kolkata',
      query: query,
      indexPattern: index,
      metricAggregation: metvalue,
      bucketAggregation: buckvalue,
      _sourceFormat:_sourceformatvalue,
      docSampleSize: sampleSize
    }
    this.controller.post(visualization_url,this.requestpayload).subscribe((data)=>{ 
      output.next(new visualLoadedState(data));
      output.complete();
      },
      (e: any) => {
      output.error(new visualLoadingErrorState(e));
      output.complete();
      this.logger.error('loading failed', e);
      });
      return output

 
    }

    mapping_fields(indexpattern){
      const output = new Subject<Store.State>();
      let mapping_url=environment.api.logs.msearch.endpoint
     let  requestpayload={requestType:"_mappingfields",index:indexpattern,gte: 1582374480000,lte: 1613996879000}
      this.controller.post(mapping_url,requestpayload).subscribe((data)=>{ 
        output.next(new mappingLoadedState(data));
        output.complete();
        },
        (e: any) => {
        output.error(new mappingLoadingErrorState(e));
        output.complete();
        this.logger.error('loading failed', e);
        });
        return output
  
   
      }
      public createDuration(startTime: number, endTime: number, preset: string, viewBy: number): Duration {
        return {gte: startTime, lte: endTime, preset: preset, viewBy: viewBy}
      }
    
      public setDuration(duration: Duration) {
        this.duration = duration;
      }
    
      public getDuration(): Duration {
        return this.duration;
      }

  getVisualization() {
    const output = new Subject<Store.State>();
    const getVis = environment.api.logs.msearch.endpoint;
    const payload = {
      requestType:'_search',
      type: 'logVisualization'
    }
    this.controller.post(getVis, payload).subscribe((data) => {
      output.next(new visualLoadedState(data));
      output.complete();
    },
      (e: any) => {
        output.error(new visualLoadingErrorState(e));
        output.complete();
        this.logger.error('loading failed', e);
      });
    return output;
  }
    }


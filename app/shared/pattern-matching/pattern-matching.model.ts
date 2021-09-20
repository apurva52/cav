import { ClientCTX } from "src/app/core/session/session.model";
import { Status } from "src/app/pages/my-library/dashboards/service/dashboards.model";

export interface patternMatchRequest {
  opType? :number;
	 clientId:string;
	 appId:string;
	 cctx:ClientCTX;
	 duration : Duration;
	 tr:number;
	 etag:string;
   grpBy:any;
   flags:number[];
	 metricSetToLookup:MetricSetCtx;
   patternMatch:PatternMatchCtx;
   exclOverall:number;
  }
  

  export interface SubjectMeasureCtx{
     subject:any;
	 measure:MeasureCtx;
  }

  export interface MetricSetCtx{
    indicesInfo:SubjectMeasureCtx[];
    catalogueName:string;
  }

  export interface SubjectContext{
    tags:SubjectTags[];
  }
  export interface MeasureCtx{
       //Store the metric type
		mgType:string;
		//Store the Metric type id 
		mgTypeId:number;
		//Store the message of metric 
		 mg:string;
		//Store the metric Id
		 mgId:number;
		//Store the Metric Name
		  metric:string;
		//Store the metric Id
		 metricId:number;
		//Store the is show together or not  
		 showTogether:number;	
		metricIds:number[];
		metrics:string[];

  }
  export interface SubjectTags{
  key:string;
	value:string;
	mode:number;
	sMeta?:string;
	sName?:string;
	appName?:string;
  }

  export interface PatternMatchCtx {
    pThreshold:number;
    baseLineData:any;
  }
  export interface  Duration {
      et: number,
      preset: string,
      st: number,
      viewBy: number
    }

    export interface Filter{
         typ:any[];
         in:boolean;
         opt:string;
         val1:number;
         val2:number;
    }

//Pattern Match Response DTO
    export interface PatternMatchMetaDataResponseDTO{
         status:Status;
         cctx:ClientCTX;
         txName:string;
         grpMetaData:GroupMetaDataCtx[];
         etag:string; // for faster access of incremental data
    }

    export interface GroupMetaDataCtx{
         title:string
	     mdata:MetaDataCtx[];
    }
 export interface MetaDataCtx{
   subject:SubjectTags[];
	 measure:MeasureCtx;
	 glbMetricId:string;
	 pMatch:any;
 }
 export interface TargetData{
    description:string;
    glbMetricId:string;
    label:string;
    name:string;
    value:string;
    graphType: string;
    mgId: number;
    metricId: number;
    vectorName: SubjectTags;
    derivedNumber: number;
    originalFormula: string;
    mg: string;
    metric: string;
 }
 export interface GroupInfo{
  groupName: string,
  mgId: number,
  glbMgId: number,
  metricTypeName: string,
  vectorType: boolean,
  hierarchicalComponent: string
 }



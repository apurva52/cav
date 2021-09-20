import { PatternVal } from "./adv-metric-configuration-data";

export class MetricConfData{
    _mN:string=''; // metric name
    _metKeyIdx:string = '';// metric Key Index
    _metType:string ='scalar' // metric type can be scalar/vector
    _dT:string = 'sample'// data type 
    _mF:string = 'None'//metric formula
    _metDesc:string = '' //metric Description
    // defV : string = '';// default Value
    dF:string= '';// derived Formula
    // dFValue:string=''// derived formula value
    advPattern : PatternVal[] = [];
    id:number; // unique id 
    _unit:string = '';  // units for graph 
    _metKeyIdx_ui:string = ''; // key/Index UI
    _rD:string = ''  //readable
    _wR:string = ''  //writable
    _isChk:boolean = false;      //only checked metrices will be added in conf file and gdf.
}

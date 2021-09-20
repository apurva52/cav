import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { mappingLoadedState, mappingLoadingErrorState, mappingLoadingState } from '../service/visualization-state';
import { VisualizationService } from '../service/visualization.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IntegrationComponent implements OnInit {

  metricAgreegation: MenuItem[];
  bucketAgreegation: MenuItem[];
  interValArray = []
  selectedAgreegation: MenuItem;
  advance :MenuItem[]
  selectedValues: string[] = [];
  bucketFieldList: MenuItem[];
  selectedAdvance: MenuItem;
  counter:number = 2;
  Reset_click: boolean =true; 
  disableClrreset:boolean=true;
  saved_param:any;
  reset_disablecolor:any='silver';
  gaugeLevelOpt = [{levelValue: 30, levelColor: '#1976D2'}];
  gaugeMinVal = 0;
  gaugeMaxVal = 100;
  metricArray =[{id: "1", aggType: 'count', field: '',metfield:{label:''}, metAgg:{label: 'Count'},isMetricFieldAgg: false, customName: 'count'}];
  bucketArray =[{id: "2", aggType: 'date_histogram', field: '@timestamp',buckfield:{label:'',value:''} ,buckAgg:{label: 'Date Histogram'},interval:{name:'auto',val:'15m'},isDateBucket: true, customName: '@timestamp'}];
  // isMetricFieldAgg: boolean = false;
@Output() metbuckval: EventEmitter<any> = new EventEmitter(); 
@Output() customxval:EventEmitter<any> = new EventEmitter(); 
@Output() customyval:EventEmitter<any> = new EventEmitter();
@Output() optionVal:EventEmitter<any> = new EventEmitter();
@Input() chartType;
  mapping_fieldsdata: any;
  empty: boolean;
  Error: any;
  loading: boolean;
  legendOption:MenuItem[];
  legendPosition:any = {label: 'right'};
  isSmoothLine=false;
  isCurrentTime=false;
  isYaxisDataBound=false;
  isXaxisDataBound=false;
  isTooltipEnable=true;
  selectedChartMode:string;
  chartModeArray:MenuItem[]
  customxlabel: any;
  customylabel: any;
  applyenable:boolean;
  constructor(private vs:VisualizationService) { }

  ngOnInit(): void {
    const me = this;
    this.vs.mapping_fields("*").subscribe(
      (state: Store.State) => {
        if (state instanceof mappingLoadingState) {
          this.onmappingDataLoading(state);
          return;
        }

        if (state instanceof mappingLoadedState) {
          this.onmappingDataLoaded(state);
          return;
        }
      },
      (state: mappingLoadingErrorState) => {
        this.onmappingDataLoadingError(state);
      }
    );
    me.legendOption = [
      {label: 'right'},
      {label: 'left'},
      {label: 'center'}
    ]

    me.chartModeArray=[
      {label: 'Stacked'},
      {label: 'Overlap'},
      {label: 'Percentage'},
      {label: 'Wiggle'},
      {label: 'Silhouette'},
    ]
    me.metricAgreegation = [
      {label: 'Count'},
      {label: 'Count/sec'},
      {label: 'Sum'},
      {label: 'Min'},
      {label: 'Max'},
      {label: 'Average'},
    ];

    me.bucketAgreegation = [
      {label: 'Date Histogram'},
      {label: 'terms'},
    ]
    console.log(me.bucketAgreegation)
    
    

    

    me.interValArray = [
      { name: 'Auto', val: '15m' },
      { name: 'Millisecond', val: '5s' },
      { name: 'Second', val: '10s' },
      { name: 'Minute', val: '1m' },
      { name: 'Hourly', val: '1h' },
      { name: 'Weekly', val: '1w' },
      { name: 'Monthly', val: '1M' },
      { name: 'Yearly', val: '1y' },
      // { name: 'Custom', val: 'custom' },
    ]
  }

  onmappingDataLoading(state:mappingLoadingState){
    const me = this;
    me.mapping_fieldsdata = null;
    me.empty = false;
    me.Error = null;
    me.loading = true;
  }

  onmappingDataLoadingError(state:mappingLoadingErrorState){
    const me = this;
    me.mapping_fieldsdata = null;
    me.empty = false;
    me.Error = null;
    me.loading = true;
  }

  onmappingDataLoaded(state:mappingLoadedState){
    const me = this;
    me.mapping_fieldsdata = state.data
    console.log(me.mapping_fieldsdata.string_val)
    this.bucketFieldList=this.mapping_fieldsdata.date_val
    console.log(this.bucketFieldList)
  }

  addSubMetric(){
    const me = this;
    me.counter++;
    this.enbale_reset_btn();
    me.metricArray.push({id:  ""+me.counter, aggType: 'count',  field: '',metfield:{label:''},  metAgg:{label: 'Count'}, isMetricFieldAgg: false, customName: 'count'});
    console.log('filterArray is:::', me.metricArray)
  }

  removeFilter(index){
    const me = this;
    me.metricArray.splice(index, 1);
  }

  addSubBucket(){
    const me = this;
    me.counter++;
    this.enbale_reset_btn();
    me.bucketArray.push({id: ""+me.counter, aggType: 'date_histogram', field: '@timestamp',buckfield:{label:'',value:''}, buckAgg:{label: 'Date Histogram'},interval:{name:'auto',val:'15m'},isDateBucket: true, customName: '@timestamp'});
    console.log(me.bucketArray);
  }
 
  removeFilter2(index){
    const me = this;
    me.bucketArray.splice(index, 1);
  }

  setFieldvalue(val){
    console.log(val)
    this.enbale_reset_btn();
   val.field=val.metfield.label
   console.log(val.field)
  }

  setIsBucketFieldValue(val){
    val.field=val.buckfield.value
    this.enbale_reset_btn();
    console.log(val.field)
  }
  setIntervalValue(interval){
console.log(interval)
  }

  setIsMetricFieldValue(metricObj) {
    const metricAggTypes = {
      AVERAGE: "avg",
      SUM: "sum",
      MEDIAN: "Median",
      MIN: "min",
      MAX: "max",
      UNIQUECOUNT: "Unique Count",
      COUNT: "count",
      'COUNT/SEC': "countrate"
    };
    let metAggVal = metricObj.metAgg.label.toUpperCase();
    this.enbale_reset_btn()
    console.log('=========', metAggVal)
    metricObj.aggType = metricAggTypes[metAggVal];
    if (metricObj.metAgg.label != 'Count' && metricObj.metAgg.label != 'Count/sec') {
      metricObj.isMetricFieldAgg = true;
    }
    else {
      metricObj.isMetricFieldAgg = false;
    }
    console.log(metricObj);
  }

  setBucketFieldValue(bucketObj) {
    console.log(bucketObj)
    bucketObj.aggType = bucketObj.buckAgg.label;
    this.enbale_reset_btn();
    this.bucketFieldList=[]
    if (bucketObj.buckAgg.label == 'Date Histogram') {
      bucketObj.isDateBucket = true;
      this.bucketFieldList=this.mapping_fieldsdata.date_val
      
    }
    else {
      bucketObj.isDateBucket = false;
      this.bucketFieldList = this.mapping_fieldsdata.date_val.concat(this.mapping_fieldsdata.boolean_val,this.mapping_fieldsdata.number_val, this.mapping_fieldsdata.string_val)
      console.log(this.bucketFieldList);
    }
  }

  disable_reset_btn(){
    this.disableClrreset=true;
    this.Reset_click=true;

  }
  enbale_reset_btn(){
    this.disableClrreset=false;
    this.Reset_click=false;
    
  }

  addGaugeLevel() {
    this.gaugeLevelOpt.push({levelValue: 30, levelColor: '#1976D2'});
  }

  removeGaugeLevel() {
    this.gaugeLevelOpt.pop();
  }

  reset() {
    if (this.applyenable == true) {
    this.metricArray = this.saved_param.matrix;
    this.bucketArray = this.saved_param.bucket;
    this.customylabel = this.saved_param.customy;
    this.customxlabel = this.saved_param.customx;
    this.apply();
    }
    
    else {
    this.counter = 2;
    this.metricArray = [{ id: "1", aggType: 'count', field: '', metfield: { label: '' }, metAgg: { label: 'Count' }, isMetricFieldAgg: false,customName: 'count' }];
    this.bucketArray = [{ id: "2", aggType: 'date_histogram', field: '@timestamp', buckfield: { label: '', value: '' }, buckAgg: { label: 'Date Histogram' }, interval: { name: 'auto', val: '15m' }, isDateBucket: true, customName: '@timestamp' }];
    this.customylabel = ' ';
    this.customxlabel = ' ';
    console.log({ met: this.metricArray, buck: this.bucketArray })
    this.apply()
    }
    this.disable_reset_btn()
    }
 
  customchanges(val) {
    console.log(this.customylabel)
    if (val) {
    this.enbale_reset_btn()
    }
    }

    apply() {
      console.log({ met: this.metricArray, buck: this.bucketArray })
      this.applyenable = true;
      this.disable_reset_btn();
      this.saved_param = {
      matrix: JSON.parse(JSON.stringify(this.metricArray)),
      bucket: JSON.parse(JSON.stringify(this.bucketArray)),
      customx: this.customxlabel, customy: this.customylabel
      };
      this.metbuckval.emit({ met: this.metricArray, buck: this.bucketArray });
      // this.customyval.emit(this.customylabel);
      // this.customxval.emit(this.customxlabel);
      this.optionVal.emit({ positionLegend: this.legendPosition, tooltipEnable: this.isTooltipEnable, gaugeMinVal: this.gaugeMinVal, gaugeMaxVal: this.gaugeMaxVal, gaugeLevelArr: this.gaugeLevelOpt });
      }

}

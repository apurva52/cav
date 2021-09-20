import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { MenuItem } from 'primeng';
import { LOG_DETAILS_TABLE } from './service/log-details.dummy';
import { LogDetailsTable, LogDetailsTableHeaderCols } from './service/log-details.model';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LogDetailsComponent implements OnInit {
  data: LogDetailsTable;
  settingOptions: MenuItem[];
  widgetReportItems: MenuItem[];
  items1: MenuItem[];
  checkTab: number = 0;
  _selectedColumns: LogDetailsTableHeaderCols[] = [];
  cols: LogDetailsTableHeaderCols[] = [];
  selectedRow: any;
  isOn: boolean=true;

  @Output() arrowClick = new EventEmitter<boolean>();
  @Input() rowdata;
  @Output() pairs  = new EventEmitter<any[]>();
  @Output() plus_paramsObject  = new EventEmitter<{ match_phrase: { [x: number]: { query: any; }; }; }>();
  @Output() minus_paramsObject  = new EventEmitter<{ match_phrase: { [x: number]: { query: any; }; }; }>();
  @Output() exist_paramsObject  = new EventEmitter<{ exists: { field: any; }; }>();
  jsonView: any;
  json: any = {
    "$schema": 'http://json-schema.org/draft-07/schema#',
    "type": 'object',
    "title": 'Object',
    "additionalProperties": false,
    "properties": {
      "string": {
        "type": 'string',
        "title": 'String',
      },
    },
  }
 
  
  validpairs=[]
 // exist_paramsObject: { exists: { field: any; }; };
 // paramsObject: { match_phrase: { [x: number]: { query: any; }; }; };
  
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.items1 = [
      { label: 'Filter for value',command: ($event) => {
        const me = this;
       // me.filterdata($event);
      }},
      { label: 'Filter for field present'},
      { label: 'Toggle column in table'}
    ];
    me.settingOptions = [
      { label: 'Alerts'},
      { label: 'Dashboard'},
      { label: 'Tier Status'}
    ];
    me.widgetReportItems = [
      {label: 'TABLE', command: (event: any) => {me.checkTab = 0 }},
      {label: 'JSON', command: (event: any) => {me.checkTab = 1 }},  
    ];
    me.data = LOG_DETAILS_TABLE;
    console.log(this.rowdata)
    me.data.layoutTable.data=[]
    me.data.detailInfoTable.data=[]
  //  delete this.rowdata.responseBtns
   // delete this.rowdata.no
   // delete this.rowdata.icon
    console.log(this.rowdata)
    me.data.layoutTable.data.push(this.rowdata)
    console.log(me.data.layoutTable.data)
console.log(this.rowdata)
    me.data.detailInfoTable.data=this.rowdata.response
    
    console.log(me.data.detailInfoTable.data)
    this.json=this.rowdata.response
    me.cols = me.data.detailInfoTable.headers[0].cols;
    for (const c of me.data.detailInfoTable.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    this.jsonView = JSON.stringify(this.json,null,2);
    
  }
  plusfilter(val) {
    console.log(val)
   let TableKey=val.label
   let TableValue=val.value
    if(TableKey=='@timestamp')
    {
      TableValue=TableValue.replace('th','')
      TableValue=moment(new Date(TableValue).getTime()).format('YYYY-MM-DD,h:mm:ss.SSS');
      //console.log(TableValue)
    }
    this.pairs.emit([TableKey,TableValue])
    this.validpairs.push(TableKey)
    let checker=this.pairchecker(TableKey)
if(checker=='pairfound'){
console.log("pair")
}else{
    this.plus_paramsObject.emit({"match_phrase":{[TableKey]:{"query":TableValue}}})
    console.log(this.plus_paramsObject)
  }
}
  
  minusfilter(val) {
    console.log(val)
    let TableKey=val.label
    let TableValue=val.value
    if(TableKey=='@timestamp')
  {
    TableValue=TableValue.replace('th','')
    TableValue=moment(new Date(TableValue).getTime()).format('YYYY-MM-DD,h:mm:ss.SSS');
    //console.log(TableValue)
  }
  this.pairs.emit([TableKey,TableValue])
  this.minus_paramsObject.emit({"match_phrase":{[TableKey]:{"query":TableValue}}})
    

  }
  existfilter(val) {
    console.log(val)
    let TableKey=val.label
    let TableValue=val.value
    if(TableKey=='@timestamp')
    {
      TableValue=TableValue.replace('th','')
      TableValue=moment(new Date(TableValue).getTime()).format('YYYY-MM-DD,h:mm:ss.SSS');
      //console.log(TableValue)

    }
    this.exist_paramsObject.emit({"exists":{field:TableKey}})
    this.pairs.emit(["field",TableKey])

  }
pairchecker(value){
  console.log(value)

  console.log(this.validpairs)

for(let i=0;i<this.validpairs.length;i++)
{
  if(this.validpairs[i]==value && this.validpairs.length>1)
  {
    return 'pairfound'

  }
  else{
    return 'pairnotfound'
  }
}
}

  @Input() get selectedColumns(): LogDetailsTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: LogDetailsTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  backToMethodTiming() {
    this.isOn = false;
    this.arrowClick.emit(this.isOn);
  }

}

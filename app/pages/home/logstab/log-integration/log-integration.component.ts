import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
// import * as EventEmitter from 'node:events';
import { LOG_INTEGRATION_DATA } from './service/log-integration.dummy';
import { LogIntegrationData } from './service/log-integration.model';

@Component({
  selector: 'app-log-integration',
  templateUrl: './log-integration.component.html',
  styleUrls: ['./log-integration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LogIntegrationComponent implements OnInit {

  data: LogIntegrationData;
  validpairs=[]
  @Input() fieldsArray
  @Input() filterVal
  @Output() field: EventEmitter<any> = new EventEmitter();
  @Output() pairs  = new EventEmitter<any[]>();
  @Output() plus_paramsObject  = new EventEmitter<{ match_phrase: { [x: number]: { query: any; }; }; }>();
  @Output() minus_paramsObject  = new EventEmitter<{ match_phrase: { [x: number]: { query: any; }; }; }>();
ngOnChanges(){
  if(this.fieldsArray.length!=0){
    this.ngOnInit()
  }
  if(this.filterVal!=undefined){
    console.log(this.filterVal)
    console.log(this.validpairs)
    for(let i=0;i<this.validpairs.length;i++)
{
  if(this.validpairs[i]==this.filterVal){
    this.validpairs.splice(i,1)
  }
}  }
  
}


  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = LOG_INTEGRATION_DATA;
    me.data.data=this.fieldsArray
  }

  addField(fieldValue,row){
    console.log('field value:::',fieldValue);
    console.log('IS SELECTED:::',row);
    row.isSelected = true;
    this.field.emit(fieldValue);
  }

  minusfilter(rowData,field){
    console.log(rowData);
    let TableKey=rowData.name
    let TableValue=field.value
    if(rowData.name=='tags'){
      TableValue =field.value[0]
    }
    if(TableKey=='@timestamp')
    {
      TableValue=TableValue.replace('th','')
      TableValue=moment(new Date(TableValue).getTime()).format('YYYY-MM-DD,h:mm:ss.SSS');
      //console.log(TableValue)
    }
    this.pairs.emit([TableKey,TableValue])
    this.minus_paramsObject.emit({"match_phrase":{[TableKey]:{"query":TableValue}}})

  }
plusfilter(rowData,field){
console.log(rowData);
let TableKey=rowData.name
let TableValue=field.value
if(rowData.name=='tags'){
  TableValue =field.value[0]
}
if(TableKey=='@timestamp')
{
  TableValue=TableValue.replace('th','')
  TableValue=moment(TableValue).format('YYYY-MM-DD,h:mm:ss.SSS');
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



}

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { LOG_TABLE } from './service/log-table.dummy';
import { LogTable } from './service/log-table.model';
import { NfLogsService } from '../../home/logstab/service/nf-logs.service';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class LogTableComponent implements OnInit {

  data: LogTable;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  RowData: any;
  fieldsdata:any
  isOn: boolean;
  isCustomTable= false;
  isCreateTable=false;
  @Output() rowClick = new EventEmitter<boolean>();
  @Input() tabledata
  @Output() NDNVIntegration: EventEmitter<any> = new EventEmitter();
  @Output() sortData: EventEmitter<any> = new EventEmitter();
    //@ViewChild(CreateVisualizationComponent) child:CreateVisualizationComponent;
    sorting_input:boolean=true;
    sorting_order(){
      this.sorting_input=!this.sorting_input
      console.log(this.sorting_input);
      this.sortData.emit(this.sorting_input)
      //this.child.visData();
    }
  ngOnChanges() {
    // changes=this.nfdbresponse
    console.log(this.tabledata.length)
  console.log
    if(this.tabledata.length !== 0){
      console.log("valuee")
      this.ngOnInit()
    }
  }

  constructor(private NfLogsService:NfLogsService) { }

  ngOnInit(): void {
    const me = this;
    me.data = LOG_TABLE;
    console.log(this.tabledata)
    me.data.data=this.tabledata
    me.getFieldsValue()
  }
  getFieldsValue() {
    const me = this;
    me.NfLogsService.getFieldsData().subscribe((res)=>{
      me.fieldsdata=res['data'];
      console.log(me.fieldsdata)
    })
  }
  addTableColumn(field) {
    console.log('field is adding:;',field)
    if (this.isCreateTable == false || this.isCustomTable == false) {
      console.log('table added first time')
      this.isCreateTable = true;
      this.data.headers[0].cols.forEach((element,index) => {
         console.log(element.label)
        if(element.label == 'Log Information') {
          this.data.headers[0].cols.splice(index,1);
        }
      });
    }
    let colLength = this.data.headers[0].cols.length
    let fieldObj = {
      label: field,
      valueField: field,
      classes: 'text-left',
      badgeField: true,
      width: '30%',
    }
    this.data.headers[0].cols.splice(colLength-1,0,fieldObj);
  }
  
  deleteColumn(index, fieldName) {
    this.data.headers[0].cols.splice(index,1);
    console.log(this.fieldsdata)
    this.fieldsdata.forEach(element => {
      if (element.name == fieldName) {
        element.isSelected = false;
      }
    });
    if (this.data.headers[0].cols.length == 2) {
      this.isCreateTable = false;
      this.isCustomTable = false;
      let respCol =  {
        label: 'Log Information',
        valueField: 'keyword',
        classes: 'text-left',
        badgeField: true,
        width: '70%',
      }
      this.data.headers[0].cols.splice(1,0,respCol);
    }
  }

  getFpId(rowdata, isCheckFP) {
    let fp = rowdata.filter(ele => ele.label == 'fp');
    if (fp.length > 0 ) {
      if(isCheckFP == true) {
        return true;
      }
      return fp[0].value.split(':')[1];
    }
    else {
      return false
    }
  }

  integrationByFP(prodType, respInfo) {
    this.NDNVIntegration.emit({prodName:prodType,rowData:respInfo})
  }
  toLogDetails(value){
    this.isOn = true;
    this.RowData=value
    console.log(this.RowData)
    this.rowClick.emit(this.isOn)
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

}

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ADD_MONITOR_FORM } from '../../add-monitor/service/add-monitor.dummy';
import { AwsConfigHeaderCols, AwsConfigTable } from '../../add-monitor/service/add-monitor.model';
import { AWS_CONFIG_FORM } from './service/aws-configuration.dummy';

@Component({
  selector: 'app-aws-configuration',
  templateUrl: './aws-configuration.component.html',
  styleUrls: ['./aws-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AwsConfigurationComponent implements OnInit {

  formData: any;

  selectedRadioOption:any;

  configData: AwsConfigTable;

  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  
  cols: AwsConfigHeaderCols[] = [];
  _selectedColumns: AwsConfigHeaderCols[] = [];

  globalFilterFields: string[] = [];
  
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  constructor() { }

  ngOnInit(): void {

    const me = this;
     me.formData = AWS_CONFIG_FORM.components;

     me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]
    
    me.configData = AWS_CONFIG_FORM.table;

    me.cols = me.configData.headers[0].cols;
    for (const c of me.configData.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

  }

  @Input() get selectedColumns(): AwsConfigHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: AwsConfigHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  public showChild(node) {

    if(node.dependentComp && node.dependentComp.length > 0){
      if(node.type === 'Checkbox'){
        return node.value;
      }else{
        return true;
      }
    }

    return false
  }



}

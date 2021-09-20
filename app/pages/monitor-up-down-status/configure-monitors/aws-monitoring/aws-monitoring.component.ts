import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { AWS_MONITOR_DATA } from './service/aws-monitoring.dummy';
import {  AWSMonitoring, AwsTable, AwsTableHeaderColumn } from './service/aws-monitoring.model';

@Component({
  selector: 'app-aws-monitoring',
  templateUrl: './aws-monitoring.component.html',
  styleUrls: ['./aws-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AwsMonitoringComponent implements OnInit {

  totalConfigData: any[];
  awsMonitoringData: AWSMonitoring;

  data: AwsTable;

  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  
  cols: AwsTableHeaderColumn[] = [];
  _selectedColumns: AwsTableHeaderColumn[] = [];

  globalFilterFields: string[] = [];
  
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  configuredItems: any[];
  
  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.configuredItems = [
      {
        "label": "AWS Elastic Cache",
        "value": "AWS Elastic Cache"
      },
      {
        "label": "Dynamo DB",
        "value": "Dynamo DB"
      }];

    me.awsMonitoringData = AWS_MONITOR_DATA;
    me.totalConfigData = [
      {
        title: 'Amazon Simple Storage Service',
        data: [
        {
        label: 'Instances',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'AWS Elastic Cache',
        data: [
        {
        label: 'Instances',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'EBS',
        data: [
        {
        label: 'Volume',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'Dynamo DB',
        data: [
        {
        label: 'Tables',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'RDS',
        data: [
        {
        label: 'Instances',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'Elastic Cache',
        data: [
        {
        label: 'Instances',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'Database',
        data: [
        {
        label: 'Volume',
        value: '14'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      },
      {
        title: 'Others',
        data: [
        {
        label: 'Tables',
        value: '100'
        },
        {
        label: 'Regions',
        value: '7'
        }]
      }
      ]


      me.downloadOptions = [
        { label: 'WORD'},
        { label: 'PDF'},
        { label: 'EXCEL'}
      ]
      
      me.data = AWS_MONITOR_DATA.table;
      console.log(me.data);
      me.cols = me.data.headers[0].cols;
      for (const c of me.data.headers[0].cols) {
        me.globalFilterFields.push(c.valueField);
        if (c.selected) {
          me._selectedColumns.push(c);
        }
      }
      

    
  }

  @Input() get selectedColumns(): AwsTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: AwsTableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

}

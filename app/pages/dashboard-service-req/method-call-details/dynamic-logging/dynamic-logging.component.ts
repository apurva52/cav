import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { DYNAMIC_LOGGING_TABLE } from './service/dynamic-logging.dummy';
import { DynamicLoggingTable } from './service/dynamic-logging.model';

@Component({
  selector: 'app-new-dynamic-logging',
  templateUrl: './dynamic-logging.component.html',
  styleUrls: ['./dynamic-logging.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicLoggingComponent implements OnInit {
  data: DynamicLoggingTable;
  tabs: MenuItem[];
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  displayBasic: boolean;
  methodDetails: boolean;
  activeIndex: number;
  isOn: number;
  items: MenuItem[];
  selectedRow = [];
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
  @Output() arrowClick =new EventEmitter<number>();
 
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = DYNAMIC_LOGGING_TABLE;
    me.items = [
      {
        label : 'Word'
      },
      {
        label : 'Excel'
      },
      {
        label : 'PDF'
      }
    ]
    this.jsonView = JSON.stringify(this.json,null,2);
  }
  hotspotMethod() {
    this.isOn = 1;
    this.arrowClick.emit(this.isOn);
  }
 
  closeTab(flag){
    this.isOn = flag;
  }
}

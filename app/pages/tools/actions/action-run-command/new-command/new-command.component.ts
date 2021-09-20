import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { NEW_COMMAND_DATA } from './service/new-command.dummy';
import { NewCommand } from './service/new-command.model';

@Component({
  selector: 'app-new-command',
  templateUrl: './new-command.component.html',
  styleUrls: ['./new-command.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewCommandComponent implements OnInit {
  loading: boolean;
  empty: boolean;
  data: NewCommand;

  downloadOptions: MenuItem[];

  tierName: any;
  serverName: any;
  groupName: any;
  commandName: any;

  reverseOrder: any;
  humanReadableFormat: any;
  longList: any;
  hiddenFiles: any;
  sortByTime: any;

  repeatCommand: any;
  repeatVal: any;

  saveOutput: any;

  viewType: any;
  deliMeter: any;

  serverTime: any = '1/02/2020 01:12:34(CST)';

  selectedReport: any;

  isShowColumnFilter: boolean = false;

  showData:boolean = true;

  totalRecords: number;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      {
        label: 'PDF',
      },
      {
        label: 'Excel',
      },
    ];
    me.data = NEW_COMMAND_DATA;

    me.cols = me.data.commandDetails.commandData.headers[0].cols;
    for (const c of me.data.commandDetails.commandData.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  clearData(){
    const me = this;
    me.showData = false;
  }

  runCommand(){
    const me = this;
    me.showData = true;
  }
}

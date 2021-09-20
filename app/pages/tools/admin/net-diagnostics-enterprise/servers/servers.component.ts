import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { UpgradeCmonComponent } from '../dialogs/upgrade-cmon/upgrade-cmon.component';
import { CmonStatsComponent } from '../dialogs/cmon-stats/cmon-stats.component';
import { RunCommandComponent } from '../dialogs/run-command/run-command.component';
import { RunningMonitorsComponent } from '../dialogs/running-monitors/running-monitors.component';
import { SERVERS_DATA } from './service/servers.dummy';
import { ServersTable } from './service/servers.model';
import { StartNcmonComponent } from '../dialogs/start-ncmon/start-ncmon.component';
import { CmonVersionComponent } from '../dialogs/cmon-version/cmon-version.component';
import { ShowCmonComponent } from '../dialogs/show-cmon/show-cmon.component';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServersComponent implements OnInit {
  data: ServersTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  downloadOptions: MenuItem[];
  serverOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';

  @ViewChild('runcommand', { read: RunCommandComponent })
  runcommand: RunCommandComponent;

  @ViewChild('runningmonitor', { read: RunningMonitorsComponent })
  runningmonitor: RunningMonitorsComponent;

  @ViewChild('cmonstat', { read: CmonStatsComponent })
  cmonstat: CmonStatsComponent;

  @ViewChild('upgradeCmon', { read: UpgradeCmonComponent })
  upgradeCmon: UpgradeCmonComponent;

  @ViewChild('startNcmon', { read: StartNcmonComponent })
  startNcmon: StartNcmonComponent;

  @ViewChild('cmonVersion', { read: CmonVersionComponent })
  cmonVersion: CmonVersionComponent;

  @ViewChild('showCmon', { read: ShowCmonComponent })
  showCmon: ShowCmonComponent;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const me = this;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];

    me.serverOptions = [
      {
        label: 'Upgrade CMON',
        command: (event: any) => {
          this.upgradeCmon.openUpgradeCmonDialog();
        },
      },
      {
        label: 'Start CMON',
        command: (event: any) => {
          this.startNcmon.openStartNcmonDialog();
        },
      },
      {
        label: 'Restart CMON',
      },
      {
        label: 'Stop CMON',
      },
      {
        label: 'Show CMON',
        command: (event: any) => {
          this.showCmon.openShowCmonDialog();
        },
      },
      {
        label: 'CMON Version',
        command: (event: any) => {
          this.cmonVersion.openCmonVersionDialog();
        },
      },
      {
        label: 'Show Running Monitors',
        command: (event: any) => {
          this.runningmonitor.openRunningMonitorDialog();
        },
      },
      {
        label: 'Run Command',
        command: (event: any) => {
          this.runcommand.openRunCommandDialog1();
        },
      },
      {
        label: 'CAVMON Stats',
        command: (event: any) => {
        this.cmonstat.openCmonStatDialog();
        },
      },
      {
        label: 'Upload File',
      },
    ];

    me.data = SERVERS_DATA;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }



  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
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

  toAddServer() {
    this.router.navigate(['/add-server']);
  }
}

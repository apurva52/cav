import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MenuItem, Table } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { SelectItem } from 'src/app/pages/drilldown/flow-path/flow-path.component';
import { Metadata } from 'src/app/pages/home/home-sessions/common/interfaces/metadata';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';

@Component({
  selector: 'app-special-reports',
  templateUrl: './special-reports.component.html',
  styleUrls: ['./special-reports.component.scss']
})
export class SpecialReportsComponent implements OnInit, OnChanges {
  @Input() filters: any;
  @ViewChild('dt') dt: Table;


  metadata: Metadata;
  channels: SelectItem[];
  pages: { label: any; value: { pageName: any; pageid: any; }; }[];
  locations: SelectItem[];
  browsers: { label: any; value: { browserName: any; browserid: any; version: any; }; }[];
  events: SelectItem[];
  storeIDs: SelectItem[];
  storeNames: SelectItem[];
  connectionTypes: SelectItem[];
  appNameandVersions: SelectItem[] = [];

  columns: any[];
  tableData: any[] = [];
  loading: any;
  error: any;
  crqName: string;
  items: MenuItem[];
  exportColumns: any[];
  _selectedColumns: any[];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this._selectedColumns = this.columns.filter(col => val.includes(col));
  }

  constructor(private http: NvhttpService, private metadataService: MetadataService) {
    this.items = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'EXCEL', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.generateReport();
    }
  }

  ngOnInit(): void {
    this.getMetadata();
    this.getAppNameandVersion();
  }

  getMetadata() {
    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      // Channel
      const channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        };
      });

      // Pages
      const pagesKey: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.pages = pagesKey.map(key => {
        return {
          label: this.metadata.pageNameMap.get(key).name,
          value: { pageName: this.metadata.getPageName(key).name, pageid: key }
        };
      });

      // Location
      const locationm: any[] = Array.from(this.metadata.locationMap.keys());
      this.locations = locationm.map(key => {
        const loc = this.metadata.locationMap.get(key).state ? (this.metadata.locationMap.get(key).state + ',') : '';
        return {
          label: loc + this.metadata.locationMap.get(key).country,
          value: this.metadata.locationMap.get(key).country
        };
      });

      // Browsers
      const bsm: any[] = Array.from(this.metadata.browserMap.keys());
      this.browsers = bsm.map(key => {
        return {
          label: this.metadata.browserMap.get(key).name,
          value: {
            browserName: this.metadata.getBrowser(parseInt(key, 10)).name,
            browserid: key,
            version: this.metadata.getBrowser(parseInt(key, 10)).version
          }
        };
      });

      // Events
      const eventKeys: any[] = Array.from(this.metadata.eventMap.keys());
      this.events = eventKeys.map(key => {
        return {
          label: this.metadata.eventMap.get(key).name,
          value: key
        };
      });

      // Store IDs
      const storeid: any[] = Array.from(this.metadata.storeMap.keys());
      this.storeIDs = storeid.map(key => {
        return {
          label: this.metadata.storeMap.get(key).name + '(' + this.metadata.storeMap.get(key).id + ')',
          value: this.metadata.storeMap.get(key).id
        };
      });

      //  Store Name
      const storename: any[] = Array.from(this.metadata.storeMap.keys());
      this.storeNames = storename.map(key => {
        return {
          label: this.metadata.storeMap.get(key).name,
          value: this.metadata.storeMap.get(key).id
        };
      });

      // Store IDs
      this.storeIDs = storename.map(key => {
        return {
          label: this.metadata.storeMap.get(key).id,
          value: this.metadata.storeMap.get(key).id
        };
      });

      const connection: any[] = Array.from(this.metadata.connectionMap.keys());
      this.connectionTypes = connection.map(key => {
        return {
          label: this.metadata.connectionMap.get(key).name,
          value: this.metadata.connectionMap.get(key).id,

        };
      });

    });
  }

  generateReport(): void {
    this.columns = [];
    this.tableData = [];

    this.http.getReportData(this.filters).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
        this.columns = [];
        this.tableData = [];
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;

        if (state.data.length) {
          const headers = state.data[0]['Response Page Report Header'][0];
          const keys = Object.keys(headers);

          keys.sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
          });

          keys.forEach(key => {
            this.columns.push({ header: headers[key], field: key });
          });

          this._selectedColumns = this.columns;

          this.exportColumns = this.columns.map(col => ({ title: col.header, dataKey: col.field }));


          this.tableData = state.data[0]['Response Page Report'];

          this.processTableData();

        }
      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.error = state.error;
        this.tableData = [];
        this.columns = [];
      }
    });

  }

  processTableData() {
    for (const i of this.tableData) {
      for (const key in i) {
        if (!isNaN(i[key])) {
          i[key] = Number(i[key]);

        } else if (i[key] === '' || i[key] === 'null' || i[key] === null || i[key] === undefined) {
          i[key] = 0;
        }
      }
    }

    if (this.crqName === 'NativeAppOverallPerformanceReport') {
      for (const i of this.tableData) {
        for (const key in i) {
          switch (key) {
            case 'column00':
              i[key] = this.getPageName(i[key]);
              break;
            case 'column01':
              i[key] = this.getAppVersion(i[key]);
              break;
            case 'column02':
              i[key] = this.getConnectionName(i[key]);
              break;
          }
        }
      }

      // Remove those rows where application version =-1
      let tmpData = [];
      for (const i of this.tableData) {
        if (i.column01 !== 'Others') {
          tmpData.push(i);
        }
      }
      this.tableData = tmpData;
    }
  }

  getPageName(pageid) {
    return this.metadata.pageNameMap.get(pageid) ? this.metadata.pageNameMap.get(pageid).name : 'Others';
  }

  getAppVersion(data) {
    for (const i of this.appNameandVersions) {
      if (i.value === data) {
        return i.label;
      }
    }
    return 'Others';
  }


  isNumber(number) {
    return isNaN(number);
  }

  getConnectionName(id) {
    return this.metadata.connectionMap.get(id) ? this.metadata.connectionMap.get(id).name : 'Others';
  }

  getAppNameandVersion() {
    if (this.crqName === 'NativeAppOverallPerformanceReport') {
      if (!this.appNameandVersions.length) {
        this.http.getAppNameandVersion().subscribe((state: Store.State) => {
          if (state instanceof NVPreLoadedState) {
            for (const i of state.data) {
              // tslint:disable-next-line: no-string-literal
              this.appNameandVersions.push({ label: i.name, value: i.id });
            }
          }
        }, (state: Store.State) => {
          if (state instanceof NVPreLoadingErrorState) {
            console.log('Failed to get App Name and Version | Error - ', state.error);
          }
        });
      }
    }
  }

  exportCSV() {
    if (this.dt) {
      this.dt.exportCSV();
    }
  }

  exportPdf() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.tableData);
        doc.save(`${this.filters.filObj.reportName}.pdf`);
      });
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.tableData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.filters.filObj.reportName);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}

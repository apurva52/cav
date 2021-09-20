import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { TableHeaderColumn } from '../../../../shared/table/table.model'; 
import { CONTROLLER_NAME_DATA} from './dashboard.dummy'; 
import { MenuItem, Table} from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../../home-sessions/common/util/export-util'; 
import { Router } from '@angular/router'; 
import { NsmhttpservicesService} from './../nsmhttpservices.service'; 
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
@Component({
  selector: 'app-nsm-dashboard',
  templateUrl: './nsm-dashboard.component.html',
  styleUrls: ['./nsm-dashboard.component.scss'], 
  encapsulation: ViewEncapsulation.None,
})
export class NsmDashboardComponent implements OnInit { 
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0; 
  lat = 13;
  lng = 80; 
  error: string;
  loading: boolean = false;
  empty: boolean;
  totalRecordspivot = 0;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters'; 
  checkdata:any;  
  tatalinfo :any; 
  totalServer:any; 
  loadGenrators:any; 
  controllers :any; 
  sumOfblades:any; 
  chartb: any; 
  dedicated:any; 
  freeServer:any; 
  additional:any; 
  servercount:any; 
  onserver:any; 
  offserver:any; 
  chartserver:any; 
  getrator:any; 
  controller:any;
  netstrom:any; 
  noTypeSCount:any; 
  securityscan:any; 
  healthCheck:any; 
  downstatus:any; 
  mailcheck:any;
  
  constructor(private router: Router, private http: NsmhttpservicesService) { }

  ngOnInit() {  
    const me = this; 
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
                        ];

   

    me.data = CONTROLLER_NAME_DATA;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    } 
    this.getDataForcontrollers(); 
    this.getForcarddata();
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
  location(x) {
    this.lat = x.coords.lat;
    this.lng = x.coords.lng;
  } 

  exportCSV() {
    // save current state of table. 
    const rows = this.servers.rows;
    const first = this.servers.first;
    this.servers.rows = this.totalRecords;
    this.servers.first = 0;

    setTimeout(() => {
      try {
        ExportUtil.exportToCSV(this.servers.el.nativeElement, 1, 'blades.csv');
      } catch (e) {
        console.error('Error while exporting into CSV');
      }

      //revert back to previous state. 
      this.servers.rows = rows;
      this.servers.first = first;
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      // save the current state. 
      // get rows and first value. 
      const rows = this.servers.rows;
      const first = this.servers.first;

      this.servers.rows = this.totalRecords;

      this.servers.first = 0;
      setTimeout(() => {
        try {
          const jsonData = ExportUtil.getXLSData(this.servers.el.nativeElement, 1);
          const worksheet = xlsx.utils.json_to_sheet(jsonData.data, { header: jsonData.headers, skipHeader: true });
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer);
        } catch (e) {
          console.error('error while exporting in xls, error - ', e);
        }

        //reset table properties. 
        this.servers.rows = rows;
        this.servers.first = first;
      });
    });
  }


  saveAsExcelFile(buffer: any): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      // const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, 'blades.xlsx');
    });
  }

  exportPdf() {
    // save current state of table. 
    const rows = this.servers.rows;
    const first = this.servers.first;
    this.servers.rows = this.totalRecords;
    this.servers.first = 0;

    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.servers.el.nativeElement));
        //autoTable(doc, {html: this.table.el.nativeElement});
        const jsonData = ExportUtil.generatePDFData(this.servers.el.nativeElement, 1);
        console.log('session-page export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('blades.pdf');
      } catch (e) {
        console.error('error while exporting in pdf. error - ', e);
      }

      //revert back to previous state. 
      this.servers.rows = rows;
      this.servers.first = first;
    });

  } 
  gettingIpDetail(){
    this.router.navigate(['/Ip-details'],)
   
  } 
  gettingProjectDetail(){
    this.router.navigate(['/Project-detail'],)
  } 

  getDataForcontrollers(){ 
    this.loading = true;
    this.http.getControllers().subscribe((data) => {
      this.checkdata = <any[]>data; 
     
      if (this.checkdata == null || this.checkdata == undefined) {
        this.error = "error while getting data"
      }
      this.loading = false;
      this.data.data = this.checkdata.data;
      this.empty = !this.data.data.length;
    })
  } 

  getForcarddata() {
    this.http.getsummery().subscribe((data) => {
      let response
      response = <any[]>data;
      
      this.tatalinfo = response.data; 
      this.totalServer = this.tatalinfo.totalServers; 
      this.loadGenrators = this.tatalinfo.totalGenerators; 
      this.controllers = this.tatalinfo.totalControllers;
      this.sumOfblades = this.tatalinfo.totalBlades; 
      this.dedicated = this.tatalinfo.totalDedicatedServer;
      this.freeServer = this.tatalinfo.totalFreeServer; 
      this.additional = this.tatalinfo.totalAdditionalServer;  
      this.onserver = this.tatalinfo.onServerCount;
      this.offserver = this.tatalinfo.offServerCount; 
      this.getrator = this.tatalinfo.generatorTypeServerCount;
      this.controller = this.tatalinfo.controllerTypeServerCount
      this.netstrom = this.tatalinfo.nsTypeServerCount; 
      this.noTypeSCount = this.tatalinfo.noTypeServerCount; 
      this.securityscan = this.tatalinfo.securityScanServiceStatus; 
      this.healthCheck = this.tatalinfo.healthCheckServiceStatus;
      this.downstatus = this.tatalinfo.statusCheckServiceStatus; 
      this.mailcheck = this.tatalinfo.mailerServiceStatus;
     
      this.getAllocationchart();
      this.getservercount(); 
      this.getchartforServers();
     
    })  
    
  } 

  getAllocationchart(){
    this.chartb =
      {
        title: 'ALLOCATION',
        highchart: {
          chart: {
            type: 'pie',
            height: '190px'
          },

          title: {
            text: '375',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x: -80
          },

          yAxis: {
            title: {
              text: 'Total percent market share'
            }
          },
          plotOptions: {
            pie: {
              shadow: false,
              borderColor: null
            }
          },
          tooltip: {
            formatter: function () {
              return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
            }
          },
          legend: {
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'middle',
            symbolRadius: 0,
            symbolPadding: 10,
            itemMarginTop: 10,
            itemStyle: {
              "color": "#000",
              "fontSize": '12px'
            }
          },
          series: [{
            name: 'Dedictated',
            data: [{
              y: this.dedicated,
              name: "Dedictated",
              color: "#4A4292"
            }, {
              y: this.freeServer,
              name: "Free",
              color: "#F89B23"
            }, {
              y: this.additional,
              name: "Additional",
              color: "#16A9BD"
            }],
            size: '70%',
            innerSize: '70%',
            showInLegend: true,
            dataLabels: {
              enabled: false
            },
            marker: {
              symbol: 'square',
              radius: 12
            }
          }] 
        },
      } 
      
  } 

  getservercount(){
    this.servercount={
      title: 'On/Off VP and CC',
      highchart: {
        chart: {
          type: 'pie',
          height: '190px'
        },

        title: {
          text: '375',
          align: 'center',
          verticalAlign: 'middle',
          y: 20,
          x: -80
        },

        yAxis: {
          title: {
            text: 'Total percent market share'
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            borderColor: null
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
          }
        },
        legend: {
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          symbolRadius: 0,
          symbolPadding: 10,
          itemMarginTop: 10,
          itemStyle: {
            "color": "#000",
            "fontSize": '12px'
          }
        },
        series: [{
          name: 'Dedictated',
          data: [ 
            {
              y: this.noTypeSCount,
              name: "NO Servers",
              color: "#4A4292"
            },
            {
            y: this.offserver,
            name: "OFF Servers",
            color: "#F89B23"
          }, {
            y: this.onserver, //this.noTypeSCount
            name: "On Servers",
            color: "#16A9BD"
          }],
          size: '70%',
          innerSize: '70%',
          showInLegend: true,
          dataLabels: {
            enabled: false
          },
          marker: {
            symbol: 'square',
            radius: 12
          }
        }]
      },
    }
   
    } 

  getchartforServers(){
    this.chartserver={
      title: 'Servers',
      highchart: {
        chart: {
          type: 'pie',
          height: '190px'
        },

        title: {
          text: '375',
          align: 'center',
          verticalAlign: 'middle',
          y: 20,
          x: -80
        },

        yAxis: {
          title: {
            text: 'Total percent market share'
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            borderColor: null
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
          }
        },
        legend: {
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          symbolRadius: 0,
          symbolPadding: 10,
          itemMarginTop: 10,
          itemStyle: {
            "color": "#000",
            "fontSize": '12px'
          }
        },
        series: [{
          name: 'Dedictated',
          data: [{
            y: this.getrator,
            name: "Generator",
            color: "#4A4292"
          }, {
            y: this.controller,
            name: "Controller",
            color: "#F89B23"
          }, {
            y: this.netstrom,
            name: "Netstorm",
            color: "#16A9BD"
          }],
          size: '70%',
          innerSize: '70%',
          showInLegend: true,
          dataLabels: {
            enabled: false
          },
          marker: {
            symbol: 'square',
            radius: 12
          }
        }]
      },
    }
    }
  
  
  }
  
  



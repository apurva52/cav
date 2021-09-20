import { Component, Input, OnInit, ViewChild } from '@angular/core'; 
import {  TableHeaderColumn } from '../../../../../shared/table/table.model';
import { MenuItem, Table} from 'primeng' ;
import { Pvoit_NAME_DATA} from './pvoit-table.dummy' 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../../home-sessions/common/util/export-util'; 
import { NsmhttpservicesService } from './../../nsmhttpservices.service';

@Component({
  selector: 'app-dash-pvoit-table',
  templateUrl: './dash-pvoit-table.component.html',
  styleUrls: ['./dash-pvoit-table.component.scss']
})
export class DashPvoitTableComponent implements OnInit { 
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
  constructor(private http: NsmhttpservicesService) { }

  ngOnInit(): void { 
    const me = this; 
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
                        ];

   

    me.data = Pvoit_NAME_DATA;
    this.totalRecords = me.data.data.length;
    
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    } 
    this.getForTabledata();
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

  getForTabledata(){  
    this.loading = true;
    this.http.getsummery().subscribe((data) => {
      let response 
       response = <any[]>data;
      console.log("Data for teams priyanka", response)
      //this.data.data = response.data.teams; 
      if (response == null || response == undefined) {
        this.error = "error while getting data"
      }
      this.loading = false;
      //.data.data = response.data.teams; 
      let counter = 1;
      this.data.data = response.data.teams.map(data => {

        data['eventcounter'] = counter++;
        return data

      });
      this.empty = !this.data.data.length;
    })
  }

  }
  
  
  



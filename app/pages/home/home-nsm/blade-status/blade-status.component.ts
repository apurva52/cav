import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {  TableHeaderColumn } from '../../../../shared/table/table.model';
import { Blade_NAME_DATA } from './blade.dummy';
import { MenuItem, Table } from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util'; 
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { dataFortable } from './blade.model';


@Component({
  selector: 'app-blade-status',
  templateUrl: './blade-status.component.html',
  styleUrls: ['./blade-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BladeStatusComponent implements OnInit {
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  @ViewChild('table') table: Table;
  error: string;
  loading: boolean = false;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  constructor(private http:NsmhttpservicesService) { }

  ngOnInit(){ 
    const me = this;
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
  ];



    me.data = Blade_NAME_DATA;
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
    const rows = this.table.rows;
    const first = this.table.first;
    this.table.rows = this.totalRecords;
    this.table.first = 0;

    setTimeout(() => {
      try {
        ExportUtil.exportToCSV(this.table.el.nativeElement, 1, 'blades.csv');
      } catch (e) {
        console.error('Error while exporting into CSV');
      }

      //revert back to previous state. 
      this.table.rows = rows;
      this.table.first = first;
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      // save the current state. 
      // get rows and first value. 
      const rows = this.table.rows;
      const first = this.table.first;

      this.table.rows = this.totalRecords;

      this.table.first = 0;
      setTimeout(() => {
        try {
          const jsonData = ExportUtil.getXLSData(this.table.el.nativeElement, 1);
          const worksheet = xlsx.utils.json_to_sheet(jsonData.data, { header: jsonData.headers, skipHeader: true });
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer);
        } catch (e) {
          console.error('error while exporting in xls, error - ', e);
        }

        //reset table properties. 
        this.table.rows = rows;
        this.table.first = first;
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
    const rows = this.table.rows;
    const first = this.table.first;
    this.table.rows = this.totalRecords;
    this.table.first = 0;

    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.table.el.nativeElement));
        //autoTable(doc, {html: this.table.el.nativeElement});
        const jsonData = ExportUtil.generatePDFData(this.table.el.nativeElement, 1);
        console.log('session-page export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('blades.pdf');
      } catch (e) {
        console.error('error while exporting in pdf. error - ', e);
      }

      //revert back to previous state. 
      this.table.rows = rows;
      this.table.first = first;
    });

  }
  getForTabledata() { 
    this.loading=true;
    let blade = "blade";

    this.http.getActionLogs(blade).subscribe((data) => {
      let response
      response = <any[]>data;
      
      this.loading = false;
      if (response != null && response != undefined) {


        this.data.data = response.data.map(temp => {
          let obj = {} as dataFortable
          let split = temp.split('|');
          obj.sl = split[0]
          obj.Action = split[1]
          obj.Stamp = split[2]
          obj.Name = split[3]
          obj.IP = split[4]
          obj.Controller = split[5]
          obj.Uversion = split[6]
          obj.Build = split[7] 
          obj.Server = split[8]
          obj.Machine = split[9]
          obj.status = split[10] 
          obj.Team = split[11]
          obj.Channel = split[12]
          obj.Owner = split[13]
          obj.Allocation = split[14]
          obj.Bandwidth = split[15]

          return obj

        })
      }
     this.empty= !this.data.data.length;

    })
  }

}

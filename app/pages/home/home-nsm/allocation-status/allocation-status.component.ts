import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import {  TableHeaderColumn } from '../../../../shared/table/table.model';
import { allocation_NAME_DATA } from './allocation.dummy';
import { MenuItem, Table} from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util';
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { dataFortable } from './allocation.model';


@Component({
  selector: 'app-allocation-status',
  templateUrl: './allocation-status.component.html',
  styleUrls: ['./allocation-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AllocationStatusComponent implements OnInit { 
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  error: string;
  loading: boolean = false;
  empty: boolean;
  @ViewChild('table') table: Table;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';

  constructor(private http: NsmhttpservicesService) { }

  ngOnInit(){ 
    const me = this;
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
  ];



    me.data = allocation_NAME_DATA;
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
    let allocation ="allocation";
    
    this.http.getActionLogs(allocation).subscribe((data) =>{
      let response
      response = <any[]>data; 
      this.loading = false;
     
      if (response != null && response != undefined) {


        this.data.data = response.data.map(temp => {
          let obj = {} as dataFortable
          let split = temp.split('|');
          obj.sl = split[0]
          obj.User = split[1]
          obj.Stamp = split[2]
          obj.Comments = split[3]
         
          return obj

        })
      }
     this.empty=!this.data.data.lenght;

    })
  }


}

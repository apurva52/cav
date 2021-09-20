import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import {  TableHeaderColumn } from '../../../../shared/table/table.model';
import { Blades_NAME_DATA } from './nsm-blades.dummy';
import { MenuItem, Table} from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util'; 
import { NsmhttpservicesService } from './../nsmhttpservices.service';
@Component({
  selector: 'app-nsm-blades',
  templateUrl: './nsm-blades.component.html',
  styleUrls: ['./nsm-blades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NsmBladesComponent implements OnInit { 
  @ViewChild('blades') blades: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  error: string;
  loading: boolean = false;
  empty: boolean;
 
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  constructor(private http: NsmhttpservicesService) { }

  ngOnInit(){ 
    const me = this;
    
    this.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];




    me.data = Blades_NAME_DATA;
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
     const rows = this.blades.rows;
     const first = this.blades.first;
     this.blades.rows = this.totalRecords;
     this.blades.first = 0;

    setTimeout(() => {
       try {
         ExportUtil.exportToCSV(this.blades.el.nativeElement, 1, 'blades.csv');
       } catch (e) {
         console.error('Error while exporting into CSV');
       }

       //revert back to previous state. 
      this.blades.rows = rows;
      this.blades.first = first;
     });
   }

   exportExcel() {
     import('xlsx').then(xlsx => {
       // save the current state. 
       // get rows and first value. 
       const rows = this.blades.rows;
       const first = this.blades.first;

       this.blades.rows = this.totalRecords;

       this.blades.first = 0;
       setTimeout(() => {
        try {
          const jsonData = ExportUtil.getXLSData(this.blades.el.nativeElement, 1);
          const worksheet = xlsx.utils.json_to_sheet(jsonData.data, { header: jsonData.headers, skipHeader: true });
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer);
        } catch (e) {
          console.error('error while exporting in xls, error - ', e);
        }

        //reset table properties. 
         this.blades.rows = rows;
         this.blades.first = first;
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
    const rows = this.blades.rows;
    const first = this.blades.first;
    this.blades.rows = this.totalRecords;
    this.blades.first = 0;

    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.blades.el.nativeElement));
        //autoTable(doc, {html: this.table.el.nativeElement});
        const jsonData = ExportUtil.generatePDFData(this.blades.el.nativeElement, 1);
        console.log('session-page export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('blades.pdf');
      } catch (e) {
        console.error('error while exporting in pdf. error - ', e);
      }

      //revert back to previous state. 
      this.blades.rows = rows;
      this.blades.first = first;
    });

  } 
  getForTabledata() { 
    this.loading = true;
    this.http.getMasterBlades().subscribe((data) => {
      let response
      response = <any[]>data;
     
      //this.data.data = response.data; 
      if (response == null || response == undefined) {
        this.error = "error while getting data"
      }
      this.loading = false;
      this.data.data = response.data;
      this.empty = !this.data.data.length;
      
    })
  }

}

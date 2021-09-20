import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../shared/table/table.model';
import { Mvenders_NAME_DATA } from './mange-venders.dummy';
import { MenuItem, Table, SelectItem } from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util';
import { NsmhttpservicesService } from './../nsmhttpservices.service';


@Component({
  selector: 'app-mang-venders',
  templateUrl: './mang-venders.component.html',
  styleUrls: ['./mang-venders.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MangVendersComponent implements OnInit {
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[]; 
  error: string;
  loading: boolean = false;
  empty: boolean;
  data: any;
  totalRecords = 0;
  adtext:any;
  addFlag:any; 
  delvenders:any; 
  deletFlag:boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  status:[];
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters'; 
  vrndors: SelectItem[] = [];  
  addvendors:string;
  
  constructor(private http: NsmhttpservicesService) { }

  ngOnInit() {
    const me = this; 
    me.http.getmatadatforvenders().subscribe((data: object) => {
      //let response:[] = ['data.data']; 
      let response: [] = data['data']
      console.log(response, "resopnse")
      for (let k of response) {
        me.vrndors.push({ label: k, value: k })
      }
    })
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];



    me.data = Mvenders_NAME_DATA;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    } 
    this.getDataFortable();
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
  openDialog(){
    this.addFlag=true;
  } 
  deletDialog(){
    this.deletFlag=true;
  } 
  getDataFortable() {
    this.loading = true;
    this.http.getmvender().subscribe((data) => {  
      let response = <any[]>data;
      this.loading = false;
      this.data.data = response['data'];
      this.empty =!this.data.data.lenght;
      console.log("mrequest")
    })
  } 
   addvendersname(){  
     console.log(this.addvendors,"added venders called")
     this.http.getaddvenders(this.addvendors).subscribe((data)=>{
       console.log(data,"venders added data")
     })
   } 

  deletevendername(){ 
   console.log( this.delvenders ,"deleteed venders called")
    this.http.getdeletvenders(this.delvenders).subscribe((data)=>{
      console.log(data,"venders deleted data ")
    })

  }

}

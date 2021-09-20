import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../shared/table/table.model';
import { Mteam_NAME_DATA } from './mange-team.dummy';
import { MenuItem, SelectItem, Table } from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util'; 
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { addteammanage } from './mange-team.model';


@Component({
  selector: 'app-mang-team',
  templateUrl: './mang-team.component.html',
  styleUrls: ['./mang-team.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MangTeamComponent implements OnInit {
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0; 
  adtext:any;
  addflag:boolean =false;
  deletflag:boolean =false;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  status: [];
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters'; 
  delvenders:any; 
  error: string;
  loading: boolean = false;
  empty: boolean; 
  channel:string; 
  owner:string; 
  team:string; 
  delteam: SelectItem[] = [];
  constructor(private http: NsmhttpservicesService) { }

  ngOnInit(): void { 
    const me = this; 
    me.http.getmatadatforteam().subscribe((data)=>{ 
      console.log(data,"response of team matadata")
      let response: [] = data['data'] 
      
     
      console.log(response, "resopnse for team")
      for (let k of response) {
        this.delteam.push({ label: k, value: k })

      }
    })
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];



    me.data = Mteam_NAME_DATA;
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
  addopen(){ 
    this.addflag=true;
  } 
  deleteopen(){ 
    this.deletflag=true;
  } 
  getDataFortable() {
    this.loading = true;
    this.http.getmchannel().subscribe((data) => { 
      let response;
       response = <any[]>data;  
      this.loading = false;
      this.data.data = response.data; 
      this.empty= this.data.data.length;

      console.log(this.data.data,"mrequest")
    })
  } 
  addteamname(){
    let objadd = new addteammanage(this.channel,this.owner,this.team) 
    console.log(objadd) 
    this.http.postaddteam(objadd).subscribe((data)=> 
    console.log(data,"added data of team")
    )
  } 
  deletteam(){
    console.log("delete location is called") 
    this.http.postdeleteteam(this.delvenders).subscribe((data)=>{
      console.log(data,"delted team name")
    })
  }

}

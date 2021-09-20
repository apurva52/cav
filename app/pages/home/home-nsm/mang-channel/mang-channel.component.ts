import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../shared/table/table.model';
import { Mchannel_NAME_DATA } from './mang-channel.dummy';
import { MenuItem, SelectItem, Table } from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util';  
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { addchannelmanage, deletechannelmanage } from './mang-channel.model';


@Component({
  selector: 'app-mang-channel',
  templateUrl: './mang-channel.component.html',
  styleUrls: ['./mang-channel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MangChannelComponent implements OnInit {
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  status: [];
  adtext:any;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  addFlag:boolean=false; 
  deletFlag:boolean = false;
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters'; 
  delvenders:any;
  adVender:any 
  error: string;
  loading: boolean = false;
  empty: boolean; 
  channel: string;
  owner: string;
  team: string; 
  addteam:SelectItem[] =[]; 
  delchannel: SelectItem[] = [];

  constructor(private http: NsmhttpservicesService) { }

  ngOnInit(): void { 
    const me = this; 
    me.http.getmatadatforteam().subscribe((data:object)=>  {
      let response: [] = data['data'] 
      for (let k of response) {
        this.addteam.push({ label:k, value:k })
        
      }
    }
    ) 

    this.http.getmatadatforchannel().subscribe((data)=>{ 
      let response: [] = data['data']  
      let chnres: [] = response['Dev']  
      console.log(chnres, "resopnse for channel")
     
      for (let k of chnres) {
        console.log(k,"k value of channel")
        this.delchannel.push({ label: k, value: k })

      }


    })
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];



    me.data = Mchannel_NAME_DATA;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    } 

    me.getDataFortable();
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
    this.addFlag=true;
  } 
  editopen(){
    this.deletFlag=true;
  } 
  getDataFortable() {
    this.loading = true;
    this.http.getmchannel().subscribe((data) => { 
      let response; 
      response = <any[]>data; 
      this.loading = false;
      this.data.data = response.data; 
      this.empty=!this.data.data.length;

      console.log(this.data.data,"mrequest")
    })
  } 
  

  addchannel(){
    let addobj = new addchannelmanage(this.channel, this.owner,this.team)  
    console.log(addobj,"added channel")
    this.http.postaddchannel(addobj).subscribe((data)=> 
      console.log(data,"added object")
    )

  } 

  deletechannel(){
    let obj = new deletechannelmanage(this.team,this.channel) 
    console.log(obj,"deleted object channel") 
    this.http.postdeletechannel(obj).subscribe((data=>{
      console.log(data,"deleted channel data")
    }))
  }

}

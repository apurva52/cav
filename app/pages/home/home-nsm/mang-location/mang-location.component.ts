import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../shared/table/table.model';
import { Mlocation_NAME_DATA } from './mang-location.dummy';
import { MenuItem, SelectItem, Table } from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util';
import { flashOnEnterAnimation } from 'angular-animations'; 
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { addlocationmanage, deletlocationmange } from './mange-location.model';

@Component({
  selector: 'app-mang-location',
  templateUrl: './mang-location.component.html',
  styleUrls: ['./mang-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MangLocationComponent implements OnInit {
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  addFlag:boolean = false;
  deletFlag:boolean = false;
  adVender:any;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  status: []; 
  delvenders:any;
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';  
  error: string;
  loading: boolean = false;
  empty: boolean;
  //adVender:any; 
  addcity: SelectItem[] = [];
  addzone: SelectItem[] = [];
  addState: SelectItem[] = [];
  addCountry: SelectItem[] = []; 
  country:string; 
  state:string; 
  city:string; 
  zone:string;
  constructor(private http: NsmhttpservicesService) { }

  ngOnInit() { 
    const me = this; 
    me.http.getmatadatforloaction().subscribe((data: object) => {

      let response: [] = data['data']


      console.log(response, "resopnse of location")
      for (let k of response) {
        this.addcity.push({ label: k['city'], value: k['city'] })
        this.addState.push({ label: k['state'], value: k['state'] })
        this.addCountry.push({ label: k['country'], value: k['country'] }) 
        this.addzone.push({ label: k['zone'], value: k['zone'] })
      }


    })
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];



    me.data = Mlocation_NAME_DATA;
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
  adddailog(){ 
    this.addFlag = true;
    

  } 
  deltedailog(){ 
   
    this.deletFlag = true;

  }
  getDataFortable() {
    this.loading = true;
    this.http.getmlocation().subscribe((data) => {
      let response;
      response = <any[]>data; 
      this.loading = false;
      this.data.data = response.data; 
      this.empty = !this.data.data.length;
      console.log(this.data.data,"mrequest")
    })
  } 

  addlocation(){
    let addobj = new addlocationmanage(this.country,this.state,this.city, this.zone,)  
    console.log(addobj,"add location object")
    this.http.postaddlocation(addobj).subscribe((data)=> 
    console.log(data,"postdata of location")
    )
  } 

  deletelocation(){
    let delobj = new deletlocationmange(this.country, this.state, this.city,) 
    console.log(delobj,"del obj ") 
    this.http.postdeletelocation(delobj).subscribe((data)=>{
      console.log(data, "data for deleted location")
    })
  }

}

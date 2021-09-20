import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../shared/table/table.model';
import { Manage_NAME_DATA } from './nsm-manage.dummy';
import { MenuItem, Table ,SelectItem} from 'primeng';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import { ExportUtil } from '../../../common/util/export-util';
import { ExportUtil } from '../../home-sessions/common/util/export-util'; 
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { addservermangedata, deletservermagedata, editeservermagedata } from './nsm-manage.model';  
import { Store } from 'src/app/core/store/store';
import { NvhttpService} from './../../home-sessions/common/service/nvhttp.service'

@Component({
  selector: 'app-nsm-manage',
  templateUrl: './nsm-manage.component.html',
  styleUrls: ['./nsm-manage.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NsmManageComponent implements OnInit {
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  addFlag:boolean = false;
  editFlag :boolean = false; 
  deleteFlag:boolean = false;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  error: string;
  loading: boolean = false;
  empty: boolean;
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters'; 
  //ngmodel of add dailog 
  adCountry:any; 
  adState:any; 
  adLocation:any; 
  adVender:any; 
  adip:any; 
  adtext:any; 
  status:[]; 
  delserve:any; 
  vrndors: SelectItem[]=[]; 
  addLocation: SelectItem[] = []; 
  addservertype: SelectItem[] = []; 
  addState: SelectItem[] = []; 
  addCountry: SelectItem[] = []; 
  //addname:any; 
  name: string;
   ip: any;
   vendor: any;
   location: any;
   serverType: any;
   state: any;
  country: any;  
  //edit
  blade: string;
  server: string;
  allocation: string;
  machineType: string;
  securityGroup: string; 
  editblade: SelectItem[] = []; 
  editSname: SelectItem[] = []; 
  editallocation: SelectItem[] = [];
  editMachine: SelectItem[] = []; 
  editSecurity: SelectItem[] = []; 
  servername:string;
  
  constructor(private http: NsmhttpservicesService, private httpnv: NvhttpService) {  
    this.editblade=[
      { label: "UST_Sandbox", value: "UST_Sandbox" }, 
      { label: "work", value: "work" }
    ] 
    this.editSecurity=[
      { label: "poc", value: "poc" },
      { label: "noncabin", value: "noncabin" }
    ]
  }

  ngOnInit(){ 
    const me = this; 
    me.http.getmatadatforvenders().subscribe((data:object)=>{   
      //let response:[] = ['data.data']; 
      let response :[]= data['data'] 
      console.log(response,"resopnse")
      for (let k of response ){
       me.vrndors.push({label:k,value:k})
      }
    })  
    me.http.getmatadatforloaction().subscribe((data: object) => {
      
      let response: [] = data['data'] 
     
  
      console.log(response, "resopnse of location")
      for (let k of response) {  
        this.addLocation.push({label:k['city'],value:k['city']})
        this.addState.push({ label: k['state'], value: k['state']}) 
        this.addCountry.push({ label: k['country'], value: k['country']})
      }  
      
     
    }) 
    me.http.getmatadatforatribute().subscribe((data: object) => {
    
      let response: [] = data['data']
      console.log(response, "resopnse") 
      let server: [] = response['serverType']  
      let allocation: [] = response['allocationType'] 
      let machinetype: [] = response['machineType']

      for (let k of server) {
        me.addservertype.push({ label: k, value: k }) 
      }  
      for (let k of allocation) {
        me.editallocation.push({ label: k, value: k })
      } 
      for (let k of machinetype) {
        me.editMachine.push({ label: k, value: k })
      }

    })


    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];



    me.data = Manage_NAME_DATA;
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
    this.addFlag= true;
  } 

  showDialogToEditGroup(){
    this.editFlag=true;
  }
  deleteDialog(){
    this.deleteFlag = true;
  }
  getDataFortable() {
    this.loading = true;
    this.http.getmserver().subscribe((data) => { 
      this.loading = true;
      this.data.data = <any[]>data.data; 

     this.empty=!this.data.data.length;
      console.log("mrequest")
    })
  } 

  addmangeserver(){
    let postobj = new addservermangedata( this.name,this.ip,this.vendor,this.location,this.serverType,this.state,this.country,
    ) 
    console.log(postobj,"object set for addrequest")  
     this.http.postadddatamangeserver(postobj).subscribe((data)=>{
       console.log(data,"added new data call");
   }
    )

  } 

  editeservermange() { 
    let postobj = new editeservermagedata(this.blade,this.server,this.allocation,this.machineType,this.securityGroup,)
    console.log(postobj,"object set for editrequest")  
     this.http.posteditdatamangeserver(postobj).subscribe((data) => {
    console.log(data, "edite data call");
  }
  ) 
} 
  deleteservermanage(){ 
    console.log("delete is called")
    let delobj = new deletservermagedata(this.servername) 
   console.log(delobj,"deleted object frm server mange") 
    this.http.getdeletedservers(this.servername).subscribe((data:string)=>{ 
      console.log(data); 
      console.log("deleted",data)

    } 
    )
  }

}

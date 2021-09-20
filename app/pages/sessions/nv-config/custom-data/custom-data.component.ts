import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CUSTOM_DATA_TABLE } from './service/custom-data.dummy';
import { CustomDataTable} from './service/custom-data.model';
import { NvhttpService ,NVPreLoadedState, NVPreLoadingState, NVPreLoadingErrorState} from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { CustomDataSource } from 'src/app/pages/home/home-sessions/common/interfaces/customdatasource';
import { MsgService } from 'src/app/pages/home/home-sessions/common/service/msg.service';
import { Metadata } from 'src/app/pages/home/home-sessions/common/interfaces/metadata';
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import { Store } from 'src/app/core/store/store'; 
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';

@Component({
  selector: 'app-custom-data',
  templateUrl: './custom-data.component.html',
  styleUrls: ['./custom-data.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class CustomDataComponent implements OnInit {
  data: CustomDataTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;

  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  metadata: Metadata = null;
  nchannel : any;
  busy : boolean  = false;
  customvalue : any;
  channelarray : any;
  msgs : any;
  type: any [];
  name : any;
  Type : any ;
  description : any;
  encryption :any[];
  encryptflag : any;
  updatename : any;
  updatedescription : any;
  trendgraph : any [];
  Trendgraph : any;
  updateTrendgraph : any;
  updateType : any ;
  updateencryptflag : any;
  id : any;
  updateRate : any;
  updategraph : any;
  graph : any[];
  rate : any[];
  Rate : any;
  sum : any[];
  Sum : any;
  times : any[];
  Rates:any [];
  Times : any;
  updatechannel : any;
  metadataService: MetadataService;
  updateTrendflag : boolean = false;
  Trendflag : boolean = false;
  channel : any; 
  buttonflag:boolean = false;

  configaddpopup=false;
  configeditpopup=false;
  
  constructor(private router: Router, private nvhttp: NvhttpService, private matadataservice: MetadataService, private SessionStateService: SessionStateService  ) {
    this.matadataservice.getMetadata().subscribe(response => {
      this.metadata = response;
      let channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        }
      });
        this.getData(response);
});
   }

  ngOnInit(): void {
    const me = this; 
    if (this.SessionStateService.isAdminUser() == true) {
      
      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {
    
      this.buttonflag = false; 
    }
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.data = CUSTOM_DATA_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
    @Input() get selectedColumns(): TableHeaderColumn[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: TableHeaderColumn[]) {
      const me = this;
      me._selectedColumns = me.cols.filter((col) => val.includes(col));
    }

    showAddReport(){
      this.router.navigate(['/add-report']);
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

    addCustomData(){
      
    }

    //open dialog
    opencustomDialog()
{
this.graph = [];
this.name = undefined;
this.channel = null;
this.description  = undefined;
this.configaddpopup = true;
}

//save new added data
saveAddCustom()
{
this.msgs = [];

if(this.Trendgraph == "1")
this.graph = this.Rate;

if(this.name == "undefined" || this.name == undefined || this.name == '')
{
  this.msgs.warn("Please Enter Name");
 return;
}
if(this.description == "undefined" || this.description == undefined || this.description == '')
{
  this.msgs.warn("Please Enter Description");
return;
}
if(this.channel == null) {
  this.msgs.warn("Please Enter Channel");
 return
}

let data = new CustomDataSource(this.name,this.description,this.Type,this.encryptflag,"",this.graph,this.channel);
this.nvhttp.addcustom(data).subscribe((response : any) => {
if(response)
{
let obj = {};
this.nvhttp.UpdateAgentMetadata(obj).subscribe((configresponse : any) => {
});
this.msgs.push({severity:'success', detail:'Successfully Added'});
let description = "Custom Data " + "'" + data.name + "'" + " added";
this.nvhttp.getAuditLog("INFO" , "Open Configuration" , description , "UX Monitoring::ConfigUI::Custom Data").subscribe(response => {
});
this.getData(this.metadata);
this.busy = false;
}
});
this.id = undefined;
this.configaddpopup = false;
}

//saving custom update...
saveUpdateCustom()
{
  this.msgs = [];
if(this.updatename == "undefined" || this.updatename == undefined || this.updatename == '')
{
 this.msgs.warn("Please Enter Name");
 return;
}
if(this.updatedescription == "undefined" || this.updatedescription == undefined || this.updatedescription == '')
{
  this.msgs.warn("Please Enter Description");
return;
}

let updatedata = new CustomDataSource(this.updatename,this.updatedescription,this.updateType,this.updateencryptflag,this.id,this.Rates,this.updatechannel);
console.log("updatdata--" ,updatedata)
this.busy = true;
this.nvhttp.updateCustom(updatedata).subscribe(response => {
  if(response)
  {
     let obj = {};
     this.nvhttp.UpdateAgentMetadata(obj).subscribe((configresponse : any) => {
     });
     this.msgs.push({severity:'success',  detail:'Updated Successfully'});
	let description = "Custom Data " + "'" + updatedata.name + "'" + " updated";
        this.nvhttp.getAuditLog("INFO" , "Open Configuration" , description , "UX Monitoring::ConfigUI::Custom Data").subscribe(response => {
          console.log("Audit Log");
        });
        this.getData(this.metadata);
        this.busy = false;
  }
     });
this.id = undefined;

this.configeditpopup = false;
}
applyadd(e){
  console.log("add is now in table componenet ");
  this.name=e.name;
  this.Type=e.Type;
  this.Trendgraph=e.Trendgraph;
  this.Rate=e.Rate;
  this.description=e.description;
  this.encryptflag=e.encryptflag;
  this.channel=e.channel;
  for(var j of this.customvalue){
    if(this.name == j.name)
    {
    this.msgs.push({severity: 'error',summary: '',detail: 'This Custom Name Already Exist'});
    return;
    }
    }
  //if(this.name == j.name)
  // {
  // this.msgs.push({severity: 'error',summary: '',detail: 'This Custom Name Already Exist'});
   //return;
   //}
   //}
   
   this.saveAddCustom();
   
   }  

//methiod for edit ..
applyedit(e){
  console.log("edite is now in table componenet ");
     this.updategraph = e.updategraph;
     this.updatechannel = e.updatechannel;
     this.updateRate = e.updateRate;
     this.id = e.id
     this.updateencryptflag = e.updateencryptflag,
     this.updateType = e.updateType,
     this.updatedescription = e.updatedescription,
     this.updatename = e.updatename 
     this.saveUpdateCustom();
   }  

   //method for delete ...
   applyedelet(e){
    this.DeleteCustsom();

  }
  DeleteCustsom() {
   // this.msgs = [];
    if (this.id == undefined || this.id == "undefined") {
    MsgService.warn("Please select row to delete");
    }
    else {
      //this.busy = true;
    this.nvhttp.deleteCustom(this.id).subscribe(response => {
    if (response) {
         let obj = {};
          this.nvhttp.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
          });
          //this.msgs.push({ severity: 'success', detail: 'Deleted Successfully' });
          MsgService.warn("Deleted Successfully")
          let description = "Custom Data Deleted";
          this.nvhttp.getAuditLog("INFO", "Open Report", description, "UX Monitoring::ConfigUI::Custom Data").subscribe(response => {
            console.log("Audit Log");
          });
          this.getData(this.metadata);
         // this.busy = false;
        }
      });
    }
    this.id = undefined;
  } 
 //On rowselection ...
  onRowSelectEditTable(rowevent){
    this.updatename = rowevent.data.name;
    this.updatedescription = rowevent.data.description;
    this.updateType = rowevent.data.type;
    this.updateencryptflag = rowevent.data.encryptflag;
    this.id = rowevent.data.id;
    this.updateRate = rowevent.data.trendList;
    var sepratedRate = this.updateRate.split(/\s*,\s*/);
    this.Rates = [];
    for (var i = 0; i < sepratedRate.length; i++) {
    let k = sepratedRate[i].toString();
    this.Rates.push(k);
    }
    if (this.updateRate == '')
    this.Rates = [];
    this.updatechannel = rowevent.data.channelid;
    this.updategraph = rowevent.data.trendList;
    
    }
    closeCustomeditPopup($event){
      this.configeditpopup=false;
    }

//fetching data...
    getData(metadata)
{
this.busy = true;
this.nvhttp.getCustomData().subscribe((state : Store.State) => {

  if (state instanceof NVPreLoadingState) {
    console.log('NVPreLoadingState', state);
    this.loading = true;
    this.error = state.error;
 }
 if (state instanceof NVPreLoadedState) {

 if(state.data != null && state.data.length > 0)
 {
  this.loading = false;
  this.customvalue = state.data;
  this.busy = false;
  for (var i of state.data)
    {
       this.channelarray = i.channel.toString().split(",");
       i.channelid = i.channel
       i.channel = Util.getChannelNames(this.channelarray, metadata);
    }
  console.log("lllsee--" ,this.customvalue);
 }
}
 else
 {
  (err: Store.State) =>{
    if (err instanceof NVPreLoadingErrorState) {
      this.busy = false; 
      this.customvalue = [];
    console.log("error occred : ", err);
    }
  }
}
 });
}



}

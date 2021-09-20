import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { MetadataService } from './../../../../home/home-sessions/common/service/metadata.service';
import { Metadata } from './../../../../home/home-sessions/common/interfaces/metadata';
//import { NvhttpService} from'./../../../../home/home-sessions/common/service/nvhttp.service';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../../../../home/home-sessions/common/service/nvhttp.service';
import {Util}from'./../../../../home/home-sessions/common/util/util'


@Component({
selector: 'app-custom-data-crud',
templateUrl: './custom-data-crud.component.html',
styleUrls: ['./custom-data-crud.component.scss'],
encapsulation : ViewEncapsulation.None
})
export class CustomDataCrudComponent extends PageDialogComponent
implements OnInit {
@Output() data: EventEmitter<any>;
@Output() adddata: EventEmitter<any>;
//@Output() close:EventEmitter<boolean>;
@Output() updatedClose:EventEmitter<boolean>;

visible : boolean;
showFields: boolean;
name: string;
type: any;
description: string;
channel: string;
Type : any;
encryption :any;
encryptflag :any;
trendgraph :any;
Trendgraph:any;
rate :any;
customvalue: any;
//taken ---
//type: any[];
//name: any;
//Type: any;
//description: any;
//encryption: any[];
// encryptflag: any;
updatename: any;
updatedescription: any;
//trendgraph: any[];
//Trendgraph: any;
updateTrendgraph: any;
busy: boolean = false;
updateType: any;
updateencryptflag: any;
id: any;
updateRate: any;
updategraph: any;
graph: any[];
//rate: any[];
Rate: any;
sum: any[];
Sum: any;
times: any[];
Rates: any[];
Times: any;
nchannel: any;
// channel: any;
channelarray: any;
updatechannel: any;
metadata: Metadata = null;
metadataService: MetadataService;
updateTrendflag: boolean = false;
Trendflag: boolean = false;
disableEncryptionDropdown = false;
udisableEncryptionDropdown = false;


constructor(private httpService: NvhttpService, metaDataService: MetadataService) {
super();
//this.close= new EventEmitter();
this.data= new EventEmitter();
this.updatedClose=new EventEmitter();
this.adddata = new EventEmitter();

this.metadataService = metaDataService;
this.metadataService.getMetadata().subscribe(response => {
this.metadata = response;
let channelm: any[] = Array.from(this.metadata.channelMap.keys());
this.nchannel = channelm.map(key => {
return {
label: this.metadata.channelMap.get(key).name,
value: this.metadata.channelMap.get(key).id
}
});
this.getdata(response);
});
}

ngOnInit() {
this.type = [
{ label: 'Text', value: "0" },
{ label: 'Number', value: "1" },
{ label: 'Double', value: "2" },
{ label: 'Json', value: "3" }
];
this.Type = "0";
this.encryption = [
{ label: 'Enable', value: "1" },
{ label: 'Disable', value: "0" }
];
this.encryptflag = "1";
this.trendgraph = [
{ label: 'Enable/ON', value: "1" },
{ label: 'Disable/OFF', value: "0" }
];
this.Trendgraph = "0";

this.rate = [
{ label: 'Rate NA', value: "2" },
{ label: 'Rate CumToPM', value: "3" },
{ label: 'Rate/Min', value: "4" },
{ label: 'Rate/Sec', value: "5" },
{ label: 'Sum', value: "0" },
{ label: 'Times', value: "1" }
];
}



open(row, isShowFields) {
console.log(row);
super.show();
if (row) {

//this.updategraph = row.;
this.updatechannel = row.channel ;
this.updateRate = row.trendList;
this.id = row.id
this.updateencryptflag = row.encryptflag;
this.updateType = row.type ,
this.updatedescription = row.description ,
this.updatename = row.name ;
var sepratedRate = this.updateRate.split(/\s*,\s*/);
this.Rate =[];
for(var i =0; i < sepratedRate.length;i++){
let k = sepratedRate[i].toString();
this.Rate.push(k);
}
if(this.updateRate =='')
this.Rate=[];
this.updatechannel =row.channelid;
this.updategraph = row.trendlist;
} else {
//this.name = null;
//this.type = null;
//this.description = null;
//this.channel = null;
this.Type = "0";
this.Trendgraph = "0";
this.encryptflag = "1";
this.Rate ="2";
this.description =null;
this.channel = null;
}
this.showFields = isShowFields;
}

closeDialog(){
this.visible = false;
}
graphChange() {
console.log("dikhaoo--", this.Trendgraph)
if (this.Type == "1" || this.Type == "2") {
console.log("dikhaoo1--", this.Trendgraph)
this.Trendgraph = "1";
this.encryptflag = "0";
this.disableEncryptionDropdown = true;
//this.Trendflag == true;
}
if (this.Type == "0" || this.Type == "3") {
console.log("dikhaoo2--", this.Trendgraph)
this.disableEncryptionDropdown = false;
this.encryptflag = "1";
}
this.Rate = undefined;
this.Trendgraph = "0";
this.Trendflag = false;

}
grapFlag() {
if (this.Trendgraph == "1")
this.Trendflag = true;
if (this.Trendgraph == "0") {
this.Trendflag = false;
this.Rate = undefined;
}
}
updategrapFlag() {
if (this.updateTrendgraph == "1")
this.updateTrendflag = true;
if (this.updateTrendgraph == "0") {
this.updateTrendflag = false;
this.updateRate = undefined;
}
}

updategraphChange() {
if (this.updateType == "0" || this.updateType == "3") {
this.updateTrendflag = false;
this.updateencryptflag = "1";
this.udisableEncryptionDropdown = false;
}
if (this.updateType == "1" || this.updateType == "2") {
this.updateencryptflag = "0";
this.udisableEncryptionDropdown = true;
}

}
objPopup={};
Save(){
console.log("edite is saved in curd compo")
this.objPopup = {
'updategraph': this.updategraph,
'updatechannel': this.updatechannel,
'updateRate': this.updateRate,
'id': this.id,
'updateencryptflag': this.updateencryptflag,
'updateType': this.updateType,
'updatedescription': this.updatedescription,
'updatename': this.updatename

}
this.data.emit(this.objPopup);
this.closeDialog();

}
getdata(metadata){
this.httpService.getCustomData().subscribe((response: any) => {
if (response != null && response.length > 0) {
this.customvalue = response;
this.busy = false;
for (var i of response) {
this.channelarray = i.channel.toString().split(",");
i.channelid = i.channel
i.channel = Util.getChannelNames(this.channelarray, metadata);
}
console.log("lllsee--", this.customvalue);
}
else {
this.busy = false;
this.customvalue = [];
}
});
}
SaveAdd(){
  console.log("add is saved in curd compo")
this.objPopup = {
    'name':this.name,
    'Type':this.Type,
    'Trendgraph':this.Trendgraph,
    'Rate':this.Rate,
    'description':this.description,
    'encryptflag':this.encryptflag,
    'channel':this.channel,
  
    'id':this.id,
   

}
console.log('saveadd : ',this.channel);
//console.log(this.objPopup.channel);
this.adddata.emit(this.objPopup);
this.closeDialog();

}
updatedCancel()
  {
    this.updatedClose.emit(false);
  }
 

}
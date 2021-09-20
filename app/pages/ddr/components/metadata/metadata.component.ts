import { Component, OnInit } from '@angular/core';
//import { Http, Response } from '@angular/http';
//import { Observable } from 'rxjs';
import { CommonServices } from '../../services/common.services';
//import { Http } from '@angular/http';
import 'rxjs';
//import { Router } from '@angular/router';
import { DdrBreadcrumbService } from '../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Router } from '@angular/router';
import { DDRRequestService } from '../../services/ddr-request.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})

export class MetadataComponent implements OnInit {
  
  urlParam: any;
  pquery:any;
  pqMdata:any;
  pqMetadata:any;
  metaTier: any;
  metaServer:any;
  metaInstance:any;
  metaTable:any;
  tableMdata:any;
  tableMetadata:any;
  tsiTier: any;
  tsiServer:any;
  tsiInstance:any;
  backend:any;
  method:any;
  businessT:any;
  classM:any;
  packageM:any;
  mapMdata:any;
  mapIdata:any;
  mapSdata:any;
  tsiTierMapdata:any;
  tsiServerMapdata:any;
  tsiInstanceMapdata:any;
  selectedTierRow:any;
  selectedServerRow:any;
  
  tierMdata:any;
  tierMetadata :any;
  serverMdata:any;
  serverMetadata:any;
  instanceMdata:any;
  instanceMetadata:any;
  methodMdata:any;
  backendMdata:any;
  classMdata:any;
  packageMdata:any;
  btMdata:any;
  methodMetadata:any;
  backendMetadata:any;
  btMetadata:any;
  classMetadata:any;
  packageMetadata:any;
  ptRecord:any;
  tierRecord:any;
  serverRecord:any;
  instanceRecord:any;
  cRecord:any;
  mRecord:any;
  btRecord:any;
  bRecord:any;
  qRecord:any;
  tRecord:any;
  tsitRecord:any;
  tsisRecord:any;
  tsiiRecord:any;
  loading=false;
  metadataAccordion:boolean= false;
  mappingAccordion:boolean = false;
  screenHeight:any;
  topologyData: any;
  
  constructor( public commonService: CommonServices,
  private breadcrumbService: DdrBreadcrumbService, private _router: Router,private ddrRequest:DDRRequestService) {       
  }

  ngOnInit(){
    this.loading = true;
    this.urlParam = this.commonService.getData();
    this.mappingAccordion = true;
    this.topologyEntity(0);
      if(this._router.url.indexOf('/home/ED-ddr/flowpath') != -1)
       this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FLOWPATH);
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTOMD);
 
    
     this.fillData();
     this.commonService.isToLoadSideBar = false;
     this.screenHeight = Number(this.commonService.screenHeight) - 130;
 }
  topologyEntity(type:any): any {
    var url = '';
    if (this.commonService.host != undefined && this.commonService.host != '' && this.commonService.host != null) {
      if (this.commonService.protocol && this.commonService.protocol.endsWith("://"))
        url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
      else if (this.commonService.protocol)
        url = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
      else
        url = "// " + this.commonService.host + ':' + this.commonService.port;
    }
    else {
      url = this.commonService.getHostUrl();
    }
    url += '/' + this.urlParam['product'] + '/v1/cavisson/netdiagnostics/webddr/fetchAllMetaData/' + (this.urlParam['testRun'] || sessionStorage.getItem("testRun")) + '?&flag=' + type;
     this.ddrRequest.getDataUsingGet(url).subscribe((data) => { 
     this.topologyData = data;
     this.mData();

     if(this.mappingAccordion){
       this.onMappingTabOpen();
      }
       if(this.metadataAccordion){
         this.onTopologyEntityTab();
       }
    })
  }
mData(){
     this.tierMdata =this.topologyData['tiers'];
     this.serverMdata=this.topologyData['servers'];
     this.instanceMdata=this.topologyData['instances'];
     this.methodMdata= this.topologyData['methods'];
     this.backendMdata= this.topologyData['backends']; 
     this.classMdata= this.topologyData['class']; 
     this.packageMdata=this.topologyData['packages']; 
     this.btMdata= this.topologyData['bt'];
     this.pqMdata= this.topologyData['pq'];
     this.tableMdata= this.topologyData['table_records'];
     this.mapMdata=this.topologyData['T_S_I'];
     this.loading = false;
}
fillData(){    
    this.screenHeight = Number(this.commonService.screenHeight) - 130;
    this.pquery=[
        {field: 'query', header: 'Query', sortable: true, action: true },
        {field: 'pId', header: 'PId', sortable: true, action: true, align: 'right', width: '81' }
    
      ]
      this.metaTier=[
        {field: 'tierName', header: 'Tier Name', sortable: true, action: true },
        {field: 'tierid', header: 'Tier Id', sortable: true, action: true, align: 'right', width: '81' }
       ];
    
       this.metaServer=[
        {field: 'serverName', header: 'Server Name', sortable: true, action: true },
        {field: 'serverId', header: 'Server Id', sortable: true, action: true, align: 'right', width: '81' }
       ];
       this.metaInstance=[
        {field: 'instanceName', header: 'Instance Name', sortable: true, action: true },
        {field: 'instanceId', header: 'Instance Id', sortable: true, action: true, align: 'right', width: '81' }
       ];
       this.backend=[
         {field:'backendName', header: 'Backend Name', sortable: true, action: true},
         {field: 'backendId', header: 'Backend Id', sortable: true, action: true, align: 'right', width: '81'}
       ];
       this.method=[
         {field: 'methodName', header: 'Method Name', sortable: true, action: true},
         {field: 'methodId', header: 'Method Id', sortable: true, action: true, align: 'right', width: '81'}
       ];
       this.businessT=[
        {field: 'btId', header: 'Url Name',sortable: true, action:true},
        {field: 'btName', header: 'Url Index', sortable: true, action:true, align: 'right',width:'81'}
        ];
        this.classM=[
          {field: 'className', header: 'Class Name', sortable: true, action:true},
          {field: 'classId', header: 'Class Id',sortable: true, action:true, align: 'right', width: '81'}
          ];
          this.packageM=[
            {field: 'packageName', header: 'Package Name', sortable: true, action:true},
            {field: 'packageId', header: 'Package Id',sortable: true, action:true, align: 'right', width: '81'}
            ];
            this.metaTable=[
              {field: 'tableName', header: 'Table Name', sortable: true, action: true },
              {field: 'rowCount', header: 'Row Count', sortable: true, action: true, align: 'right', width: '81' }
             ];
       this.tsiTier=[
        {field: 'tierName', header: 'Tier Name', sortable: true, action: true },
        {field: 'tierid', header: 'Tier Id', sortable: true, action: true, align: 'right', width: '81' }
       ];
    
       this.tsiServer=[
        {field: 'serverName', header: 'Server Name', sortable: true, action: true },
        {field: 'serverId', header: 'Server Id', sortable: true, action: true, align: 'right', width: '81' },
        {field: 'agentPort', header: 'Agent Port', sortable: true, action: true, align: 'right', width: '81' }
       ];
       this.tsiInstance=[
        {field: 'instanceName', header: 'Instance Name', sortable: true, action: true },
        {field: 'instanceId', header: 'Instance Id', sortable: true, action: true, align: 'right', width: '81' },
        {field: 'port', header: 'Port', sortable: true, action: true, align: 'right', width: '81' }
       ];
}
onTopologyEntityTab(){
    this.mappingAccordion = false;
    this.metadataAccordion = true;
    //tier
      let keys =Object.keys(this.tierMdata)
      this.tierMetadata =[];
      for(let i=0;i<keys.length;i++)
      {
        this.tierMetadata.push({'tierid' : this.tierMdata[keys[i]] , 'tierName' :keys[i] });
      }
      this.tierRecord=this.tierMetadata.length;
    //server
      let keys2 =Object.keys(this.serverMdata)
      this.serverMetadata =[];
      for(let i=0;i<keys2.length;i++)
      {
        this.serverMetadata.push({'serverName' :keys2[i] , 'serverId' : this.serverMdata[keys2[i]] })
      }
          this.serverRecord = this.serverMetadata.length;
    //instance
      let keys3 =Object.keys(this.instanceMdata)
      this.instanceMetadata =[];
      for(let i=0;i<keys3.length;i++)
      {
        this.instanceMetadata.push({'instanceName' :keys3[i] , 'instanceId' : this.instanceMdata[keys3[i]] })
      }
      this.instanceRecord = this.instanceMetadata.length;
      //table records
      let keys10 =Object.keys(this.tableMdata)
      this.tableMetadata =[];
      for(let i=0;i<keys10.length;i++)
      {
        this.tableMetadata.push({'tableName' :keys10[i] , 'rowCount' : this.tableMdata[keys10[i]] })
      }
      this.tRecord = this.tableMetadata.length;
      //method
      let keys4= Object.keys(this.methodMdata);
      this.methodMetadata =[];
      for(let i=0;i < keys4.length;i++)
      {
       this.methodMetadata.push({'methodName' :keys4[i],  'methodId' :this.methodMdata[keys4[i]]})
      }
      this.mRecord = this.methodMetadata.length;
      //backend
      let keys5= Object.keys(this.backendMdata);
      this.backendMetadata =[];
      for(let i=0;i < keys5.length;i++)
      {
        this.backendMetadata.push({'backendName' :keys5[i],  'backendId' :this.backendMdata[keys5[i]]})
      }
      this.bRecord = this.backendMetadata.length;
      //class
      let keys6= Object.keys(this.classMdata);
      this.classMetadata =[];
      for(let i=0;i < keys6.length;i++)
      {
       this.classMetadata.push({'className' :keys6[i],  'classId' :this.classMdata[keys6[i]]})
      }
      this.cRecord = this.classMetadata.length;
      //package
      let keys7= Object.keys(this.packageMdata);
      this.packageMetadata =[];
      for(let i=0;i < keys7.length;i++)
      {
        this.packageMetadata.push({'packageName' :keys7[i],  'packageId' :this.packageMdata[keys7[i]]})
      }
      this.ptRecord=this.packageMetadata.length;
      //BT
      let keys8= Object.keys(this.btMdata);
      this.btMetadata =[];
      for(let i=0;i < keys8.length;i++)
      {
       this.btMetadata.push({'btName' :keys8[i],  'btId' :this.btMdata[keys8[i]]})
      }
      this.btRecord = this.btMetadata.length;
      //PQuery
      let keys9= Object.keys(this.pqMdata);
      this.pqMetadata =[];
      for(let i=0;i < keys9.length;i++)
      {
        this.pqMetadata.push({'pId' :keys9[i],  'query' :this.pqMdata[keys9[i]]})
      }
      this.qRecord = this.pqMetadata.length;
    }
    onMappingTabOpen()
    { 
      //mapping of tier ,server and instance 
           this.metadataAccordion = false;
           let keys =Object.keys(this.mapMdata);
           this.tsiTierMapdata=[];
           this.tsiServerMapdata=[];
           this.tsiInstanceMapdata=[];
           for(let i=0; i<keys.length; i++)
           {  
             this.tsiTierMapdata.push({'tierName' :this.mapMdata[keys[i]].name , 'tierid' : this.mapMdata[keys[i]].id, 'server':this.mapMdata[keys[i]].sdMap})  
           }
           this.selectedTierRow=this.tsiTierMapdata[0];
           let serkey= Object.keys(this.mapMdata[keys[0]].sdMap);
           for(let i=0;i<serkey.length;i++)
           {
             this.tsiServerMapdata.push({"serverName" :this.mapMdata[keys[0]].sdMap[serkey[i]].name , "serverId": this.mapMdata[keys[0]].sdMap[serkey[i]].id, "agentPort":this.mapMdata[keys[0]].sdMap[serkey[i]].agentPort,"instance":this.mapMdata[keys[0]].sdMap[serkey[i]].iObjM})
             let inskey = Object.keys(this.mapMdata[keys[0]].sdMap[serkey[i]].iObjM);
             if(i==0) 
             {
             for(let j=0;j<inskey.length;j++)
             {
               this.tsiInstanceMapdata.push({"instanceName": this.mapMdata[keys[0]].sdMap[serkey[i]].iObjM[inskey[j]].name, "instanceId" : this.mapMdata[keys[0]].sdMap[serkey[i]].iObjM[inskey[j]].id, "port":this.mapMdata[keys[0]].sdMap[serkey[i]].iObjM[inskey[j]].port});
             }
            }
           }
           this.selectedServerRow=this.tsiServerMapdata[0];
           this.tsitRecord = this.tsiTierMapdata.length;
           this.tsisRecord = this.tsiServerMapdata.length;
           this.tsiiRecord = this.tsiInstanceMapdata.length;
           //this.mappingAccordion = false;
           
   }
     onRowClickTier(event) 
     {
       this.mapSdata = event.data.server;
       this.tsiServerMapdata=[];
       this.tsiInstanceMapdata=[];
       let keys = Object.keys(this.mapSdata);
       for(let i=0;i<keys.length;i++)
       {
        //  console.log("keys[i]****",keys[i]);
        //  console.log("obj[keys[i]]*****",this.mapSdata[keys[i]]);
        this.tsiServerMapdata.push({"serverName" :this.mapSdata[keys[i]].name , "serverId" : this.mapSdata[keys[i]].id,"agentPort":this.mapSdata[keys[i]].agentPort, "instance" :this.mapSdata[keys[i]].iObjM })
       }
       if(keys.length>=1)
       {
         this.tsisRecord = this.tsiServerMapdata.length;  
         this.selectedServerRow=this.tsiServerMapdata[0];
         this.mapIdata=this.mapSdata[keys[0]].iObjM;
         let instancekey=Object.keys(this.mapIdata);
         // console.log("&&&&Inst",this.mapIdata);
                
         for(let j=0;j<instancekey.length;j++)
         {
           this.tsiInstanceMapdata.push({"instanceName" : this.mapIdata[instancekey[j]].name , "instanceId" :  this.mapIdata[instancekey[j]].id,"port": this.mapIdata[instancekey[j]].port})
           // console.log("+++++++++++++",this.tsiInstanceMapdata[j]);
         }
         if(instancekey.length>=1)
         {
          this.tsiiRecord = this.tsiInstanceMapdata.length;
         }
         else{
             this.tsiiRecord = 0;
             }
        }
        else{
             this.tsisRecord = 0;
             this.tsiiRecord = 0;
        }
    }
           onRowClickServer(event)
           {
            this.mapIdata = event.data.instance;
            this.tsiInstanceMapdata=[];
            let keys = Object.keys( this.mapIdata);
            //console.log("instance.......",   this.mapIdata);
            //console.log("key*****ins",keys)      
            for(let i=0;i<keys.length;i++)
            {
              //  console.log("keys[i]****",keys[i]);
              //  console.log("obj[keys[i]]*****", this.mapIdata[keys[i]]);
              this.tsiInstanceMapdata.push({"instanceName" : this.mapIdata[keys[i]].name , "instanceId" :  this.mapIdata[keys[i]].id,"port": this.mapIdata[keys[i]].port})
            }
            if(keys.length>=1){
                  this.tsiiRecord = this.tsiInstanceMapdata.length;
            }
            else{
                this.tsiiRecord = 0;
            }
           }
           refreshTSI()
           {
             this.loading = true ;
             this.metadataAccordion = true;
             this.mappingAccordion = false;
             this.topologyEntity(2);              
              this.loading = false ;
             this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTOMD);
          } 
          refreshPCMB(){
            console.log("********");
            this.loading = true ;
            this.metadataAccordion = true;
           this.topologyEntity(3);   
            this.loading = false ;
           this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTOMD);
         }
         refreshTC(){
           this.loading = true ;
           this.metadataAccordion = true;
           this.topologyEntity(6);   
             this.loading = false ;
           this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTOMD);
         }
         refreshBT(){
            this.loading = true ;
            this.metadataAccordion = true;
            this.topologyEntity(4);   
             this.loading = false ;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTOMD);
         }
         refreshQP(){
            this.loading = true ;
            this.metadataAccordion = true;
            this.topologyEntity(5);   
             this.loading = false ;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPTOMD);
         }
          onCloseMetadataTab(){
              this.metadataAccordion = false;
              this.onMappingTabOpen();
              this.mappingAccordion = true;
          }
          onCloseMappingTab(){
              this.mappingAccordion = false;
          }
}

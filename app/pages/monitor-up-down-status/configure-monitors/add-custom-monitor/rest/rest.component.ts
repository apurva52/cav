import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MonitorupdownstatusService } from "../../../service/monitorupdownstatus.service";
import { CustomMonitorService } from "../services/custom-monitor.service";

@Component({
  selector: "app-rest",
  templateUrl: "./rest.component.html",
  styleUrls: ["./rest.component.scss"]
})

export class RestComponent implements OnInit {
  
  constructor(public router: Router,
    private customMonService:CustomMonitorService) { 

  }

  ngOnInit() {

  }
  //route to DB UI in edit mode
  openDBEdit(){
    this.customMonService.editDBdataConfig('java','java','-1').subscribe(data=>{
  this.router.navigate(['configure-db-monitor']);
  this.customMonService.isFromEdit = true;
  this.customMonService.getDbEditData = data;
  console.log("this.monupdown getcmd===>",this.customMonService.getDbEditData)
})

  }
}

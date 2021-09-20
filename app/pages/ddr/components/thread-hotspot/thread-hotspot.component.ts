import { Component, OnInit } from '@angular/core';
import { CommonServices } from "../../services/common.services";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';

@Component({
  selector: 'app-thread-hotspot',
  templateUrl: './thread-hotspot.component.html',
  styleUrls: ['./thread-hotspot.component.css']
})
export class ThreadHotspotComponent implements OnInit {
    depth: any;
    display:boolean=false;
    topFrame:any;
    index:number=0;
    displayName:any;
    signatureName:any;
    id: any; //common service id
    reportHeader:string;
    screenHeight: any;
    
   
    ngOnInit() {
          this.commonService.isToLoadSideBar = false ;
       this.screenHeight = Number(this.commonService.screenHeight)-80;
      this.id = this.commonService.getData();
	    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.THREAD_HOTSPOT);
      this.reportHeader= 'Thread Hotspot Report- '+this.id.testRun;
    }

  constructor(private commonService: CommonServices,private breadcrumbService :DdrBreadcrumbService) {
    
   }
  saveSignatureData(data)
  {
    if(data.length >= 3)
      {
    this.displayName = data[0];
    this.signatureName = data[1];
    this.index = data[2];
    if(data.length > 3)
    this.depth = data[3];
    console.log("Data in parent module=--->",data);
        }
    else if(data.length == 1)
      {
        this.index = data[0];
        console.log('index value in back case',this.index)
      }
  }

  
  getValue()
  {
    if(isNaN(this.topFrame) || this.topFrame.trim() == "" || Number(this.topFrame) < 0)
      alert("Please enter valid input.");
    else
      this.display = false;
  }

  handleChange(event)
  {
    this.index = event.index;
    // this.indexArr.push(this.index);
    console.log('index is',this.index);
    if(Number(this.index) == 2)
      this.display = true;
    this.signatureName = undefined;
  }
  back()
  {
    this.index = this.commonService.indexArr.pop();
    this.display = false;
  }

}

import { Component, OnInit } from "@angular/core";
import { DdrDataModelService } from "../../service/ddr-data-model.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { DdrBreadcrumbService } from "../../services/ddr-breadcrumb.service";
// import * as  CONSTANTS from '../../breadcrumb.constants';
import { MenuItem } from 'primeng';
import { HeapDumpService } from '../service/heap-dump.service'

@Component({
  selector: "app-heap-dump-analyser",
  templateUrl: "./heap-dump-analyser.component.html",
  styleUrls: ["./heap-dump-analyser.component.scss"]
})

export class HeapDumpAnalyserComponent implements OnInit {
  index: number = 0;
  fileName: SafeResourceUrl;
  hostUrl ="";
  breadcrumb: MenuItem[] = [];
  heapPath: any;

  constructor(public _ddrData: DdrDataModelService,
    private sanitizer: DomSanitizer,
    private heapDumpService:  HeapDumpService
    // private breadcrumbService :DdrBreadcrumbService
    ) {
      this.breadcrumb = [
        { label: 'Home', routerLink: '/home/dashboard' },
        { label: 'Heap Dump', routerLink: '/actions/dumps/heap-dump' },
        {label:'Java Heap Dump Analyzer'}
      ];
      this.heapPath = this.heapDumpService.$heapPath;
      console.log('this.heapDumpService.$selectedGeoApp;====>',this.heapDumpService.$heapPath)
  } 

  ngOnInit() {
    // this.breadcrumbService.itemBreadcrums = [];
    // this.breadcrumbService.isFromHome = true;
    // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.HEAP_ANALYZER);
    // if(sessionStorage.getItem("isMultiDCMode") == "true" && sessionStorage.getItem("activeDC") !== "ALL")
    // {
    //   this.hostUrl=location.protocol+"//"+location.host+"/tomcat/" + sessionStorage.getItem("activeDC") + "/";
    // }
    // else
    // {
    //   this.hostUrl=location.protocol+"//"+location.host+"/"; 
    // }
    // if(sessionStorage.getItem("isMultiDCMode") == "true" && this._ddrData.heapPath.startsWith("..")){
    //     this._ddrData.heapPath = this._ddrData.heapPath.substring(3,this._ddrData.heapPath.length);
    // }

    this.hostUrl=window.location.protocol+"//"+window.location.host+"/"; 
    if(this.heapPath.startsWith(".."))
      this.heapPath.substring(3,this.heapPath.length);

    let url = this.hostUrl + this.heapPath + "/SystemOverview/index.html";
    this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  handleChange(event) {
    this.index = event.index;
    let url = "";
    if (this.index == 0)
      url = this.hostUrl+this.heapPath + "/SystemOverview/index.html";
    if (this.index == 1)
      url = this.hostUrl+this.heapPath + "/LeakSuspects/index.html";
    if (this.index == 2)
      url = this.hostUrl+this.heapPath + "/TopComponents/index.html";

    this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    console.log('index is', this.index, ' and url ',this.fileName);
  }
}

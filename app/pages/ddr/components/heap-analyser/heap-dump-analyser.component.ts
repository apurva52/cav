import { Component, OnInit } from "@angular/core";
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DdrBreadcrumbService } from "../../services/ddr-breadcrumb.service";
import * as  CONSTANTS from './../../constants/breadcrumb.constants';

@Component({
  selector: "app-heap-dump-analyser",
  templateUrl: "./heap-dump-analyser.component.html",
  styleUrls: ["./heap-dump-analyser.component.scss"]
})

export class HeapDumpAnalyserComponent implements OnInit {
  index: number = 0;
  fileName: SafeResourceUrl;
  hostUrl ="";

  constructor(public _ddrData: DdrDataModelService,
    private sanitizer: DomSanitizer,
    private breadcrumbService :DdrBreadcrumbService) {

  } 

  ngOnInit() {
    this.breadcrumbService.itemBreadcrums = [];
    this.breadcrumbService.isFromHome = true;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.HEAP_ANALYZER);
    if(sessionStorage.getItem("isMultiDCMode") == "true" && sessionStorage.getItem("activeDC") !== "ALL")
    {
      this.hostUrl=location.protocol+"//"+location.host+"/tomcat/" + sessionStorage.getItem("activeDC") + "/";
    }
    else
    {
      this.hostUrl=location.protocol+"//"+location.host+"/"; 
    }
    if(sessionStorage.getItem("isMultiDCMode") == "true" && this._ddrData.heapPath.startsWith("..")){
        this._ddrData.heapPath = this._ddrData.heapPath.substring(3,this._ddrData.heapPath.length);
    }
    let url = this.hostUrl + this._ddrData.heapPath + "/SystemOverview/index.html";
    this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  handleChange(event) {
    this.index = event.index;
    let url = "";
    if (this.index == 0)
      url = this.hostUrl+this._ddrData.heapPath + "/SystemOverview/index.html";
    if (this.index == 1)
      url = this.hostUrl+this._ddrData.heapPath + "/LeakSuspects/index.html";
    if (this.index == 2)
      url = this.hostUrl+this._ddrData.heapPath + "/TopComponents/index.html";

    this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    console.log('index is', this.index, ' and url ',this.fileName);
  }
}

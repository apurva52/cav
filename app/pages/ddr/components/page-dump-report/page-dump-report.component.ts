import { Component,OnChanges, Output, EventEmitter, ViewChild, ElementRef,AfterViewInit } from '@angular/core';
import { DdrBreadcrumbService } from '../../services/ddr-breadcrumb.service';
import { CavConfigService } from '../../../../main/services/cav-config.service';
import { Subscription } from 'rxjs/Subscription';
import * as  CONSTANTS from '../../constants/breadcrumb.constants';

@Component({
    selector: 'page-dump-report',
    templateUrl: 'page-dump-report.component.html',
    styleUrls: ['page-dump-report.component.scss']
})
export class PageDumpReportComponent implements AfterViewInit {
    recordedFrame:any;
    recfrm:boolean;
    snapshotData:any;
    @ViewChild('pageTable') pageTable: ElementRef;
    heightVal: any;
    showIframeHider:boolean = false;
    sideBarToggleSubs: Subscription;
    myDiv:any;
    constructor(private breadcrumbService:DdrBreadcrumbService,private _cavConfig: CavConfigService) {
    }

    ngOnDestroy() {
    	if(this.sideBarToggleSubs)
      	   this.sideBarToggleSubs.unsubscribe();
    }

    ngAfterViewInit() {
	let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        if(screenWidth)
            screenWidth = (screenWidth - 77);
        if(screenHeight)
            screenHeight = (screenHeight - 49);

       setTimeout(()=>{

        this.myDiv= document.getElementById('pageDumpStyleID');
	if(this.myDiv){
        	this.myDiv.style.width=screenWidth+'px';
        	this.myDiv.style.height=screenHeight+'px'; 
	}
    },1000);
   }

    ngOnInit(){
        this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_DUMP);
	this.sideBarToggleSubs = this._cavConfig.$sideBarToggleObserv.subscribe((val)=>{
      	if(val)
          {
		if(this.myDiv)
			this.myDiv.style.width=(window.innerWidth -77)+'px';
	  } 
        else{
 		  if(this.myDiv)
                        this.myDiv.style.width=(window.innerWidth - 2)+'px';
	}
    });	
    }
    getLowerPaneData(event) {
        this.recfrm = event.recfrm;
        this.recordedFrame = event.recordedFrame;
        this.snapshotData = event.snapshot;

        console.log(' this.recfrm ', this.recfrm,' , this.recordedFrame ',this.recordedFrame,' , this.snapshotData ',this.snapshotData)
    }
    onScrollDown(){
        this.showIframeHider = false;
        this.heightVal = this.pageTable.nativeElement.clientHeight;
        // console.log('0000000000000000000000 ',this.pageTable);
    }
}

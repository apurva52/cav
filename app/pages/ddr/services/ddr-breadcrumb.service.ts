import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
//import { CavTopPanelNavigationService } from '../../../main/services/cav-top-panel-navigation.service';
//import { DdrDataModelService } from "./ddr-data-model.service";
import { DdrDataModelService } from '../../../pages/tools/actions/dumps/service/ddr-data-model.service';

import { CommonServices } from './common.services';
//import 'rxjs/add/operator/pairwise';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


@Injectable()
export class DdrBreadcrumbService {
  private breadcrumbItem$: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
  public breadCrumbAsObservable$: Observable<MenuItem[]> = this.breadcrumbItem$.asObservable();
  itemBreadcrums: MenuItem[] = [];
  private isNotDuplicate: boolean = true;
  private _nsReportName:string;
  isFromHome : boolean = false;
  isFromBreadCrumb : boolean = false;
  parentChildInfo: any={};
  constructor(
    private ddrData: DdrDataModelService, 
    private _router: Router, 
    private commonService: CommonServices, 
    private _activateRoute: ActivatedRoute ) {

    this.ddrData.tabNameObservable$.subscribe((data) => {
      this.itemBreadcrums = [];
      this.commonService.removeAllComponentFromFlowpath();
    })
  }

  setBreadcrumbs(page: string) {
    let refList: MenuItem[] = this.getBreadcrumsLink(page);
    this.breadcrumbItem$.next(refList);

  }

  parentComponent: string = '';
  private getBreadcrumsLink(page: string): MenuItem[] {

    this.isNotDuplicate = true;
    this.itemBreadcrums.map((data) => {
      if (data.routerLink[0] == page) {
        this.isNotDuplicate = false;
      }

    });
    this.isFromBreadCrumb = false;
    let label = '';
    if (page == 'main') {
      label = 'Web Logic';
    }
    else if (page == 'flowpath') {
       label = 'Flowpath'
    }
    else if (page == 'view') {
      label = 'ThreadDump';
    }
      else if (page == 'gcViewer') {
      label = 'GC LOG Details';
    }
    else if (page == 'query') {
      label = 'DB Queries'
    }
    else if (page == 'exception') {
      label = 'Exceptions'
    }
    else if (page == 'methodtiming') {
      if(this.commonService.openfptoAggMT == true)
      label = 'Aggregate Method Timing'
      else
      label = 'Method Timing';
    }
    else if (page == 'servicemethodtiming') {
      label = 'Service Method Timing'
    }
    else if (page == 'threadhotspot') {
      label = 'Thread Hotspots'
    }
    else if (page == 'Ddrtransactionflowpmap') {
      label = 'Transaction Flowmap'
    }
    else if (page == 'hotspot') {
      label = 'HotSpot Thread Details'
    } else if (page === 'httpReqResp') {
      label = 'HTTP Request Response'
    } else if (page === 'methodCallingTree') {
      label = 'Method Calls Details'
    } else if (page === 'Flowpathbysignature') {
      label = 'Flowpaths By Signature'
    } else if (page === 'Flowpathgroupby') {
      label = 'Flowpaths Group By BT'
    } else if (page === 'CustomDataByBTSplitting') {
      label = 'Custom Data By BT Splitting'
    }
    else if (page === 'dbGroupBy') {
      label = 'DB Group By BT'
    }
    // else if (page == 'aggMethodTiming') {
    //   label = 'Aggregate Method Timing'
    // }
    else if (page == 'DdrBtTrendComponent') {
      label = 'BT Trend'
    }
    else if (page == 'IpStatComponent') {
      label = 'IP Stat'
    }
    else if (page === 'flowpathAnalyzer') {
    label = 'Flowpaths Analyzer'
   }
   else if(page === 'sqlByExecutionTime') {
     label = 'SQL Report By Query Execution Time'
   } 
   else if(page === 'sqlTiming') {
    label = 'SQL Timings'
   }
   else if(page === 'ipsummary')
   label ="BT IP Summary"; 
   else if (page === 'dbReport') {
    label = 'DB Queries'
    }
    else if(page === 'flowpathToDB')
      label = "DB Queries"
   else if(page === 'flowpathToMD')  
      label = "Metadata"
 /**
    * NS Session
    */
    else if (page === 'nsreports/sessionSummary')
      label = 'Session Summary'
    else if (page === 'nsreports/sessionStatus')
      label = 'Session Summary By Status'
    else if (page === 'nsreports/sessionInstance')
      label = 'Session Instance'
    else if (page === 'nsreports/sessionFailure')
      label = 'Session Failure Report'
    else if (page === 'nsreports/sessionDetail')
      label = 'Session Detail Report'
    else if (page === 'nsreports/sessionTiming')
      label = this.nsReportName + ' Timing Details'
     /**
      * NS Page
      */
    else if (page === 'nsreports/PageSummary')
      label = 'Page Summary'
    else if (page === 'nsreports/PageSessionSummary')
      label = 'Page Session Summary'
    else if (page === 'nsreports/PageSummaryByStatus')
      label = 'Page Summary By Status'
    else if (page === 'nsreports/PageInstance')
      label = 'Page Instance'
    else if (page === 'nsreports/PageComponentDetail')
      label = 'Page Component Details'
    else if (page === 'nsreports/PageFailure')
      label = 'Page Failure'
    /**
      * NS URL
      */
    else if (page === 'nsreports/urlSummary')
      label = 'URL Summary'
    else if (page === 'nsreports/urlSummaryStatus')
      label = 'URL Summary By Status'
    else if (page === 'nsreports/urlInstance')
      label = 'URL Instance'
    else if (page === 'nsreports/urlfail')
      label = 'URL Failure Report'
    else if (page === 'nsreports/urldetails')
      label = 'URL Component Details'
    else if (page === 'nsreports/urlsessionsummary')
      label = 'URL Session Summary'
      
    /**
      * NS transaction
      */
    else if (page === 'nsreports/TransactionSummary')
      label = 'Transaction Summary'
    else if (page === 'nsreports/TransactionSummaryByStatus')
      label = 'Transaction Summary By Status'
    else if (page === 'nsreports/TransactionInstance')
      label = 'Transaction Instance'
    else if (page === 'nsreports/TransactionFailurereport')
      label = 'Transaction Failure'
    else if (page === 'nsreports/TransactionDetails')
      label = 'Transaction Details Report'
    else if (page === 'nsreports/TransactionSessionSummary')
      label = 'Transaction Session Summary'
    else if (page === 'nsreports/userSession')
      label = 'User Session'
    else if(page == 'pagedump')
      label = 'Page Dump'
    else if (page == 'sequencediagram/fromPage')
      label = 'Sequence Diagram'
    else if(page == 'heapAnalyser')
      label = 'Java heap dump analyzer'
    else if (page == "DdrTierMergeViewComponent" )
      label = "Aggregate Transaction Flowmap";
    else if(page == "DdrAggFlowmapComponent" )
      label = "Agg Transaction Flowmap" 
    else if (page == 'sysdef')
      label = 'System Queries'  
    else if(page == 'ibmheapAnalyser')
       label = 'IBM Java heap dump analyzer'    
    else if(page == 'gcManager')
        label = 'GC Manager'     
   if(this.parentComponent == 'flowpath' && this.commonService.splitView )
    {
       return this.itemBreadcrums;
     }
   else{
    let objCheck = this.itemBreadcrums.find((itemObj) => { return itemObj.routerLink[0] === 'flowpath' });
    let checkIndex = this.itemBreadcrums.indexOf(objCheck);

    // this._router.events.filter(e => e instanceof NavigationEnd).pairwise().first().subscribe((e) => {
    //   console.log('NAVIGATION PREVIOUS => ',e);
      
    //     if((e[0]['url'] == '/home/ddr/flowpath' || e[0]['url'] == '/home/ED-ddr/flowpath' || e[0]['url'] == '/home/ddrCopyLink/flowpath') && checkIndex != -1 && objCheck && !this.isFromBreadCrumb ){
    //     this.itemBreadcrums.splice(checkIndex + 1,this.itemBreadcrums.length-1);
    //   } 
    // });
   }


   var objToAdd = {
    label: label, routerLink: [page], command: (event) => {
     this.commonService.isFilterFromSideBar = true ; 
     //this.commonService.isFromBreadCrumb=true;
     console.log("event breadcrumb --",event);
      // this.ddrData.throughBreadcrumb = true ;
      let label = event.item.label ;
      if(label == 'Flowpaths Group By BT')
      this.commonService.previousReport = "FlowpathGroupBy" ;
      else if(label == 'Aggregate Method Timing')
      this.commonService.previousReport = "Method Timing" ;
      else if(label == 'Flowpath')
      this.commonService.previousReport = "Flowpath" ;
      else if(label == 'Exceptions')
      this.commonService.previousReport = "Exception" ;
      else if(label == 'DB Group By BT')
      this.commonService.previousReport = "DBGroupBy" ;
      else if(label == 'DB Queries')
      this.commonService.previousReport = "DB Report" ;
      else if(label == 'HotSpot Thread Details')     
      this.commonService.previousReport = "HotSpot" ;
      else if(label == 'BT IP Summary')
      this.commonService.previousReport = "IP Summary" ;
      
      this.parentComponent = event.item.routerLink[0];
      this.isFromHome = false;
      //this.isFromBreadCrumb = true;
      let labelTemp='';
      if(label.indexOf(" By") != -1 && page.includes("nsreports")) // will do only in case of ns report.
      {
        let index =label.indexOf(" By");
        labelTemp =label.slice(0,index);
        console.log("sliced label turned to summary report ********* ",labelTemp);
      }
      if(this.ddrData.nsCqmAutoFill[label] || this.ddrData.nsCqmAutoFill[labelTemp] )
      {
        console.log("firing event from bread crumb service *********** ",label,"*****",labelTemp);
       if(labelTemp!='')
       this.commonService.nsAutoFillSideBar(labelTemp);
       else
       this.commonService.nsAutoFillSideBar(label);
      }
    }
  };

    let objParent = this.itemBreadcrums.find((itemObj) => { return itemObj.routerLink[0] === this.parentComponent });
    let indexOfParent = this.itemBreadcrums.indexOf(objParent);
    if (indexOfParent != -1 && indexOfParent != (this.itemBreadcrums.length - 1) && (this.parentComponent != page) && !this.isFromHome) {
      let tempBreadCrump = [];

      for (let i = 0; i <= indexOfParent; i++) {
        tempBreadCrump.push(this.itemBreadcrums[i]);
      }
      tempBreadCrump.push(objToAdd);

      this.itemBreadcrums = [];
      this.itemBreadcrums = tempBreadCrump;
    }
    else if (this.isNotDuplicate) {
      this.itemBreadcrums.push(objToAdd);
    }
    return this.itemBreadcrums;
  }

	public get nsReportName(): string {
		return this._nsReportName;
	}

	public set nsReportName(value: string) {
		this._nsReportName = value;
	}


}

import { Component, Input, OnInit, OnChanges,OnDestroy } from '@angular/core';
import { DdrBreadcrumbService } from '../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from '../../../constants/breadcrumb.constants';
import { NsCommonService } from '../services/ns-common-service';


@Component({
    selector: 'ns-session-report',
    templateUrl: 'ns-session-report.component.html',
    styleUrls: ['ns-session-report.component.scss']
})
export class NsSessionReportComponent {
    @Input() id:any;
    instanceReport:boolean=false;
    summaryReport:boolean=false;
    sessionFailure:boolean=false;
    sessionDetail:boolean=false;
    sessionTiming:boolean=false;
    
    summaryReportByStatus:boolean=false;
    
    
    constructor(private breadcrumbService: DdrBreadcrumbService,private nsCommonData:NsCommonService){

    }

    ngOnDestroy(){
        console.log('ng On Destroy is called')
        this.instanceReport=false;
        this.summaryReport=false;
        this.sessionFailure=false;
        this.sessionDetail=false;
        this.sessionTiming=false;
    }
    ngOnChanges(){
        this.loadComponent();
    }
    ngOnInit() {
        console.log('*** input ',this.id);
        this.loadComponent();
    }
     loadComponent()
     {
        console.log('*** loadComponent ',this.id);

        if (this.id === 'sessionInstance'){
            this.summaryReport = false;
            this.sessionDetail = false;
            this.sessionTiming = false;
            this.sessionFailure = false;
            this.instanceReport = true;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SESSION_INSTANCE);
        }
        else if (this.id === 'sessionSummary')
        {
            this.summaryReportByStatus = false;
            this.sessionTiming = false;
            this.sessionFailure =false;
            this.sessionDetail = false;
            this.instanceReport = false;
            this.summaryReport = true;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SESSION_SUMMARY);
            
        }
        else if (this.id === 'sessionStatus')
        {
            this.sessionFailure = false;
            this.instanceReport = false;
            this.sessionTiming = false;
            this.sessionDetail = false;
            this.summaryReportByStatus = true; // use for Constructing query for SessionSummary by status report
            this.summaryReport = true;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SESSION_STATUS);
            
        }
        else if(this.id === 'sessionFailure')
        {
            this.summaryReport = false;
            this.instanceReport = false;
            this.sessionDetail = false;
            this.sessionTiming = false;
            this.sessionFailure = true;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SESSION_FAILURE);
        }
        else if(this.id === 'sessionDetail')
        {
            this.summaryReport = false;
            this.instanceReport = false;
            this.sessionFailure = false;
            this.sessionTiming = false;
            this.sessionDetail = true;
            
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SESSION_DETAIL);
        }
        else if(this.id === 'sessionTiming')
        {
            /**
             * use for Setting Breadcumb Name
             */
            if (this.nsCommonData.objectType === '0')
                this.breadcrumbService.nsReportName = 'URL';
            else if (this.nsCommonData.objectType === '1')
                this.breadcrumbService.nsReportName = 'Page';
            else if (this.nsCommonData.objectType === '2')
                this.breadcrumbService.nsReportName = 'Transaction';
            else
                this.breadcrumbService.nsReportName = 'Session';

            this.summaryReport = false;
            this.instanceReport = false;
            this.sessionFailure = false;
            this.sessionDetail = false;
            this.sessionTiming = true;
            this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.SESSION_TIMING);
        }

     }
   
}

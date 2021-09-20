import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DdrBreadcrumbService } from '../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from '../../../constants/breadcrumb.constants';

@Component({
    selector: 'ns-url-report',
    templateUrl: 'ns-url-report.component.html',
    styleUrls: ['ns-url-report.component.scss']
})
export class NsUrlReportComponent {
    @Input() id:any;
    urlSummaryReport:boolean=false;
    urlSessionsummary:boolean=false;
    urlSummaryStatus:boolean=false;
    urlInstanceReport:boolean=false;
    urlFailure:boolean=false;
    urlDetail:boolean=false;
    
    constructor(private breadcrumbService: DdrBreadcrumbService){

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

        if (this.id == 'urlInstance'){
            this.urlSummaryReport=false;
            this.urlSessionsummary=false;
            this.urlFailure=false;
            this.urlDetail=false;
            this.urlInstanceReport=true;
            this.urlSummaryStatus = false;
        }
        else if (this.id == 'urlSummary' || this.id === 'urlSummaryStatus')
        {
            this.urlSummaryReport=true;
            this.urlSessionsummary=false;
            this.urlSummaryStatus = false;
            this.urlInstanceReport=false;
            this.urlFailure=false;
            this.urlDetail=false;
            if(this.id === 'urlSummaryStatus')
            this.urlSummaryStatus = true;          
        }
        else if(this.id === 'urlfail')
        {
            this.urlSummaryReport=false;
            this.urlSummaryStatus = false;
            this.urlSessionsummary=false;
            this.urlInstanceReport=false;
            this.urlFailure=true;
            this.urlDetail=false;
        }
        else if(this.id === 'urldetails')
        {
            this.urlSummaryReport=false;
            this.urlSummaryStatus = false;
            this.urlSessionsummary=false;
            this.urlInstanceReport=false;
            this.urlFailure=false;
            this.urlDetail=true;
        }
        else if(this.id === 'urlsessionsummary')
        {
            this.urlSummaryReport=false;
            this.urlSummaryStatus = false;
            this.urlSessionsummary=true;
            this.urlInstanceReport=false;
            this.urlFailure=false;
            this.urlDetail=false;
        }

     }
   
}

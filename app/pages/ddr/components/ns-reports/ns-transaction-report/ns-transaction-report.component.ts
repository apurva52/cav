import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DdrBreadcrumbService } from '../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from '../../../constants/breadcrumb.constants';

@Component({
    selector: 'ns-transaction-report',
    templateUrl: 'ns-transaction-report.component.html',
    styleUrls: ['ns-transaction-report.component.scss']
})
export class NsTransactionReportComponent {
    @Input() id:any;
    summaryReport:boolean=false;   
    instanceReport:boolean=false;   
    summarybystatusReport:boolean=false;
    transactionDetail:boolean = false;
    transactionSessionSummary:boolean = false;
    transactionFailure:boolean = false;
 
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

       if(this.id === 'TransactionSummary') 
       {
           this.summaryReport = true;
           this.summarybystatusReport = false;
           this.instanceReport = false;
           this.transactionDetail = false;
           this.transactionSessionSummary = false;
           this.transactionFailure = false;
          this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMARY);
       }
       else if(this.id === 'TransactionSummaryByStatus')
       {
           this.summarybystatusReport = true;
           this.summaryReport = false;
           this.instanceReport = false;
           this.transactionDetail = false;
           this.transactionSessionSummary = false;
           this.transactionFailure = false;
          this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SUMMAY_STATUS);		
       }
       else if(this.id === 'TransactionInstance')
       {
           this.instanceReport = true;
           this.summaryReport = false;
           this.summarybystatusReport = false;
           this.transactionDetail = false;
           this.transactionSessionSummary = false;
           this.transactionFailure = false;
        this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_INSTANCE);
       }
       else if(this.id === 'TransactionFailurereport')
       {
           this.transactionFailure = true;
           this.summaryReport = false;
           this.summarybystatusReport = false;
           this.instanceReport = false;
           this.transactionDetail = false;
           this.transactionSessionSummary = false;
          this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FAILURE);
       }
       else if(this.id === 'TransactionDetails')
       {			
           this.transactionDetail = true;
           this.summaryReport = false;
           this.summarybystatusReport = false;
           this.instanceReport = false;
           this.transactionSessionSummary = false;
           this.transactionFailure = false;
           
          this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_DETAILS);
       }
       else if(this.id === 'TransactionSessionSummary')
       {
           this.transactionSessionSummary = true;
           this.summaryReport = false;
           this.summarybystatusReport = false;
           this.instanceReport = false;
           this.transactionDetail = false;	
           this.transactionFailure = false;
           
          this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_SESSION_SUMMARY);
       }

        
    }
}


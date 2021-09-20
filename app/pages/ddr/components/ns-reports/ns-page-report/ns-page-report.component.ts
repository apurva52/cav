import { Component ,Input, OnInit , OnChanges} from '@angular/core';

@Component({
    selector: 'ns-page-report',
    templateUrl: 'ns-page-report.component.html',
    styleUrls: ['ns-page-report.component.scss']
})
export class NsPageReportComponent {
    @Input() id:any;
    summary:boolean=false;
    instance:boolean=false;
    summaryByStatus:boolean=false;
    failure:boolean=false;
    compDetail:boolean=false;
    sessionSummary:boolean=false;

    constructor(){}

    ngOnChanges()
    {
        this.loadComponent();
    }
    
    ngOnInit()
    {
        console.log(" id from input decorator = " , this.id);
        this.loadComponent();
    }
    
    loadComponent(){
        if(this.id === 'PageSummary')
        {
            this.summary = true;
            this.summaryByStatus = false;
            this.instance = false;
            this.compDetail = false;
            this.failure = false;
            this.sessionSummary = false;
        }
        else if(this.id === 'PageSessionSummary')
        {
            this.sessionSummary = true;
            this.summary = false;
            this.summaryByStatus = false;
            this.instance = false;
            this.compDetail = false;
            this.failure = false;      
        }
        else if(this.id === 'PageSummaryByStatus')
        {
            this.summary = true;
            this.summaryByStatus = true;
            this.instance = false;
            this.sessionSummary = false;
            this.compDetail = false;
            this.failure = false; 
        }
        else if(this.id === 'PageInstance')
        {
            this.instance = true;
            this.summary = false;
            this.summaryByStatus = false;
            this.sessionSummary = false;
            this.compDetail = false;
            this.failure = false; 
        }
        else if(this.id === 'PageFailure')
        {
            this.failure = true;
            this.instance = false;
            this.summary = false;
            this.summaryByStatus = false;
            this.sessionSummary = false;
            this.compDetail = false;
        }
        else if(this.id === 'PageComponentDetail')
        {
            this.compDetail = true;
            this.failure = false;
            this.instance = false;
            this.summary = false;
            this.summaryByStatus = false;
            this.sessionSummary = false;
        }
    }
    
}


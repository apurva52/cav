import { Component, OnInit, OnChanges,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NsCommonService } from './services/ns-common-service';

@Component({
  selector: 'ns-reports',
  templateUrl: 'ns-reports.component.html',
  styleUrls: ['ns-reports.component.scss']
})
export class NsReportsComponent implements OnInit, OnChanges, OnDestroy{
  id;
  sub: Subscription;
  sessionReport = false;
  urlReport = false;
  pageReport = false;
  transactionReport = false;
  userSessionReport = false;

  constructor(private route: ActivatedRoute,) { }
  loadComponent(){
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
     
    if (this.id.startsWith('session')){
      this.userSessionReport = false;
      this.urlReport = false;
      this.pageReport = false;
      this.transactionReport = false;
      this.sessionReport = true;
    }
    else if (this.id.startsWith('url')){
      this.pageReport = false;
      this.transactionReport = false;
      this.userSessionReport = false;
      this.sessionReport = false;
      this.urlReport = true;
    }
    else if (this.id.startsWith('Page')){
      this.urlReport = false;
      this.transactionReport = false;
      this.userSessionReport = false;
      this.sessionReport = false;
      this.pageReport = true;
    }
    else if (this.id.startsWith('Transaction')){
      this.urlReport = false;
      this.pageReport = false;
      this.userSessionReport = false;
      this.sessionReport = false;
      this.transactionReport = true;
    }
    else if(this.id.startsWith('user'))
    {
      this.urlReport = false;
      this.pageReport = false;
      this.sessionReport = false;
      this.transactionReport = false;
      this.userSessionReport = true;
    }
    });
  }

   ngOnInit() {
    this.loadComponent();
  }

   ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnChanges(){
    this.loadComponent();
  }

}

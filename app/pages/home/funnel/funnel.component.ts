import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { FunnelDetailsComponent } from './funnel-details/funnel-details.component';
import { PageDetailsComponent } from './page-details/page-details.component';

@Component({
  selector: 'app-funnel',
  templateUrl: './funnel.component.html',
  styleUrls: ['./funnel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FunnelComponent implements OnInit {
  funnelDetails: FunnelDetailsComponent;
  pageDetails: PageDetailsComponent;

  compareMode: boolean;

  constructor(private route: ActivatedRoute, private breadcrumb: BreadcrumbService) { }

  ngOnInit(): void {
    const me = this;
    // add breadcrumb.
    if (Object.keys(me.route.snapshot.queryParams).length == 0) {
      // it is clicked from menu.
      // remove all and add from the begining.
      me.breadcrumb.removeAll();

      me.breadcrumb.add({ label: 'Home', routerLink: '/home' } as MenuItem);
    }

    me.breadcrumb.addNewBreadcrumb({ label: 'Funnel', routerLink: '/home/funnel', queryParams: { 'from': 'breadcrumb' } } as MenuItem);
  }

}
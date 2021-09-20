import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyLibraryComponent implements OnInit {

  items: MenuItem[];
  featurePermission = 7;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    public breadcrumb: BreadcrumbService
  ) { }

  ngOnInit(): void {
    let reportLabel: MenuItem = { label: 'Reports', routerLink: '/reports' };
    let stateSession = this.sessionService.session;
    /**Handle for no permisson capability for report */
    if (stateSession) {
      if (stateSession.permissions || stateSession.permissions.length > 0) {
        if (stateSession.permissions[1].key === "WebDashboard") {
          if (stateSession.permissions[1].permissions || stateSession.permissions[1].permissions.length > 0) {
            this.featurePermission = stateSession.permissions[1].permissions[32].permission;
            if (this.featurePermission == 0) {
              reportLabel = { label: 'Reports', disabled: true, title: 'No Permission' };
            } else {
              reportLabel = { label: 'Reports', routerLink: '/reports' }
            }
          }
        }
      }
      this.items = [
        { label: 'Dashboards', routerLink: '/my-library/dashboards' },
        { label: 'Alerts', routerLink: '/my-library/alert' },
        reportLabel,
        // {label: 'Favorites', routerLink: '/favorites', disabled: true},
        { label: 'Searches', routerLink: '/my-library/search', disabled: false },
        //{label: 'Business Process', routerLink: '/my-library/business-process'},
        { label: 'Logs Visualization', routerLink: '/visualization' }
      ];
      this.breadcrumb.addNewBreadcrumb({ label: 'My-Library', routerLink: ['/my-library'] });

    }
  }


  openReport() {
    this.router.navigate(['/reports']);
  }

  onTabChange(event) {
    console.log(event);
    if (event.index === 2) {
      this.router.navigate(['/reports']);
    }
  }
}

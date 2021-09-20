import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-config-auto-discover',
  templateUrl: './config-auto-discover.component.html',
  styleUrls: ['./config-auto-discover.component.css']
})
export class ConfigAutoDiscoverComponent implements OnInit {

  index: number = 0;
  breadcrumb: BreadcrumbService;
  constructor(private _configKeywordsService: ConfigKeywordsService, breadcrumbService: BreadcrumbService) { this.breadcrumb = breadcrumbService;}

  ngOnInit() {
    this.breadcrumb.add({label: 'Instrumentation Finder', routerLink: '/nd-agent-config/auto-discover'});
  }

  handleChange(e) {
    this.index = e.index;
    // this.router.navigate(['/profile/general', this.profileId, this.index]);
  }
 /**
 * Purpose : To invoke the service responsible to open Help Notification Dialog
 * related to the current component.
 */
  sendHelpNotification() {
    this._configKeywordsService.getHelpContent("Left Panel", "Instrumentation Finder", "");
  }

}

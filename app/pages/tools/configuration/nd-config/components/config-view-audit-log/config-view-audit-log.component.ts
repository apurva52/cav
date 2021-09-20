import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-view-audit-log',
  templateUrl: './config-view-audit-log.component.html',
  styleUrls: ['./config-view-audit-log.component.css']
})
export class ConfigViewAuditLogComponent implements OnInit {

  auditLogData: any = [];
  gb: any;

  cols = [
    { field: '', header: 'S.No' },
    { field: 'timestamp', header: 'TimeStamp' },
	  { field: 'action', header: 'Action' },
	  { field: 'username', header: 'User Name' },
	  { field: 'description', header: 'Description' }
    ];
  breadcrumb: BreadcrumbService;
  constructor(private _configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private _configKeywordsService: ConfigKeywordsService, breadcrumbService: BreadcrumbService) { this.breadcrumb = breadcrumbService; }

  ngOnInit() {
    this.breadcrumb.add({label: 'Audit Log', routerLink: '/nd-agent-config/audit-log-view'});
    //Getting data on Initial Load
    this.getAuditLogData();
  }

  getAuditLogData() {
    let fileName = '';
    // Getting Audit Log data from Server
    this._configKeywordsService.getActivityLogData().subscribe(data => {
      this.auditLogData = data;
    });
  }
}

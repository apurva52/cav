import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-retention-policy',
  templateUrl: './retention-policy.component.html',
  styleUrls: ['./retention-policy.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RetentionPolicyComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  agentInfoItems: MenuItem[];
  activeTab: MenuItem;
  
  constructor(
    private router : Router,
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Data Retention & Cleanup' },
    ]
    me.agentInfoItems = [
      {
        label: 'GLOBAL CONFIGURATION',      
        command: (event: any) => {          
          me.router.navigate(['/retention-policy/global-configuration']);
        },
      },
      {
        label: 'CLEANUP CONFIGURATION',
        command: (event: any) => {
          me.router.navigate(['/retention-policy/cleanup-configuration']);
        },
      },
      
    ];
    this.activeTab = this.agentInfoItems[0];
  }

}

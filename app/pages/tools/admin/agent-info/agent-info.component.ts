import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-agent-info',
  templateUrl: './agent-info.component.html',
  styleUrls: ['./agent-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgentInfoComponent implements OnInit {
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
      { label: 'Agent Info' },
    ]
    me.agentInfoItems = [
      {
        label: 'MACHINE AGENT STATUS (TOTAL: 175, ACTIVE: 159)',      
        command: (event: any) => {          
          me.router.navigate(['/agent-info/machine-agent']);
        },
      },
      {
        label: 'APPLICATION AGENT STATUS (TOTAL: 1018, ACTIVE: 1012)',
        command: (event: any) => {
          me.router.navigate(['/agent-info/application-agent']);
        },
      },
      
    ];
    this.activeTab = this.agentInfoItems[0];
  }

}

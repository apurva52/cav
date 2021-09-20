import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-configure-detection-rules',
  templateUrl: './configure-detection-rules.component.html',
  styleUrls: ['./configure-detection-rules.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ConfigureDetectionRulesComponent  extends PageDialogComponent implements OnInit {
  widgetReportItems: MenuItem[];
  activeTab: MenuItem;
  allState: MenuItem[];
  allEvent: MenuItem[];
  
  constructor(private router : Router,) { 
        super();
  }

  ngOnInit(): void {
    const me = this;
    me.allState = [
      { label: '-Select Mode-' },
      { label: 'Select' },
    ];
    me.allEvent = [
      { label: 'Select Type' },
      { label: 'Select' },
      
    ];
    me.widgetReportItems = [
      {
        label: 'CONFGURE DETECTION RULES',      
        command: (event: any) => {          
         me.router.navigate(['']);
        },
      },
      {
        label: 'SPLIT BY METHOD EXECUTION',
        command: (event: any) => {
        
        },
      },
      {
        label: 'SPLIT BY REQUEST HEADERS',
        command: (event: any) => {
          
        },
      },
      {
        label: 'SPLIT BY RESPONSE HEADERS',
        command: (event: any) => {
         
        },
      },
    ];
    this.activeTab = this.widgetReportItems[0];
  }
  
  open(){
    this.visible = true;
  }
 
  closeDialog(){
    this.visible = false;
  }
}

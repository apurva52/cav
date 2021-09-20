import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-starve-application',
  templateUrl: './starve-application.component.html',
  styleUrls: ['./starve-application.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StarveApplicationComponent implements OnInit {

  
  items: MenuItem[];
  downloadOptions: MenuItem[];
  isShow: boolean = true;
  // activeTab: MenuItem;

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.items = [
      {label: 'CPU Burst', icon: 'icons8 icons8-forward', routerLink: 'cpu-burst'},
      {label: 'Disk Swindle', icon: 'icons8 icons8-forward', routerLink: 'disk-swindle'},
      {label: 'I/O Shoot Up', icon: 'icons8 icons8-forward', routerLink: ''},
      {label: 'Memory Outlay', icon: 'icons8 icons8-forward', routerLink: ''},
     

    ];
    
    // this.activeTab = this.items[0];
  }

  closeSidePanel(){
    const me = this;
    me.isShow = false;
  }
  openSidePanel() {
    const me = this;
    me.isShow = true;
  }


}

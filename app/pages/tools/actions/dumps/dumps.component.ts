import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-dumps',
  templateUrl: './dumps.component.html',
  styleUrls: ['./dumps.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DumpsComponent implements OnInit {

  tabs: MenuItem[];  
  

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.tabs = [
      { label: 'Thread Dump', routerLink: 'thread-dump' },
      { label: 'Heap Dump', routerLink: 'heap-dump' },
      { label: 'Process Dump', routerLink: 'process-dump' },
      { label: 'TCP Dump', routerLink: 'tcp-dump' },
    ];
  }

}

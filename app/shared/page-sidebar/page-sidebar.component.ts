import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng';

@Component({
  selector: 'app-page-sidebar',
  template: 'Page Sidebar Works!',
  encapsulation: ViewEncapsulation.None
})
export class PageSidebarComponent implements OnInit {

  @ViewChild('sidebar', { read: Sidebar, static: true }) sidebar: Sidebar;
  visible: boolean;

  constructor() {
  }

  ngOnInit(): void {}

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }


}

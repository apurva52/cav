import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SearchSidebarComponent } from 'src/app/shared/search-sidebar/search-sidebar/search-sidebar.component';

@Component({
  selector: 'app-node-action-sidebar',
  templateUrl: './node-action-sidebar.component.html',
  styleUrls: ['./node-action-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeActionSidebarComponent implements OnInit {
  isVisible: boolean = false;
  nodeRepresentation: boolean = true;
  topTransaction: boolean = false;
  showDashboard: boolean = false;
  nodeInfo: boolean = false;
  searchSidebar: boolean = false;

  @ViewChild(SearchSidebarComponent, { read: SearchSidebarComponent })
  private searchSidebarComponent: SearchSidebarComponent;


  constructor() { }

  ngOnInit(): void {
    const me = this;
  }

  openTierInfo() {
    const me = this;
    me.isVisible = true;
  }

  closeClick() {
    const me = this;
    this.isVisible = !this.isVisible;
  }

  nodeRepresentationVisible(value) {
    const me = this;
    me.isVisible = true;
    me.showDashboard = false;
    me.topTransaction = false;
    me.nodeInfo = false;
    me.nodeRepresentation = value;
    me.searchSidebar = false;
  }

  dashboardVisible(value) {
    const me = this;
    me.isVisible = true;
    me.nodeRepresentation = false;
    me.topTransaction = false;
    me.nodeInfo = false;
    me.searchSidebar = false;
    me.showDashboard = value;
  }

  transactionsVisible(value) {
    const me = this;
    me.isVisible = true;
    me.nodeRepresentation = false;
    me.showDashboard = false;
    me.nodeInfo = false;
    me.searchSidebar = false;
    me.topTransaction = value;
  }

  closeSidepanel() {
    const me = this;
    me.topTransaction = false;
    this.isVisible = !this.isVisible;
  }

  nodeInfoVisible(value) {
    const me = this;
    me.isVisible = true;
    me.nodeRepresentation = false;
    me.showDashboard = false;
    me.topTransaction = false;
    me.searchSidebar = false;
    me.nodeInfo = value;
  }

  searchSidebarVisible(value) {
    const me = this;
    // me.isVisible = true;
    me.nodeRepresentation = false;
    me.showDashboard = false;
    me.topTransaction = false;
    me.searchSidebar = value;
    me.nodeInfo = false;
    this.searchSidebarComponent.open();
  }
}

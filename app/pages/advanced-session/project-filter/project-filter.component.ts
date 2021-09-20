import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectFilterComponent extends PageSidebarComponent
implements OnInit  {

  selectedItem;
  project: MenuItem[];
  selectedProject: MenuItem;

  constructor() {
    super();
   }

  ngOnInit(): void {
    const me = this;
    
    me.project = [
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
      { label: 'ALL'},
    ];

  }

  onClickMenu(item) {
    this.selectedItem = item.toElement.innerText;
  }

  drillDownFilterApply() {
    const me = this;
    super.hide();
  }

  drillDownFilterReset() { }


  closeClick() {
    const me = this;
    super.hide();
  }


}

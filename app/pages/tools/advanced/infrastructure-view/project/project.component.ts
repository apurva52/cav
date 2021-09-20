import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PROJECT_PANEL_DATA } from './service/project.dummy';
import { ProjectPanelData } from './service/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent implements OnInit {

  error: AppError;
  empty: boolean;
  loading: boolean;
  data: ProjectPanelData;
  width: number;
  options: MenuItem[];
  selectedOption: MenuItem;

  @ViewChild('projectCard', { read: ElementRef })
  projectCard: ElementRef;

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.options = [
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'}
    ];

    me.data = PROJECT_PANEL_DATA;
  }

  getCustomWidth() {
    const me = this;
    let el;

    if (me.projectCard) {
      el = me.projectCard.nativeElement.querySelector('p-card .ui-card');
      el.setAttribute('style', 'width: 400px');
    }
  }
}

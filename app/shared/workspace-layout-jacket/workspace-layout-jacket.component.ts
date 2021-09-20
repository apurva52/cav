import { Component, OnInit, Input } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-workspace-layout-jacket',
  templateUrl: './workspace-layout-jacket.component.html',
  styleUrls: ['./workspace-layout-jacket.component.scss']
})
export class WorkspaceLayoutJacketComponent implements OnInit {

  @Input() dashboard: DashboardComponent;

  constructor() { }

  ngOnInit(): void {
  }

  workspaceLayout: any = [
    { type: '4-grid', label: '4 - Grid', icon: 'assets/icons/4-grid-layout.svg' },
    { type: 'gallery', label: 'Gallery', icon: 'assets/icons/gallery-layout.svg' },
    { type: 'horizontal-2', label: 'Horizontal 2', icon: 'assets/icons/horizontal-2-layout.svg' },
    { type: '3-grid', label: '3 - Grid', icon: 'assets/icons/3-grid-layout.svg' },
    { type: '6-grid', label: '6 - Grid', icon: 'assets/icons/6-grid-layout.svg' },
    { type: '9-grid', label: '9 - Grid', icon: 'assets/icons/9-grid-layout.svg' },
    { type: 'design-canvas', label: 'Design Canvas', icon: 'assets/icons/design-canvas-layout.svg' }
  ];

}


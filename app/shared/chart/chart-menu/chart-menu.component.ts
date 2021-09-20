import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { ChartComponent } from '../chart.component';

@Component({
  selector: 'app-chart-menu',
  templateUrl: './chart-menu.component.html',
  styleUrls: ['./chart-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChartMenuComponent implements OnInit {
  items: MenuItem[];
  @Input() chart: ChartComponent;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.items = [
      {
        label: 'Open Dashboard',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Widget Settings',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Time Period & View By',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Show Metric Data',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Pattern Matching',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Add to custom metrics',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Show Graph In Tree',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Reports',
        command: (event: any) => {},
        disabled: true,
      },
      {
        label: 'Run Commands',
        disabled: true,
      },
      {
        label: 'Download As',
        items: [
          {
            label: 'PNG',
          },
          {
            label: 'JPEG',
          },
          {
            label: 'SVG',
          },
          {
            label: 'PDF',
          },
        ],
        disabled: true,
      },
      {
        label: 'Advanced Open/Merge',
        command: () => {},
        disabled: true,
      },
      {
        label: 'Monochromatic Color',
        items: [
          {
            label: 'Off',
          },
          {
            label: 'On',
          },
        ],
        disabled: true,
      },
    ];
  }
}

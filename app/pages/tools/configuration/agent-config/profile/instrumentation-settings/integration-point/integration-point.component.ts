import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-integration-point',
  templateUrl: './integration-point.component.html',
  styleUrls: ['./integration-point.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IntegrationPointComponent implements OnInit {
  selectedValues: string = 'selectAll';

  constructor() {}

  ngOnInit(): void {
    const me = this;
  }
}

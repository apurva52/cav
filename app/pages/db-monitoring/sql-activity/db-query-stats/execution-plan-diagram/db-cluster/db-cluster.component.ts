import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-db-cluster',
  templateUrl: './db-cluster.component.html',
  styleUrls: ['./db-cluster.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DbClusterComponent extends BaseNodeComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

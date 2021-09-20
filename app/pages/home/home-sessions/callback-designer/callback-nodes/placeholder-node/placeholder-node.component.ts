import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-placeholder-node',
  templateUrl: './placeholder-node.component.html',
  styleUrls: ['./placeholder-node.component.scss']
})
export class PlaceholderNodeComponent extends BaseNodeComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

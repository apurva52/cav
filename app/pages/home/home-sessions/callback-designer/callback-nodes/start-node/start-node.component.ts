import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-start-node',
  templateUrl: './start-node.component.html',
  styleUrls: ['./start-node.component.scss']
})
export class StartNodeComponent extends BaseNodeComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

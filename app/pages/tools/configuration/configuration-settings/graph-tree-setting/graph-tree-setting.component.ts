import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-graph-tree-setting',
  templateUrl: './graph-tree-setting.component.html',
  styleUrls: ['./graph-tree-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphTreeSettingComponent implements OnInit {

  selectedValues: string = 'saveConfigFile';

  constructor() { }

  ngOnInit(): void {
  }

}

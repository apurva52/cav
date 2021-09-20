import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-query-setting',
  templateUrl: './query-setting.component.html',
  styleUrls: ['./query-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuerySettingComponent implements OnInit {

  selectedValues: string;
  url: string = 'https://192.254.65.194:72';

  constructor() { }

  ngOnInit(): void {
  }

}

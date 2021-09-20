import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-db-setting',
  templateUrl: './db-setting.component.html',
  styleUrls: ['./db-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DbSettingComponent implements OnInit {

  selectedValues: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}

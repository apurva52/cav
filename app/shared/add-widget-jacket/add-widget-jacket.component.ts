import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-add-widget-jacket',
  templateUrl: './add-widget-jacket.component.html',
  styleUrls: ['./add-widget-jacket.component.scss']
})
export class AddWidgetJacketComponent implements OnInit {

  constructor() { }
  items: MenuItem[];
  ngOnInit(): void {

    this.items = [
      {label:'GROUP'},
      {label:'GRAPHS'},
      {label:'STORES'}
    ]
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OthersComponent implements OnInit {

  options: MenuItem[];  
  selectedOptions: MenuItem;
  
  constructor() { }

  ngOnInit(): void {

    const me = this;

    me.options = [
      {label: 'Select'},
      {label: 'logger1'},
      {label: 'logger2'},
      {label: 'logger3'},
      {label: 'logger4'}
    ];
    
  }

}

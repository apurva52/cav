import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionDetailsComponent implements OnInit {

  options: MenuItem[];  
  selectedOptions: MenuItem;
  selectedValues: string = 'transaction';

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.options = [
      {label: '100'},
      {label: '95'},
      {label: '90'},
      {label: '85'},
      {label: '80'},
      {label: '50'}
    ];
  }

}

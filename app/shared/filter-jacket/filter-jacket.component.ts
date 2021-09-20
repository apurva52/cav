import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-jacket',
  templateUrl: './filter-jacket.component.html',
  styleUrls: ['./filter-jacket.component.scss']
})
export class FilterJacketComponent implements OnInit {

  filterValues = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  hours: any = [
    { name: 'Last 2 Hours' },
    { name: 'Last 6 Hours' },
    { name: 'Last 8 Hours' },
    { name: 'Last 10 Hours' }
  ];

  filterList: any = [
    { name: 'Checkout' },
    { name: 'Transaction Failed' },
    { name: 'Add to Cart' },
    { name: 'Exceptions' },
    { name: 'Latency Spike' },
    { name: 'Decrease in users' },
    { name: 'Transaction Successful' },
  ]

  addFilter(item){
    this.filterValues.push(item.name);
  }

}

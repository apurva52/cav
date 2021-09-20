import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-business-transaction',
  templateUrl: './business-transaction.component.html',
  styleUrls: ['./business-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessTransactionComponent implements OnInit {
  settings:string = 'patternconfig';;
  constructor() { }

  ngOnInit(): void {
  }

}

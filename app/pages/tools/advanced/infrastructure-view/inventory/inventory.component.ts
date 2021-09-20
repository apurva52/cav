import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InventoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

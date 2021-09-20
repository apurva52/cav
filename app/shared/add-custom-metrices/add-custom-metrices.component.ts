import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-add-custom-metrices',
  templateUrl: './add-custom-metrices.component.html',
  styleUrls: ['./add-custom-metrices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCustomMetricesComponent implements OnInit {

  isVisible: boolean = false;
  displayBasic2 = false;

  constructor() { }

  ngOnInit(): void {
  }

  // Form Modal open
  open() {
    const me = this;
    me.isVisible = true;
  }

  // Form Modal Close
  apply() {
    this.isVisible = false;
  }

  closeDialog(){
    const me = this;
    me.isVisible = false;
  }



}

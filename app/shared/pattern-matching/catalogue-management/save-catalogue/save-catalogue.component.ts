import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-catalogue',
  templateUrl: './save-catalogue.component.html',
  styleUrls: ['./save-catalogue.component.scss']
})
export class SaveCatalogueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  visible:boolean =false;
  
  show() {
    const me = this;
    this.visible = true;
  }

}

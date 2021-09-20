import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-add-new-variation',
  templateUrl: './add-new-variation.component.html',
  styleUrls: ['./add-new-variation.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AddNewVariationComponent extends PageDialogComponent implements OnInit {

  selectedValue: string = 'val1';
  channel: SelectItem[];
  page: SelectItem[];
  val: number;
  disableDropdown: boolean = false;
  disableInput: boolean = true;
  
  constructor() {
    super();
   }

  ngOnInit(): void {

    const me = this;

    me.channel = [
      {label:'All', value:'all'},
      {label:'Channel1', value:'channel1'},
    ]

    me.page = [
      {label:'Select Page', value:'selectPage'},
      {label:'Select Page1', value:'selectPage1'},
    ]
    
  }

  showDialog() {
    super.show();
  }

  open(){
    this.visible = true;
  }
 
  closeDialog(){
    this.visible = false;
  }

  updateCountry() {
    if(this.selectedValue =='val1') {
      this.disableDropdown = false;
      this.disableInput = true;
    } else {
      this.disableDropdown = true;
      this.disableInput = false;
    }
}

}

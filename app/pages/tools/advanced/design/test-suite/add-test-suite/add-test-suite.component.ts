import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-add-test-suite',
  templateUrl: './add-test-suite.component.html',
  styleUrls: ['./add-test-suite.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTestSuiteComponent extends PageDialogComponent  implements OnInit {

  project: SelectItem[];
  subProject: SelectItem[];
  actionOnFailure: SelectItem[];
  parameterizationMode: SelectItem[];

  constructor() { 
    super();
  }

  ngOnInit(): void {
    const me = this;

    me.project = [
      {label:'All', value:'all'},
      {label:'Project1', value:'project1'},
      {label:'Project2', value:'project2'},
    ]

    me.subProject = [
      {label:'All', value:'all'},
      {label:'Sub Project1', value:'subProject1'},
      {label:'Sub Project2', value:'subProject2'},
    ]

    me.actionOnFailure = [
      {label:'3months', value:'3months'},
      {label:'5months', value:'5months'},
      {label:'10months', value:'10months'},
    ]

    me.parameterizationMode = [
      {label:'3months', value:'3months'},
      {label:'5months', value:'5months'},
      {label:'10months', value:'10months'},
    ]
  }

  open() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

}

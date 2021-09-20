import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-execution-plan-detail',
  templateUrl: './execution-plan-detail.component.html',
  styleUrls: ['./execution-plan-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExecutionPlanDetailComponent implements OnInit {
  Object = Object;
  constructor(private _dialog: MatDialogRef<ExecutionPlanDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) {
    
  }

  ngOnInit(): void {
  }

  /* Method to close the dialog box.*/
  close() {
    this._dialog.close();
  }

}

import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToggleComponent } from '../controlType/toggle/toggle.component';
import { DynamicFormFields } from '../service/dynamic-form';

@Component({
  selector: 'app-dynamic-form-right',
  templateUrl: './dynamic-form-right.component.html',
  styleUrls: ['./dynamic-form-right.component.scss']
})
export class DynamicFormRightComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  @Input() dialog: boolean;
  fieldData: DynamicFormFields;
  @ViewChild(ToggleComponent, { read: ToggleComponent })
  toggleComponent: ToggleComponent;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.fieldData = this.fields;

    if (this.fieldData.colspan === undefined) {

      if (this.dialog === true) {
        if (this.fieldData.controlType === 'json' || this.fieldData.controlType === 'jsonarray') {
          this.fieldData.colspan = 12;
        }

      } else {
        if (this.fieldData.controlType === 'json' || this.fieldData.controlType === 'jsonarray') {
          this.fieldData.colspan = 12;
        } else {
          this.fieldData.colspan = 3;
        }
      }
    }


  }

}

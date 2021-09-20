import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  fieldData: DynamicFormFields;
  errorMsg: { min: string; max: string; required: string; email: string; pattern: string; };

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {

    this.dynamicFormService.getErrorMessage().subscribe(result => {
      this.errorMsg = result;
    });

    this.form.get(this.fieldData.key).valueChanges.subscribe(val => {
      if (val === null) {
        this.form.get(this.fieldData.key).patchValue(val);
      }
      this.enableDisable();
    });

  }


  ngOnChanges() {
    this.fieldData = this.fields;

    this.dynamicFormService.getColSpan(this.fieldData.colspan).subscribe(result => {
      this.fieldData.classes = result;
      // offset
      this.dynamicFormService.getColOffset(this.fieldData.coloffset).subscribe(offset => {
        this.fieldData.classes += offset;
      });
    });

    this.enableDisable();
  }

  enableDisable() {
    if (this.fieldData.hasOwnProperty('dependency')) {
      for (const i of this.fieldData.dependency) {
        if (this.form.get(i.key) !== null) {
          if (this.form.get(this.fieldData.key).value === i.value) {
            if (i.hasOwnProperty('patchValue')) {
              this.form.get(i.key).patchValue(i.patchValue);
            }
            this.form.get(i.key).disable();
          } else {
            this.form.get(i.key).enable();
          }
        }
      }
    }
  }

}

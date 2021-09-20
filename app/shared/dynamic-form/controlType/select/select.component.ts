import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  // form: FormGroup;
  fieldData: DynamicFormFields;
  options: any[];
  errorMsg: { min: string; max: string; required: string; email: string; pattern: string; };

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {

    this.dynamicFormService.getErrorMessage().subscribe(result => {
      this.errorMsg = result;
    });

    this.form.get(this.fieldData.key).valueChanges.subscribe(val => {
      if (val === null) {
        this.form.get(this.fieldData.key).patchValue(this.fieldData.defaultValue);
      }
    });

    this.enableDisableControl(this.fieldData.value);

  }

  enableDisableControl(val) {
    if (this.fieldData.hasOwnProperty('dependency')) {
      for (const i of this.fieldData.dependency) {
        if (i.value === val) {
          this.form.get(i.key).disable();
        } else {
          this.form.get(i.key).enable();
        }
      }
    }
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

    if (typeof (this.fieldData.options) === 'string') {
      this.dynamicFormService.getMetadata(this.fieldData.options).subscribe(metadata => {
        this.options = metadata;
      });
    } else {
      this.options = this.fieldData.options;
    }

  }

  onChange(e) {
    this.enableDisableControl(e);
  }

}

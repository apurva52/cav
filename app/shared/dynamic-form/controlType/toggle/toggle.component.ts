import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})

export class ToggleComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  fieldData: DynamicFormFields;
  colspan: string;
  errorMsg: { min: string; max: string; required: string; email: string; pattern: string; };

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {


    this.dynamicFormService.getErrorMessage().subscribe(result => {
      this.errorMsg = result;
    });


    if (this.form.get(this.fieldData.key).value === true || this.form.get(this.fieldData.key).value != 0) {
      this.form.get(this.fieldData.key).patchValue(true, { emitEvent: false });
      this.onChange(true);
    } else {
      this.form.get(this.fieldData.key).patchValue(false, { emitEvent: false });
      this.onChange(false);
    }

    this.form.valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
      setTimeout(() => {
        if (this.form.get(this.fieldData.key).value === true && this.form.enabled) {
          this.onChange(true);
        } else {
          this.onChange(false);
        }
      });
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
  }

  onChange(e) {

    if (this.fieldData.hasOwnProperty('dependency')) {
      for (const i of this.fieldData.dependency) {
        if (e) {
          this.form.get(i.key).enable();
        } else {
          this.form.get(i.key).disable();
        }
      }
    }
  }
}

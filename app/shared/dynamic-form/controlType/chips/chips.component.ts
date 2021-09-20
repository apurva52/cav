import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})

export class ChipsComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;

  fieldData: DynamicFormFields;
  errorMsg: { min: string; max: string; required: string; email: string; pattern: string; };

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {
    this.dynamicFormService.getErrorMessage().subscribe(result => {
      this.errorMsg = result;
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

  onBlur(e) {
    let tmp = []
    if (this.fieldData.hasOwnProperty('type')) {
      if (this.fieldData.type === 'number') {
        for (const i of this.form.get(this.fieldData.key).value) {
          if (isNaN(i)) {
            tmp.push(i);
          } else {
            tmp.push(Number(i));
          }
        }
        this.form.get(this.fieldData.key).patchValue(tmp);
      }
    }
  }

}

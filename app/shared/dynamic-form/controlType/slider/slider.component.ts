import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;

  fieldData: DynamicFormFields;
  value: number;
  errorMsg: {
    min: string; max: string; required: string; email: string; pattern: string;
  };

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

    this.value = this.fieldData.value as number;
  }
}

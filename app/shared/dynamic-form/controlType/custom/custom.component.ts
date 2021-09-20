import { Component, Input, OnChanges } from '@angular/core';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})

export class CustomComponent implements OnChanges {
  @Input() fields: DynamicFormFields;

  fieldData: DynamicFormFields;
  colspan: string;

  constructor(private dynamicFormService: DynamicFormService) { }


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

}

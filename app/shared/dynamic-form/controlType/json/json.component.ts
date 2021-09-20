import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.scss']
})
export class JsonComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;

  fieldData: DynamicFormFields;

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
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

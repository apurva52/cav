import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})


export class CalendarComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  fieldData: DynamicFormFields;
  maxDate: Date;
  errorMsg: { min: string; max: string; required: string; email: string; pattern: string; };

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit() {

    this.dynamicFormService.getErrorMessage().subscribe(result => {
      this.errorMsg = result;
    });

    // handling error if the input for the calendar is invalid
    // accepted date format: mm/dd/yyyy hh:mm

    try {
      this.errorHandling(this.form.get(this.fieldData.key).value);

    } catch (e) {
      console.error(e);
      this.form.get(this.fieldData.key).patchValue(new Date());

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
  }

  errorHandling(date: string) {
    const pattern = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4} (2[0-3]|[01]?[0-9]):([0-5]?[0-9])$');
    if (date.toString().search(pattern) === 0) {
      this.form.get(this.fieldData.key).patchValue(this.fieldData.value);
    } else {
      throw new Error('Please provide valid date in format mm/dd/yyyy hh:mm, including leading zero. \n Exapmle: 01/02/2015 03:04:59');

    }
  }

  convertDateFormat() {
    const d = new Date(this.form.get(this.fieldData.key).value);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    const hour = d.getHours();
    const minute = d.getMinutes();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    this.form.get(this.fieldData.key).patchValue(month + '/' + day + '/' + year + ' ' + hour + ':' + minute);
  }

}

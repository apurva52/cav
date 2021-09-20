import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DynamicForm, DynamicFormError, DynamicFormErrorMsg, DynamicFormFieldsValidators } from './service/dynamic-form';
import { DynamicFormService } from './service/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Output() result = new EventEmitter();
  @Input() panelPosition: string = 'left';
  @Input() jsonData: DynamicForm[];
  @Input() btnStyle: any = {
    position: 'sticky',
    bottom: '30px',
    right: '30px',
    float: 'right'
  };
  @Input() metadataMap: string;
  @Input() readOnly: boolean;
  @Input() btnClass: string;
  formSchema: DynamicForm[];
  form: FormGroup;
  formError: DynamicFormError;
  count: number;

  constructor(private dynamicFormService: DynamicFormService, private messageService: MessageService) { }

  ngOnInit() {

  }

  generateValidator(rule: DynamicFormFieldsValidators): ValidatorFn[] {
    const varray: ValidatorFn[] = [];
    // tslint:disable-next-line: forin
    for (const r in rule) {
      if (r === 'min') {
        varray.push(Validators.min(rule[r]));
      }
      if (r === 'max') {
        varray.push(Validators.max(rule[r]));
      }
      if (r === 'required' && rule[r] === true) {
        varray.push(Validators.required);
      }
      if (r === 'requiredTrue') {
        varray.push(Validators.requiredTrue);
      }
      if (r === 'email') {
        varray.push(Validators.email);
      }
      if (r === 'minLength') {
        varray.push(Validators.minLength(rule[r]));
      }
      if (r === 'maxLength') {
        varray.push(Validators.maxLength(rule[r]));
      }
      if (r === 'pattern') {
        varray.push(Validators.pattern(rule[r]));
      }
      if (r === 'unique' && rule[r] === true) {
        varray.push(RxwebValidators.unique());
      }
    }
    return varray;
  }

  toFormGroup(fields: any[]): FormGroup {
    const formControlMap = {};
    fields.forEach(field => {


      if (field.hasOwnProperty('formName')) {
        formControlMap[field.key] = this.toFormGroup(field.fields);

      } else if (field.hasOwnProperty('subFormName')) {
        formControlMap[field.key] = this.toFormGroup(field.fields);

      } else if (field.controlType === 'json') {

        for (const i of field.fields) {

          if (field.value === undefined) {
            console.error('Property value is not defined for field - ', field.key);

          } else {
            if (field.value.hasOwnProperty(i.key)) {
              i.value = field.value[i.key];
            }
          }
        }

        formControlMap[field.key] = this.toFormGroup(field.fields);

      } else if (field.controlType === 'jsonarray') {
        formControlMap[field.key] = new FormArray([...this.toFormGroups(field)]);

      } else {
        formControlMap[field.key] = new FormControl(field.value, this.generateValidator(field.validators));
      }

    });

    return new FormGroup(formControlMap);
  }

  toFormGroups(field): FormGroup[] {
    const arr = [];
    let map = new Map();
    field.value = field.value || [];
    for (const i of field.value) {

      field.fields.forEach(j => {
        map.set(j.key, j.value);

        // set inner form values
        j.value = i[j.key];
      });
      arr.push(this.toFormGroup(field.fields));

      field.fields.forEach(j => {
        // reset inner from values for add control in jsonarray
        j.value = map.get(j.key);
      });
    }

    return arr;
  }


  onSubmit(f) {
    console.log('form : ', f);

    // showing no if error in badge
    if (f.status === 'INVALID') {
      for (const i of this.formSchema) {
        this.count = 0;
        if (f.controls[i.key].status === 'INVALID') {
          i.error = this.getNoofErrCount(f.controls[i.key], i.fields);
        } else {
          i.error = new DynamicFormError(0, []);
        }

        console.log(i.error);
      }

      this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'Oops something wasn\'t right'
      });
      return;

    } else {
      this.result.emit(f.value);
    }


  }


  getNoofErrCount(form: FormGroup, data): DynamicFormError {
    const field = [];
    if (form.status === 'INVALID') {
      // tslint:disable-next-line: forin
      for (const i in form.controls) {
        // if (data !== undefined) {
        for (const j of data) {

          if (j.key === i) {
            let tmp = [];

            if (form.controls[i].status === 'INVALID') {

              if (j.hasOwnProperty('formName')) {
                tmp = this.getNoofErrCount(form.controls[i] as FormGroup, j.fields).field;

              } else if (j.hasOwnProperty('subFormName')) {
                tmp = this.getNoofErrCount(form.controls[i] as FormGroup, j.fields).field;

              } else if (j.controlType === 'json') {
                tmp = this.getNoofErrCount(form.controls[i] as FormGroup, j.fields).field;

              } else if (j.controlType === 'jsonarray') {
                tmp = this.getNoofErrCount(form.controls[i] as FormGroup, j.fields).field;

              } else {
                this.count++;
                tmp = this.getNoofErrCount(form.controls[i] as FormGroup, j.fields).field;

              }
              // if (form.controls[i].hasOwnProperty('controls')) {
              // }
              field.push(new DynamicFormErrorMsg(j.label === undefined ? j.formName === undefined ? j.subFormName : j.formName : j.label, form.controls[i].errors !== null ? this.getErrorMessage(form.controls[i].errors) : '', tmp));

            }

          }

        }
        // }
      }
    }
    return new DynamicFormError(this.count, field);
  }

  getErrorMessage(error: import('@angular/forms').ValidationErrors): string {

    if (error.hasOwnProperty('min')) {
      return 'less than min value.';
    } else if (error.hasOwnProperty('max')) {
      return 'exceeded max value.';
    } else if (error.hasOwnProperty('required')) {
      return 'required field.';
    } else if (error.hasOwnProperty('email')) {
      return 'invalid email.';
    } else if (error.hasOwnProperty('pattern')) {
      return 'invalid data.';
    } else {
      return '';
    }
  }

  ngOnChanges() {
    this.formSchema = this.jsonData;
    if (this.formSchema !== undefined) {
      this.form = this.toFormGroup(this.formSchema);
      this.dynamicFormService.setMetadata(this.metadataMap);

      if (this.readOnly === true) {
        setTimeout(() => {
          this.form.disable();
        }, 100);
      }
    }
  }

  show(op: OverlayPanel, event, error) {
    op.show(event);
    this.formError = {} as DynamicFormError;
    this.formError = error;
  }


}

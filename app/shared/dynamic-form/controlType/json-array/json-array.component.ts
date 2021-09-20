import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng';
import { DynamicFormFields } from '../../service/dynamic-form';
import { DynamicFormService } from '../../service/dynamic-form.service';

@Component({
  selector: 'app-json-array',
  templateUrl: './json-array.component.html',
  styleUrls: ['./json-array.component.scss']
})

export class JsonArrayComponent implements OnInit, OnChanges {
  @Input() fields: DynamicFormFields;
  @Input() form: FormGroup;
  fieldData: DynamicFormFields;
  display: boolean;
  cols: { field: any; header: string; }[] = [];
  tableData: any[] = [];
  control: FormArray;
  selectedRow: any = {};
  wasPreviuosTableDataEmpty: boolean;
  editDisplay = false;
  selectedRecord: any = {};
  isDialog = true;
  emptyDialog: any = {};
  controlIndex = 0;
  row = [];


  constructor(private messageService: MessageService, private dynamicFormService: DynamicFormService) { }

  ngOnInit() {

    for (const i of this.fieldData.fields) {
      this.cols.push({ field: i.key, header: i.label });
    }

    this.control = this.form.controls[this.fieldData.key] as FormArray;
    this.tableData = this.control.value;
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



  deleteControl() {

    if (this.selectedRow.index === undefined) {
      this.messageService.add({
        severity: 'warn', detail: 'Please Select Row to Delete'
      });
      return;
    }

    this.control.removeAt(this.selectedRow.index);
    this.tableData = this.control.value;
    this.selectedRow = {};
    this.row = null;


  }

  editControl() {
    if (this.selectedRow.index === undefined) {
      this.messageService.add({
        severity: 'warn', detail: 'Please Select Row to Edit'
      });
      return;
    }
    this.editDisplay = true;
    this.display = true;
    this.controlIndex = this.selectedRow.index;

  }

  updateControl() {
    // ISSUE: https://github.com/primefaces/primeng/issues/8200

    document.getElementById('closeMultiselect').click();

    if (this.control.status == "INVALID") {
      this.display = true;

      let uniqueError = false;
      uniqueError = this.checkUniqueFields();
      if (uniqueError) {
        return;
      }

      this.messageService.add({
        severity: 'error', detail: 'Please Fill All The Required Fields'
      });
      return;
    }
    if (this.control.status == "VALID") {
      this.display = false;
      this.editDisplay = false;
      this.selectedRow = {};
      this.row = null;
      this.tableData = this.control.value;
    }
  }

  resetUpdate() {
    this.display = false;
    this.editDisplay = false;
    this.tableData[this.selectedRow.index] = this.row;
    this.selectedRow = {};
    this.row = null;
  }

  onRowSelect(event) {
    console.log(event);
    this.selectedRow = event;
    console.log('row', this.row);
  }

  onRowUnselect(event) {
    console.log(event);
    this.selectedRow = {};
    console.log('row', this.row);
  }


  showDialog() {
    this.display = true;
    this.control.push(this.toFormGroup(this.fieldData.fields));
    this.controlIndex = this.control.length - 1;
  }

  addControl() {
    // ISSUE: https://github.com/primefaces/primeng/issues/8200

    document.getElementById('closeMultiselect').click();
    if (this.control.status == "INVALID") {
      this.display = true;

      let uniqueError = false;
      uniqueError = this.checkUniqueFields();
      if (uniqueError) {
        return;
      }

      this.messageService.add({
        severity: 'error', detail: 'Please Fill All The Required Fields'
      });

      return;
    }
    if (this.control.status == "VALID") {
      this.display = false;
      this.tableData = this.control.value;
    }
  }

  checkUniqueFields(): boolean {
    for (const i of this.control.controls) {
      for (const control in (i as FormGroup).controls) {
        if (i.get(control).status === 'INVALID') {
          if (i.get(control).errors && i.get(control).errors.unique) {
            this.messageService.add({ severity: 'error', summary: 'error', detail: control + ' should have unique values' });
            return true;
          }
        }
      }
    }

    return false;
  }

  resetControl() {
    this.display = false;
    this.control.removeAt(this.control.length - 1);
  }

  toFormGroups(field): FormGroup[] {
    const arr = [];
    // in case value is not given.
    field.value = field.value || [];
    for (const { } of field.value) {
      arr.push(this.toFormGroup(field.fields));
    }

    return arr;
  }

  toFormGroup(fields: DynamicFormFields[]): FormGroup {
    const formControlMap = {};
    fields.forEach(field => {

      if (field.controlType == 'json')
        formControlMap[field.key] = this.toFormGroup(field.fields);
      else if (field.controlType == 'jsonarray')
        formControlMap[field.key] = new FormArray([...this.toFormGroups(field)]);
      else
        formControlMap[field.key] = new FormControl(field.value, this.generateValidator(field.validators));

    });
    return new FormGroup(formControlMap);

  }

  generateValidator(rule: any): ValidatorFn[] {
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


  tableValue(obj: any): String {
    if (typeof obj == 'object')
      return JSON.stringify(obj);
    return obj;
  }



}

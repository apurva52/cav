import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItemGroup } from 'primeng';
import { Operator } from '../../../common/interfaces/action-api';
import { DataPoint, LocalVariable } from '../../../common/interfaces/callback';
import { CallbackDatapointComponent } from '../../callback-flowchart-sidebar/callback-datapoint/callback-datapoint.component';
import { CallbackLocalvarComponent } from '../../callback-flowchart-sidebar/callback-localvar/callback-localvar.component';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-callback-action-condition-form',
  templateUrl: './callback-action-condition-form.component.html',
  styleUrls: ['./callback-action-condition-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallbackActionConditionFormComponent implements OnInit, OnChanges {
  @ViewChild(CallbackDatapointComponent) dataPoint: CallbackDatapointComponent;
  @ViewChild(CallbackLocalvarComponent) localVar: CallbackLocalvarComponent;

  @Input() data: any;
  @Output() conditionSubmit: EventEmitter<any>;

  form: FormGroup;
  groupedVariableList: SelectItemGroup[];
  operators: any[];
  submitted: boolean;

  fireFox: boolean;

  constructor(private fb: FormBuilder, private cbService: CallbackDesignerService) {
    this.operators = Operator.operatorList;
    this.conditionSubmit = new EventEmitter<any>();

    this.form = this.fb.group({
      lhs: [null, Validators.required],
      operator: [null, Validators.required],
      rhs: [null, Validators.required]
    });

  }

  ngOnInit(): void {

    this.getGroupedVarData();

    this.cbService.on('callbackChanged').subscribe(() => {
      this.getGroupedVarData();
    });

    // register for change.
    this.cbService.on('addedLocalVar').subscribe(data => this.getGroupedVarData());
    this.cbService.on('addedDataPoint').subscribe(data => this.getGroupedVarData());

    // get the data points and local variables
    const dataPoints: DataPoint[] = this.cbService.getDataPoint();
    const localVar: LocalVariable[] = this.cbService.getLocalVar();

    for (const dp of dataPoints) {
      this.groupedVariableList[0].items.push({
        label: dp.name,
        value: '@DP.' + dp.name
      });
    }

    for (const lvar of localVar) {
      this.groupedVariableList[1].items.push({
        label: lvar.name,
        value: '@Local.' + lvar.name
      });
    }


    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      this.fireFox = true;
    } else {
      this.fireFox = false;
    }
  }

  submit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.conditionSubmit.emit(this.form.value);
    this.form.reset();
  }

  ngOnChanges(): void {
    if (!this.data) {
      this.form.reset();
    } else {
      this.form.patchValue(this.data);
    }
  }

  getGroupedVarData() {
    // TODO: it has to pass by parent component or some other service.
    this.groupedVariableList = [{
      label: 'Data points',
      value: 'fa fa-mixcloud',
      items: []
    }, {
      label: 'Local variables',
      value: 'fa fa-cubes',
      items: []
    }];

    for (const dp of this.cbService.getDataPoint()) {
      this.groupedVariableList[0].items.push({
        label: dp.name,
        value: '@DP.' + dp.name
      });
    }

    for (const lvar of this.cbService.getLocalVar()) {
      this.groupedVariableList[1].items.push({
        label: lvar.name,
        value: '@Local.' + lvar.name
      });
    }

  }

  allowDrop(e) {
    e.preventDefault();
  }

  drop(ev, target: string): void {
    const value = ev.dataTransfer.getData('text').split('$')[1];
    const valueFor = ev.dataTransfer.getData('text').split('$')[0];

    switch (target) {
      case 'lhs':
        if (valueFor !== 'operator') {
          if (value.search('Element.') > -1 || value.search('XHR.') > -1) {
            this.form.get('lhs').patchValue('$$' + value);

          } else if (valueFor === 'datapoint') {
            this.form.get('lhs').patchValue('@DP.' + value);

          } else if (valueFor === 'localvar') {
            this.form.get('lhs').patchValue('@Local.' + value);

          } else {
            this.form.get('lhs').patchValue(value);
          }

        }
        this.handleDragforFirefox(ev.dataTransfer.getData('text'), 'lhs');
        break;

      case 'operator':
        if (valueFor === 'operator') {
          for (const i of this.operators) {
            if (value === i.name) {
              this.form.get('operator').patchValue(i);
            }
          }
        }
        break;

      case 'rhs':
        if (valueFor !== 'operator') {
          if (value.search('Element.') > -1 || value.search('XHR.') > -1) {
            this.form.get('rhs').patchValue('$$' + value);

          } else if (valueFor === 'datapoint') {
            this.form.get('rhs').patchValue('@DP.' + value);

          } else if (valueFor === 'localvar') {
            this.form.get('rhs').patchValue('@Local.' + value);

          } else {
            this.form.get('rhs').patchValue(value);
          }

        }
        this.handleDragforFirefox(ev.dataTransfer.getData('text'), 'rhs');

        break;
    }
  }

  handleDragforFirefox(text: string, control: string) {
    // there is a problem with firefox drag/drop
    // Handling for Bug - 
    if (this.fireFox) {
      const tmpControl = this.form.controls[control];
      setTimeout(() => {

        if (text.indexOf('datapoint$Element') > -1 || text.indexOf('datapoint$XHR') > -1) {
          tmpControl.patchValue(tmpControl.value.replace(text, ''));


        } else if (text.indexOf('localvar$') > -1) {
          tmpControl.patchValue('@Local.' + tmpControl.value.replace(text, ''));

        } else if (text.indexOf('datapoint$') > -1) {
          tmpControl.patchValue('@DP.' + tmpControl.value.replace(text, ''));

        } else {
          tmpControl.patchValue(tmpControl.value.replace(text, ''));

        }
      });
    }
  }
}

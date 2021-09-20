import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem, SelectItemGroup } from 'primeng';
import { ApiArgument } from '../../../common/interfaces/action-api';
import { ActionApiData, Callback } from '../../../common/interfaces/callback';
import { CallbackDatapointComponent } from '../../callback-flowchart-sidebar/callback-datapoint/callback-datapoint.component';
import { CallbackLocalvarComponent } from '../../callback-flowchart-sidebar/callback-localvar/callback-localvar.component';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-callback-action-api-form',
  templateUrl: './callback-action-api-form.component.html',
  styleUrls: ['./callback-action-api-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallbackActionApiFormComponent implements OnInit, OnChanges {
  @ViewChild(CallbackDatapointComponent) dataPoint: CallbackDatapointComponent;
  @ViewChild(CallbackLocalvarComponent) localVar: CallbackLocalvarComponent;

  @Input() data: ActionApiData;
  @Input() callback: Callback;
  @Output() actionSubmit: EventEmitter<ActionApiData>;

  form: FormGroup;

  groupedVariables: SelectItemGroup[];
  localVariables: SelectItemGroup[];
  states: SelectItem[] = [];
  sessionStates: SelectItem[];
  submitted: boolean;

  constructor(private cbService: CallbackDesignerService) {
    this.actionSubmit = new EventEmitter<ActionApiData>();

    this.sessionStates = [
      { label: 'BROWSER', value: 'BROWSER' },
      { label: 'SHOPPER', value: 'SHOPPER' },
      { label: 'BUYER', value: 'BUYER' }
    ];
  }

  ngOnInit(): void {
    this.getGroupedVarData();

    this.cbService.on('callbackChanged').subscribe(data => {
      this.getGroupedVarData();
    });

    // register for change.
    this.cbService.on('addedLocalVar').subscribe(() => this.getGroupedVarData());
    this.cbService.on('addedDataPoint').subscribe(() => this.getGroupedVarData());

  }

  getGroupedVarData() {
    this.groupedVariables = [{
      label: 'Data points',
      value: 'fa fa-mixcloud',
      items: []
    }, {
      label: 'Local variables',
      value: 'fa fa-cubes',
      items: []
    }];

    for (const dp of this.cbService.getDataPoint()) {
      this.groupedVariables[0].items.push({
        label: dp.name,
        value: '@DP.' + dp.name
      });
    }

    for (const lvar of this.cbService.getLocalVar()) {
      this.groupedVariables[1].items.push({
        label: lvar.name,
        value: '@Local.' + lvar.name
      });
    }

    this.localVariables = [this.groupedVariables[1]];

    console.log('Data Points and Local Vars : ', this.groupedVariables);
  }

  ngOnChanges(): void {
    if (this.data) {
      console.log('Action API | data - ', this.data);

      this.form = this.toFormGroup(this.data.api.arguments);

      if (this.data.api.category === 'localVarApi') {
        this.localVariables = [this.groupedVariables[1]];
      }
    }

    if (this.callback) {
      this.states = [];
      for (const state of this.callback.states) {
        this.states.push({ label: state.text, value: state.id });
      }
    }
  }

  toFormGroup(args: ApiArgument[]) {
    const group: any = {};
    // set the initial value from args input.
    // TODO: format the args.
    args.forEach(argument => {
      let initialValue = null;
      if (this.data.argument && typeof this.data.argument[argument.name] === 'string') {
        initialValue = this.data.argument[argument.name];
      }
      group[argument.name] = argument.required ? new FormControl(initialValue, Validators.required) : new FormControl(null);
    });

    return new FormGroup(group);
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.actionSubmit.emit({ api: this.data.api, argument: this.form.value });
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drop(ev, control) {
    const valueFor = ev.dataTransfer.getData('text').split('$')[0];
    const value = ev.dataTransfer.getData('text').split('$')[1];

    if (value.search('Element') > -1 || value.search('XHR') > -1) {
      this.form.get(control).patchValue('$$' + value);
    } else if (valueFor === 'datapoint') {
      this.form.get(control).patchValue('@DP.' + value);
    } else if (valueFor === 'localvar') {
      this.form.get(control).patchValue('@Local.' + value)
    } else {
      this.form.get(control).patchValue(value);
    }
    // there is a problem with firefox drag/drop
    // Handling for Bug - 93296
    this.handleDragforFirefox(ev.dataTransfer.getData('text'), control);

  }

  handleDragforFirefox(text: string, control: string) {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
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

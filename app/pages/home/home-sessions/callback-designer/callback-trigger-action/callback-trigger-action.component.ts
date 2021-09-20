import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { AddCheckPointComponent } from 'src/app/pages/sessions/nv-config/dialog/add-check-point/add-check-point.component';
import { Action, Callback, JtkNodeParam, State, Trigger } from '../../common/interfaces/callback';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../common/service/nvhttp.service';
import { CallbackDesignerService } from '../service/callback-designer.service';

@Component({
  selector: 'app-callback-trigger-action',
  templateUrl: './callback-trigger-action.component.html',
  styleUrls: ['./callback-trigger-action.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallbackTriggerActionComponent implements OnInit, OnChanges {
  @ViewChild(AddCheckPointComponent, { read: AddCheckPointComponent }) checkpointUI: AddCheckPointComponent;
  @Input() state: State;
  @Input() callback: Callback;
  @Output() currentAction: EventEmitter<{ action: Action, event: Event }>;

  triggerDialog: boolean;
  actionDialog: boolean;

  triggerForm: FormGroup;
  actionForm: FormGroup;

  triggerTypes: SelectItem[];
  triggers: SelectItem[] = [];
  actions: SelectItem[] = [];
  checkpoints: SelectItem[] = [];

  submitted: boolean;

  edit_trigger: boolean;
  edit_action: boolean;
  openCheckpoint: boolean;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private http: NvhttpService,
    private cbService: CallbackDesignerService
  ) {

    this.triggerForm = this.fb.group({
      stateId: [{ value: null, disabled: true }, Validators.required],
      name: [{ value: null, disabled: true }, Validators.required],
      type: [null, Validators.required],
      jData: [new JtkNodeParam()]
    });

    this.actionForm = this.fb.group({
      trigger: [null, Validators.required],
      action: [{ value: null, disabled: true }, Validators.required]
    });

    this.triggerTypes = [
      { label: 'Click', value: 'CLICK' },
      { label: 'Input Change', value: 'INPUT_CHANGE' },
      { label: 'Visibility Change', value: 'VISIBILITY_CHANGE' },
      { label: 'Content Change', value: 'CONTENT_CHANGE' },
      { label: 'URL Hash Change', value: 'HASHCHANGE' },
      { label: 'XHR Success', value: 'XHR_COMPLETE' },
      { label: 'XHR Failed', value: 'XHR_FAILED' },
      { label: 'TimeOut', value: 'TimeOut' },
      { label: 'Checkpoint', value: 'CHECKPOINT' }
    ];

    this.currentAction = new EventEmitter<{ action: Action, event: Event }>();
  }

  ngOnInit(): void {
    this.getCheckpoints();

    this.cbService.on('checkpointAdded').subscribe((val: boolean) => {
      this.refreshCheckpoints(val);
    });

  }

  ngOnChanges(): void {
    if (this.callback) {
      if (this.state) {
        //  update trigger
        this.getTriggers();
        // update action
        this.getActions();
      } else {
        this.triggers = [];
        this.actions = [];
      }
    } else {
      //  if the callback is changed , reset the triggers and actions
      this.triggers = [];
      this.actions = [];
    }

  }

  getActions(): void {
    this.actions = [];
    for (const action of this.callback.actions) {
      if (action.stateId === this.state.id) {
        this.actions.push({ label: action.name, value: action });
      }
    }
  }

  getTriggers(): void {
    this.triggers = [];
    for (const trigger of this.callback.triggers) {
      if (trigger.stateId === this.state.id) {
        this.triggers.push({ label: trigger.name, value: trigger });
      }
    }
  }

  openTriggerDialog(trigger?: Trigger): void {
    if (!this.callback) {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Alert', detail: 'Please select a callback first.' });
      return;
    }

    if (!this.state) {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Alert', detail: 'Please select a state first.' });
      return;
    }

    this.triggerDialog = true;
    this.triggerForm.get('stateId').patchValue(this.state.id);

    if (trigger) {
      // edit mode
      this.edit_trigger = true;
      this.onTriggerChange(trigger.type);
      // set the form
      // tslint:disable-next-line: forin
      for (let control in this.triggerForm.controls) {
        this.triggerForm.get(control).patchValue(trigger[control]);
      }

    } else {
      // add new mode
      this.edit_trigger = false;
      this.triggerForm.get('name').patchValue('Trigger_' + this.callback.counter.trigger);
    }
  }

  onTriggerDialogClose(): void {
    this.submitted = false;
    this.triggerForm.reset();
    this.onTriggerChange('');
  }

  onActionDialogClose(): void {
    this.submitted = false;
    this.actionForm.reset();
  }

  openActionDialog(action?: Action): void {
    if (!this.callback) {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Alert', detail: 'Please select a callback first.' });
      return;
    }

    if (!this.state) {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Alert', detail: 'Please select a state first.' });
      return;
    }


    this.actionDialog = true;

    if (action) {
      // edit mode
      this.edit_action = true;
      this.actionForm.get('action').patchValue(action.name);

      for (const i of this.callback.triggers) {
        if (i.id === action.triggerId) {
          this.actionForm.get('trigger').patchValue(i);
          break;
        }
      }

    } else {
      // add mode
      this.edit_action = false;
      this.actionForm.get('action').patchValue(`Action_${this.callback.counter.action}`);
    }
  }

  onTriggerChange(type: string): void {
    // add/remove trigger controls 
    switch (type) {
      case 'CLICK':
      case 'INPUT_CHANGE':
      case 'VISIBILITY_CHANGE':
      case 'CONTENT_CHANGE':
        this.addRemoveTriggerControl(['domSelector'], ['urlPattern', 'checkpoint', 'timeOut']);
        break;

      case 'XHR_COMPLETE':
      case 'XHR_FAILED':
        this.addRemoveTriggerControl(['urlPattern'], ['domSelector', 'checkpoint', 'timeOut']);
        break;

      case 'TimeOut':
        this.addRemoveTriggerControl(['timeOut'], ['domSelector', 'checkpoint', 'urlPattern']);
        break;

      case 'CHECKPOINT':
        this.addRemoveTriggerControl(['checkpoint'], ['domSelector', 'timeOut', 'urlPattern']);
        break;

      default:
        this.addRemoveTriggerControl([], ['urlPattern', 'checkpoint', 'timeOut', 'domSelector']);
        break;
    }
  }

  addRemoveTriggerControl(addControls: string[], removeControls: string[]): void {
    // add control
    for (const control of addControls) {
      this.triggerForm.addControl(control, new FormControl(null, Validators.required));
    }
    // remove control
    for (const control of removeControls) {
      this.triggerForm.removeControl(control);
    }

  }

  addTrigger(): void {
    this.submitted = true;

    if (!this.triggerForm.valid) {
      return;
    }

    // get the current callback
    const f = this.triggerForm.getRawValue();
    const trigger = new Trigger(`trigger_${this.callback.counter.trigger}`, f.name, f.type, this.state.id, f.domSelector, f.urlPattern, f.timeOut, f.checkpoint);
    this.callback.counter.trigger++;

    this.callback.triggers.push(trigger);
    this.getTriggers();
    // mark the callback dirty
    this.callback.dirty = true;

    this.triggerDialog = false;

    console.log('Trigger Added', this.callback.triggers);
  }

  editTrigger(): void {

    this.submitted = true;

    if (!this.triggerForm.valid) {
      return;
    }

    const f = this.triggerForm.getRawValue();


    for (let i of this.callback.triggers) {
      if (i.name === f.name) {
        i.type = f.type;
        i.domSelector = f.domSelector;
        i.checkpoint = f.checkpoint;
        i.urlPattern = f.urlPattern;
        i.timeOut = f.timeOut;
        // mark the callback dirty
        this.callback.dirty = false;
        this.triggerDialog = false;

        console.log('Trigger Updated : ', this.callback.triggers);

        return;
      }
    }
  }

  deleteTrigger(trigger: Trigger): void {
    this.confirmationService.confirm({
      message: `Do you want to delete trigger ${trigger.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      key: 'callback',

      accept: () => {
        const index = this.callback.triggers.findIndex((item) => {
          return item.id === trigger.id;
        });

        if (index > -1) {
          this.callback.triggers.splice(index, 1);
          this.getTriggers();
        }

      },
      reject: () => { }
    });
  }


  addAction(): void {
    this.submitted = true;
    if (!this.actionForm.valid) {
      return;
    }

    this.actionDialog = false;

    const action: Action = new Action(`action_${this.callback.counter.action}`, `Action_${this.callback.counter.action}`, this.state.id, this.actionForm.get('trigger').value.id);
    this.callback.counter.action++;

    // update actions array
    this.callback.actions.push(action);
    this.getActions();

    console.log('Action Added : ', this.callback.actions);
  }

  editAction(): void {
    this.submitted = true;

    if (!this.actionForm.valid) {
      return;
    }

    this.actionDialog = false;

    const f = this.actionForm.getRawValue();

    for (let i of this.callback.actions) {
      if (i.name === f.action) {
        i.triggerId = f.trigger.id;
        break;
      }
    }

    console.log('Action Updated : ', this.callback.actions);
  }

  openFlowChart(action: Action, event: Event): void {
    // set the current action in the callback-designer component
    // this currentAction needs to be passed to callback-flowchart component
    this.currentAction.emit({ action, event });

  }

  getCheckpoints(): void {
    this.http.getCheckpointData().subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.checkpoints = [];
      }

      if (state instanceof NVPreLoadedState) {
        for (const checkpoint of state.data) {
          this.checkpoints.push({ label: checkpoint.cpName, value: checkpoint.cpName });
        }
      }
    },
      (state: Store.State) => {
        if (state instanceof NVPreLoadingErrorState) {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to get checkpoint list' });
        }
      });
  }

  refreshCheckpoints(e) {
    console.log('Checkpoint added , refreshcheckpoints : ', e);
    if (e) {
      this.getCheckpoints();
    }

    this.openCheckpoint = false;
  }

}

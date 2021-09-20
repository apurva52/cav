import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, Panel, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Action, AgentProfileData, Callback, CallbackData, ProfileCallback, State } from '../common/interfaces/callback';
import { Metadata } from '../common/interfaces/metadata';
import { MetadataService } from '../common/service/metadata.service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../common/service/nvhttp.service';
import { CallbackFlowchartComponent } from './callback-flowchart/callback-flowchart.component';
import { CallbackHistoryComponent } from './callback-history/callback-history.component';
import { CallbackDesignerService } from './service/callback-designer.service';

@Component({
  selector: 'app-callback-designer',
  templateUrl: './callback-designer.component.html',
  styleUrls: ['./callback-designer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CallbackDesignerComponent implements OnInit {
  @ViewChild(CallbackFlowchartComponent) flowchart: CallbackFlowchartComponent;
  @ViewChild(CallbackHistoryComponent) historySidebar: CallbackHistoryComponent;
  @ViewChild('pnl1') pnl1: Panel;
  @ViewChild('pnl2') pnl2: Panel;

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  collapsed: boolean;

  breadcrumb: MenuItem[];

  callbackDialog: boolean;

  callbackForm: FormGroup;

  onTriggerEvents: SelectItem[] = [];
  pages: SelectItem[] = [];
  channels: SelectItem[] = [];
  profiles: SelectItem[] = [];
  metadata: Metadata;
  submitted: boolean;

  loading: boolean;
  error: Error | AppError;

  callbackList: SelectItem[];
  selectedCallbackTab: SelectItem[]; // to mark the active callback
  prevSelectedCallbackTab: SelectItem[];

  edit_callback: boolean;

  currentCallback: Callback;
  currentAction: Action;
  currentState: State;
  refreshItems: MenuItem[];

  overflow: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private metaDataService: MetadataService,
    private http: NvhttpService,
    private messageService: MessageService,
    private cbService: CallbackDesignerService,
    private confirmationService: ConfirmationService
  ) {

    this.callbackForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      type: [null, Validators.required],
      pageid: [null, Validators.required],
      channel: [null, Validators.required],
      profilename: [null, Validators.required]
    });

    this.onTriggerEvents = [
      { label: 'Page Ready', value: 1 },
      { label: 'After Beacon', value: 2 },
      { label: 'Page Unload', value: 3 },
      { label: 'Agent Init', value: 4 }
    ];

    this.refreshItems = [
      {
        label: 'Refresh callbacks list', command: () => {
          this.refreshCallbackList();
        },
      },
      {
        label: 'Refresh current callback', command: () => {
          this.refreshCallback();
        },
        visible: this.callbackList && this.callbackList.length > 0
      }
    ];
  }

  ngOnInit(): void {

    const me = this;

    me.breadcrumb = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Session', routerLink: '/home/home-sessions' },
      { label: 'Callback Designer' }
    ];


    this.getMetadata();
    this.getProfiles();
    this.getCallbacks(null);

  }

  getProfiles(): void {
    // get profile details
    this.http.getAgentDBData().subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadedState) {
        this.cbService.profiles = state.data;
      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to get profiles.' });
        console.error('Failed to get the profile | Error - ', state.error);
      }
    });
  }

  getMetadata(): void {
    this.metaDataService.getMetadata().subscribe(response => {
      this.metadata = response;

      // -------channel----------
      const channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        };
      });

      this.cbService.channels = this.channels;

      // -------pages------------
      const pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.pages = pagem.map(key => {
        return {
          label: this.metadata.pageNameMap.get(key).name,
          value: this.metadata.pageNameMap.get(key).id
        };
      });

    }, error => {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to get metadata.' });
      console.error('Failed to get the metadata list');
    });
  }


  channelChanged(channelId: number): void {
    // reset the profile and profile array
    this.callbackForm.get('profilename').reset();
    // get the profiles with the selected channel
    this.profiles = this.cbService.getProfileByChannel(channelId);
  }

  addCallback(): void {
    this.submitted = true;

    if (!this.callbackForm.valid) {
      return;
    }

    // hide the add callback dialog
    this.callbackDialog = false;
    this.submitted = false;

    // if all pages are selected , pass -1
    if (this.pages.length === this.callbackForm.get('pageid').value.length) {
      this.callbackForm.get('pageid').patchValue(['-1']);
    }
    // save the callback and get the callback from the DB 
    const callback = new Callback();
    const f = this.callbackForm.value;
    const callbackData = new CallbackData(f.name, f.description, f.type, '', f.pageid.join(','), f.channel, f.profilename, callback);

    this.httpAddCallback(callbackData);

  }

  httpAddCallback(callbackData: CallbackData) {
    this.http.addCallbacks(callbackData).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }
      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;

        if (state.data) {
          this.messageService.add({ key: 'callback', severity: 'success', summary: 'Success', detail: 'Callback added successfully.' });
          // get the callback list from the DB
          // And, select the currently added callback
          this.getCallbacks(callbackData.name);

          // reset the add callback form
          this.callbackForm.reset();

        } else {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to add callback.' });
        }


      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.error = state.error;
        this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to add callback.' });
        console.error('Failed to Add Callback \n Error : ', state.error);
      }
    });
  }

  getCallbacks(name: string): void {
    this.http.getCallbacks().subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        const callbackList: CallbackData[] = state.data;
        // show the last added callback at first
        // so, sort the callbacklist in descending order

        callbackList.sort((a, b) => b.callbackid - a.callbackid);

        this.callbackList = [];
        for (const cb of callbackList) {
          this.callbackList.push({ label: cb.name, value: cb, title: cb.name });
        }

        // select current callback
        if (this.callbackList.length) {
          this.getCurrentCallback(name);

        } else {
          this.selectedCallbackTab = [];
          this.currentCallback = null;
          this.currentAction = null;
          this.currentState = null;
        }
      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to get callbacks.' });
        console.error('Failed to get callback list \n Error : ', state.error);
      }
    });

  }

  saveCallback(): void {
    if (!this.selectedCallbackTab[0]) {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'No callback selected.' });
      return;
    }

    this.selectedCallbackTab[0].value.jsondata = this.currentCallback;

    if (this.currentAction) {
      // check if any action has dirty nodes
      let dirtyNodesPresent = this.currentAction.data.aNOdes.some(node => node.dirty);
      dirtyNodesPresent = dirtyNodesPresent || this.currentAction.data.cNodes.some(node => node.dirty);

      if (dirtyNodesPresent) {
        this.messageService.add({ key: 'callback', severity: 'error', summary: 'Unable to save', detail: 'First correct the error in the current action.' });
        return;
      }

      // check if any placeholder node is left
      if (this.currentAction.placeHolderNodes > 0) {
        this.confirmationService.confirm({
          header: 'Confirmation',
          message: 'Placeholder Nodes will be removed. Do you want to continue?',
          icon: 'icons8 icons8-error',
          key: 'callback',
          accept: () => {
            // remove placeholder nodes
            for (const node of this.flowchart.toolkit.getNodes()) {
              if (node.data.type === 'placeholder') {
                this.flowchart.toolkit.removeNode(node);
                this.currentAction.placeHolderNodes--;
              }
            }

            // save the callback
            this.updateCallback();
          }
        });

        return;

      }
    }

    this.updateCallback();

  }

  updateCallback(): void {
    this.http.updateCallback(this.selectedCallbackTab[0].value).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;

        if (state.data) {
          this.messageService.add({ key: 'callback', severity: 'success', summary: 'success', detail: 'Callback saved successfully.' });
          // update the selected callback tab, this is done to prevent get callback list request call again
          this.selectedCallbackTab[0].value.jsondata = JSON.parse(JSON.stringify(this.currentCallback));
        } else {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to save the callback.' });
          return;
        }

        this.currentCallback.dirty = false;
        if (this.currentAction) {
          this.currentAction.dirty = false;
        }
      }
    },
      (state: Store.State) => {
        if (state instanceof NVPreLoadingErrorState) {
          this.loading = state.loading;
          this.error = state.error;

          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to save the callback.' });
          console.error('Failed to save the callback \n Error - ', state.error);
        }
      });
  }

  applyCallback(): void {
    if (!this.selectedCallbackTab[0]) {
      this.messageService.add({ key: 'callback', severity: 'warn', summary: 'Alert', detail: 'First select a callback.' });
      return;
    }

    let value: CallbackData = this.selectedCallbackTab[0].value;
    let runAt = '';
    for (const i of this.onTriggerEvents) {
      if (i.value == value.type) {
        runAt = i.label.toLowerCase().split(' ').join('_');
      }
    }

    const agentProfileData = new AgentProfileData([
      new ProfileCallback(value.pageid, runAt, value.callbackid, value.jsondata)
    ]);
    //  apply the callback
    this.http.UpdateAgentProfile(agentProfileData, value.profilename).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;

        if (state.data.status === 'pass') {
          this.messageService.add({ key: 'callback', severity: 'success', summary: 'Success', detail: 'Callback applied successfully.' });

        } else {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to apply the callback' });
        }
      }
    },
      (state: Store.State) => {
        if (state instanceof NVPreLoadingErrorState) {
          this.loading = state.loading;
          this.error = state.error;

          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to apply the callback' });
          console.error('Failed to apply the callback. \n Error - ', state.error);
        }
      });
  }



  getCurrentCallback(name: string, refreshFlag?: boolean): void {
    if (name) {
      for (const callback of this.callbackList) {
        if (callback.label === name) {
          this.selectedCallbackTab = [callback];
        }
      }

    } else {
      // if the name is empty , select the first callback
      this.selectedCallbackTab = [this.callbackList[0]];
    }
    // store the selected callback tab for future use
    this.prevSelectedCallbackTab = this.selectedCallbackTab;

    // set the callback headers
    // set the selected callback in service
    if (!refreshFlag) {
      const callback = JSON.parse(JSON.stringify(this.selectedCallbackTab[0].value.jsondata)) as Callback;
      this.currentCallback = callback;
      this.cbService.setCallback(callback);
      console.log('Selected Callback : ', this.selectedCallbackTab[0].value);

    }

  }

  getCallbackName(): string {
    return this.selectedCallbackTab[0].value.name;
  }

  getProfileName(): string {
    return this.selectedCallbackTab[0].value.profilename;
  }

  getChannel(): string {
    for (const c of this.channels) {
      if (c.value === this.selectedCallbackTab[0].value.channel) {
        return c.label;
      }
    }
    return 'Others';
  }

  getTriggerType(): string {
    for (const t of this.onTriggerEvents) {
      if (t.value === this.selectedCallbackTab[0].value.type) {
        return t.label;
      }
    }
  }

  getPages(): string {
    return this.getPagesList(this.selectedCallbackTab[0].value.pageid);
  }

  getPagesList(ids: string): string {
    let str = '';
    if (ids !== null && this.pages.length) {
      if (ids === '-1') {
        str = 'All Pages';
      } else {

        const item = ids.split(',');
        this.pages.forEach((page, i) => {
          item.forEach((i, j) => {
            if (page.value == i) {
              item[j] = page.label;
            }
          });
        });

        if (item.length > 3) {
          str = item[0] + ', ' + item[1] + ', ' + item[2] + ' and ' + (item.length - 3) + ' more. ';
        } else {
          str = item.join(', ');
        }
      }
    }
    return str;
  }

  onCallbackChange(item: SelectItem[], refreshFlag?: boolean): void {
    // check for dirty callback
    if (this.currentCallback && this.currentCallback.dirty) {
      this.confirmationService.confirm({
        message: 'You have unsaved changes.\n Are You sure you want to ' + (refreshFlag ? 'refresh' : 'leave') + ' this callback?',
        header: 'Confirmation',
        icon: 'icons8 icons8-error',
        acceptLabel: refreshFlag ? 'Refresh' : 'Leave',
        rejectLabel: 'Cancel',
        key: 'callback',
        accept: () => {
          this.setCallback();
          this.collapsed = false;
        },
        reject: () => {
          this.selectedCallbackTab = this.prevSelectedCallbackTab;
          return;
        }
      });
    } else {
      this.setCallback();
    }

  }

  setCallback(): void {
    this.prevSelectedCallbackTab = this.selectedCallbackTab;

    this.currentCallback = JSON.parse(JSON.stringify(this.selectedCallbackTab[0].value.jsondata));
    // clear the selected state and action
    this.currentState = null;
    this.currentAction = null;
    this.cbService.setCallback(this.currentCallback);
  }

  editCallback(): void {
    this.submitted = true;

    if (!this.callbackForm.valid) {
      return;
    }

    this.callbackDialog = false;
    // if all pages are selected , pass -1
    if (this.pages.length === this.callbackForm.get('pageid').value.length) {
      this.callbackForm.get('pageid').patchValue(['-1']);
    }

    const f = this.callbackForm.getRawValue();
    const callback = this.cbService.currentCallback;

    const callbackData = new CallbackData(f.name, f.description, f.type, '', f.pageid.join(','), f.channel, f.profilename, callback, this.selectedCallbackTab[0].value.callbackid);

    this.http.updateCallback(callbackData).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        if (state.data) {
          this.messageService.add({ key: 'callback', severity: 'success', summary: 'Success', detail: 'Callback updated successfully.' });
          this.getCallbacks(f.name);
        } else {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to update the callback.' });
        }
      }

    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        console.error('Failed to update the callback. \n Error : ', state.error);
        this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to update the callback.' });
      }
    });
  }

  deleteCallback(callback: CallbackData): void {
    // TODO:handle dirty callback
    // raise a dialog for delete confirmation
    this.confirmationService.confirm({
      message: 'Do you want to delete the callback ' + callback.name + '?',
      header: 'Delete Confirmation',
      icon: 'icons8 icons8-error',
      key: 'callback',

      accept: () => {

        this.http.deleteCallback(callback.callbackid).subscribe((state: Store.State) => {

          if (state instanceof NVPreLoadingState) {
            this.loading = state.loading;
            this.error = state.error;
          }

          if (state instanceof NVPreLoadedState) {
            this.loading = state.loading;
            this.error = state.error;

            if (state.data) {
              this.messageService.add({ key: 'callback', severity: 'success', summary: 'Success', detail: 'Callback deleted successfylly.' });
              this.getCallbacks(null);

            } else {
              this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to delete the callback.' });
            }
          }

        },
          (state: Store.State) => {
            if (state instanceof NVPreLoadingErrorState) {
              this.loading = state.loading;
              this.error = state.error;
              this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to delete the' });
            }
          });
      },
      reject: () => {

      }
    });
  }

  openCallbackDialog(callback?: CallbackData): void {

    //  check if the current callback is dirty
    if (this.currentCallback && this.currentCallback.dirty) {
      this.confirmationService.confirm({
        header: 'Confirmation',
        message: 'You have unsaved changes.\n Are You sure you want to leave this callback?',
        key: 'callback',

        accept: () => {
          this.openAddCallbackDialog(callback);
        }
      });
    } else {
      this.openAddCallbackDialog(callback);
    }
  }

  openAddCallbackDialog(callback?: CallbackData): void {

    // reset the current callback
    this.currentState = null;
    this.currentAction = null;
    // if some callback are present, reset the currently selected callback
    if (this.selectedCallbackTab && this.selectedCallbackTab.length) {
      this.currentCallback = JSON.parse(JSON.stringify(this.selectedCallbackTab[0].value.jsondata));
    }

    this.collapsed = false;
    this.callbackDialog = true;
    if (callback) {
      //edit callback mode

      // TODO: Handle dirty callback

      // if the callback isn't dirty
      this.cbService.setCallback(callback.jsondata);

      this.edit_callback = true;
      // if the pageid = -1, means all pages are selected
      // so get all the pages value 
      let tmpPageArr = [];
      if (callback.pageid === '-1') {
        for (const page of this.pages) {
          tmpPageArr.push(page.value);
        }

      } else {
        tmpPageArr = callback.pageid.split(',').map(Number);
      }

      this.profiles = this.cbService.getProfileByChannel(callback.channel);

      this.callbackForm.patchValue({
        name: callback.name,
        description: callback.description,
        type: callback.type,
        pageid: tmpPageArr,
        channel: callback.channel,
        profilename: callback.profilename
      });

      //disable some controls
      this.callbackForm.get('name').disable();
      this.callbackForm.get('description').disable();
      this.callbackForm.get('channel').disable();
      this.callbackForm.get('profilename').disable();

    } else {
      //  add callback mode
      this.edit_callback = false;

      // enable controls if disabled
      this.callbackForm.get('name').enable();
      this.callbackForm.get('description').enable();
      this.callbackForm.get('channel').enable();
      this.callbackForm.get('profilename').enable();
    }
  }

  onDialogHide() {
    this.submitted = false;
    this.callbackForm.reset();
  }

  setCurrentAction(param: { action: Action, event: Event }): void {
    console.log('Event Emitted : ', param)
    this.currentAction = param.action;
    this.pnl1.toggle(param.event);
  }

  openFlowChart(params: any): void {
    console.log('openFlowchart : ', params);
    this.collapsed = true;

    const actionId = params.edge.data.actionId;

    this.currentCallback.actions.forEach(action => {
      if (action.id === actionId) {
        this.currentAction = action;

        this.currentCallback.states.forEach(state => {
          if (state.id === action.stateId) {
            this.currentState = state;
          }
        })
      }
    })
  }

  setCurrentState(event: State): void {
    this.currentState = event;
  }

  showHistory() {
    if (!(this.selectedCallbackTab && this.selectedCallbackTab[0])) {
      this.messageService.add({ key: 'callback', severity: 'warn', summary: 'Alert', detail: 'No callback selected.' });
      return;
    }

    this.historySidebar.showSidebar(this.selectedCallbackTab[0].value);
  }

  saveNewCopy(event: CallbackData): void {
    this.httpAddCallback(event);
  }

  refreshCallback(): void {
    this.onCallbackChange(this.selectedCallbackTab, true);
  }

  refreshCallbackList(): void {
    this.http.getCallbacks().subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        const callbackList: CallbackData[] = state.data;
        // show the last added callback at first
        // so, sort the callbacklist in descending order

        callbackList.sort((a, b) => b.callbackid - a.callbackid);

        this.callbackList = [];
        for (const cb of callbackList) {
          this.callbackList.push({ label: cb.name, value: cb, title: cb.name });
        }
        this.getCurrentCallback(this.selectedCallbackTab[0].label, true);
      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to get callbacks.' });
        console.error('Failed to get callback list \n Error : ', state.error);
      }
    });
  }

  toggleOverflow(): void {
    this.overflow = !this.overflow;

    this.cbService.broadcast('overflow', this.overflow);
  }


}

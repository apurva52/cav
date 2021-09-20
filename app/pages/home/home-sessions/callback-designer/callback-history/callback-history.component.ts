import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Callback, CallbackData } from '../../common/interfaces/callback';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../common/service/nvhttp.service';
import { CallbackDesignerService } from '../service/callback-designer.service';

@Component({
  selector: 'app-callback-history',
  templateUrl: './callback-history.component.html',
  styleUrls: ['./callback-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallbackHistoryComponent implements OnInit {
  @Output() saveNewCopy = new EventEmitter<CallbackData>();

  visible: boolean;
  error: Error | AppError;
  loading: boolean;

  versionList: SelectItem[];
  channels: SelectItem[];
  profiles: SelectItem[];
  namedVersionList: SelectItem[];


  selectedVersion: any;
  copyDialog: boolean;
  namedVersion: boolean;

  versionOptions: MenuItem[];

  // copy version form
  form: FormGroup;
  submitted: boolean;
  callbackData: CallbackData;
  rename: boolean;
  renameLabel: any;

  constructor(private http: NvhttpService, private fb: FormBuilder, private cbService: CallbackDesignerService, private messageService: MessageService) {
    this.versionOptions = [
      {
        label: 'Rename this version',
        command: () => {
          this.showRenameDialog();
        }
      }, {
        label: 'Make a copy',
        command: () => { this.showCopyDialog(); }
      }
    ];

    this.form = this.fb.group({
      name: [null, Validators.required],
      changeProfile: [false]
    });

  }

  showCopyDialog(): void {
    this.copyDialog = true;
  }

  hideCopyDialog(): void {
    this.submitted = false;
    this.copyDialog = false;
    this.form.reset();
  }

  makeCopy(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const f = this.form.value;

    const data = new CallbackData(f.name, this.callbackData.description, this.callbackData.type, this.callbackData.value, this.callbackData.pageid, f.channel != null ? f.channel : this.callbackData.channel, f.profile != null ? f.profile : this.callbackData.profilename, this.selectedVersion.jsondata);

    this.hideCopyDialog();
    this.visible = false;
    this.saveNewCopy.emit(data);
  }

  showRenameDialog() {
    this.rename = true;
    this.renameLabel = this.selectedVersion.name;
  }

  hideRenameDialog() {
    this.rename = false;
  }

  renameVersion(): void {

    if (!this.renameLabel) {
      this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Version Name is Required.' });
      return;
    }

    this.rename = false;
    this.http.updateCallbackVersionName(this.selectedVersion.versionid, this.renameLabel).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        if (state.data) {
          this.getHistory();
        }
      }
    },
      (state: Store.State) => {
        if (state instanceof NVPreLoadingErrorState) {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to rename the version.' });
        }
      });
  }



  ngOnInit(): void {
    // get channels
    this.channels = this.cbService.channels;
  }

  onChange(e: boolean): void {
    if (e) {
      this.form.addControl('channel', new FormControl(null, Validators.required));
      this.form.addControl('profile', new FormControl(null, Validators.required));
    } else {
      this.form.removeControl('channel');
      this.form.removeControl('profile');
    }
  }

  showSidebar(data: CallbackData) {
    this.visible = true;
    // get channels
    this.channels = this.cbService.channels;

    this.callbackData = data;
    this.getHistory();
  }

  hideSidebar() {
    this.visible = false;
  }

  getHistory() {
    this.http.getCallbackVersionList(this.callbackData.callbackid).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        this.versionList = [];

        const data = state.data;
        if (data.length) {
          // sort on basis on latest saved version
          data.sort((a, b) => {
            return b.savedat - a.savedat;
          });

          data.forEach(version => {
            // tslint:disable-next-line: forin
            for (const key in version) {
              if (key === 'savedat' || key === 'restoredat') {
                if (version[key]) {
                  version[key] = new Date(version[key] * 1000);
                }
              }
            }

            this.versionList.push({ label: version.savedat, value: version });

          });
        }
      }
    },
      (state: Store.State) => {
        if (state instanceof NVPreLoadingErrorState) {
          this.loading = state.loading;
          this.error = state.error;
        }
      });
  }

  showNamedVersion(e): void {
    this.namedVersionList = [];
    if (e) {
      for (const i of this.versionList) {
        if (i.value.versionname != '') {
          this.namedVersionList.push(i);
        }
      }
    }
  }

  onChannelChange(channelId: number): void {
    this.profiles = this.cbService.getProfileByChannel(channelId);
  }

  restoreThisVersion() {
    console.log('Selected Version : ', this.selectedVersion);

    if (!this.selectedVersion) {
      this.messageService.add({ severity: 'warn', summary: 'Alert', detail: 'Please select a version to restore.' });
      return;
    }
    let versionId = this.selectedVersion.versionid;

    this.callbackData.jsondata = this.selectedVersion.jsondata;

    // save the callback
    this.http.updateCallback(this.callbackData).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;

        if (state.data) {
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Version Restored Successfully.' });
        } else {
          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to restore the version.' });
          return;
        }
      }
    },
      (state: Store.State) => {
        if (state instanceof NVPreLoadingErrorState) {
          this.loading = state.loading;
          this.error = state.error;

          this.messageService.add({ key: 'callback', severity: 'error', summary: 'Error', detail: 'Failed to restore the version.' });

          console.error('Failed to restore the version \n Error - ', state.error);
        }
      });


  }
}

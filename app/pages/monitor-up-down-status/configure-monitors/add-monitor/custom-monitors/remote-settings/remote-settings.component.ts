import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableData } from '../../containers/table-data';

@Component({
  selector: 'app-remote-settings',
  templateUrl: './remote-settings.component.html',
  styleUrls: ['./remote-settings.component.scss']
})
export class RemoteSettingsComponent implements OnInit {

  @Input()
  useAsHier: TableData;
  isFromEdit: Subscription;
  tierList: any[] = []; // tier list
  serverList: any[] = []; // server list
  tierName: string = ""; // tierName from configuration screen.
  monName: string = '';
  monType: number;
  showRmTier: boolean = false;
  showRmServer: boolean = false;
  remServerVal: string = '';
  rServerLabel: string = 'Remote Server';
  rServerPlaceHolder: string = 'Custom remote server IP';

  constructor() { }

  ngOnInit(): void {
  }

}

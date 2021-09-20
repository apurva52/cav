import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-machine-configuration',
  templateUrl: './machine-configuration.component.html',
  styleUrls: ['./machine-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MachineConfigurationComponent implements OnInit {
  disabled: boolean = true;
  isEditMode: Boolean;
  options: MenuItem[];

  constructor() {}

  ngOnInit(): void {
    const me = this;
    
    me.options = [
      {label: 'ALL' },
      {label: 'ALL' },
      {label: 'ALL' },
      {label: 'ALL' },
      {label: 'ALL' }
    ]
  }

  enabledInput() {
    const me = this;
    me.disabled = false;
    me.isEditMode = true
  }

  saveInput() {
    const me = this;
    me.disabled = true;
    me.isEditMode = false
  }
}

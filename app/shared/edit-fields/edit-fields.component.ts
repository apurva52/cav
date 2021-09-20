import { Component, OnInit } from '@angular/core';
import { EditFields } from './service/edit-fields.model';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-edit-fields',
  templateUrl: './edit-fields.component.html',
  styleUrls: ['./edit-fields.component.scss']
})
export class EditFieldsComponent implements OnInit {
  data: EditFields;
  showEditFieldsModel: boolean = false;
  allType: MenuItem[];
  allSelectedType: MenuItem[];
  allDefault: MenuItem[];
  allSelectedDefault: MenuItem[];
  allSelectedPopularity: MenuItem[];
  allNumber: MenuItem[];
  allFormat: MenuItem[];
  allUser: MenuItem[];
  value17: number = 20;

  constructor() { }

  ngOnInit(): void {

    const me = this;

    me.allSelectedType = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];

    me.allSelectedDefault = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];

    me.allSelectedPopularity = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];

    me.allUser = [
      { label: 'Number' },
      { label: 'Number' },
      { label: 'Number' },
      { label: 'Number' },
      { label: 'Number' },
    ];

    me.allFormat = [
      { label: '--default--' },
      { label: '--default--' },
      { label: '--default--' },
      { label: '--default--' },

    ];

    me.allNumber = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ]
  }

  open() {
    this.showEditFieldsModel = true;
  }

  close() {
    this.showEditFieldsModel = false;
  }

}

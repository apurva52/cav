import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PROFILE_DETAILS_TABLE_DATA } from './service/profile-name-details.dummy';
import { profileDetailsTable } from './service/profile-name-details.model';

@Component({
  selector: 'app-profile-name-details',
  templateUrl: './profile-name-details.component.html',
  styleUrls: ['./profile-name-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileNameDetailsComponent implements OnInit {
  @Output() arrowClick = new EventEmitter<boolean>();
  data: profileDetailsTable;
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = PROFILE_DETAILS_TABLE_DATA;
  }

}

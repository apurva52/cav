import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-favourite-setting',
  templateUrl: './favourite-setting.component.html',
  styleUrls: ['./favourite-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FavouriteSettingComponent implements OnInit {

  selectedValues: string = 'saveConfigFile';

  constructor() { }

  ngOnInit(): void {
  }
}

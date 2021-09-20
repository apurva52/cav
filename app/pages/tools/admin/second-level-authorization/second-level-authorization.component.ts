import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '../../../../shared/header/themes-menu/service/color-theme.service';
import { PageDialogComponent } from '../../../../shared/page-dialog/page-dialog.component';

@Component({
  selector: 'app-second-level-authorization',
  templateUrl: './second-level-authorization.component.html',
  styleUrls: ['./second-level-authorization.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class SecondLevelAuthorizationComponent extends PageDialogComponent implements OnInit {

  showSecondLevelAuthModel: boolean = false;

  constructor(themeService: ThemeService) { 
    super();
  }

  ngOnInit(): void {
  }

  openSecondLevelAuthDialog() {
    this.showSecondLevelAuthModel = true;
  }

  close() {
    this.showSecondLevelAuthModel = false;
  }
}

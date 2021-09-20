import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { DashboardTime } from './../dashboard/service/dashboard.model';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MenuItem, MessageService } from 'primeng';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { DashboardService } from '../dashboard/service/dashboard.service';

@Component({
  selector: 'app-copy-favorite-link-box',
  templateUrl: './copy-favorite-link-box.component.html',
  styleUrls: ['./copy-favorite-link-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CopyFavoriteLinkBoxComponent
  extends PageDialogComponent
  implements OnInit {
  allFilterParameter: MenuItem[];
  wdFavLink: string ='';
  @Input() dashboard: DashboardComponent;

  constructor(private dashboardService: DashboardService, private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    const me = this;
  }

  show() {
    super.show();
    this.wdFavLink = this.dashboardService.createFavoriteLink(this.dashboard);
  }

   /**
   * This Method is used to verify either link has been copied successfully or not
   */
  copyFavLink(userInput) {
    userInput.select();  
    document.execCommand('copy');  
    userInput.setSelectionRange(0, 0); 

    if (this.wdFavLink != null && this.wdFavLink !== '' && this.wdFavLink !== undefined) {
     this.showSuccess("Favorite link is copied successfully");
    } else {
     this.showError("Error in copying favorite link");
    }
    super.hide();
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  close() {
    super.hide();
  }
}

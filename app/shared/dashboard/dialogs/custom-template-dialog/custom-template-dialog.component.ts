import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { DashboardComponent } from '../../dashboard.component';
import { CHECK_CUSTOM_LAYOUT, DashboardLayoutRequest, DUPLICATE_LAYOUT_NAME, NO_LAYOUT_AVAILABLE } from '../../sidebars/layout-manager/service/layout-manager.model';
import { DashboardLayoutManagerService } from '../../sidebars/layout-manager/service/layout-manager.service';
import { DashboardLayoutCheckedState, DashboardLayoutCheckingErrorState, DashboardLayoutCheckingState } from '../../sidebars/layout-manager/service/layout-manager.state';

@Component({
  selector: 'app-custom-template-dialog',
  templateUrl: './custom-template-dialog.component.html',
  styleUrls: ['./custom-template-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomTemplateDialogComponent
  extends PageDialogComponent
  implements OnInit {
  @Input() dashboard: DashboardComponent;
  templateName : string;
  nameError : boolean = false;
  constructor(private layoutService : DashboardLayoutManagerService, private confirmationService: ConfirmationService, private cd: ChangeDetectorRef,private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.nameError = false;
    me.templateName = '';
  }

  show() {
    super.show();
    this.templateName = '';
    this.nameError = false;
  }

  close() {
    super.hide();
  }

  saveChanges(){
    const me = this;
    if(this.templateName == null || this.templateName == undefined || this.templateName == ""){
      this.nameError = true;
      return;
    }
    else if (me.templateName.startsWith('_') || /^[0-9]/.test(me.templateName)) {
      me.messageService.add({ severity: 'error', summary: 'Error message', detail: "Dashboard name should start with alphabet." });
      return;
      }
      else if (/[-!$%^&*()+|~=`{}:/<>?,.@# ]/g.test(me.templateName) || me.templateName.includes('[') || this.templateName.includes(']')) {
      me.messageService.add({ severity: 'error', summary: 'Error message', detail: "Special characters are not allowed. Only AlphaNumeric and Underscore(_) are allowed." });
      return;
      }
    const layoutNameCtx = {
      name: this.templateName,
      path: 'cutom'
    }
    const layoutDetailCtx = {};

    const layoutCtx = {
      layoutNameCtx: layoutNameCtx,
      layoutDetailCtx: layoutDetailCtx
    }

    const chkPayload : DashboardLayoutRequest= {
      opType: CHECK_CUSTOM_LAYOUT, 
      multiDc: false,
      cctx: null,
      tr: null,
      layoutCtx: layoutCtx
    };


    me.layoutService.chkLayout(chkPayload).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardLayoutCheckingState) {
          me.onCheckingLayout(state);
          return;
        }

        if (state instanceof DashboardLayoutCheckedState) {
          me.onCheckedLayout(state);
          return;
        }
      },
      (state: DashboardLayoutCheckingErrorState) => {
        me.onCheckingLayoutError(state);
      }
    );

  }

  private onCheckingLayout(state : DashboardLayoutCheckingState){
    const me = this;
  }

  private onCheckedLayout(state : DashboardLayoutCheckedState){
    const me = this;
    if (state.data.code == NO_LAYOUT_AVAILABLE) {
      me.dashboard.saveAsNewLayout(this.templateName);
      super.hide();
     }
     else if (state.data.code == DUPLICATE_LAYOUT_NAME){
       me.dashboard.duplicateLayout(me.templateName);
        me.cd.detectChanges();
           }
     else{
       //error code
     }
    }
  private onCheckingLayoutError(state : DashboardLayoutCheckingErrorState){
    const me = this;

  }
}

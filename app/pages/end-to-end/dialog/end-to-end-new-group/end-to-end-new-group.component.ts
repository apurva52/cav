// import { ViewEncapsulation } from '@angular/compiler/src/core';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Dialog, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { EndToEndGraphicalComponent } from '../../end-to-end-graphical/end-to-end-graphical.component';
import { EndToEndNewGroupData } from './services/ete-new-group.model';
import { EteNewGroupService } from './services/ete-new-group.service';
import { EndToEndNode } from '../../service/end-to-end.model';
import {
  EndToEndNewGroupDataLoadingState,
  EndToEndNewGroupDataLoadedState,
  EndToEndNewGroupDataLoadingErrorState,
} from './services/ete-new-group.state';

@Component({
  selector: 'app-end-to-end-new-group',
  templateUrl: './end-to-end-new-group.component.html',
  styleUrls: ['./end-to-end-new-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EndToEndNewGroupComponent
  extends PageDialogComponent
  implements OnInit {
  @Input() Graphical: EndToEndGraphicalComponent;
  @ViewChild('dialog', { read: Dialog }) dialog: Dialog;

  visible: boolean = false;

  list2: any[];
  targetData: any[];
  data: EndToEndNewGroupData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  nodeName : string;
  createNewGP : boolean = false;
  groupName : string;

  constructor(private eteNewGroupService: EteNewGroupService) {
    super();
  }

  ngOnInit(): void {
    this.targetData = [];
  }

  cancelDialog() {
    this.visible = false;
    this.resetDialogState()
  }

  load() {
    const me = this;
    me.eteNewGroupService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof EndToEndNewGroupDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof EndToEndNewGroupDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EndToEndNewGroupDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  resetDialogState(){
    const me = this;
    me.createNewGP = false;
    me.targetData = [];
    me.groupName = '';
  }
  createGroup(){
    const me = this;
    var tiersName : string = me.nodeName;
    if(me.createNewGP)
      tiersName = me.targetData.toString();

    me.eteNewGroupService.group(tiersName, me.groupName).subscribe(
      (state) => {
        // alert(state); add some toast
        me.visible = false;
        me.resetDialogState();
      },
      (error) => {
        console.error("Error in createGroup method : ", error);
      }
    );
  }

  private onLoading(state: EndToEndNewGroupDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: EndToEndNewGroupDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: EndToEndNewGroupDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.visible = true;
    if(me.data){
      me.data.tierList = me.Graphical.toolkit.getNodes().map(e=>{
        return (e.data.id);
      });
    }
  }
}

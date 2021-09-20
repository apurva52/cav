import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectItemService } from './service/advance-open-merge.service';
import { Store } from 'src/app/core/store/store';
import { SelectItem } from 'primeng/public_api';
import { merge } from 'rxjs';
import {
  TireLoadedState,
  GraphOprationLoadedState,
  ServerLoadedState,
  BusinessTransactionsLoadedState,
  InstenceLoadedState,
  ValuesLoadedState,
  OpenwithWidgetsLoadedState,
  OperatersLoadedState,
  FilterByLoadedState,
  CriteriaLoadedState,
} from './service/select-item.state';

@Component({
  selector: 'app-advance-open-merge',
  templateUrl: './advance-open-merge.component.html',
  styleUrls: ['./advance-open-merge.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvanceOpenMergeComponent extends PageSidebarComponent
  implements OnInit {
  classes = 'page-sidebar';
  error: boolean;
  loading: boolean;

  // advanceOpenMerge: FormGroup;

  graphOprationData: SelectItem[];
  @Input() operationType: string;

  tireData: SelectItem[];
  @Input() tireSelect: string;
  @Input() tireInputComponent: string;

  serverData: SelectItem[];
  @Input() serverSelect: string;
  @Input() serverInputComponent: string;

  businessTransactionsData: SelectItem[];
  InstanceData: SelectItem[];

  valuesData: SelectItem[];
  @Input() valueType:string;

  openWithWigetsData: SelectItem[];
  @Input() layoutType: string;

  operatersData: SelectItem[];
  @Input() operater: string;
  @Input() operaterValue1: string;
  @Input() operaterValue2: string;
  @Input() selectedFilter: string;

  filterByData: SelectItem[];
  @Input() filterBy: string;

  criteriaData: SelectItem[];
  @Input() selectedcriteria:string;

  showTogetherSwitch: boolean;
  isEnableLayoutSwitch = true;
  isLayoutTypeEbable = false;
  newLayoutSwitch = true;
  showOperations: boolean;
  enableFilter: boolean;
  autoSuggestColors: boolean;
  excOverallMetric = true;
  

  constructor(
    private fb: FormBuilder,
    private SelectItemService: SelectItemService
  ) {
    super();
    const me = this;

    me.valueType = 'Avg';
    me.enableFilter = false;
    me.operater = '=';
    me.layoutType = '9';
    me.filterBy = 'Avg';
    me.selectedcriteria = 'Include';
    me.autoSuggestColors = true;
  }

  show() {
    super.show();
  }

  ngOnInit(): void {
    const me = this;
    me.load();
  }

  closeClick(){
    const me = this;
    this.visible = !this.visible;
  }

  // initForm() {
  //   const me = this;

  //   me.advanceOpenMerge = me.fb.group({
  //     graphOpration: new FormControl(),
  //     tireValue: new FormControl(),
  //     serverValue: new FormControl(),
  //   });
  // }

  load() {
    const me = this;
    merge(
      me.SelectItemService.loadGraphOpration(),
      me.SelectItemService.loadTire(),
      me.SelectItemService.loadServer(),
      me.SelectItemService.loadInstence(),
      me.SelectItemService.loadBusinessTransactions(),
      me.SelectItemService.loadValues(),
      me.SelectItemService.loadOpenwithWidgets(),
      me.SelectItemService.loadOpraters(),
      me.SelectItemService.loadFilterBy(),
      me.SelectItemService.loadCriteria()
    ).subscribe((state: Store.State) => {
      if (state instanceof GraphOprationLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof TireLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof ServerLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof BusinessTransactionsLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof InstenceLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof ValuesLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof OpenwithWidgetsLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof OperatersLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof FilterByLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof CriteriaLoadedState) {
        me.onLoaded(state);
        return;
      }
    });
  }

  private onLoaded(state: Store.State) {
    const me = this;

    if (state instanceof GraphOprationLoadedState) {
      me.graphOprationData = state.data;
    }
    if (state instanceof TireLoadedState) {
      me.tireData = state.data;
    }
    if (state instanceof ServerLoadedState) {
      me.serverData = state.data;
    }
    if (state instanceof BusinessTransactionsLoadedState) {
      me.businessTransactionsData = state.data;
    }
    if (state instanceof InstenceLoadedState) {
      me.InstanceData = state.data;
    }
    if (state instanceof ValuesLoadedState) {
      me.valuesData = state.data;
    }
    if (state instanceof OpenwithWidgetsLoadedState) {
      me.openWithWigetsData = state.data;
    }
    if (state instanceof OperatersLoadedState) {
      me.operatersData = state.data;
    }
    if (state instanceof FilterByLoadedState) {
      me.filterByData = state.data;
    }
    if (state instanceof CriteriaLoadedState) {
      me.criteriaData = state.data;
    }
    me.error = true;
    me.loading = true;
  }

  openOprations(event) {
    const me = this;
    if (event === 'Advanced Open/Merge') {
      me.showOperations = true;
    } else {
      me.showOperations = false;
    }
  }

  setAdvanceSetting() {
    const me = this;
    if (
      me.operationType.startsWith('Open') ||
      me.operationType.startsWith('Merge')
    ) {
      me.operationType = 'Advanced Open/Merge';
    }

    me.isEnableLayoutSwitch = false;
    me.newLayoutSwitch = false;
    me.layoutType = 'Default';
    me.isLayoutTypeEbable = true;
  }

  changeDefaultLayoutName() {
    const me = this;
    if (me.newLayoutSwitch) {
      me.layoutType = '9';
      me.isLayoutTypeEbable = false;
    } else {
      me.layoutType = 'Default';
      me.isLayoutTypeEbable = true;
    }
  }

  defaultOprations() {}

  makeTireSameValue() {
    const me = this;
    if (me.tireSelect === 'Same') {
      me.tireInputComponent = 'Cavisson';
      me.showTogetherSwitch = true;
    }
  }

  makeServerSameValue() {
    const me = this;
    if (me.serverSelect === 'Same') {
      me.serverInputComponent = 'NDAppliance';
      me.showTogetherSwitch = true;
    }
  }

  saveData() {
    console.log('Data Save');
  }
}

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MULTI_NODE_CONFIG_STATS_TABLE } from './service/multi-node-configuration.dummy';
import { multiNodeConfigTable } from './service/multi-node-configuration.model';
import { MultiNodeService } from './service/multi-node-configuration.service';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { MultiNodeConfigurationLoadingState, MultiNodeConfigurationLoadedState, MultiNodeConfigurationErrorState } from './service/multi-node-configuration.state';

@Component({
  selector: 'app-multi-node-configuration',
  templateUrl: './multi-node-configuration.component.html',
  styleUrls: ['./multi-node-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class MultiNodeConfigurationComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: multiNodeConfigTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];

  nodeName: string = '';
  ip: string = '';
  port: string = '';
  protocol: MenuItem = { label: 'HTTP', id: 'http' };
  isMaster: boolean = false;
  selProdType: MenuItem = { label: 'NETDIAGNOSTICS', id: 'netdiagnostics' };
  tr: string = '';
  isConfigurationSaved: boolean = false;
  buttonValue: string = "ADD";
  currentRowData: any = {};

  constructor(
    private router: Router,
    private nodeService: MultiNodeService,
    private session: SessionService
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: ' Configuration-Setting ' },
      { label: 'Multi-Node-Configuration ' },

    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.options = [
      { label: 'NETDIAGNOSTICS', id: 'netdiagnostics' },
      { label: 'NETSTORM', id: 'netstorm' },
      { label: 'NETVISION', id: 'netvision' },
      { label: 'NETFOREST', id: 'netforest' },
      { label: 'NETCLOUD', id: 'netcloud' },
    ];
    me.options2 = [
      { label: 'HTTP' },
      { label: 'HTTPS' }
    ];

    me.loadnodeConfiguration(me.session.session.cctx);
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }


  loadnodeConfiguration(clientObj) {
    const me = this;

    me.nodeService.loadConfiguration(clientObj).subscribe(
      (state: Store.State) => {
        if (state instanceof MultiNodeConfigurationLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof MultiNodeConfigurationLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: MultiNodeConfigurationErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: MultiNodeConfigurationLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MultiNodeConfigurationErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.error.msg = 'Error while loading data.';
    me.loading = false;
  }

  private onLoaded(state: MultiNodeConfigurationLoadedState) {
    const me = this;
    me.data = MULTI_NODE_CONFIG_STATS_TABLE;
    try{
      me.data.data = JSON.parse(state.data);
    }
    catch{
      me.data.data = state.data;
    }
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  resetConfiguration() {
    const me = this;

    me.nodeName = '';
    me.tr = '';
    me.protocol = { label: 'HTTP', id: 'http' };
    me.selProdType = { label: 'NETDIAGNOSTICS', id: 'netdiagnostics' }
    me.isMaster = false;
    me.ip = '';
    me.port = '';

    me.buttonValue = 'ADD';
  }

  addConfiguration(isUpdateButton) {
    const me = this;

    let isValidatedDetails : boolean = true;
    isValidatedDetails = me.validateNodeInfo();

    if (isValidatedDetails) {

      if (isUpdateButton == 'ADD') {

        let index = me.getIndexForTable(me.nodeName);
        if (index == -1) {
          me.data.data.push({
            dc: me.nodeName,
            testRun: me.tr,
            ip: me.ip,
            port: me.port,
            protocol: me.protocol.id,
            icon: 'icons8 icons8-checkmark',
            isMaster: me.isMaster,
            productType: me.selProdType.id

          })
        }
        else {
          alert("Node Name already present. Please enter different node name.");
          return;
        }
      }
      else {
        let index = me.getUpdatedRowIndexFromTable(me.currentRowData);
        if (index != -1) {
          me.data.data[index] = {
            dc: me.nodeName,
            testRun: me.tr,
            ip: me.ip,
            port: me.port,
            protocol: me.protocol.id,
            icon: 'icons8 icons8-checkmark',
            isMaster: me.isMaster,
            productType: me.selProdType.id

          }
        }
        me.buttonValue = 'ADD';
      }
      me.resetConfiguration();
    }
  }

  validateNodeInfo() {
    const me = this;
    let regexForInputField = /^[a-zA-Z0-9_.-]*$/;
    let regexForNumberField = /^[0-9]*$/
    let regexForIPAddressField = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/

    if (me.nodeName == "" || me.tr == "" || me.ip == "" || me.port == "") {
      alert("Please fill all necessary details.")
      return false;
    }
    if (me.nodeName.length > 32) {
      alert("Node Name cannot be greater than 32 characters.")
      return false;
    }
    if (!regexForInputField.test(me.nodeName)) {
      alert("You can only use alphabets for Node Name.")
      return false;
    }
    if (!regexForNumberField.test(me.tr)) {
      alert("Test Run can only be in numerics.")
      return false;
    }
    if (!regexForIPAddressField.test(me.ip)) {
      alert("Please enter valid ip.")
      return false;
    }
    if (me.ip.length > 30) {
      alert("IP can not be greater than 30 characters.")
      return false;
    }
    if (!regexForNumberField.test(me.port)) {
      alert("Port can only be in numerics.")
      return false;
    }
    if (me.port.length > 10) {
      alert("Port can not be greater than 10 digits.")
      return false;
    }

  }

  getUpdatedRowIndexFromTable(currentRowData: any) {
    const me = this;
    let index = -1;
    try {

      if (currentRowData && me.data.data.length > 0) {
        for (let index = 0; index < me.data.data.length; index++) {
          if (me.data.data[index].dc == currentRowData.dc)
            return index;
        }
      }

    } catch (error) {
      console.error("Error in getting index", error)
    }

    return index;
  }

  saveNodeConfiguration() {
    const me = this;
    console.log("on saving...dc data is ", me.data.data)
    me.nodeService.saveConfiguration(me.data.data);
    alert("Configurations are saved in dcinfo.json. Please check.")
    me.isConfigurationSaved = true;
  }

  applyNodeConfiguration() {
    const me = this;
    for (const dc in me.data.data) {
      if (me.data.data[dc].isMaster == true) {
        me.data.data[dc]['controllerIP'] = me.data.data[dc]['ip'];
        me.data.data[dc]['host'] = me.data.data[dc]['ip'];
        me.nodeService.applyConfiguration(me.data.data[dc]);
      }
    }
    alert("Configurations have been applied. Node is restarted. Please check.")
  }

  deleteRowFromTable(rowIndex, rowData) {
    const me = this;
    if (confirm("Are you sure you want to delete selected node Info?")) {
      if (rowData.isMaster) {
        alert("Master Node Info cannot be deleted.")
      }
      else {
        me.data.data.splice(rowIndex, 1);
        me.resetConfiguration();
      }
    }
  }

  editRowFromTable(event) {
    const me = this;
    me.currentRowData = event;
    console.log("event is", event)
    if (confirm("Do you want edit configuration?")) {
      me.buttonValue = 'UPDATE';
      me.nodeName = event.dc;
      me.tr = event.testRun;
      me.protocol.id = event.protocol
      me.selProdType.id = event.productType
      me.isMaster = event.isMaster;
      me.ip = event.ip;
      me.port = event.port;
    }
  }


  getIndexForTable(nodeName: string) {
    const me = this;
    let index = -1;
    try {

      if (me.data.data && me.data.data.length > 0) {
        for (let index = 0; index < me.data.data.length; index++) {

          let data = me.data.data[index];
          if (data) {
            if (nodeName == data['dc']) {
              return index;
            }
          }
        }
      }

    } catch (error) {
      console.error("Error in getting index", error)
    }

    return index;
  }

}


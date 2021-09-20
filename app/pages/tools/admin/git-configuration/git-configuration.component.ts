import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import * as encrypt from 'jsencrypt/bin/jsencrypt.min';
import { GitConfigService } from './service/gitconfig.service';
import { Subscription } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { gitConfigCreatedState, gitConfigCreatingErrorState, gitConfigCreatingState } from './service/gitconfig.state';
import { responseForGit } from './service/gitconfig.model';
import { AppError } from 'src/app/core/error/error.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
import { FileManagerComponent } from 'src/app/shared/file-manager/file-manager.component';

@Component({
  selector: 'app-git-configuration',
  templateUrl: './git-configuration.component.html',
  styleUrls: ['./git-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GitConfigurationComponent extends PageDialogComponent implements OnInit {
  showGitconfigModel: boolean = false;
  useGit: boolean = false;
  selectedProtocolValue: string;
  publicKey: any = '';
  userName: string = '';
  domainIp: string;
  repoPath: string = '';
  port = '22';
  password: any;
  pwd = '';
  passPhrase: string = '';
  repoEmail = "NA";
  isSSLCertificateDisable: boolean;
  dialogVisible: boolean;
  private gitConfigSubscritpion: Subscription;
  error: AppError;
  visible: boolean;
  loading: boolean;
  gitResponse: responseForGit;
  content: InfoData;
  isChecked: boolean;
  isUpload: boolean = false;
  
  @ViewChild('fileManager', { read: FileManagerComponent })
  fileManager: FileManagerComponent;

  constructor(private gitConfigService: GitConfigService, private confirmationService: ConfirmationService, private messageService: MessageService, private ref: ChangeDetectorRef, public confirmation: ConfirmationService) {
    super();
  }

  ngOnInit(): void {
  }

  openGitConfigDialog() {
    const me = this;
    me.showGitconfigModel = true;
    me.getGitConfig();
  }

  getGitConfig() {
    const me = this;
    me.gitConfigSubscritpion = me.gitConfigService.testGitConfig().subscribe(
      (state: Store.State) => {
        if (state instanceof gitConfigCreatingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof gitConfigCreatedState) {
          me.getConfigOnLoaded(state);
          return;
        }
      },
      (state: gitConfigCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: gitConfigCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: gitConfigCreatingErrorState) {
    const me = this;
    me.gitResponse = null;
    me.error = state.error;
    me.loading = false;
  }

  getConfigOnLoaded(state: gitConfigCreatedState) {
    const me = this;
    me.gitResponse = state.data;
    me.error = null;
    me.loading = false;
    let responseArr = me.gitResponse['data'].split(" ");
    me.domainIp = responseArr[0];
    me.port = responseArr[1];
    me.repoPath = responseArr[2];
    me.userName = responseArr[3] == "NA" ? "" : responseArr[3];
    me.password = responseArr[4];
    me.useGit = responseArr[5];
    me.passPhrase = responseArr[6];
    me.selectedProtocolValue = responseArr[8];
    if (me.selectedProtocolValue === "https" && responseArr[9] == "false")
      me.isSSLCertificateDisable = false;
    else if (me.selectedProtocolValue === "https" && responseArr[9] == "true")
      me.isSSLCertificateDisable = true;
  }

  authorizeCredential() {
    const me = this;
    let session = JSON.parse(localStorage.getItem('session'));
    let productType = '';
    let userLoggedIn = '';
    if (session) {
      productType = session['cctx']['prodType']
      userLoggedIn = session['cctx']['u']
      if (productType == 'netocean' || productType == 'NO') {
        productType = 'NO';
      } else {
        productType = 'NS';
      }
    }
    let prerequisiteKey = JSON.parse(localStorage.getItem('preSession'));
    let pwd = "NA";
    let passPhraseKey = "NA";
    let publicMetaKey = '';
    if (prerequisiteKey)
      publicMetaKey = prerequisiteKey['publicKey']
    if (publicMetaKey !== 'NA') {
      let encryptAPI = new encrypt.JSEncrypt();
      encryptAPI.setKey(publicMetaKey);
      pwd = encryptAPI.encrypt(me.password == "" ? "NA" : me.password);
      passPhraseKey = encryptAPI.encrypt(me.passPhrase == "" ? "NA" : me.passPhrase);
    }
    if (pwd == "NA" && passPhraseKey == "NA") {
      pwd = me.pwd;
      passPhraseKey = me.passPhrase;
    }
    let returnString = function (str) {
      if (str)
        return str;
      else
        return "NA";
    };
    let testString = "GIT_HOST = " + returnString(me.domainIp) + " " + returnString(me.port) + " " + returnString(me.repoPath) + " " + returnString(me.userName) + " " + returnString(pwd) + " " + returnString(me.useGit) + " " + returnString(passPhraseKey) + " " + returnString(me.repoEmail) + " " + returnString(me.selectedProtocolValue) + " " + returnString(me.isSSLCertificateDisable);
    let data = {
      "userName": userLoggedIn,
      "productType": productType,
      testString
    };
    me.testGitConfig(data);
  }

  testGitConfig(data: any) {
    const me = this;
    me.gitConfigSubscritpion = me.gitConfigService.authorizeGitConfig(data).subscribe(
      (state: Store.State) => {
        if (state instanceof gitConfigCreatingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof gitConfigCreatedState) {
          me.testConfigOnLoaded(state);
          return;
        }
      },
      (state: gitConfigCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  testConfigOnLoaded(state: gitConfigCreatedState) {
    const me = this;
    me.gitResponse = state.data;
    me.error = null;
    me.loading = false;
    me.alertMsg(me.gitResponse['data']['data']['response'], "Error");
  }

  setGitConfig() {
    const me = this;
    if (!me.domainIp || me.domainIp == "notConfigured") {
      me.alertMsg("Enter valid IP/Domain Name.", "Error");
      return false;
    }
    if (!me.repoPath) {
      me.alertMsg("Enter valid repository path.", "Error");
      return false;
    }
    if (!(/^[a-zA-Z][A-Za-z0-9!#$&'()*+,\/:;=?@\[\].-]*$/).test(me.userName) && me.userName) {
      me.alertMsg("Enter Valid Credentials.", "Error");
      return false;
    }
    let pwd = "NA";
    let passPhraseKey = "NA";
    let prerequisiteKey = JSON.parse(localStorage.getItem('preSession'));
    let publicMetaKey = '';
    if (prerequisiteKey)
      publicMetaKey = prerequisiteKey['publicKey']
    if (publicMetaKey !== 'NA') {
      let encryptAPI = new encrypt.JSEncrypt();
      encryptAPI.setKey(publicMetaKey);
      pwd = encryptAPI.encrypt(me.password == "" ? "NA" : me.password);
      passPhraseKey = encryptAPI.encrypt(me.passPhrase == "" ? "NA" : me.passPhrase);
    }
    me.repoEmail = "NA";
    if (me.selectedProtocolValue == "http" || me.selectedProtocolValue == "ssh")
      me.isSSLCertificateDisable = false;
    else if (me.selectedProtocolValue == "https" && me.isChecked == true)
      me.isSSLCertificateDisable = true;
    else if (me.selectedProtocolValue == "https" && me.isChecked == false)
      me.isSSLCertificateDisable = false;
    let parm = {
      "GIT_HOST_ip": me.domainIp,
      "GIT_HOST_repo_name": me.repoPath,
      "GIT_HOST_repo_port": me.port == "" ? "NA" : me.port,
      "GIT_HOST_uname": me.userName == "" ? "NA" : me.userName,
      "GIT_HOST_pwd": pwd,
      "GIT_HOST_enable": me.useGit,
      "GIT_HOST_pass_phrase": passPhraseKey,
      "GIT_HOST_email": me.repoEmail,
      "GIT_HOST_protocol": me.selectedProtocolValue,
      "GIT_HOST_isSSLCertificateDisable": me.isSSLCertificateDisable
    }
    me.setGitConfigToServer(parm);
    me.showGitconfigModel = true;
  }

  setGitConfigToServer(params: any) {
    const me = this;
    me.gitConfigSubscritpion = me.gitConfigService.setGitConfig(params).subscribe(
      (state: Store.State) => {
        if (state instanceof gitConfigCreatingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof gitConfigCreatedState) {
          me.setConfigOnLoaded(state);
          return;
        }
      },
      (state: gitConfigCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  setConfigOnLoaded(state: gitConfigCreatedState) {
    const me = this;
    me.gitResponse = state.data;
    me.error = null;
    me.loading = false;
    me.alertMsg(me.gitResponse['data'], "Success");
    sessionStorage.setItem("isGitIsConfigured", me.domainIp + " " + me.port + " " + me.repoPath + " " + me.userName + " " + me.password + " " + me.useGit + " " + me.passPhrase + " " + me.repoEmail + " " + me.selectedProtocolValue + " " + me.isSSLCertificateDisable);
  }

  resetAllValues() {
    const me = this;
    me.useGit = false;
    me.userName = '';
    me.port = '';
    me.domainIp = '';
    me.userName = '';
    me.passPhrase = '';
    me.password = '';
    me.repoPath = ''
  }

  close() {
    const me = this;
    me.resetAllValues();
    me.showGitconfigModel = false;
  }

  ngOnDestroy(): void {
    const me = this;
    if (me.gitConfigSubscritpion)
      me.gitConfigSubscritpion.unsubscribe();
  }

  showSuccess(msg) {
    const me = this;
    me.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  alertMsg(msg, header) {
    const me = this;
    me.dialogVisible = true;
    me.confirmation.confirm({
      key: 'GitConfigInfo',
      message: msg,
      header: header,
      accept: () => { me.dialogVisible = false; },
      reject: () => { me.dialogVisible = false; },
      rejectVisible: false
    });
    me.ref.detectChanges();
  }

  changePort(protocol) {
    const me = this;
    let gitSetting;
    gitSetting = sessionStorage.getItem("isGitIsConfigured");
    if (gitSetting != "notConfigured" && gitSetting) {
      gitSetting = sessionStorage.getItem("isGitIsConfigured").split(" ");
      let repoPort = gitSetting[1] == "NA" ? me.setDefaultPort() : gitSetting[1];
      let protocol2 = gitSetting[8] == undefined ? "http" : gitSetting[8];

      if (protocol === "https" && gitSetting[9] == "false")
        me.isSSLCertificateDisable = false;

      else if (protocol === "https" && gitSetting[9] == "true")
        me.isSSLCertificateDisable = true;

      if (protocol == protocol2)
        me.port = repoPort;
      else
        me.setDefaultPort();
    }
    else
      me.setDefaultPort();
  }

  setDefaultPort() {
    const me = this;
    if (me.selectedProtocolValue == "http")
      me.port = "80";
    else if (me.selectedProtocolValue == "https")
      me.port = "443";
    else
      me.port = "22";

    return me.port;
  }

  CheckboxValue(event) {
    const me = this;
    me.isChecked = event.checked;

    return me.isChecked;
  }

  openDialog() {
    try {
      this.fileManager.open(true, this.isUpload);
      this.ref.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }

}

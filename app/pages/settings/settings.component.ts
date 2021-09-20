import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem, PasswordModule } from 'primeng';
import * as CONS from './service/settings.dummy';
import { SettingsTable, CONTENT, MailSMSConfig } from './service/settings.model';
import * as encrypt from 'jsencrypt/bin/jsencrypt.min';
import { SettingsService } from './service/settings.service';
import { ChangePasswordLoadedState, ChangePasswordLoadingErrorState, ChangePasswordLoadingState, MailSMSSettingLoadedState, MailSMSSettingLoadingErrorState, MailSMSSettingLoadingState } from './service/settings.state';
import { Store } from 'src/app/core/store/store';
import { SessionService } from './../../core/session/session.service';
import { DialogsService } from 'src/app/shared/dialogs/dialogs.service';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  data: SettingsTable;
  content: InfoData;
  timezone: any;
  timezoneOptions: any;
  selectedTrend: string[] = [];
  selectedValue: string = 'val1';
  selectedValue1: string = 'val2';
  displayDetails: boolean;
  oldPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  errorMessage = [];
  AuthenticationService: any;
  model: any;
  passwordType: string = 'password';
  publicMetaKey: string = 'NA';
  isOktaEnabled: boolean = false;
  isDisabled: boolean = false;
  isGuestUser: boolean = false;
  passwordTooltip: string = "Click to change password";
  serverTimeInfo: any;
  clientTimeInfo: any;
  selectedTime: string = "servertime";
  dialogVisible: boolean = false;

  //new variables
  secureConnectionOption: SelectItem[];
  carriers: SelectItem[];

  //sms variables
  sendSmsTo: string;
  customCarriers: string;
  selectedCarrierType: number = 0;
  standardCarriers: string [] = [];

  //mail variables
  smtphost: string;
  smtpport: number;
  email: string;
  confrmPwd: string;
  pwd: string;
  isAuthRequire: boolean;
  selectedSecureConnType: string;
  isSecureConn: boolean;
  sendMailTo: string;


  private stateSession: Store.State = null;
  constructor(private settingService: SettingsService, public sessionService: SessionService, private messageService: MessageService, private dialogService: DialogsService, private ref: ChangeDetectorRef, public confirmation :ConfirmationService) { }

  changePasswordType() {
    if (this.passwordType == 'password')
      this.passwordType = 'text';
    else if (this.passwordType == 'text')
      this.passwordType = 'password';
    else
      this.passwordType = 'password';
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  ngOnInit(): void {
    const me = this;
    me.content = CONTENT;
    me.secureConnectionOption = CONS.SCECURE_CON_OPTION;
    me.carriers = CONS.STD_CARRIER_TYPE_OPTION;
    this.serverTimeInfo = JSON.parse(localStorage.getItem('session'))['defaults']['serverTimeInfo'];

    const dateString: string = new Date().toString();
    const browserTimeOffset = dateString.substr((dateString.indexOf("GMT") + 3), 5);
      for(let index in me.sessionService.session.defaults.timeInfo.timeZoneList){
        if(me.sessionService.session.defaults.timeInfo.timeZoneList[index]['value']['offset'] == browserTimeOffset){
          // me.clientTimeInfo = me.sessionService.session.defaults.timeInfo.timeZoneList[index]['value'];
          me.clientTimeInfo = me.sessionService.session.defaults.timeInfo.timeZoneList[index]['label'].slice(12);
        }

      }
      if(me.sessionService.selectedTime == "" || me.sessionService.selectedTime == undefined){
        me.selectedTime = "servertime";
      }else
        me.selectedTime = me.sessionService.selectedTime;


    console.log("for okta check", this.sessionService.isSSO())
    if (this.sessionService.isSSO())
      this.isOktaEnabled = true;

    me.data = CONS.SETTINGS_TABLE;

    console.log("coming in setting file", me.sessionService.timeZoneLists);
    if (me.sessionService.session.cctx.u == "guest") {
      me.isGuestUser = true;
      me.passwordTooltip = "Guest user cannot change password.";
    }
    else if (me.sessionService.isSSO()) {
      me.isGuestUser = true;
      me.passwordTooltip = "Okta user cannot change password.";
    }

    me.settingService.getMailSMSSetting().subscribe((state: Store.State)=>{
      if(state instanceof MailSMSSettingLoadingState)
        this.onMailSMSSettingLoading(state);
      if(state instanceof MailSMSSettingLoadedState)
        this.onMailSMSSettingLoaded(state);
      if(state instanceof MailSMSSettingLoadingErrorState)
        this.onMailSMSSettingError(state);
    })
  }

  onChangeTimeZone(event) {
    const me = this;
    me.sessionService.session.defaults.timeInfo.zone = me.sessionService.session.defaults.timeInfo.zoneId
      = me.sessionService.selectedTimeZone.abb;
    me.showSuccess('TimeZone is changed successfully as ' + me.sessionService.selectedTimeZone.value);
    me.selectedTime = "othertime"

  }

  onChangeRadioTimeZone(event){
     const me = this;
     if(me.selectedTime == "clienttime"){
      const dateString: string = new Date().toString();
            const browserTimeOffset = dateString.substr((dateString.indexOf("GMT") + 3), 5)
      for(let index in me.sessionService.session.defaults.timeInfo.timeZoneList){
        if(me.sessionService.session.defaults.timeInfo.timeZoneList[index]['value']['offset'] == browserTimeOffset){
          me.sessionService.selectedTimeZone = me.sessionService.session.defaults.timeInfo.timeZoneList[index]['value'];
           me.sessionService.session.defaults.timeInfo.zone =  me.sessionService.selectedTimeZone.abb;
          me.sessionService.session.defaults.timeInfo.zoneId  = me.sessionService.selectedTimeZone.abb;
          
        }
      }
      me.sessionService.selectedTime = me.selectedTime;
      me.showSuccess('Client TimeZone is successfully applied as ' + me.sessionService.selectedTimeZone.value);
     }
     else if (me.selectedTime == "servertime"){
      for(let index in me.sessionService.session.defaults.timeInfo.timeZoneList){
        if(me.sessionService.session.defaults.timeInfo.timeZoneList[index]['value']['offset'] == me.sessionService.session.defaults.serverTimeInfo.offset){
          me.sessionService.selectedTimeZone = me.sessionService.session.defaults.timeInfo.timeZoneList[index]['value'];
           me.sessionService.session.defaults.timeInfo.zone =  me.sessionService.selectedTimeZone.abb;
          me.sessionService.session.defaults.timeInfo.zoneId  = me.sessionService.selectedTimeZone.abb;
        }
      }
      me.sessionService.selectedTime = me.selectedTime;
      me.showSuccess('Server TimeZone is successfully applied as ' + me.sessionService.selectedTimeZone.value);
     }
     else{
       me.sessionService.selectedTime = me.selectedTime;
       me.onChangeTimeZone(event);
     }
  }

  showPassDetails() {
    const me = this;
    me.oldPassword = "";
    me.newPassword = "";
    me.confirmPassword = "";
    this.displayDetails = true;
    this.passwordType = "password";
  }
  closeDialog() {
    this.displayDetails = false;
  }

  /**this method will encript text. */
  getEncriptedText(text: string) {
    try {
      this.publicMetaKey = this.sessionService.preSession.publicKey;
      /**Checking if encryption keys are available. */
      if (this.publicMetaKey !== 'NA') {
        let encryptAPI = new encrypt.JSEncrypt();
        encryptAPI.setKey(this.publicMetaKey);
        text = encryptAPI.encrypt(text);
        return text;
      } else {
        return text;
      }
    } catch (error) {
      console.log('error while encripted text ', error);
    }
  }

  changePassword() {

    if ((this.oldPassword == "") && (this.newPassword == "") && (this.confirmPassword == "")) {
     // this.dialogService.showInformativeBox("Error", "All fields are mandatory.", "OK");
      this.alertMsg("All fields are mandatory.", "Error");
      return false;
    }
    if (this.oldPassword != "")  // Old pwd is entered
    {
      if ((this.newPassword == "") && (this.confirmPassword == "")) {
        //this.dialogService.showInformativeBox("Error","To change password, please enter new and confirm password", "OK");
        this.alertMsg("To change password, please enter new and confirm password", "Error");
        return false;
      }
      else if ((this.newPassword != "") && (this.confirmPassword == "")) {
        //this.dialogService.showInformativeBox("Error", "To change password, please enter confirm password", "OK");
        this.alertMsg("To change password, please enter confirm password", "Error");
        return false;
      }
      else if ((this.newPassword == "") && (this.confirmPassword != "")) {
        //this.dialogService.showInformativeBox("Error", "To change password, please enter new password", "OK");
        this.alertMsg("To change password, please enter new password", "Error");
        return false;
      }
      else if (this.oldPassword === this.newPassword) {
        //this.dialogService.showInformativeBox("Error", "Both new and old passwords are same, please enter new password", "OK");
        this.alertMsg("Both new and old passwords are same, please enter new passwordTo change password, please enter new password", "Error");
        return false;
      }
    }
    else if (this.oldPassword == "") // Old Pwd is not entered
    {
      if ((this.newPassword != "") && (this.confirmPassword == "")) {
        //this.dialogService.showInformativeBox("Error", "To change password, please enter old and confirm password", "OK");
        this.alertMsg("To change password, please enter old and confirm password", "Error");
        return false;
      }

      else if ((this.newPassword == "") && (this.confirmPassword != "")) {
        //this.dialogService.showInformativeBox("Error", "To change password, please enter old and new password", "OK");
        this.alertMsg("To change password, please enter old and new password", "Error");
        return false;
      }
      else if ((this.newPassword != "") && (this.confirmPassword != "")) {
        //this.dialogService.showInformativeBox("Error", "To change password, please enter old password", "OK");
        this.alertMsg("To change password, please enter old password", "Error");
        return false;
      }
      else if ((this.newPassword == "") && (this.confirmPassword == "")) {
        //this.dialogService.showInformativeBox("Error", "To change password, please enter all fields", "OK");
        this.alertMsg("To change password, please enter all fields", "Error");
        return false;
      }
    }

    if ((this.oldPassword != "") && (this.newPassword != "") && (this.confirmPassword != "")) {
      // All three are entered
      if (this.validatePassword(this.newPassword) == false)
        return false;

      if (this.validatePassword(this.confirmPassword) == false)
        return false;

      if (this.newPassword != this.confirmPassword) {
        //this.dialogService.showInformativeBox("Error", "New password and confirm password should be same", "OK");
        this.alertMsg("New password and confirm password should be same", "Error");
        return false;
      }
    }

    let encriptOldPasswd = this.getEncriptedText(this.oldPassword);
    let newEcncriptedPasswd = this.getEncriptedText(this.newPassword);

    let prms = { 'newPassword': newEcncriptedPasswd, 'oldPassword': encriptOldPasswd };

    this.load(prms);
  }

  validatePassword(password) {
    let passregex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,64})$/;

    if (!password) {
      //this.dialogService.showInformativeBox("Error", "Please enter password.", "OK");
      this.alertMsg("Please enter password.", "Error");
      return false;
    }
    else if (password == "") {
      //this.dialogService.showInformativeBox("Error", "Please enter password.", "OK");
      this.alertMsg("Please enter password.", "Error");
      return false;
    }
    else if (password.length < 8 || password.length > 64) {
      //this.dialogService.showInformativeBox("Error", "Your password length should be 8 to 64 characters long and must have special characters ", "OK");
      this.alertMsg("Your password length should be 8 to 64 characters long and must have special characters ", "Error");
      return false;
    }
    else if (!passregex.test(password)) {
      //this.dialogService.showInformativeBox("Error", "Password must be atleast containing 8 characters including minimum 1(A-Z),1(a-z),1(0-9) and special symbols like ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ `{ | }~", "OK");
      this.alertMsg("Password must be atleast containing 8 characters including minimum 1(A-Z),1(a-z),1(0-9) and special symbols like ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ `{ | }~", "Error");
      return false;
    }
    return true;
  }

  confirmGui(res: any) {

    if (res == 0) {
      this.displayDetails = false;
      this.showSuccess("Password changed successfully for user.")
      //window.location.href = window.location.protocol + '//' + window.location.host;
    }
    else {
      try {
        if (res == 114) {
          this.displayDetails = true;
          //this.dialogService.showInformativeBox("Error", "Old Password does not Matched . Please enter valid password.", "OK");
          this.alertMsg("Old Password does not Matched . Please enter valid password.", "Error");
          return false;
        }
        else if (res == 113) {
          this.displayDetails = true;
          //this.dialogService.showInformativeBox("Error", "Error in changing password from server", "OK");
          this.alertMsg("Error in changing password from server", "Error");
        }

      }
      catch (e) {
        console.log(e);
      }
    }
  }

  load(payload) {
    const me = this;
    me.settingService.load(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ChangePasswordLoadingState) {
          me.onLoading(state);
          return;
        }
        
        if (state instanceof ChangePasswordLoadedState) {
          me.confirmGui(state.data['code'])
          me.onLoaded(state);
          return;
        }
      },
      (state: ChangePasswordLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    me.closeDialog();
  }

  private onLoading(state: ChangePasswordLoadingState) {
    const me = this;
    // me.error = null;
    // me.loading = true;
  }

  private onLoadingError(state: ChangePasswordLoadingErrorState) {
    const me = this;
    me.data = null;
    // me.error = state.error;
    // me.loading = false;
  }

  private onLoaded(state: ChangePasswordLoadedState) {
    const me = this;
    console.log(me.data);
    // me.data = state.data;
    // me.error = null;
    // me.loading = false;
  }

  alertMsg(msg,header) {
    this.dialogVisible = true;
      this.confirmation.confirm({
        key: 'settings',
        message: msg,
        header: header,
        accept: () => { this.dialogVisible = false; },
        reject: () => { this.dialogVisible = false;},
        rejectVisible:false
      });

      this.ref.detectChanges();
  }

  saveSettings()
  {
    this.dialogVisible = false;
    this.alertMsg("Please enter smtp host.", "Error");
    //mail format          
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //checking validation for smtp host

    if (this.smtphost === "") {
      //Try to use commented one
      //this.alertMsg("Please enter smtp host.", "Error");
      this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter smtp host." });
      return;
    }

    if (this.smtpport === undefined || this.smtpport === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter smtp port." });
      return;
    }

    if (this.smtpport < 1 || this.smtpport > 65535) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter value of SMTP Port between 1 to 65535." });
      return;
    }

    //checking validation for user name
    if (this.email === "") {
      this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter user name." });
      return;
    }

    //checking for the valid username or mail id
    if (!this.email.match(mailformat)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter valid mail id." });
      return;
    }


    if (this.isAuthRequire) {
      //checking validation for password
      if (this.pwd === "") {
        this.alertMsg("Please enter password.", "Error");
        this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter password." });
        return;
      }

      if (this.confrmPwd === "") {
        this.alertMsg("Please enter confirm password.", "Error");
        this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter confirm password." });
        return;
      }

      //checking validation for confirm password
      if (this.confrmPwd != this.pwd) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail:"Password and Confirm password should be same." });
        return;
      }
    }

    let cusCarrRegex = /((^[a-zA-Z0-9]([a-zA-Z0-9])*)*\.([a-zA-Z0-9])+$)/;

    //checking validation for SMS carriers
    if (this.selectedCarrierType == 0) {
      if (this.standardCarriers === undefined) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please select atleast one Standard carrier." });
        return;
      }
    }
    else {
      if (this.customCarriers === "") {
        this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter some custom SMS Gateway Domain." });
        return;
      }
      else if (!(this.customCarriers.match(cusCarrRegex))) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please enter valid custom SMS Gateway Domain." });
        return;
      }
    }    
    let mailSMSConfigDTO: MailSMSConfig = {
      userName: this.sessionService.session.cctx.u,
      host: this.smtphost,
      port: this.smtpport,
      secConn: this.selectedSecureConnType,
      authReq: this.isAuthRequire,
      secAuth: this.isSecureConn,
      user: this.email,
      pwd: this.pwd,
      smsCType: this.selectedCarrierType,
      sms: this.standardCarriers,
      sendTo: this.sendSmsTo
    }

    this.settingService.saveMailSMSSetting(mailSMSConfigDTO).subscribe((state: Store.State)=>{
      if(state instanceof MailSMSSettingLoadingState)
        this.onMailSMSSettingLoading(state);
      if(state instanceof MailSMSSettingLoadedState)
        this.onMailSMSSettingLoaded(state);
      if(state instanceof MailSMSSettingLoadingErrorState)
        this.onMailSMSSettingError(state);
    })
    console.log("created object is : ", mailSMSConfigDTO)
  }

  /*used to save MAIL SMS Configuration data from client to server by using POST request*/
  validationMailSmsConfig()
  {

    //mail format          
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //checking validation for smtp host
    
    if(this.smtphost === "")
    {
      this.alertMsg("Please enter smtp host.", "Error");
      return -1;
    }

    if(this.smtpport === undefined || this.smtpport === null)
    {
      this.alertMsg("Please enter smtp port.", "Error");
      return -1;
    }

    if(this.smtpport < 1 || this.smtpport > 65535)
    {
      this.alertMsg("Please enter value of SMTP Port between 1 to 65535.", "Error");
      return -1;
    }

    //checking validation for user name
    if(this.email === "")
    {
      this.alertMsg("Please enter user name.", "Error");
      return -1;
    }

    //checking for the valid username or mail id
    if(!this.email.match(mailformat))
    {
      this.alertMsg("Please enter valid mail id.", "Error");
      return -1;
    }
    
    
    if(this.isAuthRequire)
    {
     //checking validation for password
     if(this.pwd === "")
     {
      this.alertMsg("Please enter password.", "Error");
      return -1;
     }
    
     if(this.confrmPwd === "")
     {
      this.alertMsg("Please enter confirm password.", "Error");
      return -1;      
     }
    
     //checking validation for confirm password
     if(this.confrmPwd != this.pwd)
     {
      this.alertMsg("Password and Confirm password should be same.", "Error");
      return -1;
     }
    }

    let cusCarrRegex = /((^[a-zA-Z0-9]([a-zA-Z0-9])*)*\.([a-zA-Z0-9])+$)/; 

    //checking validation for SMS carriers
    if(this.selectedCarrierType == 0)
    {
      if(this.standardCarriers === undefined)
      {
        this.alertMsg("Please select atleast one Standard carrier.", "Error");
        return -1;
      }
    }
    else
    {
      if(this.customCarriers === "")
      {
        this.alertMsg("Please enter some custom SMS Gateway Domain.", "Error");
        return -1;
      }
      else if(!(this.customCarriers.match(cusCarrRegex)))
      {
        this.alertMsg("Please enter valid custom SMS Gateway Domain.", "Error");
        return -1;
      }
    }
  }

  testMail()
  {

  }

  testSms()
  {

  }

  onMailSMSSettingLoading(state: MailSMSSettingLoadingState)
  {
    const me = this;
    console.log("state: MailSMSSettingLoadingState", state)
    // me.error = null;
    // me.loading = true;
  }

  onMailSMSSettingLoaded(state: MailSMSSettingLoadedState)
  {
    const me = this;
    console.log("state: MailSMSSettingLoadingState", state);
    if(state!= null && state.data != null && state.data.config != null)
    {
      me.smtphost = state.data.config.host;
      me.smtpport = state.data.config.port;
      me.selectedSecureConnType = state.data.config.secConn;
      me.isAuthRequire = state.data.config.authReq;
      me.isSecureConn = state.data.config.secAuth;
      me.email = state.data.config.user;
      me.pwd = state.data.config.pwd;
      me.confrmPwd = state.data.config.pwd;
      me.selectedCarrierType = state.data.config.smsCType;
      me.standardCarriers = state.data.config.sms;
    }
    let msg = state.data.status.detailedMsg;
    if(msg && msg != ""){
      msg = state.data.status.detailedMsg; 
    }else{
      msg = state.data.status.msg;
    }
    if(state.data.status.code == 1057)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Alert Mail/SMS configuration could not be loaded due to some error" });
    else
      this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  onMailSMSSettingError(state: MailSMSSettingLoadingErrorState)
  {
    const me = this;
    me.data = null;
    console.log("state: MailSMSSettingLoadingErrorState", state)
    // me.error = state.error;
    // me.loading = false;
  }
}

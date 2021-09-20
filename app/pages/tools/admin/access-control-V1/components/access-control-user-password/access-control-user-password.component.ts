import { Component, OnInit } from '@angular/core';
import * as encrypt from 'jsencrypt/bin/jsencrypt.min';
import { SessionService } from 'src/app/core/session/session.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng';

@Component({
  selector: 'app-access-control-user-password',
  templateUrl: './access-control-user-password.component.html',
  styleUrls: ['./access-control-user-password.component.css']
})
export class AccessControlUserPasswordComponent implements OnInit {
  newPassword: string;
  confirmPassword: string;
  errorMessage = [];
  AuthenticationService: any;
  model: any;

  constructor(
    private sessionService: SessionService,
    public ref: DynamicDialogRef,
    private messageService: MessageService) {
  }

  ngOnInit() {
  }

  closePassworddialog(status) {
    this.ref.close();
  }

  validateNewPassword() {
    let passregex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,64})$/;


    if (this.newPassword === 'undefined' || this.newPassword === '') {
      this.showError("Please enter the new password ");
      return;
    }
    else if (!passregex.test(this.newPassword)) {
      this.showError("Password must be containing 8-64 characters including minimum 1(A-Z),1(a-z),1(0-9) and special symbols like ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ `{ | }~");
      return;
    }
    else if (this.newPassword.length < 8 || this.newPassword.length > 64) {
      this.showError("Please use between 8 and 64 Alphanumeric characters and special character For Password");
      return;
    }

    if (this.confirmPassword === 'undefined' || this.confirmPassword === '') {
      this.showError("Please enter the confirm password ");
      return;
    }

    if (this.confirmPassword !== this.newPassword) {
      this.showError("Confirm password is not same as New password . Please Enter same Password");
      return;
    }
 
    let publicMetadata = this.sessionService.preSession.publicKey;
    if (publicMetadata != 'NA') {
      let encryptAPI = new encrypt.JSEncrypt();
      encryptAPI.setKey(publicMetadata);
      this.newPassword = encryptAPI.encrypt(this.newPassword);
      this.confirmPassword = this.newPassword;
    }
    this.ref.close(this.confirmPassword);
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }
}

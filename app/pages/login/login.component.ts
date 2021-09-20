import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SessionService } from 'src/app/core/session/session.service';
import { Router } from '@angular/router';
import { LoginPayload } from 'src/app/core/session/session.model';
import { SessionCreatedState, SessionDestroyedState } from 'src/app/core/session/session.state';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from 'src/app/core/store/store';
import { CavConfigService } from '../tools/configuration/nd-config/services/cav-config.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  loading: boolean;
  saasEnabled: boolean;
  UserNameLoginForSaas: boolean;

  @ViewChild('username', { read: ElementRef }) username: ElementRef;

  constructor(
    private fb: FormBuilder,
    public sessionService: SessionService,
    private http: HttpClient,
    private _config: CavConfigService
  ) {
    this.loading = false;
    this.saasEnabled = false;
    this.UserNameLoginForSaas = false;
  }

  initForm(saasFlag: boolean) {
    const me = this;
    if (saasFlag) {
      me.form = me.fb.group({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
      });
    } else {
      me.form = me.fb.group({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
    }
  }

  ngOnInit(): void {
    if (this.sessionService.preSession.saasEnabled == '1') {
      this.saasEnabled = true;
      this.UserNameLoginForSaas = true;
      console.log('saas enabled');
      this.initForm(true);
    } else {
      this.initForm(false);
    }
  }

  ngAfterViewInit() {
    const me = this;
    setTimeout(() => {
      if (me.username) {
        me.username.nativeElement.focus();
      }
    });
  }

  login() {
    const me = this;
    if (this.sessionService.preSession.saasEnabled == '1' && this.UserNameLoginForSaas) {
      me.saasUserAuthentication();
      me.loading = false;
      return;
    }
    if (me.form.controls.username.invalid || me.form.controls.password.invalid) {
      return;
    }
    if(this.saasEnabled){
      this.form.value.username = this.form.controls.username.value;
  }

    const loginPayload: LoginPayload = me.form.value as LoginPayload;

    me.form.setErrors(null);

    me.loading = true;

    me.sessionService.login(loginPayload).subscribe((state: SessionCreatedState) => {
      if(this.sessionService.preSession.saasEnabled == '1'){
        me.sessionService.redirectToPostLoginSAASPage()
      } else {
        me.sessionService.redirectToPostLoginPage();
      }
    }, (error: Error) => {
      let errorMessage = null;

      if (error instanceof HttpErrorResponse) {

        if (error.status === 409 && confirm('There is already one session running with the same user. Click Ok to forcefully logout other session and login.')) {

          me.sessionService.forceLogout(loginPayload.username).subscribe((state: Store.State) => {
            if (state instanceof SessionDestroyedState) {
              me.login();
            }
          }, () => {
            errorMessage = 'Error while destroying existing session.';
            me.form.setErrors({ serviceError: errorMessage });
          });

          return;

        } else {

          switch (error.status) {
            case 0:
              errorMessage = 'Can not connect to server.';
              break;
            case 401:
              errorMessage = 'Invalid credentials.';
              break;
            case 409:
              errorMessage = 'User already loggedin.';
              break;
          }
        }

        if (!errorMessage) {
          errorMessage = 'Something went wrong.';
        }

        me.loading = false;

        me.form.setErrors({ serviceError: errorMessage });
      }
    });

  }

  saasUserAuthentication() {
    const me = this;
    if (me.form.controls.username.invalid) {
      return;
    }      
    me.loading = true;
    const loginPayload: LoginPayload = me.form.value as LoginPayload;
    let errorMessage = null;
    this.http.get(this._config.$serverIP + "DashboardServer/acl/EnterPrise/getDomainNameForSaasUser?requestForAccountDomain=" + true + '&userName=' + loginPayload.username + '&productKey=' + loginPayload.username).pipe(res => <any>res).subscribe(res => {
      if (res != null) {
        if (res['status'] == 123) {
          let ssoUrl = res['domain'];
          window.open(ssoUrl, "_self");
          return;
        } else if (res['status'] == 122) {
          errorMessage = "No account configured for this domain";
          me.form.setErrors({ serviceError: errorMessage });
        } else if (res['status'] == 121) {
          this.UserNameLoginForSaas = false;
          this.form.controls['username'].disable()
        } else if (res['status'] == 120) {
          errorMessage = "Something umexpected happened. Kindly contact Administrator";
        }
      } else {
        errorMessage = 'Error while validating SAAS username.';
      }
    });
    if (errorMessage != null) {
      me.form.setErrors({ serviceError: errorMessage });
    }
  }
}


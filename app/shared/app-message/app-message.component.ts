import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { AppMessageService } from './service/message.service';
import { MessageOptions } from './service/message.model';
import { messageAnimation } from './service/message.animation';

@Component({
  selector: 'app-message',
  templateUrl: './app-message.component.html',
  styleUrls: ['./app-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [messageAnimation],
})
export class AppMessageComponent implements OnInit {
  @Input() type = 'neutral';
  @Input() label: string;
  @Input() align = 'middleCenter';
  @Input() toast = false;
  @Input() error: AppError;
  @Input() setInterval = 3000;
  @Input() showTransformOptions = 'translateY(100%)';
  @Input() hideTransformOptions = 'translateY(-100%)';
  @Input() showTransitionOptions = '300ms ease-out';
  @Input() hideTransitionOptions = '250ms ease-in';
  @Input() loader = false;
  @Input() size: string;
  @Input() showLoaderText = true;
  @Input() loaderText: string = 'Loading';

  classes: string;
  sizeClass: string;
  iconClass: string;
  messages = [];

  iconMapper = {
    error: 'pi-times',
    success: 'pi-check-circle',
    warning: 'pi-exclamation-circle',
    info: 'pi-info-circle',
  };

  constructor(public appMessageService: AppMessageService) {
    const me = this;
  }

  ngOnInit() {
    const me = this;

    if (me.toast) {
      me.getPositionClass(me.align);
      me.loadToastMessage();

    } else {
      me.loadInitial();
    }
  }

  loadInitial() {
    const me = this;

    if (me.error && (me.error.msg || me.error.code)) {
      me.type = 'error';
    }

    me.iconClass = me.iconMapper[me.type];
    // Check for label or throw error
    me.checkLabelValidation();
    // get position of the message/toast based on alignment
    me.getPositionClass(me.align);

    console.log(me.loader)
    if (me.loader) {
      me.getLoaderSizeClass(me.size);
    }
  }

  getPositionClass(align: string) {
    const me = this;

    if (me.toast === true) {
      // me.toastTransition();
      switch (align) {
        case 'topLeft':
          me.classes = 'p-toast-top-left';
          break;
        case 'topCenter':
          me.classes = 'p-toast-top-center';
          break;
        case 'topRight':
          me.classes = 'p-toast-top-right';
          break;
        case 'bottomLeft':
          me.classes = 'p-toast-bottom-left';
          break;
        case 'bottomCenter':
          me.classes = 'p-toast-bottom-center';
          break;
        case 'bottomRight':
          me.classes = 'p-toast-bottom-right';
          break;
        case 'middleCenter':
          me.classes = 'p-toast-center';
          break;
        default:
          me.classes = 'p-toast-top-right';
      }
    } else {
      switch (align) {
        case 'topLeft':
          me.classes = 'p-justify-start p-align-start';
          break;
        case 'topRight':
          me.classes = 'p-justify-end p-align-start';
          break;
        case 'topCenter':
          me.classes = 'p-justify-center p-align-start';
          break;
        case 'middleCenter':
          me.classes = 'p-justify-center p-align-center';
          break;
        case 'middleLeft':
          me.classes = 'p-justify-left p-align-center';
          break;
        case 'middleRight':
          me.classes = 'p-justify-end p-align-center';
          break;
        case 'bottomLeft':
          me.classes = 'p-justify-start p-align-end';
          break;
        case 'bottomCenter':
          me.classes = 'p-justify-center p-align-end';
          break;
        case 'bottomRight':
          me.classes = 'p-justify-end p-align-end';
          break;
        default:
          me.classes = 'p-justify-center p-align-center';
      }
    }
  }

  getLoaderSizeClass(size: string) {
    const me = this;
    if (me.loader) {
      switch (size) {
        case 'small':
          me.sizeClass = 'p-small-loader';
          break;
        case 'middle':
          me.sizeClass = 'p-medium-loader';
          break;
        case 'large':
          me.sizeClass = 'p-large-loader';
          break;
        default:
          me.sizeClass = 'p-medium-loader';
      }
    }
  }

  getTypeClass(toast: boolean, type: string) {
    const me = this;
    if (toast === true) {

      switch (type) {
        case 'error':
          return 'toast msg-error p-justify-start p-align-center';
        case 'info':
          return 'toast msg-info p-justify-start p-align-center';
        case 'warning':
          return 'toast msg-warning p-justify-start p-align-center';
        case 'success':
          return 'toast msg-success p-justify-start p-align-center';
        case 'neutral':
          return 'toast msg-neutral p-justify-start p-align-center';
        case 'empty':
          return 'toast msg-empty p-justify-start p-align-center';
        default:
          return 'toast p-justify-start p-align-center';
      }
    } else {
      switch (type) {
        case 'error':
          return 'app-message-text-content msg-error';
        case 'info':
          return 'app-message-text-content msg-info';
        case 'warning':
          return 'app-message-text-content msg-warning';
        case 'success':
          return 'app-message-text-content msg-success';
        case 'neutral':
          return 'app-message-text-content msg-neutral';
        case 'empty':
          return 'app-message-text-content msg-empty';
        default:
          return 'app-message-text-content';
      }
    }
  }

  checkLabelValidation() {
    const me = this;
    if (me.type === 'error' || me.error) {
      me.validateErrorType();
    } else if (me.type === 'empty') {
      if (!me.label) {
        me.label = 'No Data.';
      }
    } else {
      if (
        (me.type === 'success' ||
          me.type === 'info' ||
          me.type === 'warning' ||
          me.type === 'neutral') &&
        !me.label
      ) {
        throw new TypeError('Property "label" missing for message component');
      }
    }
  }

  validateErrorType() {
    const me = this;
    if (
      (me.type === 'error' && me.error && (me.error.msg || me.error.code)) ||
      (me.error && (me.error.msg || me.error.code))
    ) {
      if (me.error.msg && me.error.msg !== '') {
        me.label = me.error.msg;
      } else {
        me.label = me.error.code;
      }
    } else if (me.type === 'error' && !me.error) {
      me.label = 'Something went wrong!';
    } else {
      throw new TypeError('Message of type "AppError" is required');
    }
  }

  loadToastMessage() {
    const me = this;
    me.appMessageService.getAlert().subscribe((alert: MessageOptions) => {
      if (!alert) {
        me.messages = [];
        return;
      }

      me.messages.push(alert);

      setTimeout(() => {
        me.messages = me.messages.filter((x) => x !== alert);
      }, me.setInterval);
    });
  }

  clearToast(notification: MessageOptions) {
    const me = this;
    me.messages = me.messages.filter((x) => x !== notification);
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class AddMonValidationService {
  constructor() { }

  valMethod(methodName) {
    if (methodName.startsWith("/google.com")) {
      return "Method not cannot starts with / character";
    }
    return '';
  }

  valInstance(instanceName) {
    /** Here now checking that instance name should not begin with any special character.
      * Changes done in this method for bug id:46372
      */
    if (!/^([A-Za-z][A-Za-z0-9-_.!;]*$)$/.test(instanceName)) {
      return "Instance Name is not valid";
    }
    return '';
  }

  /**
   * HostName not valid = cav908###,cav344%% 
   * @param {*} hostName 
   * 
   */
  valHostName(hostName) {
    /*** hostName doesnot allow = " _ ,*,cav- "
     *   allow = "cav-log","cav123",""
     */
    if (!/^((([0-9]{1,3}\.){3}[0-9]{1,3})|([A-Za-z][A-Za-z0-9-_.]*$))$/.test(hostName)) {
      return "Host Name is not valid"
    }
    return '';
  }


  valPort(port) {
    if (port < 0 || port > 65535) {
      return "Port length must not exceed more than 65535 and cannot have negative values";
    }
    return '';
  }

  valPwd(password) {
    if (password.length > 64) {
      return "Password must not exceed more than 64 characters"
    }
    return '';
  }

  valUserName(userName) {
    if (!/^([A-Za-z][A-Za-z0-9-_.@#!*]*$)$/.test(userName)) {
      return "User Name is not valid";
    }
    return '';
  }
}




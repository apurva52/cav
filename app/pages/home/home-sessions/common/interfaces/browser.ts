export class Browser {
  id: number;
  name: string;
  version: string;
  icon: string;
  constructor(dbrecord: any)
  {
    this.id = dbrecord.id;
    this.name = dbrecord.name;
    this.icon = dbrecord.icon;
    // if we have icons present in Unified Dashboard , use them
    if(browserMap[this.name]){
      this.icon = browserMap[this.name];
    }
    this.version = dbrecord.version;
    return this;
  }
}
// for below browsers, we have icon
let browserMap = {
  'Others' : 'assets/images/browsers/question-circle-solid.svg',
  'Chrome' : 'assets/images/browsers/chrome.svg',
  'Firefox' : 'assets/images/browsers/firefox.svg',
  'IE' : null,
  'Safari' : 'assets/images/browsers/safari.svg',
  'Opera': null,
  'MicrosoftEdge':'assets/images/browsers/edge.svg',
  'Iphone':'assets/images/browsers/safari.png',
  'Android' : null,
  'WindowsPhone' : null,
  'BlackBerry' : null,
  'Netscape' : null,
  'OviBrowser' : null,
  'AndroidBrowser' : null,
  'WindowsApp' : null,
  'IphoneApp'  : null
}
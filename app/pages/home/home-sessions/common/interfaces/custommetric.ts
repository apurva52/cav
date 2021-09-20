import { nvEncoder} from './nvencode';
declare var unescape: any;

export class CustomMetric {
  name: string;
  pageName: string;
  value: string;
  encrypt:boolean;
  pageInstance : any;
  isNumber: any;
  constructor(name, pageName, value, encrypt , pageInstance)
  {
    console.log("name"+name+"pageName"+pageName+"value"+value+"encrypt"+encrypt);
    this.name = name;
    this.pageName = pageName;
    if(encrypt)
    {
	try{
         this.value = nvEncoder.decode(value);
       }
       catch(e){
         console.log("Exception occured while decoding value : " + value);
         this.isNumber = Number(value);
         if(isNaN(this.isNumber))
          this.value = null;
         else
          this.value = value;
      }
    }
    else
    {
        try{
	  this.value = nvEncoder.decode(value);
          this.value = unescape(value);
        }catch(e){
          this.value = unescape(value);
        }
    }
    if(this.value === undefined || this.value === 'undefined' || this.value === null)
      this.value = '-';
    this.encrypt = encrypt;
    this.pageInstance = pageInstance;    

  }
}

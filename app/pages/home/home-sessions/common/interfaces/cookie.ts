declare var unescape: any;
export class Cookie {
  name:string;
  value:string;
  nvCookie:boolean;
  origName:string;
  origValue:string;
 
  constructor(name,value,nvCookie)
  {
    this.origName = name;
    //this.origValue = unescape(value);
    this.origValue = value;
    this.name = name.split("%PIPE").join("|");
    try{
     this.value = unescape(value.split("%PIPE%").join("|").split("%PIPE").join("|"));
    }
    catch(e)
    {
     this.value = value.split("%PIPE").join("|");
    }
    this.nvCookie = nvCookie;
  }
  
  static addline(str,lmt)
  {
    let ret = '';
    let i = 0;
    let a = str.length;
    if(a <= lmt)
    {
      return str;
    }
    while(a > lmt)
    {
      ret += str.substr(i,130) + "\n";
      i = i+131;
      a = a - 130;
    }
    return ret;
  }
  
}

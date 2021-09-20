
export class nvEncoder {
   
  //This is the fastest one among all four A-grade browser.
  static reverse(s) {
     let o = '';
     for (let i = s.length - 1; i >= 0; i--)
      o += s[i];
     return o;
  }
 
  //Encoding Algo.
  //1. Reverse the string.
  //2. Apply NVBase64 encoding.
  //Format: <length of string>.<encoded value>
  static encode(s){
    if(s == undefined || s == null) return '';
    return s.length + '.'  + btoa(nvEncoder.reverse(s));
  }

  //Decode algo.
  //1. NVBase64 decoding.
  //2. reverse the string.
  //Note: Format: <actual Content Length>.<encoded content>
  static decode(s) {
    if(s == undefined || s == null) return '';
    //search for .
    let r = s.indexOf('.');
    if(r != -1)
      s = s.substr(r + 1);
    return nvEncoder.reverse(atob(s));
  }

  static decode_default(s) {
        let r = s.indexOf('.');
        let len;
        //take this value as length of string.
        if(r != -1)
        {
          len = parseInt(s.substring(0, r));
        }
        else
          len = s.length;
        return Array(len).join("*");
  }

  //Note: this will split the content in different-2 seperators and then will encode them.
  static decodeText(str, callback) {
        //Tokenize the string by escape characters(\r, \n, \t, \v, \b, \f).
        let str_arr = [];
        let token_arr = [];
        let offset = 0;

        if(!callback)
          callback = nvEncoder.decode_default;

        //Note: we are not using space.
        for(let z = 0; z < str.length; z++)
        {
           if(str[z] == ' ' || str[z] == '\r' || str[z] == '\n' || str[z] == '\t' || str[z] == '\b' || str[z] == '\v' || str[z] == '\f')
           {
               str_arr.push(str.substring(offset, z));
               token_arr.push(str[z]);
               //update offset.
               offset = z+1;
           }
        }
        if(offset != str.length)
        {
            str_arr.push(str.substr(offset));
        }

        //call the callback for each string token.
        let out = "";
        for(let z = 0; z < str_arr.length; z++)
        {
          if(str_arr[z] != "")
            out += callback(str_arr[z]);
          if(token_arr[z] != undefined)
            out += token_arr[z];
        }
        return out;
      }

      
               
        
        //Note: this method will apply multiple filters (decryption callback)
        //Note: each callback should return non null in case of success;
        //If one callback will be failed then we will use the other one.
        static transformElement(e, encode_fn_array)
        {
          let defaultFn = (s:String) =>{
            return nvEncoder.decodeText(s, nvEncoder.decode_default);
          }
      
         let decrypt = (text, encode_fn_array) =>
        {
              var encodedValue = null;
              for(var i = 0; i < encode_fn_array.length; i++)
              {
                try {
                  encodedValue = encode_fn_array[i](text);
                  if(encodedValue != null)
                    return encodedValue;
                }
                catch(e) {}
              }
              if(encodedValue == null)
                encodedValue = "****";
          return encodedValue;
        }

          //get list of all childNodes and encode the TEXT_NODE.
          if(typeof e == undefined || e == null) return;
      
          var cn = [];
          var encodedValue;
          var tvalue; //trimmed value.
          var text;
          var rsaEncFlag = false;
      
          if(!encode_fn_array || encode_fn_array.length == 0)
          {
            encode_fn_array = [defaultFn];
          }
      
          //check if there is no child node of this element then we should try to process this element.
          if(e.childNodes.length == 0)   
            cn.push(e);
          else 
            cn = e.childNodes;
          
          var success;
          for(var z = 0; z < cn.length; z++)
          {
            if(cn[z].nodeType == e.TEXT_NODE)
            {
              text = cn[z].textContent;
              cn[z].textContent = decrypt(text, encode_fn_array);
            }
      
            //if it is element node then we need to call this function again.
            if(cn[z].nodeType == e.ELEMENT_NODE && cn[z].childNodes.length > 0)
              this.transformElement(cn[z], encode_fn_array);
            else {
              //check if elementNode is of INPUT or TEXTAREA type in that case we need to encode it's value.
              //TODO: we may need to filterout some types like , submit, tel etc.
              if(cn[z].tagName != undefined && (cn[z].tagName == 'INPUT' || cn[z].tagName == 'TEXTAREA'))  {
                try{
                  console.log("Input Element , value - " +  cn[z].value + ", placeholder - " + cn[z].placeholder + ", defaultValue - " +  cn[z].defaultValue);
                  // Currently not sending the default value 
                  //Sometimes default value may have been set in that case we need to encode that also.
                  /*if(typeof cn[z].defaultValue != 'undefined' && cn[z].defaultValue != null && cn[z].defaultValue != "")
                    cn[z].defaultValue = decrypt(cn[z].defaultValue, encode_fn_array);*/
      
                  cn[z].value = decrypt(cn[z].value, encode_fn_array);
                  //Check for place holder.
                  if(cn[z].placeholder)
                    cn[z].placeholder = decrypt(cn[z].placeholder, encode_fn_array);
                }catch(e){}
                console.log("Input element value - " +  cn[z].value + ", placeholder - " +  cn[z].placeholder + ", defaultValue - " +  cn[z].defaultValue);
              }
            }
          } 
        }
      
}

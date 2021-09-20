export class Extension {
 
    extTypes : object;
    constructor()
    {
       this.extTypes = {
                 "3gp"   : "Media"
                 , "a"     : "Others"
                 , "ai"    : "Others"
                 , "aif"   : "Media"
                 , "aiff"  : "Media"
                 , "asc"   : "Others"
                 , "asf"   : "Media"
                 , "asm"   : "Documents"
                 , "asx"   : "Media"
                 , "atom"  : "Documents"
                 , "au"    : "Media"
                 , "avi"   : "Media"
                 , "bat"   : "Others"
                 , "bin"   : "Others"
                 , "bmp"   : "Images"
                 , "bz2"   : "Others"
                 , "c"     : "Others"
                 , "cab"   : "Others"
                 , "cc"    : "Others"
                 , "chm"   : "Others"
                 , "class"   : "Others"
                 , "com"   : "Others"
                 , "conf"  : "Documents"
                 , "cpp"   : "Others"
                 , "crt"   : "Others"
                 , "css"   : "Stylesheets"
                 , "csv"   : "Documents"
                 , "cxx"   : "Documents"
                 , "deb"   : "Others"
                 , "der"   : "Others"
                 , "diff"  : "Documents"
                 , "djv"   : "Images"
                 , "djvu"  : "Images"
                 , "dll"   : "Others"
                 , "dmg"   : "Others"
                 , "doc"   : "Documents"
                 , "dot"   : "Documents"
                 , "dtd"   : "Documents"
                 , "dvi"   : "Others"
                 , "ear"   : "Others"
                 , "eml"   : "Others"
                 , "eps"   : "Others"
                 , "exe"   : "Others"
                 , "f"     : "Others"
                 , "f77"   : "Documents"
                 , "f90"   : "Documents"
                 , "flv"   : "Media"
                 , "for"   : "Documents"
                 , "gem"   : "Others"
                 , "gemspec" : "Documents"
                 , "gif"   : "Images"
                 , "gz"    : "Others"
                 , "h"     : "Others"
                 , "hh"    : "Others"
                 , "htm"   : "Documents"
                 , "html"  : "Documents"
                 , "ico"   : "Images"
                 , "ics"   : "Documents"
                 , "ifb"   : "Documents"
                 , "iso"   : "Others"
                 , "jar"   : "Others"
                 , "java"  : "Others"
                 , "jnlp"  : "Others"
                 , "jpeg"  : "Images"
                 , "jpg"   : "Images"
                 , "js"    : "Scripts"
                 , "json"  : "Scripts"
                 , "log"   : "Documents"
                 , "m3u"   : "Media"
                 , "m4v"   : "Media"
                 , "man"   : "Documents"
                 , "mathml"  : "Documents"
                 , "mbox"  : "Others"
                 , "mdoc"  : "Documents"
                 , "me"    : "Documents"
                 , "mid"   : "Media"
                 , "midi"  : "Media"
                 , "mime"  : "Documents"
                 , "mml"   : "Documents"
                 , "mng"   : "Media"
                 , "mov"   : "Media"
                 , "mp3"   : "Media"
                 , "mp4"   : "Media"
                 , "mp4v"  : "Media"
                 , "mpeg"  : "Media"
                 , "mpg"   : "Media"
                 , "ms"    : "Documents"
                 , "msi"   : "Others"
                 , "odp"   : "Others"
                 , "ods"   : "Documents"
                 , "odt"   : "Documents"
                 , "ogg"   : "Others"
                 , "p"     : "Documents"
                 , "pas"   : "Documents"
                 , "pbm"   : "Images"
                 , "pdf"   : "Documents"
                 , "pem"   : "Others"
                 , "pgm"   : "Images"
                 , "pgp"   : "Others"
                 , "pkg"   : "Others"
                 , "pl"    : "Documents"
                 , "pm"    : "Documents"
                 , "png"   : "Images"
                 , "pnm"   : "Images"
                 , "ppm"   : "Images"
                 , "pps"   : "Documents"
                 , "ppt"   : "Documents"
                 , "ps"    : "Others"
                 , "psd"   : "Images"
                 , "py"    : "Documents"
                 , "qt"    : "Media"
                 , "ra"    : "Media"
                 , "rake"  : "Documents"
                 , "ram"   : "Media"
                 , "rar"   : "Others"
                 , "rb"    : "Documents"
                 , "rdf"   : "Documents"
                 , "roff"  : "Documents"
                 , "rpm"   : "Others"
                 , "rss"   : "Documents"
                 , "rtf"   : "Documents"
                 , "ru"    : "Documents"
                 , "s"     : "Documents"
                 , "sgm"   : "Documents"
                 , "sgml"  : "Documents"
                 , "sh"    : "Others"
                 , "sig"   : "Others"
                 , "snd"   : "Media"
                 , "so"    : "Others"
                 , "svg"   : "Images"
                 , "svgz"  : "Images"
                 , "swf"   : "Media"
                 , "t"     : "Documents"
                 , "tar"   : "Others"
                 , "tbz"   : "Others"
                 , "tcl"   : "Others"
                 , "tex"   : "Others"
                 , "texi"  : "Others"
                 , "texinfo" : "Others"
                 , "text"  : "Documents"
                 , "tif"   : "Images"
                 , "tiff"  : "Images"
                 , "torrent" : "Others"
                 , "tr"    : "Documents"
                 , "txt"   : "Documents"
                 , "vcf"   : "Documents"
                 , "vcs"   : "Documents"
                 , "vrml"  : "Others"
                 , "war"   : "Others"
                 , "wav"   : "Media"
                 , "wma"   : "Media"
                 , "wmv"   : "Media"
                 , "wmx"   : "Media"
                 , "wrl"   : "Others"
                 , "wsdl"  : "Others"
                 , "xbm"   : "Images"
                 , "xhtml"   : "Documents"
                 , "xls"   : "Documents"
                 , "xml"   : "Documents"
                 , "xpm"   : "Images"
                 , "xsl"   : "Documents"
                 , "xslt"  : "Documents"
                 , "yaml"  : "Documents"
                 , "yml"   : "Documents"
                 , "zip"   : "Others"
                 , "aspx"  : "Documents"
                 , "axd"   : "Documents"
                 , "asmx"  : "Documents"
                 , "ashx"  : "Documents"
                 , "jhmtl" : "Documents"
                 , "jsp"   : "Documents"
                 , "jspx"  : "Documents"
                 , "wss"   : "Documents"
                 , "do"    : "Documents"
                 , "action": "Documents"
                 , "php"   : "Documents"
                 , "php4"  : "Documents"
                 , "php3"  : "Documents"
                 , "phtml" : "Documents"
                 , "rhtml" : "Documents"
                 , "cgi"   : "Documents"
 
         }
    }
 
    // bug id : 109240
    // give priority to cinitiator
    // if cinitiator is unknown or Others, then do according to initiator
    getExtension(path, initiator, cinitiator) 
    {
      let t = "Others";
      switch(cinitiator.toLowerCase()){
        case "xmlhttprequest" : 
          t = "XHR";
          break;
        case "img":
          t = "Images";
          break;
        case "script" :
          t= "Scripts";
          break;
        case "link" : 
          t = "Stylesheets";
          break;
        default :
          t = "Others"; 
      }
      if(t == "Others"){
          if(initiator.toLowerCase() == "xmlhttprequest")
            return "XHR"; 
          //extract pathname.     
          let i = null;        
          i = path.indexOf('?');
          if(i != -1)   
            path = path.substr(0, i); 
          i = path.indexOf('#');  
          if(i != -1)   
            path = path.substr(0, i);
          i = path.lastIndexOf('.');
          if(i < 0)
            return "Others";
          let ext = path.substr(i+1);
          return this.extTypes[ext] || "Others";
      }else 
      return t;
  }
 
 }
 
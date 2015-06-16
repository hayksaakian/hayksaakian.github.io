var popup_in = 1000 
// milliseconds
var showpopup = localStorage.getItem('popupbeta');
var popup_url = "http://innovativemen.com/popup/"

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}


var filesadded="" //list of files already added
 
function checkloadjscssfile(filename, filetype){
    if (filesadded.indexOf("["+filename+"]")==-1){
        loadjscssfile(filename, filetype)
        filesadded+="["+filename+"]" //List of files added in the form "[filename1],[filename2],etc"
    }
    else
        alert("file already added!")
  }

var jQueryScriptOutputted = false;

if(typeof($) == 'undefined' && typeof(jQuery) != 'undefined'){
  var $ = jQuery
}

function initJQuery() {
  
  //if the jQuery object isn't available
  if (typeof($) == 'undefined') {
  
      if (! jQueryScriptOutputted) {
          //only output the script once..
          jQueryScriptOutputted = true;
          
          //output the script (load it from google api)
          document.write("<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js'></script>");
      }
      setTimeout("initJQuery()", 50);
  } else {
                      
      $(function() {  
        initPopup()
      });
  }     
}
function initPopupJS () {
  initJQuery();
}

function initPopup () {
  checkloadjscssfile("http://dimsemenov-static.s3.amazonaws.com/dist/jquery.magnific-popup.min.js", "js") //success
  checkloadjscssfile("http://dimsemenov-static.s3.amazonaws.com/dist/magnific-popup.css", "css") //redundant file, so file not added
  $(document).ready(function() {

    setTimeout(openPopup, popup_in)
  })
}

function openPopup(){
  $.magnificPopup.open({
    type: 'iframe',
    items: {
        src: popup_url,        
    },
    iframe: {
       markup: '<div class="mfp-iframe-scaler">'+
                  '<div class="mfp-close"></div>'+
                  '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '</div>'
    }
  })
}

if(showpopup){
  initPopupJS()
}

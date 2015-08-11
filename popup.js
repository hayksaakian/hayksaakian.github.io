function () {

var seconds_to_popup = 45
var days_between_popup = 30

// var popup_url = "http://visitor.r20.constantcontact.com/d.jsp?llr=sryz7buab&p=oi&m=1121050223154&sit=9ev96kvjb&f=f1799d22-c972-4d79-b2f5-7352f09e3641"
var popup_url = "http://www.innovativemen.com/popup/"

var excluded_urls = [
  popup_url,
  "mens-clinic-appointment"
]

var beta = localStorage.getItem('popupbeta');

var showpopup = beta

var lastseen = localStorage.getItem('lastseen') ? new Date(parseInt(localStorage.getItem('lastseen'))) : 0
var today = new Date()
var priorDate = new Date().setDate(today.getDate()-days_between_popup)
if(lastseen < priorDate){
  showpopup = true
}

// to block recursion
for (var i = 0; i < excluded_urls.length; i++) {
  if(!showpopup){
    break
  }
  showpopup = window.location.toString().indexOf(excluded_urls[i]) !== -1
};

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
  // checkloadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/ouibounce/0.0.11/ouibounce.min.js", "js") 
  checkloadjscssfile("http://hayksaakian.github.io/jquery.magnific-popup.min.js", "js") 
  checkloadjscssfile("http://hayksaakian.github.io/magnific-popup.css", "css")
  $(document).ready(function() {
    setTimeout(openPopup, seconds_to_popup*1000)
  })
}

function openPopup(){
  $.magnificPopup.open({
    type: 'iframe',
    items: {
        src: popup_url,        
    },
    iframe: {
       markup: '<div class="mfp-iframe-scaler" style="padding-top: 70%;">'+
                  '<div class="mfp-close"></div>'+
                  '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '</div>'
    },
    callbacks: {
      open: function(){
        localStorage.setItem('lastseen', +new Date)
      }
    }
  })

}

if(showpopup){
  initPopupJS()
}

}()

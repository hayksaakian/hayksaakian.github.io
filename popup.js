
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
 
checkloadjscssfile("http://dimsemenov-static.s3.amazonaws.com/dist/jquery.magnific-popup.min.js", "js") //success
checkloadjscssfile("http://dimsemenov-static.s3.amazonaws.com/dist/magnific-popup.css", "css") //redundant file, so file not added


var showpopup = localStorage.getItem('popupbeta');
var popup_url = "http://innovativemen.com/popup/"

$(document).ready(function() {
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
      });
    }

    setTimeout(function (){
        if(!showpopup){
            return
        }
        openPopup()
    }, 1000)
});
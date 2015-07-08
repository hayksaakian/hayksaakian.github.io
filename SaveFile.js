/*

   SaveFile v0.2
   By Eric Gerds  http://www.pinlady.net/PluginDetect/


   This script does the following:
     1) Converts any data that appears in <HTMLtag id="[FILE.dataSrcId]"></HTMLtag> to a string,
        and saves that string to a <form>.
     2) Enables the "Save" button inside the <form>. 
        The Save button is initially disabled because there is no data 
        to save until this script is called.


   The <form> in your web page requires a "Save" button as follows:
     <FORM ACTION="[path/]SaveFile.php" METHOD=POST
      style="display:inline; margin:0px; padding:0px; border:0px;outline:0px;">
     <input disabled="disabled" class="buttontext" type="submit" value="Save" id="SaveFileButton" />
     </FORM>

   When the user presses the "Save" button in the <form>, the browser sends the data string
   in the <form> to "SaveFile.php", and then the browser downloads the data as a file attachment.



   Usage for this script:

    FILE.name = "filename.txt";  // name of file to be saved
    FILE.type = "text/plain";    // type of file to be saved.  "text/plain", "text/javascript", etc...
    FILE.dataSrcId = "out";      // id of HTML tag that contains the data to be saved
    FILE.convertHTML = 1;        // ==1 to convert HTML string to plain text string, ==0 otherwise

    FILE.SaveNow();              // Save data right now to the <form>
    FILE.SaveOnWinLoad();        // Save data after window.onload to the <form>



*/

var FILE = {

  name:"", // Specify file name here
  type:"", // Specify file type here
  dataSrcId:"", // Specify id of <div> that contains source data
  convertHTML:0, // Specify if ==1 then convert HTML tags, if ==0 then no conversion


  // default values for the <form> that contains the "Save" button
  SaveButtonId:"SaveFileButton", // id of <input> that is the Save button
  dataTargetId:"fileOutData",  // id of <input> that will contain file data
  nameTargetId:"fileOutName",  // id of <input> that will contain file name
  typeTargetId:"fileOutType",   // id of <input> that will contain file type


  // Create additional hidden <input> for the <form>
  createInputTag: function(form, inputId, inputValue){
     
     var tmp, input;

     tmp = document.getElementById(inputId);
     if (tmp) tmp.parentNode.removeChild(tmp);  // remove old <input> if already exists
     input = document.createElement("input");   // create new <input>
     input.type = "hidden";
     input.name = inputId;
     input.id = inputId;
     input.value = inputValue;
     form.appendChild(input); 

  },


  // This function can be an event handler, so the "this" keyword is not correct in that case.
  // When used an event handler, the inputs: $, FILE should be defined.
  SaveNow:function($, FILE){
    
   if (!FILE) var FILE=this;

   var SaveButton=document.getElementById(FILE.SaveButtonId);
   if (!SaveButton) return;
   SaveButton.disabled = true;  // disable the Save button for the time being


   if (typeof FILE.dataSrcId!="string" || !(/[a-zA-Z]/).test(FILE.dataSrcId)) return;
   var dataSrc=document.getElementById(FILE.dataSrcId);
   if (!dataSrc) return;


   var data="";
   if (/div/i.test(dataSrc.tagName) && dataSrc.innerHTML){ data = dataSrc.innerHTML; }
   else if (dataSrc.value && typeof dataSrc.value=="string"){ data = dataSrc.value; }
   else return;
   if (!data) return;


   // Convert HTML to plain text
   if (FILE.convertHTML){
     data = data.replace(/\n/g, "");
     data = data.replace(/<\s*br\s*\/?\s*>/gi, "\n");
     data = data.replace(/<\s*hr\s*\/?\s*>/gi, "------------------------------\n");

     data = data.replace(/&nbsp;/g, " ");
     data = data.replace(/&gt;/g, ">");
     data = data.replace(/&lt;/g, "<");
     data = data.replace(/&amp;/g, "&");

     data = data.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "");

     data = data.replace(/<\s*(a|b|div)[^>]*>/gi, "");
     data = data.replace(/<\s*\/\s*(a|b)\s*>/gi, "");
     data = data.replace(/<\s*\/\s*div\s*>/gi, "\n");
   };


   var form = SaveButton.parentNode;

   // Create additional <input> for the <form> for dataTarget
   FILE.createInputTag(form, FILE.dataTargetId, data);


   // Create additional <input> for the <form> for nameTarget
   FILE.createInputTag(form, FILE.nameTargetId, FILE.name);

   // Create additional <input> for the <form> for typeTarget
   FILE.createInputTag(form, FILE.typeTargetId, FILE.type);


   SaveButton.disabled = false;  // enable the Save button

 },   // end of SaveNow()


 SaveOnWinLoad:function(){

   if (PluginDetect && PluginDetect.onWindowLoaded)
   {
     // In this case, FILE.SaveNow() is an event handler, so we give it
     // 2 input arguments: SaveNow(PluginDetect, FILE){}
     PluginDetect.onWindowLoaded([FILE.SaveNow, FILE]);
   }
   else
   {
     var t = window.onload;
     window.onload = function(){
        if (typeof t =="function") t();
        FILE.SaveNow(0, FILE);
     };

   };

 
 }   // end of SaveOnWinLoad()


}; // end of FILE{}

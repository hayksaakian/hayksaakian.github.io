/*

   navarray.js  v1.6   By Eric Gerds  http://www.pinlady.net/PluginDetect/

   We attempt to enumerate the following objects:
        window.navigator
        window.navigator.mimeTypes[]
        window.navigator.plugins[]
        window

   We also make a small attempt to list some non-enumerable mimetypes and plugins.
   But this listing will most likely be incomplete.

   Warning: your browser may prevent enumeration of certain objects due to privacy reasons.
   So the enumeration of these objects may be incomplete.

*/


(function(){    // wrapper function

var $ = PluginDetect;  // We assume that the Library is present for this script


// We want to check if obj == {} or obj == new Object().
//
// This routine is not foolproof, but for most things it should be ok.
//
// This routine is based on John Resig's jQuery.isPlainObject().
$.isPlainObject = function(obj){

  if (!obj ||
  
       // Filter out boolean|string|number|function|array|date|regexp|error
       (/Boolean|String|Number|Function|Array|Date|RegExp|Error/i).test($.toString.call(obj)) ||
       
       // If we get this far, then we are left with the following possibilities for obj:
       // 1) {} whose contructor is the Object(){} function
       // 2) new Object() whose constructor is the Object(){} function
       // 3) new function(){} whose constructor is some function(){}
       // 4) Some kind of host object such as navigator, navigator.plugins, 
       //      document.createElement("a").toString, etc...
       //     that does not behave well


       
       // Note: John Resig's jQuery.js filters out the window and DOM nodes in
       // the following manner...
       //
       // Filter out window object.
       //
       // Firefox/Chrome:
       // window.window === window.window: true
       // window === window.window: true
       // window == window.window: true
       // window.window == window.window: true
       //
       // IE 8:
       // window.window === window.window: true
       // window === window.window: false
       // window == window.window: true
       // window.window == window.window: true
       //
       // So, we only use ==, not ===
       obj.window == obj ||

       // Filter out DOM node,
       // should be a number
       $.rgx.num.test($.toString.call(obj.nodeType))


     ) return 0;


     // The Object(){} constructor function appears to be a DIFFERENT object across frames.
     //      window.varName1 = {};   (code run in other frame)
     //      window.varName2 = {};   (code run in this frame)
     //      The constructors for these 2 objects are NOT the same.
     // Hence, we cannot compare Object to obj.constructor to determine if obj is a Plain Object.


   // It is possible for obj.constructor.prototype to cause an error in certain browsers for
   // certain objects. Hence we use try-catch.
   //
   try{
     if (!$.hasOwn(obj, "constructor") &&
           !$.hasOwn(obj.constructor.prototype, "isPrototypeOf"))
                 return 0
   }catch(e){return 0}



/*
   // For those objects that have $.hasOwn(obj, "constructor") == true,
   // there is a way to detect if Plain Object.
   //
   // Advantage: we would no longer have to try to explicitly filter out DOM nodes,
   // or the window object if we use this code;
   //
   // Disadvantage: we try to delete the constructor, which may be dangerous.
   // And it probably is not worth the extra code.
   if ($.hasOwn(obj, "constructor"))
   {
     var tmp, notPlain=0;
     try{ tmp = obj.constructor;
          delete obj.constructor;
          
          // If, after trying to delete the constructor, it is still OWN,
          // then it is a host object, and thus is not a Plain Object.
          if ($.hasOwn(obj, "constructor") ||

            !$.hasOwn(obj.constructor.prototype, "isPrototypeOf")) 
            
               notPlain=1;

          // Try to restore the constructor to be unobtrusive
          obj.constructor = tmp;

          if (notPlain) return 0;
      }
     catch(e){return 0}
   }
*/


   return 1;

}; // end of isPlainObject()



var result = "", RESULT=[""];

function docWrite(S){
  var len;
  result += S;
  
  // len = RESULT.length-1;
  // RESULT[len] += S;
  
  // If string too big, add another array element;
  // if (RESULT[len].length > 5000) RESULT.push("");
}

function docPrint(node){
  return
   var tmp = node ? document.getElementById(node) : 0;
   if (tmp){
   tmp.innerHTML += result;
  
/*
   var x, span;
   for (x=0;x<RESULT.length;x++){
        span = document.createElement("div");
        span.innerHTML = RESULT[x];
        tmp.appendChild(span);
   }
*/

   }
   result="";
//   RESULT=[""];
}

// return '[y]' or '["y"]' or '.y'
function showPropertyName(y){
   return ($.isString(y) ?
      ( (/[\/;\.]/).test(y) ? "[\"" + y + "\"]" : "." + y ) : "[" + y + "]");
}

function showPropertyValue(){

}

// Enumerate all the properties in obj.
//
// skipObj [undefined/null/object]: object with property names that should be skipped.
// pluginObj [undefined/true/false]: if true, then obj input is a navigator.plugins{} obj,
//   so we save the data.
//
// enumerate(T.enabledPlugin, "A.enabledPlugin", ": ", null, 1);
function enumerate(obj, str1, str2, skipObj, pluginObj){

  var x, num=0, length;
  

  for (x in obj)
  {
    // Note, we enumerate ALL properties, without any filtering via hasOwnProperty().
    // The reason is that obj is going to be a host object,
    // such as window, navigator, navigator.plugins[i], etc...
    if (1)
    {
       if (pluginObj && (x===0 || x=="0")) num=1;

       if (skipObj && $.isDefined(skipObj[x]) && $.hasOwn(skipObj, x)) continue;

       // Save the mimetype and plugin names.
       if (pluginObj){

          try{
            if (obj[x].type){
              extraMIMES[obj[x].type]=obj
            }
          }
          catch(e){}

          try{
            if (obj.name){
              extraPLUGINS[obj.name]=obj
            }
          }
          catch(e){}
       }

       try{docWrite(str1 + showPropertyName(x) + str2 + obj[x] + "<br>");}
       catch(e){}
    }
  } // x loop

  // If the pluginObj did not enumerate with a numerical index,
  // then check for that here.
  // We look for obj[0], obj[1], obj[2]... obj.0, obj.1, obj.2 etc...
  if (pluginObj && !num && obj && $.isNum(obj.length))
  {
     length = obj.length;
     for (x=0;x<length;x++){
        try{docWrite(str1 + showPropertyName(x) + str2 + obj[x] + "<br>");}
        catch(e){}
     }

  }


} // end of enumerate()



function copyObj(obj){
  var x, result={};
  for (x in obj){if (1) result[x] = obj[x];}
  return result;
}

var x, T, tmp, length;

// Keeps track of all navigator.mimeTypes{} objects that have already been displayed in the web page.
// Keeps track of all navigator.plugins{} objects that have already been displayed in the web page.
var MIMES = {}, PLUGINS = {};

// List mimeTypes that should be tested. If not displayed yet, then display on the web page as
//   a non-enumerable mimetype.
// List of plugins that should be tested. If not displayed yet, then display on the web page as
//   a non-enumerable plugin.
var extraMIMES = {}, extraPLUGINS = {};


// Count the number of properties in an object
var numProps;

// ------------------------------------------------------------------

// Enumerate the window.navigator{} object
docWrite("<br><br><br><br>");
docWrite("<a id='navigatorObject'>&nbsp;</a>");
docWrite("<a href='#topPage'>top of page</a>");
docWrite("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
docWrite("<br>");
docWrite("<div class='Title1'><b>Enumeration of window.navigator object</b></div><br>");

enumerate(window.navigator, "navigator", ": ");


// Mozilla may not recognize new plugins without this refresh
//    navigator.plugins.refresh(false);
docWrite("<br>");
docWrite("navigator.javaEnabled(): " + navigator.javaEnabled() + "<br>")
docWrite("navigator.userAgent: " + navigator.userAgent + "<br>");
docWrite("navigator.platform: " + navigator.platform + "<br>");
docWrite("navigator.product: " + navigator.product + "<br>");
docWrite("navigator.appVersion: " + navigator.appVersion + "<br>");
docWrite("navigator.appName: " + navigator.appName + "<br>");
docWrite("navigator.vendor: " + navigator.vendor + "<br>");
docWrite("navigator.plugins.length = " + navigator.plugins.length + "<br>");
docWrite("navigator.mimeTypes.length = " + navigator.mimeTypes.length + "<br>");

// We print out to the screen multiple times (not just once).
// This is to not overwhelm the print buffer with too much text.
docPrint("output1");


// --------------------------------------------------------------------


// Enumerate the navigator.mimeTypes[] array
docWrite("<br><br><br><br>");
docWrite("<a id='mimetypesArray'>&nbsp;</a>");
docWrite("<a href='#topPage'>top of page</a>");
docWrite("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
docWrite("<br>");

docWrite("<div class='Title1'><b>Enumerable mimetypes in navigator.mimeTypes[ ] array</b></div>");

numProps=0;
docWrite("<div id='num2'></div><br><br>");

length = navigator.mimeTypes.length;
for (x=0;x<length;x++){

   docWrite("<b>Let A = navigator.mimeTypes[" + x + "]</b><br>");

   T = navigator.mimeTypes[x];

   if (T)
   {
      numProps++;

      // We keep track of all mimetypes that are enumerated
      try{if (T.type) MIMES[T.type]=1}
      catch(e){}

      enumerate(T, "A", ": ");

      if (T.enabledPlugin) enumerate(T.enabledPlugin, "A.enabledPlugin", ": ", null, 1);

      docWrite("<br><br>");
   }

}  // end of for loop



docPrint("output2");


tmp = document.getElementById("num2");
if (tmp) tmp.innerHTML = "[# of mimetypes: " + numProps + "]";



// -----------------------------------------------------------------------------

// Display a list of non-enumerable properties of the navigator.mimeTypes[] array.
// This list will be incomplete.

docWrite("<br><br><br><br>");
docWrite("<a id='mimetypesArray_'>&nbsp;</a>");
docWrite("<a href='#topPage'>top of page</a>");
docWrite("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
docWrite("<br>");
docWrite("<div class='Title1'><b>Non-enumerable mimetypes in navigator.mimeTypes[ ] array</b></div>");

numProps=0;
docWrite("<div id='num3'></div><br><br>");


// Your browser may not necessarily allow us to enumerate the navigator.mimeTypes[] array.
// Thus, we will query the navigator.mimeTypes[] array for specific mimetypes.
//
// But first, need to get a list of mimeTypes from the PluginDetect Library.
// We search the library for object property names that contain the string "mimetype".
// Search for mimetypes recursively.
// Put results into extraMIMES{}.
var hasBeenSearched = "has$Been$Searched$123$00999";
function searchMime(obj){

    var x, y, tmp, arr, length;

    for(x in obj)
    {
       if (!$.hasOwn(obj, x)) continue;

       tmp = 0;
       try{tmp = obj[x]}
       catch(e){}

       // Look for any property name that contains "mimetype" string
       if (tmp && (/mimetype/i).test(x))
       {
          arr = $.isString(tmp) ? [tmp] : ($.isArray(tmp) ? tmp : 0);

          if(arr)
          {  length = arr.length;
             for (y=0;y<length;y++)
             {
               if ($.isString(arr[y])){
                  try{extraMIMES[arr[y]]=1}
                  catch(e){}
               }
             }
          }
       }

       // Check the current object tmp.
       // If it is an actual plain object{} that was created via Javascript
       // and is NOT a string, array, function, number, RegExp, DOM node, HTML tag,
       // then search that object as well.
       if (tmp && !tmp[hasBeenSearched] && $.isPlainObject(tmp))
       {
           // $.isPlainObject(tmp) is not 100% reliable, in that some host objects
           // might incorrectly be detected as a Plain Object... for example window.navigator.
           //
           // If tmp is a host object that does not allow properties to be modified
           // it might generate an error.
           try{tmp[hasBeenSearched] = 1}
           catch(e){}

           if (tmp[hasBeenSearched]) searchMime(tmp);
       }
    }  // end of x loop

} // end of searchMime()


// enumerate extraMIMES{} object
function enumExtraMimes(inputMimes){
  
  var mimesList = copyObj(inputMimes), x;

  for (x in mimesList)
  {
     // If mimetype has not been displayed yet, then do so now
     if (!MIMES[x] && $.hasOwn(mimesList, x))
     {
         T = navigator.mimeTypes[x];
         
         if (T)
         {
            numProps++;
            
            docWrite("<b>Let A = navigator.mimeTypes[\"" + x + "\"]</b><br>");

            try{MIMES[x]=1}
            catch(e){}

            enumerate(T, "A", ": ");

            if (T.enabledPlugin) enumerate(T.enabledPlugin, "A.enabledPlugin", ": ", null, 1);

            docWrite("<br><br>");
         }
     }

  }
}  // end of enumExtraMimes()

  searchMime($.Plugins);

  enumExtraMimes(extraMIMES);
  enumExtraMimes(extraMIMES);


  // $.mimeList is a list of mimetypes that we look for.
  // This is for the non-enumerable mimetypes.
  // $.mimeList is loaded from a separate Javascript file.
  if ($.mimeList)
  {
    tmp = $.mimeList;
    if ($.isArray($.mimeList)){
      tmp = {};
      length = $.mimeList.length;
      for (x=0;x<length;x++){
         try{tmp[$.mimeList[x]] = 1}
         catch(e){}
      }
    }

    enumExtraMimes(tmp);
  }


  docPrint("output3");

  tmp = document.getElementById("num3");
  if (tmp) tmp.innerHTML = "[This list of mimetypes may be incomplete." +
    "&nbsp;&nbsp;&nbsp;# of mimetypes: " + numProps + "]";



// ----------------------------------------------------------------------------



function showPluginProps(x){

   // x can be a number or a string.

   // If plugin has already been displayed, then exit
   if (x && $.isString(x) && PLUGINS[x] && $.hasOwn(PLUGINS, x)) return;


   var num, y, pluginObj, length;

   pluginObj = navigator.plugins[x];

   if (pluginObj)
   {
       numProps++;

       docWrite("<b>Let B = navigator.plugins[" + ($.isString(x) ? '"' + x + '"' : x) + "]</b><br>");

       if (x && $.isString(x)){
          try{PLUGINS[x] = 1}
          catch(e){}
       }
       else if (pluginObj.name && $.isString(pluginObj.name)){
          try{PLUGINS[pluginObj.name] = 1}
          catch(e){}
       }

       num=0;
       for (y in pluginObj)
       {
          // We do NOT use $.hasOwn() in this loop, because pluginObj
          // is a host object, and we want to enumerate all the properties.
          if (1)
          {
             if ((y===0 || y=="0") && pluginObj[y]) num=1;

             docWrite("B" + showPropertyName(y) + ": " + pluginObj[y] + "<br>");

             if (!$.isString(pluginObj[y]))
                enumerate(pluginObj[y], "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B" + showPropertyName(y), ": ");
          }

       } // y loop
            
       // If the pluginObj did not enumerate with a numerical index,
       // then check for that here.
       // We look for pluginObj[0], pluginObj[1], pluginObj[2]...
       if (!num && pluginObj && $.isNum(pluginObj.length))
       {
          length = pluginObj.length;
          for (y=0;y<length;y++){
             docWrite("B" + showPropertyName(y) + ": " + pluginObj[y] + "<br>");

             if (!$.isString(pluginObj[y]))
                enumerate(pluginObj[y], "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B" +
                   showPropertyName(y), ": ");
          }
       }

       docWrite("<br><br>");

   }


} // end of showPluginProps()


// Enumerate the navigator.plugins[] array, if it is possible.
docWrite("<br><br><br><br>");
docWrite("<a id='pluginsArray'>&nbsp;</a>");
docWrite("<a href='#topPage'>top of page</a>");
docWrite("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
docWrite("<br>");

docWrite("<div class='Title1'><b>Enumerable plugins in navigator.plugins[ ] array</b></div>");

numProps=0;
docWrite("<div id='num4'></div><br><br>");

// Enumerate the navigator.plugins[] array, if it is possible.
length = navigator.plugins.length;
for (x=0;x<length;x++){showPluginProps(x)}

docPrint("output4");

tmp = document.getElementById("num4");
if (tmp) tmp.innerHTML = "[# of plugins: " + numProps + "]";


// ----------------------------------------------------------------------------------------

// Display list of non-enumerable properties of navigator.plugins[] array.
// This list will most likely be incomplete.

docWrite("<br><br><br><br>");
docWrite("<a id='pluginsArray_'>&nbsp;</a>");
docWrite("<a href='#topPage'>top of page</a>");
docWrite("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
docWrite("<br>");

docWrite("<div class='Title1'><b>Non-enumerable plugins in navigator.plugins[ ] array</b></div>");

numProps=0;
docWrite("<div id='num5'></div><br><br>");

// We copy the extraPLUGINS{} object, because items may be added
// to it during enumeration.
var pluginsList = copyObj(extraPLUGINS);
for (x in pluginsList){if ($.hasOwn(pluginsList, x)) showPluginProps(x)}

// We do this a second time just to make sure that we have all the properties.
// Additional items may have been added to extraPLUGINS{} during the first time.
pluginsList = copyObj(extraPLUGINS);
for (x in pluginsList){if ($.hasOwn(pluginsList, x)) showPluginProps(x)}


docPrint("output5");

tmp = document.getElementById("num5");
if (tmp) tmp.innerHTML = "[This list of plugins may be incomplete." +
    "&nbsp;&nbsp;&nbsp;# of plugins: " + numProps + "]";



// -----------------------------------------------------------------------------

// We enumerate native window properties
docWrite("<br><br><br><br>");
docWrite("<a id='windowObject'>&nbsp;</a>");
docWrite("<a href='#topPage'>top of page</a>");
docWrite("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
docWrite("<br>");
docWrite("<div class='Title1'><b>Enumeration of window object</b></div><br>");

// enumerate window object
enumerate(window, "windowZZZZZZZ", ": ");

docWrite("<br>");
docWrite("window.ActiveXObject: " + window.ActiveXObject + "<br>");
docWrite("window.GeckoActiveXObject: " + typeof window.GeckoActiveXObject + "<br>");
docWrite("window.opera: " + typeof window.opera + "<br>");
docWrite("window.gecko: " + typeof window.gecko + "<br>");
docWrite("window.chrome: " + typeof window.chrome + "<br>");
docWrite("window.netscape: " + typeof window.netscape + "<br>");


docWrite("<br><br><br><br>");
docWrite("Script has ended successfully.<br>");
docWrite("<br><br>");
docWrite("<a href='#topPage'>top of page</a><br>");

docPrint("output6");

// ------------------------------------------------------------------------------
window.PLUGINS = PLUGINS
window.MIMES = MIMES
console.log('plugins', PLUGINS)
console.log('mimes', MIMES)

// Save generated data to a text file
if (window.FILE){
  FILE.name = "navarray.txt";
  FILE.type = "text/plain";
  FILE.dataSrcId = "out";
  FILE.convertHTML = 1;

  FILE.SaveNow();
}


})();  // end of wrapper function



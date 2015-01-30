window.onload = function() {
    document.getElementById('title').innerHTML = 
	"<h1>Search Gists</h1>";
};

function loadGists() {
    //var possibleLanguages = ["Python","JSON","Javascript","SQL"];

    // get languages from checkboxes
    var languages = document.getElementsByName('languages');
    var selectedLanguages = [];
    // for (l in possibleLanguages){
    for (l in languages){
	// var checkedFlag = document.getElementById(l).checked;
	//var checkedFlag = l.checked;
	//if (l && checkedFlag != null)
	//if (!checkedFlag)
	//   selectedLanguages.push(l.id);
	console.log(l.id);
    }
    // console.log(selectedLanguages);
    
};


// search theObject for theKey, get the key's value.
// we know it's in there, just gotta find it. 
// (browse-url "http://stackoverflow.com/questions/15523514/find-by-key-deep-in-nested-json-object")
function getValueFromKeyInObject(theObject,theKey) {
    var result = null; 
    if(theObject instanceof Array) { // if the object is an array
        for(var i = 0; i < theObject.length; i++) { // recurse over array
            result = getValueFromKeyInObject(theObject[i]);
        }
    }
    else
    {
        for(var prop in theObject) {
            console.log(prop + ': ' + theObject[prop]);
            if(prop == theKey) {
                // if(theObject[prop] == 1) {
                //    return theObject;
		// return the key's value
		return theObject[prop];
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) // if the pair is an object, or an array,
                result = getValueFromKeyInObject(theObject[prop]); // recurse
	}
    }
    //return result;
}


function displayResults(){

    var resultDiv = document.getElementById('searchResults');
    resultDiv.innerHTML='<div></div>';

    //  use gists API
    // https://developer.github.com/v3/gists/

    // in particular:

    /*
      List all public gists:
      
      GET /gists/public

      */


    // This means parsing the object somehow.   
    // For now, let's just try to pull URLs. 

    var ghr = null; // github response
    ghr = new XMLHttpRequest();
    ghr.open("GET", "https://api.github.com/gists/public", false);
    ghr.send(null);
    // console.log(ghr.responseText);
    // resultDiv.innerHTML=(ghr.responseText);
    
    // convert the text to an object:
    var parsedResult = JSON.parse(ghr.responseText);
    // resultDiv.innerHTML=(parsedResult);  // works, but doesn't expand
    console.log(parsedResult); // works and expands.  Now need to parse the parsing

    // the problem is that the entire object is an array, and each element is a deep object.

    // so you have to recurse over the object and find each key:value pair.  If the key is "html_url", we want to get the value, and store it in the array.   Also, we want to get the value of the key "description".  

    // (browse-url "http://stackoverflow.com/questions/15523514/find-by-key-deep-in-nested-json-object")


    // create array to hold resulting URLs
    results = [];

    // search properties in the result for html_url and description

     for (var key in parsedResult){  // parsedResult is an object with an array of objects
     	 if (parsedResult.hasOwnProperty(key) ){
     	     var r = document.createElement('div');
     	     // resultDiv.appendChild(r); // save this for later
     	     // resultDiv.appendChild('<div style="border:2px solid; clear:both; float:left;">'+t[i]+'<div>');
     	     //r.style.float = 'left';
     	     r.style.clear = 'both';
     	     r.style.border = "solid black";
     	     r.style.borderWidth = "1px";
	     //var nestedResult = JSON.stringify(parsedResult[key]);
	     var nestedResult = parsedResult[key];
	     var description = getValueFromKeyInObject(nestedResult,'description');
	     var htmlURL = getValueFromKeyInObject(nestedResult,'html_url');
	     var link; 
	     if (description != ""){ // handle gists that have no description
		 link = '<a href="' + htmlURL + '">' + description + '</a>'; }
	     else{
		 link = '<a href="' + htmlURL + '">' + 'no description' +  '</a>';  }
     	     r.innerHTML = key + " -> " + link;
	     results.push(r);
     	     }
     }

    // get the whole shebang

    

}

function clearLocalStorate(){
    localStorage.clear();
}


function displayLocalStorage() {
    document.getElementById('output').innerHTML = localStorage.getItem('demoText');
}

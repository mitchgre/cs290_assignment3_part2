window.onload = function() {
    document.getElementById('title').innerHTML = 
	"<h1>Search Gists</h1>";
};



// get languages from checkboxes
function getLanguages(){
    var languages = document.getElementById('languageList').getElementsByTagName('input');
    var selectedLanguages = [];
    for (var l = 0; l < languages.length; l++){
	var id = languages[l].id;
	var checked = document.getElementById(id).checked;
	// console.log(id + ' ' + checked);
	if (checked) {
	    selectedLanguages.push(id);
	}
    } // end for loop
    // console.log('selected languages = ' + selectedLanguages);
    return selectedLanguages;
}


// get all recent gists
function getAllGists(){
    var ghr = null; // github response
    ghr = new XMLHttpRequest();
    ghr.open("GET", "https://api.github.com/gists/public", false);
    ghr.send(null); // get back a string of json

    var parsedResult = JSON.parse(ghr.responseText); // turn string into json object
    return parsedResult;
}



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
            // console.log(prop + ': ' + theObject[prop]);
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


// 
function parseGists(gistObject, allowedLanguages){  
    results = []; 
     for (var key in gistObject){  // gistObject is an object with an array of objects
     	 var r = document.createElement('div');
     	 // resultDiv.appendChild(r); // save this for later
     	 // resultDiv.appendChild('<div style="border:2px solid; clear:both; float:left;">'+t[i]+'<div>');
     	 //r.style.float = 'left';
     	 r.style.clear = 'both';
     	 r.style.border = "solid black";
     	 r.style.borderWidth = "1px";
	 //var nestedResult = JSON.stringify(parsedResult[key]);
	 var nestedResult = gistObject[key];
	 var description = getValueFromKeyInObject(nestedResult,'description'); // get description of current object
	 var htmlURL = getValueFromKeyInObject(nestedResult,'html_url');  // get URL of current object
	 var thisLanguage = getValueFromKeyInObject(nestedResult,'language');  // get URL of current object
	 var link; 
	 if (description != ""){ // handle gists that have no description
	     link = '<a href="' + htmlURL + '">' + description + '</a>' + ' '  + thisLanguage; }
	 else{
	     link = '<a href="' + htmlURL + '">' + 'no description' +  '</a>' + ' '  + thisLanguage;  }
     	 r.innerHTML = key + " -> " + link;
	 // if (allowedLanguages.indexOf(thisLanguage) > -1){ // if this language is in the array of allowed languages
	 // 	 console.log("YEAH!!! GET SOME!!!!");
	 // 	 results.push(r);
     	 // }
	 // else{ 
	 // 	 console.log("NAH I DON'T THINK SO!!!");
	 // 	 }
	 results.push(r);
     } // end for loop

    return results; // an array of divs containing linked descriptions to gists filtered by allowed languages
}

function displayResults(formattedResults){

    var resultDiv = document.getElementById('searchResults');
    resultDiv.innerHTML='<div></div>';

    for (var r = 0; r < formattedResults.length; r++)
	resultDiv.appendChild(results[r]); 

}


function loadGists() {
    var languages = getLanguages(); console.log(languages);    
    var gists = getAllGists();
    console.log(gists);
    var results = parseGists(gists,languages); 
    console.log(results);  
    for (var r = 0; r < results.length; r++)
	console.log(results[r]);
    displayResults(results); /// bomb here
};



function clearLocalStorate(){
    localStorage.clear();
}


function displayLocalStorage() {
    document.getElementById('output').innerHTML = localStorage.getItem('demoText');
}

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
function getAllGists(numOfPages){
    clearResults();
    var pages = [];
    var languages = getLanguages();

    for (var i=1; i <= numOfPages; i++)
    {
	// This is the actual AJAX stuff here.  See docs at:
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest

	var ghr = null; // github response
	ghr = new XMLHttpRequest();
	
	ghr.open("GET", "https://api.github.com/gists/public?per_page=100&page=" + i, true);

	function parseGistsCallback(e){ 
	    console.log("ghr:" + ghr.readyState);
	    console.log("page length = " + pages.length);
	    if (ghr.readyState == 4) {
		console.log("got server response for page " + i);
		var parsedResult = JSON.parse(ghr.responseText); 
		pages.push(parsedResult); 
		console.log("page length = " + pages.length);
		if (pages.length >= 1){
		    console.log("getting results");
		    var results = parseGists(pages,languages,i);
		    displayResults(results);
		}
		    
		// return pages;
	    }
	}


	ghr.send(null); // get back a string of json
	ghr.onreadystatechange = parseGistsCallback; // note there is no () on the function

    }
    // return parsedResult;


    console.log("I'm done with gists");
}

function clearResults(){
    var resultList = document.getElementById('searchResultsUL');
    resultList.innerHTML="";  // clear the list if it's not already cleared
}

function displayResults(formattedResults){

    var resultList = document.getElementById('searchResultsUL');

    for (var r = 0; r < formattedResults.length; r++)
	resultList.appendChild(formattedResults[r]); 

}




/* 
   gistObjectArray is an array of objects, 
   allowedLanguages is an array of strings
*/
function parseGists(gistObjectArray, allowedLanguages, pageNumber){  
    results = []; 
    for (var j=0; j < gistObjectArray.length; j++){

	// Make A Note of the Page We're On
	var pageHeader = document.createElement('li');
	pageHeader.innerHTML = "<b>page" + (pageNumber+1)  + "</b>";
	results.push(pageHeader);

	// loop over object and push results into array
	for (var i in gistObjectArray[j]){  // gistObject is an object with an array of objects
     	    var r = document.createElement('li');
     	    r.style.clear = 'both';
	    var nestedResult = gistObjectArray[j][i]; console.log(nestedResult);
	    var description = nestedResult['description']; // get description of current object
	    var htmlURL = nestedResult['html_url'];  // get URL of current object
	    var theseFiles = nestedResult['files'];  // object of files
	    var theseKeys = Object.keys(theseFiles); // array of keys to theseFiles
	    var thisFile = theseFiles[theseKeys[0]]; // value of first key in theseFiles
	    var thisLanguage = thisFile['language']; // language of gist is a property of thisFile... whew! do you get it?
	    var link;  // fill this in below. 
	    if (description != ""){ // handle gists that have no description
		link = '<a href="' + htmlURL + '">' + description + '</a>' + ' '  + thisLanguage; }
	    else{
		link = '<a href="' + htmlURL + '">' + 'no description' +  '</a>' + ' '  + thisLanguage;  }
     	    r.innerHTML = i + " -> " + link;
	    if (allowedLanguages.indexOf(thisLanguage) > -1){ // if this language is in the array of allowed languages
	 	console.log("item " + i + " accepted language " + thisLanguage );
	 	results.push(r);
     	    }
	    else{ 
	 	console.log("item " + i + " filtered language " + thisLanguage  );
	    }
	    // results.push(r);
	} // end for loop over gistObject
    } // end for loop over gistObjectArray

    return results; // an array of divs containing linked descriptions to gists filtered by allowed languages
}


function loadGists() {
    // var languages = getLanguages(); console.log(languages); // array of strings
    var numOfPages = document.getElementById('numOfPagesSelection').value; console.log("numOfPages="+numOfPages); // int
    getAllGists(numOfPages); //    console.log(gists); // array of objects
    //var results = parseGists(gists,languages);   console.log(results);  // array of html elements (li currently)
    // for (var r = 0; r < results.length; r++)
    // 	console.log(results[r]);
    // displayResults(results); // render array of html results to screen
};



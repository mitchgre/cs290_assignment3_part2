window.onload = function() {
    document.getElementById('title').innerHTML = 
	"<h1>Search Gists</h1>";
    setupFavorites();
    displayFavorites();
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


/*
  Manipulate list of favorites in local storage.
  
  (browse-url "https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage")

  For array storage/retrieval, I'm trying a different syntax: 
  (browse-url "http://stackoverflow.com/questions/22991871/localstorage-save-array")

*/
function setupFavorites(){  // take a DOM element on call
    var favorites;
    if (localStorage.getItem("favoritesList") === null)
    {
	favorites = new Array();
	localStorage["favoritesList"] = JSON.stringify(favorites);
    }
    else
    {
	favorites = JSON.parse(localStorage["favoritesList"]);
    }
    return favorites;
}


/*
  Called from a button press, addToFavorites() 
           1. takes the node that pressed the button,
	   2. finds the grandparent of the button  (should be a li in the ul 'searchResultsUL')
	   3. stores the 
*/
function addToFavorites(element){  // take a DOM element on call
    var favorites = setupFavorites();

    console.log(element.parentNode.parentNode.childNodes[2]);
    console.log(element.parentNode.parentNode.childNodes[2].innerHTML);  //  description link to gist page
    console.log(element.parentNode.parentNode.childNodes[3].innerHTML);  // language

    var li = ''; // empty string.  Could use this as a node, but let's not.
    li += element.parentNode.parentNode.childNodes[2].innerHTML; // add link to string
    li += element.parentNode.parentNode.childNodes[3].innerHTML; // add language type
    //li += '</li>';

    favorites.push(li);
    localStorage.setItem("favoritesList", JSON.stringify(favorites)); // set in localStorage
    displayFavorites();
}


function displayFavorites(){
    var favorites = setupFavorites();
    var formattedFavorites = new Array();
    clearResults('favoritesListUL');

    for (var i=0; i < favorites.length; i++)
	{
	    var r = document.createElement('li');
	    // Add a 'remove' button to each element

	    r.style.clear = "both";
	    r.innerHTML = "<div><b>"+ i +".</b></div>";
	    r.innerHTML += "<div><input type=\"button\" value=\"Remove\" onClick=\"RemoveFromFavorites(this)\"></div>";
	    r.innerHTML += "<div>"+favorites[i]+"</div>";

	    // console.log(r);
	    formattedFavorites.push(r);
	}
    displayResults(formattedFavorites,'favoritesListUL');
}


function RemoveFromFavorites(element){
    // parent then next gives the link, but we want to remove the parent.
    var favorites = setupFavorites();   // get from localStorage
    // actually, I think we want to get the array, remove the element from the array and redisplay
    // unfortunately, that's way less efficient, so I'm storing the array index in HTML as the first child
    
    // get index number from DOM, and slice off the last char which is a period
    var index = element.parentNode.previousSibling.firstChild.innerHTML.slice(0,-1); 
    var value = element.parentNode.nextSibling.innerHTML; 
    console.log("Remove element " + index + "with value:" +value);
    favorites.splice(index,1); // remove 1 element from favorites at position index
    localStorage.setItem("favoritesList", JSON.stringify(favorites)); // set in localStorage
    console.log(favorites.length);
    displayFavorites();
}


/*
  favoritesHasURL(url) takes url is a string and loops over the favorites list 
  to see if the string is already in the list.  

  Returns true or false.
  */
function favoritesHasURL(url){
    var favorites = setupFavorites();   // get from localStorage
    for (var i=0; i < favorites.length; i++)
    {
	// get ith element of favorites list
	var str = favorites[i];
	// get url string from element 
	// (need to chop off ends of string, get region in quotes)
	str = str.substring(str.indexOf('"')+1,str.lastIndexOf('"'));
	// console.log(str);
	// compare this value against url and return if true
	if (str === url)
	    return true;
    }
    return false;
}

// get all recent gists
function loadGists(){
    clearResults('searchResultsUL');
    var numOfPages = document.getElementById('numOfPagesSelection').value; console.log("numOfPages="+numOfPages); // int
    var pages = new Array();
    var request = new Array();
    var parsedResult = new Array();
    var htmlElements = new Array();
    var languages = getLanguages();

    // http://stackoverflow.com/questions/13445809/how-to-handle-simultaneous-javascript-xmlhttprequests
    for (var i=1; i <= numOfPages; i++) {
	(function(i) 
	 {
	     request[i] = new XMLHttpRequest();
	     request[i].open("GET", "https://api.github.com/gists/public?per_page=100&page="+i , true);
	     request[i].onreadystatechange = function (e) 
	     {
		 if (request[i].readyState === 4) 
		 {
		     if (request[i].status === 200) 
		     {
			 // console.log(request[i].responseText);
			 parsedResult[i] = JSON.parse(request[i].responseText);
			 // pages.push(parsedResult);
			 htmlElements[i] = parseGists(parsedResult[i],languages,i);
			 displayResults(htmlElements[i],'searchResultsUL');
		     } 
		     else 
		     {
			 console.log("Error", request[i].statusText);
		     }
		 }
	     };
	     request[i].send(null);
	})(i);
    } 
    // return parsedResult;


    console.log("I'm done with gists");
}

function clearResults(divID){
    var resultList = document.getElementById(divID);
    resultList.innerHTML="";  // clear the list if it's not already cleared
}

function displayResults(formattedResults,divID){

    var resultList = document.getElementById(divID);

    for (var r = 0; r < formattedResults.length; r++)
	resultList.appendChild(formattedResults[r]); 

}




/* 
   gistObjectArray is an array of objects, 
   allowedLanguages is an array of strings
*/
function parseGists(gistObject, allowedLanguages, pageNumber){  
    results = []; 
    // console.log("gistObjectArray.length=");
    // console.log(gistObjectArray.length);
    // for (var j=0; j < gistObjectArray.length; j++){

    // Make A Note of the Page We're On
    var pageHeader = document.createElement('li');
    pageHeader.innerHTML = "<b>page" + (pageNumber)  + "</b>";
    results.push(pageHeader);
    
    // loop over object and push results into array
    for (var i in gistObject)
    {  // gistObject is an object with an array of objects
     	var r = document.createElement('li');
     	r.style.clear = 'both';
	var nestedResult = gistObject[i]; //console.log(nestedResult);
	var description = nestedResult['description']; // get description of current object
	var htmlURL = nestedResult['html_url'];  // get URL of current object
	var theseFiles = nestedResult['files'];  // object of files
	var theseKeys = Object.keys(theseFiles); // array of keys to theseFiles
	var thisFile = theseFiles[theseKeys[0]]; // value of first key in theseFiles
	var thisLanguage = thisFile['language']; // language of gist is a property of thisFile... whew! do you get it?
	
	var favAddLink = "<div><input type=\"button\" value=\"AddToFavorites\" onClick=\"addToFavorites(this)\"></div>";

	var link;  // fill this in below. 

	if (description != "")
	{ // handle gists that have no description
	    link = favAddLink + '<div><a href="' + htmlURL + '">' + description + '</a>' + '</div><div> '  + thisLanguage + '</div>' ; 
	}
	else
	{
	    link = favAddLink + '<div><a href="' + htmlURL + '">' + 'no description' +  '</a>' + '</div><div> '  + thisLanguage + '</div>';  
	}
     	r.innerHTML = '<div>'+i+'</div>' + link;
	
	// add code here to filter results that are in the favorites list

	if (allowedLanguages.length == 0) // no filtering by language
	{
	     if (favoritesHasURL(htmlURL))
	    {
		console.log("filtering "+htmlURL+" is already in favorites list");
	    }
	    else
	    {
		results.push(r);
	    }
	}
	else
	{
	    if (allowedLanguages.indexOf(thisLanguage) > -1)
	    { // if this language is in the array of allowed languages
		console.log("item " + i + " accepted language " + thisLanguage );
		if (favoritesHasURL(htmlURL))
		{
		    console.log("filtering "+htmlURL+" is already in favorites list");
		}
		else
		{
		    results.push(r);
		}
     	    }
	    else
	    { 
		console.log("item " + i + " filtered language " + thisLanguage  );
	    }
	    // results.push(r);
	}
    } // end for loop over gistObject
    //} // end for loop over gistObjectArray

    return results; // an array of divs containing linked descriptions to gists filtered by allowed languages
}




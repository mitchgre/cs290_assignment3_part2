window.onload = function() {
    document.getElementById('title').innerHTML = 
	"<h1>Search Gists</h1>";
};

function loadGists() {
    var resultsJSON = 0;
    
    
};


function displayResults(){
    t = [1,2,3,4,5];

    var resultDiv = document.getElementById('searchResults');
    resultDiv.innerHTML='<div></div>';
    for (var i in t){
	var r = document.createElement('div');
	resultDiv.appendChild(r);
	// resultDiv.appendChild('<div style="border:2px solid; clear:both; float:left;">'+t[i]+'<div>');
	//r.style.float = 'left';
	r.style.clear = 'both';
	r.style.border = "solid black";
	r.style.borderWidth = "1px";
	r.innerHTML = t[i];
	}
	
}

function clearLocalStorate(){
    localStorage.clear();
}


function displayLocalStorage() {
    document.getElementById('output').innerHTML = localStorage.getItem('demoText');
}

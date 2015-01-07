
$(document).ready(function(){
	init();
});

function init()
{
	//clear the body of the document
	$("body").children().remove();
	
	// first build the html structure
	
	var mainElement = document.createElement('div'); //contains the whole page
	mainElement.setAttribute('class','main');
	var headElement = document.createElement('div'); //heading + breadcrumbs
	headElement.setAttribute('class','head');
	mainElement.appendChild(headElement);	
	var breadElement = document.createElement('span');
	headElement.appendChild(breadElement);
	var catElement = document.createElement('span'); //category listing
	catElement.setAttribute('class','cat');
	headElement.appendChild(catElement);
	var contentElement = document.createElement('div'); //content
	contentElement.setAttribute('class','content');
	contentElement.textContent = "page content comes here";
	mainElement.appendChild(contentElement);
	
	//client side control
	api = Rapidboard();
	nav = Navigator();
	wb = BreadCrumbWidget(breadElement, nav, api);
	wc = CategoryWidget(catElement, nav, api);
	nav.AddListener(wb.Refresh);
	nav.AddListener(wc.Refresh);
	
	// make it visible
	document.body.appendChild(mainElement);
}


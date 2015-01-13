
$(document).ready(function(){
	init();
});

function init()
{
	//clear the body of the document
	$("body").children().remove();
	
	// first build the html structure
	

	var headElement = document.createElement('div');
	headElement.setAttribute('class','head');

	var mainElement = document.createElement('div'); 
	mainElement.setAttribute('class','main');
	var sideElement = document.createElement('div');
	sideElement.setAttribute('class','side');
	mainElement.appendChild(sideElement);	
	var breadElement = document.createElement('span');
	headElement.appendChild(breadElement);
	var catElement = document.createElement('div');	catElement.setAttribute('class','cat');	sideElement.appendChild(catElement);
	var catElement2 = document.createElement('div'); catElement2.setAttribute('class','cat'); sideElement.appendChild(catElement2);
	var catElement3 = document.createElement('div'); catElement3.setAttribute('class','cat'); sideElement.appendChild(catElement3);
	var contentElement = document.createElement('div'); //content
	contentElement.setAttribute('class','content');
	contentElement.textContent = "page content comes here";
	mainElement.appendChild(contentElement);
	
	//client side control
	api = Rapidboard();
	nav = Navigator();
	cv = ContentViewer(contentElement, api);
	wb = BreadCrumbWidget(breadElement, nav, api);
	wc2 = CategoryWidget(catElement2, nav, api, 'categories', -1);
	wc3 = CategoryWidget(catElement3, nav, api, 'more categories', -2);

	wc = CategoryWidget(catElement, nav, api, 'current level',null, function(){
		ThreadCreator(contentElement, nav.Current(), api, function(){
			cv.ViewCategory(nav.Current());
		});
	});

	nav.AddListener(wb.Refresh);
	nav.AddListener(wc.Refresh);
	nav.AddListener(wc2.Refresh);
	nav.AddListener(wc3.Refresh);
	nav.AddListener(function(){
		cv.ViewCategory(nav.Current());
	});

	// make it visible
	document.body.appendChild(headElement);
	document.body.appendChild(mainElement);

	document.body.onresize = function(){
		/*var h = $(window).height() - $('.head').outerHeight();
		$('.side').outerHeight(h);
		$('.main').innerHeight(h);*/
		$('.content').innerWidth( $(window).width() - $('.side').outerWidth() );
	}
	document.body.onresize();
	setTimeout(document.body.onresize, 1000);

}



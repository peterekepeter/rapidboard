
var rb = Rapidboard();
var nav = [0];


$(document).ready(function(){
	init();
});

function init()
{
	//clear
	$("body").children().remove();
	// main container
	var main = document.createElement('div');
	main.setAttribute('class','main');
	
	// category widget
	var cat = document.createElement('div');
	cat.setAttribute('class','cat');
	main.appendChild(cat);
	
	catmain(cat);
	
	// make it visible
	document.body.appendChild(main);
}

function generateCategoryListItem(data)
{
	var e = document.createElement('li');
	e.setAttribute('class','categoryListItem');
	e.setAttribute('content',data.id);
	e.onclick = function(){ nav.push(data.id); init() };
	e.textContent = data.name;
	return e;
}

function generateDefaultListItem(data)
{
	var e = document.createElement('li');
	e.textContent = data;
	return e;
}

function generateList(array, itemGenerator)
{
	var list = document.createElement('ul');
	for (var i=0; i<array.length; i++)
	{
		list.appendChild(itemGenerator(array[i]));
	}
	return list;
}

function generateCategoryList(data)
{
	var list = generateList(data,generateCategoryListItem);
	
	if (nav.length>1)
	{
		var er = generateDefaultListItem('return');
		er.setAttribute('class', 'categoryListItem categoryListFunction');
		er.onclick = function(){ nav.pop(); init(); };
		list.appendChild(er);
	}
	
	
	var en = generateDefaultListItem('new');
	en.setAttribute('class', 'categoryListItem categoryListFunction');
	list.appendChild(en);
	
	return list;
}

function catmain(element)
{
	var current = nav[nav.length-1];
	console.log(nav,current);
	rb.CategoryList(current,function(list){
		console.log(list);
		var html = generateCategoryList(list);
		element.appendChild(html);
	})
}
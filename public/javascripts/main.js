
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
	
	// headline with breadcrumbs
	var bread = document.createElement('div');
	bread.setAttribute('class','head');
	main.appendChild(bread);	
	
	// category widget
	var cat = document.createElement('div');
	cat.setAttribute('class','cat');
	main.appendChild(cat);
	
	//content
	var content = document.createElement('div');
	content.setAttribute('class','content');
	content.textContent = "page content comes here";
	main.appendChild(content);
	
	catmain(cat);
	breadmain(bread);
	
	// make it visible
	document.body.appendChild(main);
}

function generateCategoryListItem(data)
{
	var e = document.createElement('li');
	e.setAttribute('class','categoryListItem');
	e.setAttribute('content',data.id);
	e.onclick = function(){ nav.push(data.id); catamount=10; breadmain(); catmain(); };
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
		var er = generateDefaultListItem('back');
		er.setAttribute('class', 'categoryListItem categoryListFunction');
		er.onclick = function(){ nav.pop(); breadmain(); catmain(); };
		list.appendChild(er);
	}
	
	
	var en = generateDefaultListItem('new');
	en.setAttribute('class', 'categoryListItem categoryListFunction');
	en.onclick = function(){
		var form = document.createElement("form");
		form.setAttribute('class', 'categoryCreateForm');
		var inputname = document.createElement("input");
		form.appendChild(inputname);
		form.onsubmit = function(event){
			var name = form.firstChild.value;
			if (name.length>0)
				rb.CategoryCreate(name, nav[nav.length-1], 
					function(data){nav.push(data.id); catmain(); breadmain();});
			else 
				catmain();
			return false;
		}
		this.textContent = null;
		this.appendChild(form);
		this.onclick=null;
		this.setAttribute('class', 'categoryListItemCreate'); 
		
	};
	list.appendChild(en);
	
	var em = generateDefaultListItem('more');
	em.setAttribute('class', 'categoryListItem categoryListFunction');
	em.onclick = function(){
		catamount *= 2;
		catmain();
	}
	list.appendChild(em);
	
	return list;
}

var catelem;
var catamount = 10;

function catmain(element)
{
	if (element != null) catelem = element; else element = catelem;
	var current = nav[nav.length-1];
	//console.log(nav,current);
	rb.CategoryList(current,catamount,function(list){
		//console.log(list);
		var html = generateCategoryList(list);
		removeChildren(element);
		element.appendChild(html);
	})
}

function generateBreadItem(name, target)
{
	var li = document.createElement('span');
	li.textContent = name;
	li.setAttribute('content',target);
	li.setAttribute('class','breadItem');
	li.onclick = function(){ 
		var val = Number(this.getAttribute('content'));
		var i = nav.length - 1;
		while (i>0 && nav[i] != val) {
			nav.pop();
			i--;
		}
		breadmain();
		catmain();
	};
	return li;
}

function removeChildren(element)
{
	while (element.firstChild)
		element.removeChild(element.firstChild);
}

var breadelem;

function breadmain(element)
{
	if (element != null) breadelem = element; else element = breadelem;
	rb.CategoryNames(nav, function(data){
		var ul = document.createElement('div');
		ul.setAttribute('class','bread');
		
		heading = document.createElement('h1');
		heading.appendChild(generateBreadItem('rapidboard',nav[0]));
		ul.appendChild(heading);
		for (var i=1; i<data.length; i++)
		{
			var sep = document.createElement('span');
			sep.textContent = ' / ';
			sep.setAttribute('class', 'breadSep');
			ul.appendChild(sep);
			ul.appendChild(generateBreadItem(data[i],nav[i]));
		}
		removeChildren(element);
		element.appendChild(ul);
	});
}
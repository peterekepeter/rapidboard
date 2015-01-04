	
var rb = Rapidboard();
var nav = [0];

var wb;

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
	wb = BreadCrumbWidget(bread);
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
	wb.Refresh(bread);
	
	// make it visible
	document.body.appendChild(main);
}

function generateCategoryListItem(data)
{
	var e = document.createElement('li');
	e.setAttribute('class','categoryListItem');
	e.setAttribute('content',data.id);
	e.onclick = function(){ nav.push(data.id); catamount=10; wb.Refresh(); catmain(); };
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
		er.onclick = function(){ nav.pop(); wb.Refresh(); catmain(); };
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
					function(data){nav.push(data.id); catmain(); wb.Refresh();});
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


function removeChildren(element)
{
	while (element.firstChild)
		element.removeChild(element.firstChild);
}


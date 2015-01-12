
function removeChildren(element)
{
	while (element.firstChild)
		element.removeChild(element.firstChild);
}

/// 
/// This object is used for hierarhical navigation
/// When location changes, the list of functions is called from the lsitener
/// list.
///
var Navigator = function(rootlocation, listenerList)
{
	if (rootlocation == null)
		rootlocation = 0;
	var rootloc = rootlocation;
	var stack = [rootlocation];
	var listeners;
	if (listenerList != null)
		listeners = listenerList;
	else 
		listeners = [];
	
	var locationChanged = function()
	{
		for (var i=0; i<listeners.length; i++)
		{
			listeners[i]();
		}
	}
	
	return {
		Enter:function(node){
			stack.push(node);
			locationChanged();
		},
		ReturnEnter:function(count, node){
			for (var i=0; i<count; i++)
				stack.pop();
			stack.push(node);
			locationChanged();
		},
		Return:function(){
			var oldlocation = stack.pop();
			locationChanged();
			return oldlocation;
		},
		ReturnTo:function(desiredLocation)
		{
			var i = stack.length - 1;
			var loc = stack[i];
			while (i>0 && stack[i] != desiredLocation) {
				stack.pop();
				i--;
			}
			if (loc != stack[stack.length - 1])
				locationChanged();
		},
		Current:function(offset){
			if (offset == null) offset = 0;
			return stack[stack.length - 1 + offset];
		},
		IsRoot:function()
		{
			return Top() == rootloc;
		},
		AsList:function()
		{
			return stack;
		},
		AddListener:function(callback)
		{
			listeners.push(callback);
		},
		Count:function()
		{
			return stack.length;
		}
	}
}


///
/// This object facilitates category navigation using html.
/// It uses a navigator object and the rapidboard api.
///
var CategoryWidget = function(targetElement, navigatorInstance, apiInstance, listTitle, listLevel)
{
	var nav = navigatorInstance;
	var api = apiInstance;
	var element = targetElement;
	var amount = 10;
	var title = listTitle;
	var list = listLevel;

	var categoryListItemClicked = function()
	{	
		amount = 10;
		var x = Number(this.getAttribute('content'))
		if (listLevel<0)
			nav.ReturnEnter(-listLevel,x);
		else
			nav.Enter(x);
	}
	
	var generateCategoryListItem = function (data)
	{
		var e = document.createElement('span');
		e.setAttribute('class','categoryListItem');
		e.setAttribute('content',data.id);
		e.textContent = data.name;
		e.onclick = categoryListItemClicked;
		return e;
	}

	var generateDefaultListItem = function(data)
	{
		var e = document.createElement('span');
		e.textContent = data;
		return e;
	}

	var generateList = function(array, itemGenerator)
	{
		var list = document.createElement('div');
		list.setAttribute('class','categoryList');
		for (var i=0; i<array.length; i++)
		{
			list.appendChild(itemGenerator(array[i]));
		}
		return list;
	}

	var generateCategoryList = function(data)
	{
		var list = generateList(data,generateCategoryListItem);
		return list;
	}
	
	var refresh = function(){
		var current = nav.Current(listLevel);
		if (current == null)
		{
			removeChildren(element);
			return;
		}
		//console.log(nav,current);
		api.CategoryList(current,amount,function(list){
			//console.log(list);
			var html = generateCategoryList(list);
			removeChildren(element);
				
			
			if (title!=null)
			{
				var h2 = document.createElement('h2');
				h2.textContent = title;
				element.appendChild(h2);
			}

			if (html.firstChild != null)
				element.appendChild(html);
			
			if (listLevel == null && nav.Count() > 1)
			{
				var er = generateDefaultListItem('return');
				er.setAttribute('class', 'categoryListItem categoryListFunction');
				er.onclick = function(){ nav.Return(); };
				element.appendChild(er);
			}
			
			if (listLevel == null)
			{
				if (list.length<amount)
				{
					var en = generateDefaultListItem('new category');
					en.setAttribute('class', 'categoryListItem categoryListFunction');
					en.onclick = function(){
						var form = document.createElement("form");
						form.setAttribute('class', 'categoryCreateForm');
						var inputname = document.createElement("input");
						inputname.setAttribute('class', 'categoryCreateInput');
						inputname.setAttribute('placeholder', 'type here');
						form.appendChild(inputname);
						form.onsubmit = function(event){
							var name = form.firstChild.value;
							if (name.length>0)
								api.CategoryCreate(name, nav.Current(), 
									function(data){nav.Enter(data.id)});
							else 
								refresh();
							return false;
						}
						this.textContent = null;
						this.appendChild(form);
						this.onclick=null;
						this.setAttribute('class', 'categoryListItemCreate'); 			
					};
					element.appendChild(en);
				}
				else
				{
					var em = generateDefaultListItem('show more');
					em.setAttribute('class', 'categoryListItem categoryListFunction');
					em.onclick = function(){
						amount *= 2;
						refresh();
					}
					element.appendChild(em);
				}
			}
			
		})
	}
	
	refresh(); //initial render
	
	return {
		Refresh : function(){
			refresh();
		}
	}
}

///
/// This object displays the navigator object using html
/// and also allows breadcrumb-like navigation.
///
var BreadCrumbWidget = function(targetElement, navigatorInstance, apiInstance)
{
	var nav = navigatorInstance;
	var api = apiInstance;

	var element = targetElement;
	
	var breadItemClicked = function()
	{
		var val = Number(this.getAttribute('content'));
		nav.ReturnTo(val);
	}
	
	var generateBreadItem = function(name, target)
	{
		var li = document.createElement('span');
		li.textContent = name;
		li.setAttribute('content',target);
		li.setAttribute('class','breadItem');
		li.onclick = breadItemClicked;
		return li;
	}
	
	var refresh = function()
	{
		var list = nav.AsList();
		api.CategoryNames(list, function(data){
			var ul = document.createElement('span');
			ul.setAttribute('class','bread');
			
			heading = document.createElement('h1');
			heading.appendChild(generateBreadItem('rapidboard',list[0]));
			ul.appendChild(heading);
			for (var i=1; i<data.length; i++)
			{
				var sep = document.createElement('span');
				sep.textContent = ' / ';
				ul.appendChild(sep);
				ul.appendChild(generateBreadItem(data[i],list[i]));
			}
			removeChildren(element);
			element.appendChild(ul);
		});
	}
	
	refresh(); //initial render

	return {
		Refresh : function () { refresh(); }
	}
}

var ContentViewer = function(targetElement, navigatorInstance, apiInstance){
	var element = targetElement;
	var nav = navigatorInstance;
	var api = apiInstance;

	var generateItem = function(item) 
	{
		var div = document.createElement('div');
		div.setAttribute('class', 'threadItem');
		var h2 = document.createElement('h2');
		h2.textContent = item.name;
		div.appendChild(h2);
		var p = document.createElement('p');
		p.textContent = item.firstMessage;
		div.appendChild(p);
		return div;
	}

	var refresh = function()
	{
		var x = nav.Current();
		api.ThreadList(x,0,100,function(list){
			removeChildren(element);
			for (var i=0; i<list.length; i++)
			{
				element.appendChild(generateItem(list[i]));
			}
		});
	}

	return {
		Refresh : function () { refresh(); }
	};
}